// SPDX-License-Identifier: Apache-2.0
import { randomBytes } from 'node:crypto';

import { beforeEach, describe, expect, it } from 'vitest';

import { type PayRule, pureCircuits, type Trip } from '../managed/kanta/contract/index.js';
import { expectedPayout } from '../pay.js';
import { createPrivateState } from '../witnesses.js';
import { KantaSimulator } from './kanta-simulator.js';

const T0 = 1_800_000_000; // a fixed "now" in unix seconds
const NOTICE = 600n; // 10 minutes for tests
const SLOT = 900n; // 15-minute surge slots
const SETTLE = 3600n; // a trip can be paid up to an hour after its slot ends
const KORAMANGALA = 1n;

const bytes = (): Uint8Array => new Uint8Array(randomBytes(32));

// Rule v1: Rs 25 base, Rs 6/km, Rs 1/min, Rs 30 floor (all in paise).
const RULE_V1: PayRule = { baseFare: 2500n, perKm: 600n, perMinute: 100n, minPayout: 3000n };
// Rule v2: lower base fare.
const RULE_V2: PayRule = { baseFare: 2000n, perKm: 600n, perMinute: 100n, minPayout: 3000n };

const tripFacts = (over: Partial<Trip> = {}): Omit<Trip, 'payout'> => ({
  riderKey: new Uint8Array(32).fill(7),
  tripId: bytes(),
  zone: KORAMANGALA,
  slotStart: BigInt(T0) + SLOT,
  distanceMetres: 3200n,
  minutes: 22n,
  ...over,
});

describe('Kanta contract', () => {
  let operatorSecret: Uint8Array;
  let sim: KantaSimulator;
  const slotStart = BigInt(T0) + SLOT;

  // Rule v1 announced at T0 for T0 + NOTICE; surge 1.2x announced for the next slot.
  beforeEach(async () => {
    operatorSecret = bytes();
    sim = await KantaSimulator.deploy(operatorSecret, { noticeSeconds: NOTICE, slotSeconds: SLOT, settleSeconds: SETTLE }, T0);
    await sim.publishRule(RULE_V1, bytes(), BigInt(T0) + NOTICE);
    await sim.publishSurge(KORAMANGALA, slotStart, 120n);
    sim.now = T0 + Number(SLOT) + 60; // during the slot, rule v1 in force
  });

  const pay = async (trip: Omit<Trip, 'payout'>, payout: bigint, version = 1n, salt = bytes()) =>
    sim.recordPayout({ ...trip, payout }, version, salt);

  describe('publishing', () => {
    it('stores only a commitment and start time for a rule', () => {
      expect(sim.ledger.ruleCount).toBe(1n);
      const v1 = sim.ledger.rules.lookup(1n);
      expect(v1.activeFrom).toBe(BigInt(T0) + NOTICE);
      expect(v1.commitment).toHaveLength(32);
      expect(sim.ledger.noticeSeconds).toBe(NOTICE);
    });

    it('refuses a rule announced with less than the notice period', async () => {
      await expect(sim.publishRule(RULE_V2, bytes(), BigInt(sim.now) + NOTICE - 1n)).rejects.toThrow(
        'Rule must be announced at least noticeSeconds before it starts',
      );
    });

    it('refuses a rule that starts before the current one', async () => {
      sim.now = T0 - 10_000;
      await expect(sim.publishRule(RULE_V2, bytes(), BigInt(T0))).rejects.toThrow(
        'A new rule must start after the current one',
      );
    });

    it('refuses surge published after the slot started', async () => {
      await expect(sim.publishSurge(KORAMANGALA, BigInt(sim.now) - 1n, 150n)).rejects.toThrow(
        'Surge must be published before the slot starts',
      );
    });

    it('refuses changing a surge that was already announced', async () => {
      sim.now = T0;
      await expect(sim.publishSurge(KORAMANGALA, slotStart, 200n)).rejects.toThrow('already published');
    });

    it('refuses anyone without the operator secret', async () => {
      sim.setPrivateState(createPrivateState(bytes()));
      sim.now = T0;
      await expect(sim.publishSurge(2n, slotStart + SLOT, 110n)).rejects.toThrow('Only the platform operator');
    });
  });

  describe('recording payouts', () => {
    it('records a payout that follows the rule and the announced surge', async () => {
      const trip = tripFacts();
      const amount = expectedPayout(RULE_V1, trip, 120n);
      expect(amount).toBe(7944n); // (2500*1000 + 100*22*1000 + 600*3200) * 120 / 100000
      const receipt = await pay(trip, amount);
      expect(sim.ledger.payoutCount).toBe(1n);
      expect(sim.ledger.payouts.member(receipt)).toBe(true);
    });

    it('refuses to underpay one rider by 10%', async () => {
      const trip = tripFacts();
      const amount = expectedPayout(RULE_V1, trip, 120n);
      await expect(pay(trip, (amount * 9n) / 10n)).rejects.toThrow('Payout does not follow the rule in force');
      expect(sim.ledger.payoutCount).toBe(0n);
    });

    it('refuses to overpay one rider too (no per-rider factor either way)', async () => {
      const trip = tripFacts();
      await expect(pay(trip, expectedPayout(RULE_V1, trip, 120n) + 1n)).rejects.toThrow(
        'Payout does not follow the rule in force',
      );
    });

    it('applies the minimum payout floor', async () => {
      const quietZone = 2n;
      const resume = sim.now;
      sim.now = T0;
      await sim.publishSurge(quietZone, slotStart, 100n); // no surge
      sim.now = resume;
      const short = { zone: quietZone, distanceMetres: 200n, minutes: 2n };
      const trip = tripFacts(short);
      const amount = expectedPayout(RULE_V1, trip, 100n);
      expect(amount).toBe(RULE_V1.minPayout); // formula gives 2820, floor lifts it to 3000
      await pay(trip, amount);
      await expect(pay(tripFacts(short), amount - 1n)).rejects.toThrow(
        'Payout does not follow the rule in force',
      );
    });

    it('refuses a rule version that is not in force yet', async () => {
      sim.now = T0 + 60;
      await sim.publishRule(RULE_V2, bytes(), BigInt(T0) + 60n + NOTICE);
      const trip = tripFacts({ slotStart: BigInt(T0) + SLOT * 2n });
      await sim.publishSurge(KORAMANGALA, trip.slotStart, 100n);
      sim.now = T0 + 120; // v2 announced, not yet in force
      await expect(pay(trip, expectedPayout(RULE_V2, trip, 100n), 2n)).rejects.toThrow(
        'This rule version is not in force yet',
      );
    });

    it('refuses a rule version that has been replaced', async () => {
      sim.now = T0 + 60;
      await sim.publishRule(RULE_V2, bytes(), BigInt(T0) + 60n + NOTICE);
      sim.now = T0 + Number(SLOT) + 60; // v2 now in force, inside the trip slot
      const trip = tripFacts();
      await expect(pay(trip, expectedPayout(RULE_V1, trip, 120n), 1n)).rejects.toThrow(
        'This rule version has been replaced',
      );
      await pay(trip, expectedPayout(RULE_V2, trip, 120n), 2n);
      expect(sim.ledger.payoutCount).toBe(1n);
    });

    it('refuses rule parameters that differ from the published commitment', async () => {
      const state = sim.privateState;
      const tampered = { ...state.rules['1'], rule: { ...RULE_V1, baseFare: 2000n } };
      sim.setPrivateState({ ...state, rules: { ...state.rules, '1': tampered } });
      const trip = tripFacts();
      await expect(pay(trip, expectedPayout(tampered.rule, trip, 120n))).rejects.toThrow(
        'Rule parameters do not match the published rule',
      );
    });

    it("refuses a trip whose slot hasn't started", async () => {
      const resume = sim.now;
      sim.now = T0;
      const later = slotStart + SLOT;
      await sim.publishSurge(KORAMANGALA, later, 120n);
      sim.now = resume;
      const trip = tripFacts({ slotStart: later });
      await expect(pay(trip, expectedPayout(RULE_V1, trip, 120n))).rejects.toThrow("This trip's slot has not started yet");
    });

    it('refuses a trip whose slot is past the settle window', async () => {
      const trip = tripFacts();
      sim.now = Number(slotStart + SLOT + SETTLE);
      await expect(pay(trip, expectedPayout(RULE_V1, trip, 120n))).rejects.toThrow("This trip's slot is too old to be paid now");
    });

    it('refuses a trip in a slot with no announced surge', async () => {
      const trip = tripFacts({ zone: 2n });
      await expect(pay(trip, expectedPayout(RULE_V1, trip, 100n))).rejects.toThrow(
        'No surge was announced for this zone and slot',
      );
    });

    it('refuses recording the same receipt twice', async () => {
      const trip = tripFacts();
      const amount = expectedPayout(RULE_V1, trip, 120n);
      const salt = bytes();
      await pay(trip, amount, 1n, salt);
      await expect(pay(trip, amount, 1n, salt)).rejects.toThrow('This receipt is already recorded');
    });
  });

  describe("rider's check (no wallet)", () => {
    it('finds the receipt on the ledger, and not an edited one', async () => {
      const trip = tripFacts();
      const amount = expectedPayout(RULE_V1, trip, 120n);
      const salt = bytes();
      await pay(trip, amount, 1n, salt);

      const mine = pureCircuits.payoutCommitment({ trip: { ...trip, payout: amount }, ruleVersion: 1n }, salt);
      const edited = pureCircuits.payoutCommitment({ trip: { ...trip, payout: amount + 1000n }, ruleVersion: 1n }, salt);
      expect(sim.ledger.payouts.member(mine)).toBe(true);
      expect(sim.ledger.payouts.member(edited)).toBe(false);
    });

    it('keeps trip facts and amounts off the public ledger', async () => {
      const trip = tripFacts();
      await pay(trip, expectedPayout(RULE_V1, trip, 120n));
      const publicState = JSON.stringify(
        [...sim.ledger.payouts].map((c) => Buffer.from(c).toString('hex')),
      );
      expect(publicState).not.toContain(Buffer.from(trip.riderKey).toString('hex'));
      expect(publicState).not.toContain(Buffer.from(trip.tripId).toString('hex'));
    });
  });
});
