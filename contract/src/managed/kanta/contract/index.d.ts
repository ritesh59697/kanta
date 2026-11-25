import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type PayRule = { baseFare: bigint;
                        perKm: bigint;
                        perMinute: bigint;
                        minPayout: bigint
                      };

export type RuleVersion = { commitment: Uint8Array; activeFrom: bigint };

export type Trip = { riderKey: Uint8Array;
                     tripId: Uint8Array;
                     zone: bigint;
                     slotStart: bigint;
                     distanceMetres: bigint;
                     minutes: bigint;
                     payout: bigint
                   };

export type Receipt = { trip: Trip; ruleVersion: bigint };

export type SlotKey = { zone: bigint; slotStart: bigint };

export type Witnesses<PS> = {
  operatorSecret(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  ruleParams(context: __compactRuntime.WitnessContext<Ledger, PS>,
             version_0: bigint): [PS, PayRule];
  ruleSalt(context: __compactRuntime.WitnessContext<Ledger, PS>,
           version_0: bigint): [PS, Uint8Array];
  newRule(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, PayRule];
  newRuleSalt(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
}

export type ImpureCircuits<PS> = {
  publishRule(context: __compactRuntime.CircuitContext<PS>, activeFrom_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  publishSurge(context: __compactRuntime.CircuitContext<PS>,
               zone_0: bigint,
               slotStart_0: bigint,
               surgeX100_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  recordPayout(context: __compactRuntime.CircuitContext<PS>,
               trip_0: Trip,
               version_0: bigint,
               receiptSalt_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, []>>;
}

export type ProvableCircuits<PS> = {
  publishRule(context: __compactRuntime.CircuitContext<PS>, activeFrom_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  publishSurge(context: __compactRuntime.CircuitContext<PS>,
               zone_0: bigint,
               slotStart_0: bigint,
               surgeX100_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  recordPayout(context: __compactRuntime.CircuitContext<PS>,
               trip_0: Trip,
               version_0: bigint,
               receiptSalt_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, []>>;
}

export type PureCircuits = {
  ruleCommitment(rule_0: PayRule, salt_0: Uint8Array): Uint8Array;
  slotKey(zone_0: bigint, slotStart_0: bigint): Uint8Array;
  payoutCommitment(receipt_0: Receipt, salt_0: Uint8Array): Uint8Array;
  grossScaled(rule_0: PayRule, trip_0: Trip, surgeX100_0: bigint): bigint;
  payoutFollowsRule(rule_0: PayRule, trip_0: Trip, surgeX100_0: bigint): boolean;
}

export type Circuits<PS> = {
  ruleCommitment(context: __compactRuntime.CircuitContext<PS>,
                 rule_0: PayRule,
                 salt_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, Uint8Array>>;
  slotKey(context: __compactRuntime.CircuitContext<PS>,
          zone_0: bigint,
          slotStart_0: bigint): Promise<__compactRuntime.CircuitResults<PS, Uint8Array>>;
  payoutCommitment(context: __compactRuntime.CircuitContext<PS>,
                   receipt_0: Receipt,
                   salt_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, Uint8Array>>;
  grossScaled(context: __compactRuntime.CircuitContext<PS>,
              rule_0: PayRule,
              trip_0: Trip,
              surgeX100_0: bigint): Promise<__compactRuntime.CircuitResults<PS, bigint>>;
  payoutFollowsRule(context: __compactRuntime.CircuitContext<PS>,
                    rule_0: PayRule,
                    trip_0: Trip,
                    surgeX100_0: bigint): Promise<__compactRuntime.CircuitResults<PS, boolean>>;
  publishRule(context: __compactRuntime.CircuitContext<PS>, activeFrom_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  publishSurge(context: __compactRuntime.CircuitContext<PS>,
               zone_0: bigint,
               slotStart_0: bigint,
               surgeX100_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  recordPayout(context: __compactRuntime.CircuitContext<PS>,
               trip_0: Trip,
               version_0: bigint,
               receiptSalt_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, []>>;
}

export type Ledger = {
  readonly operator: Uint8Array;
  readonly noticeSeconds: bigint;
  readonly slotSeconds: bigint;
  readonly settleSeconds: bigint;
  readonly ruleCount: bigint;
  rules: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): RuleVersion;
    [Symbol.iterator](): Iterator<[bigint, RuleVersion]>
  };
  surge: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  payouts: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  readonly payoutCount: bigint;
}

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>,
               notice_0: bigint,
               slot_0: bigint,
               settle_0: bigint): Promise<__compactRuntime.ConstructorResult<PS>>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
export declare const expectedVk: Record<string, string>;
export declare const circuitSignatures: __compactRuntime.CircuitSignatures;
export declare const declaredInterfaces: __compactRuntime.DeclaredInterfaces;
