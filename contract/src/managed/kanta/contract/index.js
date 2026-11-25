import * as __compactRuntime from '@midnight-ntwrk/compact-runtime';
__compactRuntime.checkRuntimeVersion('0.21.0');

const _descriptor_0 = new __compactRuntime.CompactTypeBytes(32);

const _descriptor_1 = new __compactRuntime.CompactTypeUnsignedInteger(65535n, 2);

const _descriptor_2 = __compactRuntime.CompactTypeBoolean;

const _descriptor_3 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);

const _descriptor_4 = new __compactRuntime.CompactTypeUnsignedInteger(4294967295n, 4);

class _RuleVersion_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_3.alignment());
  }
  fromValue(value_0) {
    return {
      commitment: _descriptor_0.fromValue(value_0),
      activeFrom: _descriptor_3.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.commitment).concat(_descriptor_3.toValue(value_0.activeFrom));
  }
}

const _descriptor_5 = new _RuleVersion_0();

class _Trip_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_1.alignment().concat(_descriptor_3.alignment().concat(_descriptor_4.alignment().concat(_descriptor_1.alignment().concat(_descriptor_4.alignment()))))));
  }
  fromValue(value_0) {
    return {
      riderKey: _descriptor_0.fromValue(value_0),
      tripId: _descriptor_0.fromValue(value_0),
      zone: _descriptor_1.fromValue(value_0),
      slotStart: _descriptor_3.fromValue(value_0),
      distanceMetres: _descriptor_4.fromValue(value_0),
      minutes: _descriptor_1.fromValue(value_0),
      payout: _descriptor_4.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.riderKey).concat(_descriptor_0.toValue(value_0.tripId).concat(_descriptor_1.toValue(value_0.zone).concat(_descriptor_3.toValue(value_0.slotStart).concat(_descriptor_4.toValue(value_0.distanceMetres).concat(_descriptor_1.toValue(value_0.minutes).concat(_descriptor_4.toValue(value_0.payout)))))));
  }
}

const _descriptor_6 = new _Trip_0();

class _PayRule_0 {
  alignment() {
    return _descriptor_4.alignment().concat(_descriptor_4.alignment().concat(_descriptor_4.alignment().concat(_descriptor_4.alignment())));
  }
  fromValue(value_0) {
    return {
      baseFare: _descriptor_4.fromValue(value_0),
      perKm: _descriptor_4.fromValue(value_0),
      perMinute: _descriptor_4.fromValue(value_0),
      minPayout: _descriptor_4.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_4.toValue(value_0.baseFare).concat(_descriptor_4.toValue(value_0.perKm).concat(_descriptor_4.toValue(value_0.perMinute).concat(_descriptor_4.toValue(value_0.minPayout))));
  }
}

const _descriptor_7 = new _PayRule_0();

class _Receipt_0 {
  alignment() {
    return _descriptor_6.alignment().concat(_descriptor_4.alignment());
  }
  fromValue(value_0) {
    return {
      trip: _descriptor_6.fromValue(value_0),
      ruleVersion: _descriptor_4.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_6.toValue(value_0.trip).concat(_descriptor_4.toValue(value_0.ruleVersion));
  }
}

const _descriptor_8 = new _Receipt_0();

const _descriptor_9 = new __compactRuntime.CompactTypeUnsignedInteger(340282366920938463463374607431768211455n, 16);

const _descriptor_10 = new __compactRuntime.CompactTypeVector(2, _descriptor_0);

class _SlotKey_0 {
  alignment() {
    return _descriptor_1.alignment().concat(_descriptor_3.alignment());
  }
  fromValue(value_0) {
    return {
      zone: _descriptor_1.fromValue(value_0),
      slotStart: _descriptor_3.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.zone).concat(_descriptor_3.toValue(value_0.slotStart));
  }
}

const _descriptor_11 = new _SlotKey_0();

class _Either_0 {
  alignment() {
    return _descriptor_2.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_2.fromValue(value_0),
      left: _descriptor_0.fromValue(value_0),
      right: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_2.toValue(value_0.is_left).concat(_descriptor_0.toValue(value_0.left).concat(_descriptor_0.toValue(value_0.right)));
  }
}

const _descriptor_12 = new _Either_0();

class _ContractAddress_0 {
  alignment() {
    return _descriptor_0.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.bytes);
  }
}

const _descriptor_13 = new _ContractAddress_0();

class _UserAddress_0 {
  alignment() {
    return _descriptor_0.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.bytes);
  }
}

const _descriptor_14 = new _UserAddress_0();

class _Either_1 {
  alignment() {
    return _descriptor_2.alignment().concat(_descriptor_13.alignment().concat(_descriptor_14.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_2.fromValue(value_0),
      left: _descriptor_13.fromValue(value_0),
      right: _descriptor_14.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_2.toValue(value_0.is_left).concat(_descriptor_13.toValue(value_0.left).concat(_descriptor_14.toValue(value_0.right)));
  }
}

const _descriptor_15 = new _Either_1();

class _Maybe_0 {
  alignment() {
    return _descriptor_2.alignment().concat(_descriptor_15.alignment());
  }
  fromValue(value_0) {
    return {
      is_some: _descriptor_2.fromValue(value_0),
      value: _descriptor_15.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_2.toValue(value_0.is_some).concat(_descriptor_15.toValue(value_0.value));
  }
}

const _descriptor_16 = new _Maybe_0();

const _descriptor_17 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

export class Contract {
  witnesses;
  constructor(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract constructor: expected 1 argument, received ${args_0.length}`);
    }
    const witnesses_0 = args_0[0];
    if (typeof(witnesses_0) !== 'object') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor is not an object');
    }
    if (typeof(witnesses_0.operatorSecret) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named operatorSecret');
    }
    if (typeof(witnesses_0.ruleParams) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named ruleParams');
    }
    if (typeof(witnesses_0.ruleSalt) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named ruleSalt');
    }
    if (typeof(witnesses_0.newRule) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named newRule');
    }
    if (typeof(witnesses_0.newRuleSalt) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named newRuleSalt');
    }
    this.witnesses = witnesses_0;
    this.circuits = {
      async ruleCommitment(context, ...args_1) {
        return { result: pureCircuits.ruleCommitment(...args_1), context };
      },
      async slotKey(context, ...args_1) {
        return { result: pureCircuits.slotKey(...args_1), context };
      },
      async payoutCommitment(context, ...args_1) {
        return { result: pureCircuits.payoutCommitment(...args_1), context };
      },
      async grossScaled(context, ...args_1) {
        return { result: pureCircuits.grossScaled(...args_1), context };
      },
      async payoutFollowsRule(context, ...args_1) {
        return { result: pureCircuits.payoutFollowsRule(...args_1), context };
      },
      publishRule: async (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`publishRule: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const activeFrom_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('publishRule',
                                     'argument 1 (as invoked from Typescript)',
                                     'kanta.compact line 135 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(activeFrom_0) === 'bigint' && activeFrom_0 >= 0n && activeFrom_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('publishRule',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'kanta.compact line 135 char 1',
                                     'Uint<0..18446744073709551616>',
                                     activeFrom_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_3.toValue(activeFrom_0),
            alignment: _descriptor_3.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._publishRule_0(context,
                                                   partialProofData,
                                                   activeFrom_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      publishSurge: async (...args_1) => {
        if (args_1.length !== 4) {
          throw new __compactRuntime.CompactError(`publishSurge: expected 4 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const zone_0 = args_1[1];
        const slotStart_0 = args_1[2];
        const surgeX100_0 = args_1[3];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('publishSurge',
                                     'argument 1 (as invoked from Typescript)',
                                     'kanta.compact line 156 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(zone_0) === 'bigint' && zone_0 >= 0n && zone_0 <= 65535n)) {
          __compactRuntime.typeError('publishSurge',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'kanta.compact line 156 char 1',
                                     'Uint<0..65536>',
                                     zone_0)
        }
        if (!(typeof(slotStart_0) === 'bigint' && slotStart_0 >= 0n && slotStart_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('publishSurge',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'kanta.compact line 156 char 1',
                                     'Uint<0..18446744073709551616>',
                                     slotStart_0)
        }
        if (!(typeof(surgeX100_0) === 'bigint' && surgeX100_0 >= 0n && surgeX100_0 <= 65535n)) {
          __compactRuntime.typeError('publishSurge',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'kanta.compact line 156 char 1',
                                     'Uint<0..65536>',
                                     surgeX100_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_1.toValue(zone_0).concat(_descriptor_3.toValue(slotStart_0).concat(_descriptor_1.toValue(surgeX100_0))),
            alignment: _descriptor_1.alignment().concat(_descriptor_3.alignment().concat(_descriptor_1.alignment()))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._publishSurge_0(context,
                                                    partialProofData,
                                                    zone_0,
                                                    slotStart_0,
                                                    surgeX100_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      recordPayout: async (...args_1) => {
        if (args_1.length !== 4) {
          throw new __compactRuntime.CompactError(`recordPayout: expected 4 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const trip_0 = args_1[1];
        const version_0 = args_1[2];
        const receiptSalt_0 = args_1[3];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('recordPayout',
                                     'argument 1 (as invoked from Typescript)',
                                     'kanta.compact line 169 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(trip_0) === 'object' && trip_0.riderKey.buffer instanceof ArrayBuffer && trip_0.riderKey.BYTES_PER_ELEMENT === 1 && trip_0.riderKey.length === 32 && trip_0.tripId.buffer instanceof ArrayBuffer && trip_0.tripId.BYTES_PER_ELEMENT === 1 && trip_0.tripId.length === 32 && typeof(trip_0.zone) === 'bigint' && trip_0.zone >= 0n && trip_0.zone <= 65535n && typeof(trip_0.slotStart) === 'bigint' && trip_0.slotStart >= 0n && trip_0.slotStart <= 18446744073709551615n && typeof(trip_0.distanceMetres) === 'bigint' && trip_0.distanceMetres >= 0n && trip_0.distanceMetres <= 4294967295n && typeof(trip_0.minutes) === 'bigint' && trip_0.minutes >= 0n && trip_0.minutes <= 65535n && typeof(trip_0.payout) === 'bigint' && trip_0.payout >= 0n && trip_0.payout <= 4294967295n)) {
          __compactRuntime.typeError('recordPayout',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'kanta.compact line 169 char 1',
                                     'struct Trip<riderKey: Bytes<32>, tripId: Bytes<32>, zone: Uint<0..65536>, slotStart: Uint<0..18446744073709551616>, distanceMetres: Uint<0..4294967296>, minutes: Uint<0..65536>, payout: Uint<0..4294967296>>',
                                     trip_0)
        }
        if (!(typeof(version_0) === 'bigint' && version_0 >= 0n && version_0 <= 4294967295n)) {
          __compactRuntime.typeError('recordPayout',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'kanta.compact line 169 char 1',
                                     'Uint<0..4294967296>',
                                     version_0)
        }
        if (!(receiptSalt_0.buffer instanceof ArrayBuffer && receiptSalt_0.BYTES_PER_ELEMENT === 1 && receiptSalt_0.length === 32)) {
          __compactRuntime.typeError('recordPayout',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'kanta.compact line 169 char 1',
                                     'Bytes<32>',
                                     receiptSalt_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_6.toValue(trip_0).concat(_descriptor_4.toValue(version_0).concat(_descriptor_0.toValue(receiptSalt_0))),
            alignment: _descriptor_6.alignment().concat(_descriptor_4.alignment().concat(_descriptor_0.alignment()))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._recordPayout_0(context,
                                                    partialProofData,
                                                    trip_0,
                                                    version_0,
                                                    receiptSalt_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      }
    };
    this.impureCircuits = {
      publishRule: this.circuits.publishRule,
      publishSurge: this.circuits.publishSurge,
      recordPayout: this.circuits.recordPayout
    };
    this.provableCircuits = {
      publishRule: this.circuits.publishRule,
      publishSurge: this.circuits.publishSurge,
      recordPayout: this.circuits.recordPayout
    };
  }
  async initialState(...args_0) {
    if (args_0.length !== 4) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 4 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const constructorContext_0 = args_0[0];
    const notice_0 = args_0[1];
    const slot_0 = args_0[2];
    const settle_0 = args_0[3];
    if (typeof(constructorContext_0) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'constructorContext' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!('initialPrivateState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialPrivateState' in argument 1 (as invoked from Typescript)`);
    }
    if (!('initialZswapLocalState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript)`);
    }
    if (typeof(constructorContext_0.initialZswapLocalState) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!(typeof(notice_0) === 'bigint' && notice_0 >= 0n && notice_0 <= 18446744073709551615n)) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 1 (argument 2 as invoked from Typescript)',
                                 'kanta.compact line 126 char 1',
                                 'Uint<0..18446744073709551616>',
                                 notice_0)
    }
    if (!(typeof(slot_0) === 'bigint' && slot_0 >= 0n && slot_0 <= 18446744073709551615n)) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 2 (argument 3 as invoked from Typescript)',
                                 'kanta.compact line 126 char 1',
                                 'Uint<0..18446744073709551616>',
                                 slot_0)
    }
    if (!(typeof(settle_0) === 'bigint' && settle_0 >= 0n && settle_0 <= 18446744073709551615n)) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 3 (argument 4 as invoked from Typescript)',
                                 'kanta.compact line 126 char 1',
                                 'Uint<0..18446744073709551616>',
                                 settle_0)
    }
    const state_0 = new __compactRuntime.ContractState();
    let stateValue_0 = __compactRuntime.StateValue.newArray();
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    state_0.data = new __compactRuntime.ChargedState(stateValue_0);
    state_0.setOperation('publishRule', new __compactRuntime.ContractOperation());
    state_0.setOperation('publishSurge', new __compactRuntime.ContractOperation());
    state_0.setOperation('recordPayout', new __compactRuntime.ContractOperation());
    const context = __compactRuntime.createCircuitContext({circuitId: 'constructor', contractAddress: __compactRuntime.dummyContractAddress(), coinPublicKeyOrZswapState: constructorContext_0.initialZswapLocalState.coinPublicKey, contractState: state_0.data, privateState: constructorContext_0.initialPrivateState});
    const partialProofData = {
      input: { value: [], alignment: [] },
      output: undefined,
      publicTranscript: [],
      privateTranscriptOutputs: []
    };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(0n),
                                                                                              alignment: _descriptor_17.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(new Uint8Array(32)),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(1n),
                                                                                              alignment: _descriptor_17.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(0n),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(2n),
                                                                                              alignment: _descriptor_17.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(0n),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(3n),
                                                                                              alignment: _descriptor_17.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(0n),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(4n),
                                                                                              alignment: _descriptor_17.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(0n),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(5n),
                                                                                              alignment: _descriptor_17.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(6n),
                                                                                              alignment: _descriptor_17.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(7n),
                                                                                              alignment: _descriptor_17.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(8n),
                                                                                              alignment: _descriptor_17.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(0n),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    const tmp_0 = this._publicKey_0(this._operatorSecret_0(context,
                                                           partialProofData));
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(0n),
                                                                                              alignment: _descriptor_17.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(1n),
                                                                                              alignment: _descriptor_17.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(notice_0),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(2n),
                                                                                              alignment: _descriptor_17.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(slot_0),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(3n),
                                                                                              alignment: _descriptor_17.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(settle_0),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    state_0.data = new __compactRuntime.ChargedState(context.callContext.currentQueryContext.state.state);
    return {
      currentContractState: state_0,
      currentPrivateState: context.callContext.currentPrivateState,
      currentZswapLocalState: context.callContext.currentZswapLocalState
    }
  }
  async _blockTimeLt_0(context, partialProofData, time_0) {
    return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                     partialProofData,
                                                                     [
                                                                      { dup: { n: 2 } },
                                                                      { idx: { cached: true,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_17.toValue(2n),
                                                                                                 alignment: _descriptor_17.alignment() } }] } },
                                                                      { push: { storage: false,
                                                                                value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(time_0),
                                                                                                                             alignment: _descriptor_3.alignment() }).encode() } },
                                                                      'lt',
                                                                      { popeq: { cached: true,
                                                                                 result: undefined } }]).value);
  }
  async _blockTimeGte_0(context, partialProofData, time_0) {
    return !await this._blockTimeLt_0(context, partialProofData, time_0);
  }
  async _blockTimeGt_0(context, partialProofData, time_0) {
    return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                     partialProofData,
                                                                     [
                                                                      { push: { storage: false,
                                                                                value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(time_0),
                                                                                                                             alignment: _descriptor_3.alignment() }).encode() } },
                                                                      { dup: { n: 3 } },
                                                                      { idx: { cached: true,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_17.toValue(2n),
                                                                                                 alignment: _descriptor_17.alignment() } }] } },
                                                                      'lt',
                                                                      { popeq: { cached: true,
                                                                                 result: undefined } }]).value);
  }
  async _blockTimeLte_0(context, partialProofData, time_0) {
    return !await this._blockTimeGt_0(context, partialProofData, time_0);
  }
  _persistentHash_0(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_11, value_0);
    return result_0;
  }
  _persistentHash_1(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_10, value_0);
    return result_0;
  }
  _persistentCommit_0(value_0, rand_0) {
    const result_0 = __compactRuntime.persistentCommit(_descriptor_7,
                                                       value_0,
                                                       rand_0);
    return result_0;
  }
  _persistentCommit_1(value_0, rand_0) {
    const result_0 = __compactRuntime.persistentCommit(_descriptor_8,
                                                       value_0,
                                                       rand_0);
    return result_0;
  }
  _operatorSecret_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.callContext.currentQueryContext.state), context.callContext.currentPrivateState, context.callContext.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.operatorSecret(witnessContext_0);
    context.callContext.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('operatorSecret',
                                 'return value',
                                 'kanta.compact line 71 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_0.toValue(result_0),
      alignment: _descriptor_0.alignment()
    });
    return result_0;
  }
  _ruleParams_0(context, partialProofData, version_0) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.callContext.currentQueryContext.state), context.callContext.currentPrivateState, context.callContext.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.ruleParams(witnessContext_0,
                                                                     version_0);
    context.callContext.currentPrivateState = nextPrivateState_0;
    if (!(typeof(result_0) === 'object' && typeof(result_0.baseFare) === 'bigint' && result_0.baseFare >= 0n && result_0.baseFare <= 4294967295n && typeof(result_0.perKm) === 'bigint' && result_0.perKm >= 0n && result_0.perKm <= 4294967295n && typeof(result_0.perMinute) === 'bigint' && result_0.perMinute >= 0n && result_0.perMinute <= 4294967295n && typeof(result_0.minPayout) === 'bigint' && result_0.minPayout >= 0n && result_0.minPayout <= 4294967295n)) {
      __compactRuntime.typeError('ruleParams',
                                 'return value',
                                 'kanta.compact line 72 char 1',
                                 'struct PayRule<baseFare: Uint<0..4294967296>, perKm: Uint<0..4294967296>, perMinute: Uint<0..4294967296>, minPayout: Uint<0..4294967296>>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_7.toValue(result_0),
      alignment: _descriptor_7.alignment()
    });
    return result_0;
  }
  _ruleSalt_0(context, partialProofData, version_0) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.callContext.currentQueryContext.state), context.callContext.currentPrivateState, context.callContext.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.ruleSalt(witnessContext_0,
                                                                   version_0);
    context.callContext.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('ruleSalt',
                                 'return value',
                                 'kanta.compact line 73 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_0.toValue(result_0),
      alignment: _descriptor_0.alignment()
    });
    return result_0;
  }
  _newRule_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.callContext.currentQueryContext.state), context.callContext.currentPrivateState, context.callContext.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.newRule(witnessContext_0);
    context.callContext.currentPrivateState = nextPrivateState_0;
    if (!(typeof(result_0) === 'object' && typeof(result_0.baseFare) === 'bigint' && result_0.baseFare >= 0n && result_0.baseFare <= 4294967295n && typeof(result_0.perKm) === 'bigint' && result_0.perKm >= 0n && result_0.perKm <= 4294967295n && typeof(result_0.perMinute) === 'bigint' && result_0.perMinute >= 0n && result_0.perMinute <= 4294967295n && typeof(result_0.minPayout) === 'bigint' && result_0.minPayout >= 0n && result_0.minPayout <= 4294967295n)) {
      __compactRuntime.typeError('newRule',
                                 'return value',
                                 'kanta.compact line 74 char 1',
                                 'struct PayRule<baseFare: Uint<0..4294967296>, perKm: Uint<0..4294967296>, perMinute: Uint<0..4294967296>, minPayout: Uint<0..4294967296>>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_7.toValue(result_0),
      alignment: _descriptor_7.alignment()
    });
    return result_0;
  }
  _newRuleSalt_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.callContext.currentQueryContext.state), context.callContext.currentPrivateState, context.callContext.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.newRuleSalt(witnessContext_0);
    context.callContext.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('newRuleSalt',
                                 'return value',
                                 'kanta.compact line 75 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_0.toValue(result_0),
      alignment: _descriptor_0.alignment()
    });
    return result_0;
  }
  _publicKey_0(sk_0) {
    return this._persistentHash_1([new Uint8Array([107, 97, 110, 116, 97, 58, 111, 112, 101, 114, 97, 116, 111, 114, 58, 112, 107, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                   sk_0]);
  }
  async _requireOperator_0(context, partialProofData) {
    __compactRuntime.assert(this._equal_0(this._publicKey_0(this._operatorSecret_0(context,
                                                                                   partialProofData)),
                                          _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                    partialProofData,
                                                                                                    [
                                                                                                     { dup: { n: 0 } },
                                                                                                     { idx: { cached: false,
                                                                                                              pushPath: false,
                                                                                                              path: [
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_17.toValue(0n),
                                                                                                                                alignment: _descriptor_17.alignment() } }] } },
                                                                                                     { popeq: { cached: false,
                                                                                                                result: undefined } }]).value)),
                            'Only the platform operator can do this');
    return [];
  }
  _ruleCommitment_0(rule_0, salt_0) {
    return this._persistentCommit_0(rule_0, salt_0);
  }
  _slotKey_0(zone_0, slotStart_0) {
    return this._persistentHash_0({ zone: zone_0, slotStart: slotStart_0 });
  }
  _payoutCommitment_0(receipt_0, salt_0) {
    return this._persistentCommit_1(receipt_0, salt_0);
  }
  _grossScaled_0(rule_0, trip_0, surgeX100_0) {
    const perOrderMilli_0 = rule_0.baseFare * 1000n
                            +
                            rule_0.perMinute * trip_0.minutes * 1000n;
    const distanceMilli_0 = rule_0.perKm * trip_0.distanceMetres;
    return (perOrderMilli_0 + distanceMilli_0) * surgeX100_0;
  }
  _payoutFollowsRule_0(rule_0, trip_0, surgeX100_0) {
    const gross_0 = this._grossScaled_0(rule_0, trip_0, surgeX100_0);
    const p_0 = trip_0.payout;
    const pScaled_0 = p_0 * 100000n;
    const nextScaled_0 = (p_0 + 1n) * 100000n;
    const minScaled_0 = rule_0.minPayout * 100000n;
    const isFloor_0 = p_0 === rule_0.minPayout && gross_0 < minScaled_0;
    const isFormula_0 = p_0 >= rule_0.minPayout && pScaled_0 <= gross_0
                        &&
                        gross_0 < nextScaled_0;
    return isFloor_0 || isFormula_0;
  }
  async _publishRule_0(context, partialProofData, activeFrom_0) {
    await this._requireOperator_0(context, partialProofData);
    const startAt_0 = activeFrom_0;
    __compactRuntime.assert(startAt_0
                            >=
                            _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_17.toValue(1n),
                                                                                                                  alignment: _descriptor_17.alignment() } }] } },
                                                                                       { popeq: { cached: false,
                                                                                                  result: undefined } }]).value),
                            'activeFrom is too early');
    let t_0;
    __compactRuntime.assert(await this._blockTimeLte_0(context,
                                                       partialProofData,
                                                       (t_0 = _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                        partialProofData,
                                                                                                                        [
                                                                                                                         { dup: { n: 0 } },
                                                                                                                         { idx: { cached: false,
                                                                                                                                  pushPath: false,
                                                                                                                                  path: [
                                                                                                                                         { tag: 'value',
                                                                                                                                           value: { value: _descriptor_17.toValue(1n),
                                                                                                                                                    alignment: _descriptor_17.alignment() } }] } },
                                                                                                                         { popeq: { cached: false,
                                                                                                                                    result: undefined } }]).value),
                                                        (__compactRuntime.assert(startAt_0
                                                                                 >=
                                                                                 t_0,
                                                                                 'result of subtraction would be negative'),
                                                         startAt_0 - t_0))),
                            'Rule must be announced at least noticeSeconds before it starts');
    const current_0 = ((t1) => {
                        if (t1 > 4294967295n) {
                          throw new __compactRuntime.CompactError('kanta.compact line 141 char 19: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 4294967295');
                        }
                        return t1;
                      })(_descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                   partialProofData,
                                                                                   [
                                                                                    { dup: { n: 0 } },
                                                                                    { idx: { cached: false,
                                                                                             pushPath: false,
                                                                                             path: [
                                                                                                    { tag: 'value',
                                                                                                      value: { value: _descriptor_17.toValue(4n),
                                                                                                               alignment: _descriptor_17.alignment() } }] } },
                                                                                    { popeq: { cached: true,
                                                                                               result: undefined } }]).value));
    if (current_0 > 0n) {
      __compactRuntime.assert(startAt_0
                              >
                              _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                        partialProofData,
                                                                                        [
                                                                                         { dup: { n: 0 } },
                                                                                         { idx: { cached: false,
                                                                                                  pushPath: false,
                                                                                                  path: [
                                                                                                         { tag: 'value',
                                                                                                           value: { value: _descriptor_17.toValue(5n),
                                                                                                                    alignment: _descriptor_17.alignment() } }] } },
                                                                                         { idx: { cached: false,
                                                                                                  pushPath: false,
                                                                                                  path: [
                                                                                                         { tag: 'value',
                                                                                                           value: { value: _descriptor_4.toValue(current_0),
                                                                                                                    alignment: _descriptor_4.alignment() } }] } },
                                                                                         { popeq: { cached: false,
                                                                                                    result: undefined } }]).value).activeFrom,
                              'A new rule must start after the current one');
    }
    const version_0 = ((t1) => {
                        if (t1 > 4294967295n) {
                          throw new __compactRuntime.CompactError('kanta.compact line 146 char 19: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 4294967295');
                        }
                        return t1;
                      })(current_0 + 1n);
    const tmp_0 = { commitment:
                      this._ruleCommitment_0(this._newRule_0(context,
                                                             partialProofData),
                                             this._newRuleSalt_0(context,
                                                                 partialProofData)),
                    activeFrom: startAt_0 };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_17.toValue(5n),
                                                                  alignment: _descriptor_17.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(version_0),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(tmp_0),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_1 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_17.toValue(4n),
                                                                  alignment: _descriptor_17.alignment() } }] } },
                                       { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                                              { value: _descriptor_1.toValue(tmp_1),
                                                                alignment: _descriptor_1.alignment() }
                                                                .value
                                                            )) } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  async _publishSurge_0(context,
                        partialProofData,
                        zone_0,
                        slotStart_0,
                        surgeX100_0)
  {
    await this._requireOperator_0(context, partialProofData);
    const start_0 = slotStart_0;
    const key_0 = this._slotKey_0(zone_0, start_0);
    __compactRuntime.assert(!_descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_17.toValue(6n),
                                                                                                                   alignment: _descriptor_17.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'Surge for this zone and slot is already published');
    __compactRuntime.assert(await this._blockTimeLt_0(context,
                                                      partialProofData,
                                                      start_0),
                            'Surge must be published before the slot starts');
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_17.toValue(6n),
                                                                  alignment: _descriptor_17.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(surgeX100_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  async _recordPayout_0(context,
                        partialProofData,
                        trip_0,
                        version_0,
                        receiptSalt_0)
  {
    await this._requireOperator_0(context, partialProofData);
    const v_0 = version_0;
    __compactRuntime.assert(_descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_17.toValue(5n),
                                                                                                                  alignment: _descriptor_17.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(v_0),
                                                                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Unknown rule version');
    const published_0 = _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                  partialProofData,
                                                                                  [
                                                                                   { dup: { n: 0 } },
                                                                                   { idx: { cached: false,
                                                                                            pushPath: false,
                                                                                            path: [
                                                                                                   { tag: 'value',
                                                                                                     value: { value: _descriptor_17.toValue(5n),
                                                                                                              alignment: _descriptor_17.alignment() } }] } },
                                                                                   { idx: { cached: false,
                                                                                            pushPath: false,
                                                                                            path: [
                                                                                                   { tag: 'value',
                                                                                                     value: { value: _descriptor_4.toValue(v_0),
                                                                                                              alignment: _descriptor_4.alignment() } }] } },
                                                                                   { popeq: { cached: false,
                                                                                              result: undefined } }]).value);
    __compactRuntime.assert(await this._blockTimeGte_0(context,
                                                       partialProofData,
                                                       published_0.activeFrom),
                            'This rule version is not in force yet');
    const next_0 = ((t1) => {
                     if (t1 > 4294967295n) {
                       throw new __compactRuntime.CompactError('kanta.compact line 176 char 16: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 4294967295');
                     }
                     return t1;
                   })(v_0 + 1n);
    if (_descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                  partialProofData,
                                                                  [
                                                                   { dup: { n: 0 } },
                                                                   { idx: { cached: false,
                                                                            pushPath: false,
                                                                            path: [
                                                                                   { tag: 'value',
                                                                                     value: { value: _descriptor_17.toValue(5n),
                                                                                              alignment: _descriptor_17.alignment() } }] } },
                                                                   { push: { storage: false,
                                                                             value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(next_0),
                                                                                                                          alignment: _descriptor_4.alignment() }).encode() } },
                                                                   'member',
                                                                   { popeq: { cached: true,
                                                                              result: undefined } }]).value))
    {
      __compactRuntime.assert(await this._blockTimeLt_0(context,
                                                        partialProofData,
                                                        _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                  partialProofData,
                                                                                                                  [
                                                                                                                   { dup: { n: 0 } },
                                                                                                                   { idx: { cached: false,
                                                                                                                            pushPath: false,
                                                                                                                            path: [
                                                                                                                                   { tag: 'value',
                                                                                                                                     value: { value: _descriptor_17.toValue(5n),
                                                                                                                                              alignment: _descriptor_17.alignment() } }] } },
                                                                                                                   { idx: { cached: false,
                                                                                                                            pushPath: false,
                                                                                                                            path: [
                                                                                                                                   { tag: 'value',
                                                                                                                                     value: { value: _descriptor_4.toValue(next_0),
                                                                                                                                              alignment: _descriptor_4.alignment() } }] } },
                                                                                                                   { popeq: { cached: false,
                                                                                                                              result: undefined } }]).value).activeFrom),
                              'This rule version has been replaced');
    }
    const rule_0 = this._ruleParams_0(context, partialProofData, v_0);
    __compactRuntime.assert(this._equal_1(this._ruleCommitment_0(rule_0,
                                                                 this._ruleSalt_0(context,
                                                                                  partialProofData,
                                                                                  v_0)),
                                          published_0.commitment),
                            'Rule parameters do not match the published rule');
    const slotStart_0 = trip_0.slotStart;
    __compactRuntime.assert(await this._blockTimeGte_0(context,
                                                       partialProofData,
                                                       slotStart_0),
                            "This trip's slot has not started yet");
    __compactRuntime.assert(await this._blockTimeLt_0(context,
                                                      partialProofData,
                                                      ((t1) => {
                                                        if (t1 > 18446744073709551615n) {
                                                          throw new __compactRuntime.CompactError('kanta.compact line 187 char 22: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 18446744073709551615');
                                                        }
                                                        return t1;
                                                      })(slotStart_0
                                                         +
                                                         _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                   partialProofData,
                                                                                                                   [
                                                                                                                    { dup: { n: 0 } },
                                                                                                                    { idx: { cached: false,
                                                                                                                             pushPath: false,
                                                                                                                             path: [
                                                                                                                                    { tag: 'value',
                                                                                                                                      value: { value: _descriptor_17.toValue(2n),
                                                                                                                                               alignment: _descriptor_17.alignment() } }] } },
                                                                                                                    { popeq: { cached: false,
                                                                                                                               result: undefined } }]).value)
                                                         +
                                                         _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                   partialProofData,
                                                                                                                   [
                                                                                                                    { dup: { n: 0 } },
                                                                                                                    { idx: { cached: false,
                                                                                                                             pushPath: false,
                                                                                                                             path: [
                                                                                                                                    { tag: 'value',
                                                                                                                                      value: { value: _descriptor_17.toValue(3n),
                                                                                                                                               alignment: _descriptor_17.alignment() } }] } },
                                                                                                                    { popeq: { cached: false,
                                                                                                                               result: undefined } }]).value))),
                            "This trip's slot is too old to be paid now");
    const key_0 = this._slotKey_0(trip_0.zone, trip_0.slotStart);
    __compactRuntime.assert(_descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_17.toValue(6n),
                                                                                                                  alignment: _descriptor_17.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'No surge was announced for this zone and slot');
    const surgeX100_0 = _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                  partialProofData,
                                                                                  [
                                                                                   { dup: { n: 0 } },
                                                                                   { idx: { cached: false,
                                                                                            pushPath: false,
                                                                                            path: [
                                                                                                   { tag: 'value',
                                                                                                     value: { value: _descriptor_17.toValue(6n),
                                                                                                              alignment: _descriptor_17.alignment() } }] } },
                                                                                   { idx: { cached: false,
                                                                                            pushPath: false,
                                                                                            path: [
                                                                                                   { tag: 'value',
                                                                                                     value: { value: _descriptor_0.toValue(key_0),
                                                                                                              alignment: _descriptor_0.alignment() } }] } },
                                                                                   { popeq: { cached: false,
                                                                                              result: undefined } }]).value);
    __compactRuntime.assert(this._payoutFollowsRule_0(rule_0,
                                                      trip_0,
                                                      surgeX100_0),
                            'Payout does not follow the rule in force');
    const receipt_0 = this._payoutCommitment_0({ trip: trip_0, ruleVersion: v_0 },
                                               receiptSalt_0);
    __compactRuntime.assert(!_descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_17.toValue(7n),
                                                                                                                   alignment: _descriptor_17.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(receipt_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'This receipt is already recorded');
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_17.toValue(7n),
                                                                  alignment: _descriptor_17.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(receipt_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_0 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_17.toValue(8n),
                                                                  alignment: _descriptor_17.alignment() } }] } },
                                       { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                                              { value: _descriptor_1.toValue(tmp_0),
                                                                alignment: _descriptor_1.alignment() }
                                                                .value
                                                            )) } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _equal_0(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_1(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
}
export function ledger(stateOrChargedState) {
  const state = stateOrChargedState instanceof __compactRuntime.StateValue ? stateOrChargedState : stateOrChargedState.state;
  const chargedState = stateOrChargedState instanceof __compactRuntime.StateValue ? new __compactRuntime.ChargedState(stateOrChargedState) : stateOrChargedState;
  const context = {
    callContext: { currentQueryContext: new __compactRuntime.QueryContext(chargedState, __compactRuntime.dummyContractAddress()), currentGasCost: __compactRuntime.emptyRunningCost() },
    costModel: __compactRuntime.CostModel.initialCostModel()
  };
  const partialProofData = {
    input: { value: [], alignment: [] },
    output: undefined,
    publicTranscript: [],
    privateTranscriptOutputs: []
  };
  return {
    get operator() {
      return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_17.toValue(0n),
                                                                                                   alignment: _descriptor_17.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get noticeSeconds() {
      return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_17.toValue(1n),
                                                                                                   alignment: _descriptor_17.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get slotSeconds() {
      return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_17.toValue(2n),
                                                                                                   alignment: _descriptor_17.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get settleSeconds() {
      return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_17.toValue(3n),
                                                                                                   alignment: _descriptor_17.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get ruleCount() {
      return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_17.toValue(4n),
                                                                                                   alignment: _descriptor_17.alignment() } }] } },
                                                                        { popeq: { cached: true,
                                                                                   result: undefined } }]).value);
    },
    rules: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_17.toValue(5n),
                                                                                                     alignment: _descriptor_17.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(0n),
                                                                                                                                 alignment: _descriptor_3.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_17.toValue(5n),
                                                                                                     alignment: _descriptor_17.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 4294967295n)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'kanta.compact line 62 char 1',
                                     'Uint<0..4294967296>',
                                     key_0)
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_17.toValue(5n),
                                                                                                     alignment: _descriptor_17.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(key_0),
                                                                                                                                 alignment: _descriptor_4.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 4294967295n)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'kanta.compact line 62 char 1',
                                     'Uint<0..4294967296>',
                                     key_0)
        }
        return _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_17.toValue(5n),
                                                                                                     alignment: _descriptor_17.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_4.toValue(key_0),
                                                                                                     alignment: _descriptor_4.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[5];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_4.fromValue(key.value),      _descriptor_5.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    surge: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_17.toValue(6n),
                                                                                                     alignment: _descriptor_17.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(0n),
                                                                                                                                 alignment: _descriptor_3.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_17.toValue(6n),
                                                                                                     alignment: _descriptor_17.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'kanta.compact line 63 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_17.toValue(6n),
                                                                                                     alignment: _descriptor_17.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'kanta.compact line 63 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_17.toValue(6n),
                                                                                                     alignment: _descriptor_17.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[6];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_1.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    payouts: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_17.toValue(7n),
                                                                                                     alignment: _descriptor_17.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(0n),
                                                                                                                                 alignment: _descriptor_3.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_17.toValue(7n),
                                                                                                     alignment: _descriptor_17.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const elem_0 = args_0[0];
        if (!(elem_0.buffer instanceof ArrayBuffer && elem_0.BYTES_PER_ELEMENT === 1 && elem_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'kanta.compact line 64 char 1',
                                     'Bytes<32>',
                                     elem_0)
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_17.toValue(7n),
                                                                                                     alignment: _descriptor_17.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(elem_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[7];
        return self_0.asMap().keys().map((elem) => _descriptor_0.fromValue(elem.value))[Symbol.iterator]();
      }
    },
    get payoutCount() {
      return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_17.toValue(8n),
                                                                                                   alignment: _descriptor_17.alignment() } }] } },
                                                                        { popeq: { cached: true,
                                                                                   result: undefined } }]).value);
    }
  };
}
const _emptyContext = {
  callContext: { currentQueryContext: new __compactRuntime.QueryContext(new __compactRuntime.ContractState().data, __compactRuntime.dummyContractAddress()), currentGasCost: __compactRuntime.emptyRunningCost() }
};
const _dummyContract = new Contract({
  operatorSecret: (...args) => undefined,
  ruleParams: (...args) => undefined,
  ruleSalt: (...args) => undefined,
  newRule: (...args) => undefined,
  newRuleSalt: (...args) => undefined
});
export const pureCircuits = {
  ruleCommitment: (...args_0) => {
    if (args_0.length !== 2) {
      throw new __compactRuntime.CompactError(`ruleCommitment: expected 2 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const rule_0 = args_0[0];
    const salt_0 = args_0[1];
    if (!(typeof(rule_0) === 'object' && typeof(rule_0.baseFare) === 'bigint' && rule_0.baseFare >= 0n && rule_0.baseFare <= 4294967295n && typeof(rule_0.perKm) === 'bigint' && rule_0.perKm >= 0n && rule_0.perKm <= 4294967295n && typeof(rule_0.perMinute) === 'bigint' && rule_0.perMinute >= 0n && rule_0.perMinute <= 4294967295n && typeof(rule_0.minPayout) === 'bigint' && rule_0.minPayout >= 0n && rule_0.minPayout <= 4294967295n)) {
      __compactRuntime.typeError('ruleCommitment',
                                 'argument 1',
                                 'kanta.compact line 89 char 1',
                                 'struct PayRule<baseFare: Uint<0..4294967296>, perKm: Uint<0..4294967296>, perMinute: Uint<0..4294967296>, minPayout: Uint<0..4294967296>>',
                                 rule_0)
    }
    if (!(salt_0.buffer instanceof ArrayBuffer && salt_0.BYTES_PER_ELEMENT === 1 && salt_0.length === 32)) {
      __compactRuntime.typeError('ruleCommitment',
                                 'argument 2',
                                 'kanta.compact line 89 char 1',
                                 'Bytes<32>',
                                 salt_0)
    }
    return _dummyContract._ruleCommitment_0(rule_0, salt_0);
  },
  slotKey: (...args_0) => {
    if (args_0.length !== 2) {
      throw new __compactRuntime.CompactError(`slotKey: expected 2 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const zone_0 = args_0[0];
    const slotStart_0 = args_0[1];
    if (!(typeof(zone_0) === 'bigint' && zone_0 >= 0n && zone_0 <= 65535n)) {
      __compactRuntime.typeError('slotKey',
                                 'argument 1',
                                 'kanta.compact line 93 char 1',
                                 'Uint<0..65536>',
                                 zone_0)
    }
    if (!(typeof(slotStart_0) === 'bigint' && slotStart_0 >= 0n && slotStart_0 <= 18446744073709551615n)) {
      __compactRuntime.typeError('slotKey',
                                 'argument 2',
                                 'kanta.compact line 93 char 1',
                                 'Uint<0..18446744073709551616>',
                                 slotStart_0)
    }
    return _dummyContract._slotKey_0(zone_0, slotStart_0);
  },
  payoutCommitment: (...args_0) => {
    if (args_0.length !== 2) {
      throw new __compactRuntime.CompactError(`payoutCommitment: expected 2 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const receipt_0 = args_0[0];
    const salt_0 = args_0[1];
    if (!(typeof(receipt_0) === 'object' && typeof(receipt_0.trip) === 'object' && receipt_0.trip.riderKey.buffer instanceof ArrayBuffer && receipt_0.trip.riderKey.BYTES_PER_ELEMENT === 1 && receipt_0.trip.riderKey.length === 32 && receipt_0.trip.tripId.buffer instanceof ArrayBuffer && receipt_0.trip.tripId.BYTES_PER_ELEMENT === 1 && receipt_0.trip.tripId.length === 32 && typeof(receipt_0.trip.zone) === 'bigint' && receipt_0.trip.zone >= 0n && receipt_0.trip.zone <= 65535n && typeof(receipt_0.trip.slotStart) === 'bigint' && receipt_0.trip.slotStart >= 0n && receipt_0.trip.slotStart <= 18446744073709551615n && typeof(receipt_0.trip.distanceMetres) === 'bigint' && receipt_0.trip.distanceMetres >= 0n && receipt_0.trip.distanceMetres <= 4294967295n && typeof(receipt_0.trip.minutes) === 'bigint' && receipt_0.trip.minutes >= 0n && receipt_0.trip.minutes <= 65535n && typeof(receipt_0.trip.payout) === 'bigint' && receipt_0.trip.payout >= 0n && receipt_0.trip.payout <= 4294967295n && typeof(receipt_0.ruleVersion) === 'bigint' && receipt_0.ruleVersion >= 0n && receipt_0.ruleVersion <= 4294967295n)) {
      __compactRuntime.typeError('payoutCommitment',
                                 'argument 1',
                                 'kanta.compact line 98 char 1',
                                 'struct Receipt<trip: struct Trip<riderKey: Bytes<32>, tripId: Bytes<32>, zone: Uint<0..65536>, slotStart: Uint<0..18446744073709551616>, distanceMetres: Uint<0..4294967296>, minutes: Uint<0..65536>, payout: Uint<0..4294967296>>, ruleVersion: Uint<0..4294967296>>',
                                 receipt_0)
    }
    if (!(salt_0.buffer instanceof ArrayBuffer && salt_0.BYTES_PER_ELEMENT === 1 && salt_0.length === 32)) {
      __compactRuntime.typeError('payoutCommitment',
                                 'argument 2',
                                 'kanta.compact line 98 char 1',
                                 'Bytes<32>',
                                 salt_0)
    }
    return _dummyContract._payoutCommitment_0(receipt_0, salt_0);
  },
  grossScaled: (...args_0) => {
    if (args_0.length !== 3) {
      throw new __compactRuntime.CompactError(`grossScaled: expected 3 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const rule_0 = args_0[0];
    const trip_0 = args_0[1];
    const surgeX100_0 = args_0[2];
    if (!(typeof(rule_0) === 'object' && typeof(rule_0.baseFare) === 'bigint' && rule_0.baseFare >= 0n && rule_0.baseFare <= 4294967295n && typeof(rule_0.perKm) === 'bigint' && rule_0.perKm >= 0n && rule_0.perKm <= 4294967295n && typeof(rule_0.perMinute) === 'bigint' && rule_0.perMinute >= 0n && rule_0.perMinute <= 4294967295n && typeof(rule_0.minPayout) === 'bigint' && rule_0.minPayout >= 0n && rule_0.minPayout <= 4294967295n)) {
      __compactRuntime.typeError('grossScaled',
                                 'argument 1',
                                 'kanta.compact line 104 char 1',
                                 'struct PayRule<baseFare: Uint<0..4294967296>, perKm: Uint<0..4294967296>, perMinute: Uint<0..4294967296>, minPayout: Uint<0..4294967296>>',
                                 rule_0)
    }
    if (!(typeof(trip_0) === 'object' && trip_0.riderKey.buffer instanceof ArrayBuffer && trip_0.riderKey.BYTES_PER_ELEMENT === 1 && trip_0.riderKey.length === 32 && trip_0.tripId.buffer instanceof ArrayBuffer && trip_0.tripId.BYTES_PER_ELEMENT === 1 && trip_0.tripId.length === 32 && typeof(trip_0.zone) === 'bigint' && trip_0.zone >= 0n && trip_0.zone <= 65535n && typeof(trip_0.slotStart) === 'bigint' && trip_0.slotStart >= 0n && trip_0.slotStart <= 18446744073709551615n && typeof(trip_0.distanceMetres) === 'bigint' && trip_0.distanceMetres >= 0n && trip_0.distanceMetres <= 4294967295n && typeof(trip_0.minutes) === 'bigint' && trip_0.minutes >= 0n && trip_0.minutes <= 65535n && typeof(trip_0.payout) === 'bigint' && trip_0.payout >= 0n && trip_0.payout <= 4294967295n)) {
      __compactRuntime.typeError('grossScaled',
                                 'argument 2',
                                 'kanta.compact line 104 char 1',
                                 'struct Trip<riderKey: Bytes<32>, tripId: Bytes<32>, zone: Uint<0..65536>, slotStart: Uint<0..18446744073709551616>, distanceMetres: Uint<0..4294967296>, minutes: Uint<0..65536>, payout: Uint<0..4294967296>>',
                                 trip_0)
    }
    if (!(typeof(surgeX100_0) === 'bigint' && surgeX100_0 >= 0n && surgeX100_0 <= 65535n)) {
      __compactRuntime.typeError('grossScaled',
                                 'argument 3',
                                 'kanta.compact line 104 char 1',
                                 'Uint<0..65536>',
                                 surgeX100_0)
    }
    return _dummyContract._grossScaled_0(rule_0, trip_0, surgeX100_0);
  },
  payoutFollowsRule: (...args_0) => {
    if (args_0.length !== 3) {
      throw new __compactRuntime.CompactError(`payoutFollowsRule: expected 3 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const rule_0 = args_0[0];
    const trip_0 = args_0[1];
    const surgeX100_0 = args_0[2];
    if (!(typeof(rule_0) === 'object' && typeof(rule_0.baseFare) === 'bigint' && rule_0.baseFare >= 0n && rule_0.baseFare <= 4294967295n && typeof(rule_0.perKm) === 'bigint' && rule_0.perKm >= 0n && rule_0.perKm <= 4294967295n && typeof(rule_0.perMinute) === 'bigint' && rule_0.perMinute >= 0n && rule_0.perMinute <= 4294967295n && typeof(rule_0.minPayout) === 'bigint' && rule_0.minPayout >= 0n && rule_0.minPayout <= 4294967295n)) {
      __compactRuntime.typeError('payoutFollowsRule',
                                 'argument 1',
                                 'kanta.compact line 111 char 1',
                                 'struct PayRule<baseFare: Uint<0..4294967296>, perKm: Uint<0..4294967296>, perMinute: Uint<0..4294967296>, minPayout: Uint<0..4294967296>>',
                                 rule_0)
    }
    if (!(typeof(trip_0) === 'object' && trip_0.riderKey.buffer instanceof ArrayBuffer && trip_0.riderKey.BYTES_PER_ELEMENT === 1 && trip_0.riderKey.length === 32 && trip_0.tripId.buffer instanceof ArrayBuffer && trip_0.tripId.BYTES_PER_ELEMENT === 1 && trip_0.tripId.length === 32 && typeof(trip_0.zone) === 'bigint' && trip_0.zone >= 0n && trip_0.zone <= 65535n && typeof(trip_0.slotStart) === 'bigint' && trip_0.slotStart >= 0n && trip_0.slotStart <= 18446744073709551615n && typeof(trip_0.distanceMetres) === 'bigint' && trip_0.distanceMetres >= 0n && trip_0.distanceMetres <= 4294967295n && typeof(trip_0.minutes) === 'bigint' && trip_0.minutes >= 0n && trip_0.minutes <= 65535n && typeof(trip_0.payout) === 'bigint' && trip_0.payout >= 0n && trip_0.payout <= 4294967295n)) {
      __compactRuntime.typeError('payoutFollowsRule',
                                 'argument 2',
                                 'kanta.compact line 111 char 1',
                                 'struct Trip<riderKey: Bytes<32>, tripId: Bytes<32>, zone: Uint<0..65536>, slotStart: Uint<0..18446744073709551616>, distanceMetres: Uint<0..4294967296>, minutes: Uint<0..65536>, payout: Uint<0..4294967296>>',
                                 trip_0)
    }
    if (!(typeof(surgeX100_0) === 'bigint' && surgeX100_0 >= 0n && surgeX100_0 <= 65535n)) {
      __compactRuntime.typeError('payoutFollowsRule',
                                 'argument 3',
                                 'kanta.compact line 111 char 1',
                                 'Uint<0..65536>',
                                 surgeX100_0)
    }
    return _dummyContract._payoutFollowsRule_0(rule_0, trip_0, surgeX100_0);
  }
};
export const expectedVk = {
  'publishRule': '885b41aa4b0c1262e04cf9a9ffac81892a3edd2dc76fd4e33546ae0b5f66a3ce',
  'publishSurge': 'd5d6b9fac2904f2fbf014b8d6994bfc97b0ebb22f88eeee0ebc8ebb13752a37a',
  'recordPayout': 'b3929d4d294481432c3b376b3d524870747ee30ecf4553206267a264bf33c9f8',
};

export const circuitSignatures = {
  'ruleCommitment': {pure: true, provable: false, argumentTypes: [{tag: 'Struct', name: 'PayRule', elements: [{name: 'baseFare', type: {tag: 'Uint', maxval: '4294967295'}}, {name: 'perKm', type: {tag: 'Uint', maxval: '4294967295'}}, {name: 'perMinute', type: {tag: 'Uint', maxval: '4294967295'}}, {name: 'minPayout', type: {tag: 'Uint', maxval: '4294967295'}}]}, {tag: 'Bytes', length: 32}], resultType: {tag: 'Bytes', length: 32}},
  'slotKey': {pure: true, provable: false, argumentTypes: [{tag: 'Uint', maxval: '65535'}, {tag: 'Uint', maxval: '18446744073709551615'}], resultType: {tag: 'Bytes', length: 32}},
  'payoutCommitment': {pure: true, provable: false, argumentTypes: [{tag: 'Struct', name: 'Receipt', elements: [{name: 'trip', type: {tag: 'Struct', name: 'Trip', elements: [{name: 'riderKey', type: {tag: 'Bytes', length: 32}}, {name: 'tripId', type: {tag: 'Bytes', length: 32}}, {name: 'zone', type: {tag: 'Uint', maxval: '65535'}}, {name: 'slotStart', type: {tag: 'Uint', maxval: '18446744073709551615'}}, {name: 'distanceMetres', type: {tag: 'Uint', maxval: '4294967295'}}, {name: 'minutes', type: {tag: 'Uint', maxval: '65535'}}, {name: 'payout', type: {tag: 'Uint', maxval: '4294967295'}}]}}, {name: 'ruleVersion', type: {tag: 'Uint', maxval: '4294967295'}}]}, {tag: 'Bytes', length: 32}], resultType: {tag: 'Bytes', length: 32}},
  'grossScaled': {pure: true, provable: false, argumentTypes: [{tag: 'Struct', name: 'PayRule', elements: [{name: 'baseFare', type: {tag: 'Uint', maxval: '4294967295'}}, {name: 'perKm', type: {tag: 'Uint', maxval: '4294967295'}}, {name: 'perMinute', type: {tag: 'Uint', maxval: '4294967295'}}, {name: 'minPayout', type: {tag: 'Uint', maxval: '4294967295'}}]}, {tag: 'Struct', name: 'Trip', elements: [{name: 'riderKey', type: {tag: 'Bytes', length: 32}}, {name: 'tripId', type: {tag: 'Bytes', length: 32}}, {name: 'zone', type: {tag: 'Uint', maxval: '65535'}}, {name: 'slotStart', type: {tag: 'Uint', maxval: '18446744073709551615'}}, {name: 'distanceMetres', type: {tag: 'Uint', maxval: '4294967295'}}, {name: 'minutes', type: {tag: 'Uint', maxval: '65535'}}, {name: 'payout', type: {tag: 'Uint', maxval: '4294967295'}}]}, {tag: 'Uint', maxval: '65535'}], resultType: {tag: 'Uint', maxval: '340282366920938463463374607431768211455'}},
  'payoutFollowsRule': {pure: true, provable: false, argumentTypes: [{tag: 'Struct', name: 'PayRule', elements: [{name: 'baseFare', type: {tag: 'Uint', maxval: '4294967295'}}, {name: 'perKm', type: {tag: 'Uint', maxval: '4294967295'}}, {name: 'perMinute', type: {tag: 'Uint', maxval: '4294967295'}}, {name: 'minPayout', type: {tag: 'Uint', maxval: '4294967295'}}]}, {tag: 'Struct', name: 'Trip', elements: [{name: 'riderKey', type: {tag: 'Bytes', length: 32}}, {name: 'tripId', type: {tag: 'Bytes', length: 32}}, {name: 'zone', type: {tag: 'Uint', maxval: '65535'}}, {name: 'slotStart', type: {tag: 'Uint', maxval: '18446744073709551615'}}, {name: 'distanceMetres', type: {tag: 'Uint', maxval: '4294967295'}}, {name: 'minutes', type: {tag: 'Uint', maxval: '65535'}}, {name: 'payout', type: {tag: 'Uint', maxval: '4294967295'}}]}, {tag: 'Uint', maxval: '65535'}], resultType: {tag: 'Boolean'}},
  'publishRule': {pure: false, provable: true, argumentTypes: [{tag: 'Uint', maxval: '18446744073709551615'}], resultType: {tag: 'Tuple', types: []}},
  'publishSurge': {pure: false, provable: true, argumentTypes: [{tag: 'Uint', maxval: '65535'}, {tag: 'Uint', maxval: '18446744073709551615'}, {tag: 'Uint', maxval: '65535'}], resultType: {tag: 'Tuple', types: []}},
  'recordPayout': {pure: false, provable: true, argumentTypes: [{tag: 'Struct', name: 'Trip', elements: [{name: 'riderKey', type: {tag: 'Bytes', length: 32}}, {name: 'tripId', type: {tag: 'Bytes', length: 32}}, {name: 'zone', type: {tag: 'Uint', maxval: '65535'}}, {name: 'slotStart', type: {tag: 'Uint', maxval: '18446744073709551615'}}, {name: 'distanceMetres', type: {tag: 'Uint', maxval: '4294967295'}}, {name: 'minutes', type: {tag: 'Uint', maxval: '65535'}}, {name: 'payout', type: {tag: 'Uint', maxval: '4294967295'}}]}, {tag: 'Uint', maxval: '4294967295'}, {tag: 'Bytes', length: 32}], resultType: {tag: 'Tuple', types: []}},
};

export const declaredInterfaces = {};

//# sourceMappingURL=index.js.map
