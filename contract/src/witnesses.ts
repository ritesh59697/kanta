// SPDX-License-Identifier: Apache-2.0
// Witnesses run only on the platform's machine. They hand the platform's private
// pay rules and operator secret to the prover; none of it reaches the ledger.
import type { WitnessContext } from '@midnight-ntwrk/compact-runtime';

import type { Ledger, PayRule, Witnesses } from './managed/kanta/contract/index.js';

export type { PayRule } from './managed/kanta/contract/index.js';

export type StoredRule = { rule: PayRule; salt: Uint8Array };

export type KantaPrivateState = {
  readonly operatorSecret: Uint8Array;
  /** Rule versions this platform has published, keyed by version number (as a decimal string). */
  readonly rules: Readonly<Record<string, StoredRule>>;
  /** The rule queued for the next publishRule call. */
  readonly pending: StoredRule | null;
};

export const createPrivateState = (operatorSecret: Uint8Array): KantaPrivateState => ({
  operatorSecret,
  rules: {},
  pending: null,
});

/** Queue a rule for the next publishRule transaction. */
export const withPendingRule = (state: KantaPrivateState, pending: StoredRule): KantaPrivateState => ({
  ...state,
  pending,
});

const storedRule = (state: KantaPrivateState, version: bigint): StoredRule => {
  const stored = state.rules[version.toString()];
  if (stored === undefined) throw new Error(`This platform has no private copy of rule version ${version}`);
  return stored;
};

const pendingRule = (state: KantaPrivateState): StoredRule => {
  if (state.pending === null) throw new Error('No rule is queued for publishing');
  return state.pending;
};

type Ctx = WitnessContext<Ledger, KantaPrivateState>;

export const witnesses: Witnesses<KantaPrivateState> = {
  operatorSecret: ({ privateState }: Ctx): [KantaPrivateState, Uint8Array] => [privateState, privateState.operatorSecret],

  ruleParams: ({ privateState }: Ctx, version: bigint): [KantaPrivateState, PayRule] => [
    privateState,
    storedRule(privateState, version).rule,
  ],

  ruleSalt: ({ privateState }: Ctx, version: bigint): [KantaPrivateState, Uint8Array] => [
    privateState,
    storedRule(privateState, version).salt,
  ],

  // Publishing moves the queued rule into the store under the version it will get.
  newRule: ({ privateState, ledger }: Ctx): [KantaPrivateState, PayRule] => {
    const pending = pendingRule(privateState);
    const version = (ledger.ruleCount + 1n).toString();
    return [{ ...privateState, rules: { ...privateState.rules, [version]: pending } }, pending.rule];
  },

  newRuleSalt: ({ privateState }: Ctx): [KantaPrivateState, Uint8Array] => [privateState, pendingRule(privateState).salt],
};
