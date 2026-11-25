// SPDX-License-Identifier: Apache-2.0
// Runs the compiled Kanta circuits locally (no proofs, no chain) so tests can drive
// the contract through its real logic, with a controllable block time.
import {
  type CircuitContext,
  createCircuitContext,
  createConstructorContext,
  sampleContractAddress,
} from '@midnight-ntwrk/compact-runtime';

import {
  Contract,
  type Ledger,
  ledger,
  type PayRule,
  pureCircuits,
  type Trip,
} from '../managed/kanta/contract/index.js';
import { createPrivateState, type KantaPrivateState, witnesses, withPendingRule } from '../witnesses.js';

const COIN_PK = '0'.repeat(64);

export class KantaSimulator {
  readonly contract = new Contract<KantaPrivateState>(witnesses);
  readonly address = sampleContractAddress();
  private context!: CircuitContext<KantaPrivateState>;
  /** Block time in unix seconds, used for the next circuit call. */
  now: number;

  private constructor(now: number) {
    this.now = now;
  }

  static async deploy(
    operatorSecret: Uint8Array,
    params: { noticeSeconds: bigint; slotSeconds: bigint; settleSeconds: bigint },
    now: number,
  ): Promise<KantaSimulator> {
    const sim = new KantaSimulator(now);
    const init = await sim.contract.initialState(
      createConstructorContext(createPrivateState(operatorSecret), COIN_PK),
      params.noticeSeconds,
      params.slotSeconds,
      params.settleSeconds,
    );
    sim.context = createCircuitContext({
      circuitId: 'publishRule',
      contractAddress: sim.address,
      coinPublicKeyOrZswapState: init.currentZswapLocalState,
      contractState: init.currentContractState,
      privateState: init.currentPrivateState,
      time: now,
    });
    return sim;
  }

  get ledger(): Ledger {
    return ledger(this.context.callContext.currentQueryContext.state);
  }

  get privateState(): KantaPrivateState {
    return this.context.callContext.currentPrivateState as KantaPrivateState;
  }

  /** Replace the private state, e.g. to act as someone without the operator secret. */
  setPrivateState(state: KantaPrivateState): void {
    this.context = this.freshContext('publishRule', state);
  }

  private freshContext(circuitId: string, privateState = this.privateState): CircuitContext<KantaPrivateState> {
    return createCircuitContext({
      circuitId,
      contractAddress: this.address,
      coinPublicKeyOrZswapState: COIN_PK,
      contractState: this.context.callContext.currentQueryContext.state,
      privateState,
      time: this.now,
    });
  }

  async publishRule(rule: PayRule, salt: Uint8Array, activeFrom: bigint): Promise<void> {
    const ctx = this.freshContext('publishRule', withPendingRule(this.privateState, { rule, salt }));
    const res = await this.contract.impureCircuits.publishRule(ctx, activeFrom);
    this.context = res.context;
  }

  async publishSurge(zone: bigint, slotStart: bigint, surgeX100: bigint): Promise<void> {
    const res = await this.contract.impureCircuits.publishSurge(this.freshContext('publishSurge'), zone, slotStart, surgeX100);
    this.context = res.context;
  }

  async recordPayout(trip: Trip, version: bigint, receiptSalt: Uint8Array): Promise<Uint8Array> {
    const res = await this.contract.impureCircuits.recordPayout(this.freshContext('recordPayout'), trip, version, receiptSalt);
    this.context = res.context;
    return pureCircuits.payoutCommitment({ trip, ruleVersion: version }, receiptSalt);
  }
}
