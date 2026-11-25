// SPDX-License-Identifier: Apache-2.0
// A receipt is everything a rider needs to find their own payout on the public ledger.
// The rider's phone recomputes the commitment; nothing is sent to the platform.
import { Kanta } from '@kanta/contract';

import { type ContractRead, fromHex, readContract, slotKey } from './chain';

export type ReceiptData = {
  contractAddress: string;
  network: string;
  ruleVersion: string;
  salt: string;
  trip: {
    riderKey: string;
    tripId: string;
    zone: string;
    slotStart: string;
    distanceMetres: string;
    minutes: string;
    payout: string;
  };
};

export const decodeReceipt = (code: string): ReceiptData => {
  const clean = code.trim().replace(/^.*[?&#]r=/, '');
  const json = atob(clean.replace(/-/g, '+').replace(/_/g, '/'));
  const r = JSON.parse(json) as ReceiptData;
  if (!r.trip || !r.salt || !r.contractAddress) throw new Error('Not a Kanta receipt');
  return r;
};

export const encodeReceipt = (r: ReceiptData): string =>
  btoa(JSON.stringify(r)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

export const commitmentOf = (r: ReceiptData): Uint8Array =>
  Kanta.pureCircuits.payoutCommitment(
    {
      trip: {
        riderKey: fromHex(r.trip.riderKey),
        tripId: fromHex(r.trip.tripId),
        zone: BigInt(r.trip.zone),
        slotStart: BigInt(r.trip.slotStart),
        distanceMetres: BigInt(r.trip.distanceMetres),
        minutes: BigInt(r.trip.minutes),
        payout: BigInt(r.trip.payout),
      },
      ruleVersion: BigInt(r.ruleVersion),
    },
    fromHex(r.salt),
  );

export type CheckResult = {
  found: boolean;
  read: ContractRead;
  rule?: Kanta.RuleVersion;
  surgeX100?: bigint;
};

export const checkReceipt = async (r: ReceiptData): Promise<CheckResult> => {
  const read = await readContract(r.contractAddress);
  const { ledger } = read;
  const version = BigInt(r.ruleVersion);
  const key = slotKey(BigInt(r.trip.zone), BigInt(r.trip.slotStart));
  return {
    found: ledger.payouts.member(commitmentOf(r)),
    read,
    rule: ledger.rules.member(version) ? ledger.rules.lookup(version) : undefined,
    surgeX100: ledger.surge.member(key) ? ledger.surge.lookup(key) : undefined,
  };
};
