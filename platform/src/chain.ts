// SPDX-License-Identifier: Apache-2.0
// The platform's connection to Midnight: operator wallet, providers, and the Kanta contract.
import { randomBytes } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { expectedPayout, Kanta, type KantaPrivateState, createPrivateState, withPendingRule, witnesses } from '@kanta/contract';
import { deployContract, findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/v9/compact-js';
import { ContractState } from '@midnight-ntwrk/midnight-js-protocol/v9/compact-runtime';
import { createMidnightProviders, networks } from '@midnight-ntwrk/midnight-js-utils';
import {
  createLogger,
  type EnvironmentConfiguration,
  MidnightWalletProvider,
  syncWallet,
  waitForFunds,
} from '@midnight-ntwrk/testkit-js';
import { WebSocket } from 'ws';

import { type Config, packageRoot } from './config.js';

// apollo (indexer subscriptions) needs a global WebSocket in Node
(globalThis as unknown as { WebSocket: unknown }).WebSocket = WebSocket;

export const PRIVATE_STATE_ID = 'kantaOperator';
const zkConfigPath = path.resolve(packageRoot, '..', 'contract', 'src', 'managed', 'kanta');

type KantaContract = Kanta.Contract<KantaPrivateState>;

export const CompiledKanta = CompiledContract.make<KantaContract>('Kanta', Kanta.Contract<KantaPrivateState>).pipe(
  CompiledContract.withWitnesses(witnesses),
  CompiledContract.withCompiledFileAssets(zkConfigPath),
);

const hex = (b: Uint8Array): string => Buffer.from(b).toString('hex');
export const fromHex = (s: string): Uint8Array => new Uint8Array(Buffer.from(s, 'hex'));
const random32 = (): Uint8Array => new Uint8Array(randomBytes(32));

export type TxInfo = { txId: string; blockHeight: number };

export type RuleView = { version: number; activeFrom: number; commitment: string };

/** Everything a rider needs to find and check their payout, without a wallet. */
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

export const encodeReceipt = (r: ReceiptData): string => Buffer.from(JSON.stringify(r)).toString('base64url');

const networkConfig = (config: Config): EnvironmentConfiguration => {
  const net = pickNetwork(config);
  return {
    walletNetworkId: net.networkId,
    networkId: net.networkId,
    indexer: net.indexer.queryURL,
    indexerWS: net.indexer.subscriptionURL,
    node: net.nodeURL,
    nodeWS: net.nodeWsURL,
    proofServer: config.proofServerUrl,
  } as EnvironmentConfiguration;
};

const pickNetwork = (config: Config) => {
  switch (config.network) {
    case 'preview':
      return networks.preview();
    case 'preprod':
    case 'mainnet': {
      if (config.blockfrostProjectId === undefined) {
        throw new Error(`${config.network} is served by Blockfrost: set KANTA_BLOCKFROST_PROJECT_ID`);
      }
      return networks[config.network](config.blockfrostProjectId);
    }
    default:
      throw new Error(`Unknown network "${config.network}"`);
  }
};

export class Chain {
  private queue: Promise<unknown> = Promise.resolve();

  private constructor(
    readonly config: Config,
    readonly env: EnvironmentConfiguration,
    readonly wallet: MidnightWalletProvider,
    readonly providers: ReturnType<typeof buildProviders>,
  ) {}

  static async connect(config: Config, log: (msg: string) => void = console.log): Promise<Chain> {
    fs.mkdirSync(config.dataDir, { recursive: true });
    const env = networkConfig(config);
    const health = await fetch(new URL('/health', config.proofServerUrl)).catch(() => null);
    if (!health?.ok) throw new Error(`Proof server not reachable at ${config.proofServerUrl} (is Docker/Colima running?)`);
    const logger = createLogger(path.join(config.dataDir, 'logs', `platform-${new Date().toISOString()}.log`));
    if (!fs.existsSync(config.seedFile)) {
      fs.writeFileSync(config.seedFile, randomBytes(32).toString('hex'), { mode: 0o600 });
      log(`Created a new operator wallet seed in ${config.seedFile}`);
    }
    const wallet = await MidnightWalletProvider.build(logger, env, fs.readFileSync(config.seedFile, 'utf8').trim());
    await wallet.start(false);
    log(`Operator wallet: ${wallet.unshieldedKeystore.getBech32Address().asString()}`);
    log('Syncing wallet with the network (this can take a few minutes)...');
    await syncWallet(wallet.wallet, 5_000, config.syncTimeoutMs);
    const night = await waitForFunds(wallet.wallet, env, false, wallet.unshieldedKeystore);
    if (night === 0n) {
      throw new Error('Operator wallet has no tNIGHT. Fund it from the network faucet, then restart.');
    }
    log(`Synced. tNIGHT balance: ${night}`);
    return new Chain(config, env, wallet, buildProviders(config, env, wallet));
  }

  /** Run wallet transactions one at a time. */
  private serial<T>(fn: () => Promise<T>): Promise<T> {
    const next = this.queue.then(fn, fn);
    this.queue = next.catch(() => undefined);
    return next;
  }

  async deploy(): Promise<{ contractAddress: string } & TxInfo> {
    return this.serial(async () => {
      const deployed = await deployContract(this.providers, {
        compiledContract: CompiledKanta,
        privateStateId: PRIVATE_STATE_ID,
        initialPrivateState: createPrivateState(random32()),
        args: [this.config.noticeSeconds, this.config.slotSeconds, this.config.settleSeconds],
      });
      const { contractAddress, txId, blockHeight } = deployed.deployTxData.public;
      return { contractAddress, txId, blockHeight };
    });
  }

  private async contract(address: string) {
    return findDeployedContract(this.providers, {
      contractAddress: address,
      compiledContract: CompiledKanta,
      privateStateId: PRIVATE_STATE_ID,
    });
  }

  private privateStore(address: string) {
    return this.providers.privateStateProvider.forContract(address);
  }

  async privateState(address: string): Promise<KantaPrivateState> {
    const state = await this.privateStore(address).get(PRIVATE_STATE_ID);
    if (state === null) throw new Error('This machine has no operator private state for the contract');
    return state as KantaPrivateState;
  }

  async ledger(address: string): Promise<Kanta.Ledger> {
    const found = await this.providers.publicDataProvider.queryContractState(address);
    if (found === null) throw new Error(`No contract at ${address}`);
    return Kanta.ledger(found.contractState.deserialize({ v9: ContractState }).data);
  }

  async rules(address: string): Promise<RuleView[]> {
    const ledger = await this.ledger(address);
    return [...ledger.rules].map(([version, r]) => ({
      version: Number(version),
      activeFrom: Number(r.activeFrom),
      commitment: hex(r.commitment),
    }));
  }

  /** The rule version in force at `nowSeconds`, if any. */
  static ruleInForce(rules: RuleView[], nowSeconds: number): RuleView | undefined {
    return [...rules].sort((a, b) => b.version - a.version).find((r) => r.activeFrom <= nowSeconds);
  }

  async publishRule(address: string, rule: Kanta.PayRule, activeFrom: bigint): Promise<TxInfo> {
    return this.serial(async () => {
      const store = this.privateStore(address);
      const current = await this.privateState(address);
      await store.set(PRIVATE_STATE_ID, withPendingRule(current, { rule, salt: random32() }));
      const contract = await this.contract(address);
      const tx = await contract.callTx.publishRule(activeFrom);
      return { txId: tx.public.txId, blockHeight: tx.public.blockHeight };
    });
  }

  async publishSurge(address: string, zone: bigint, slotStart: bigint, surgeX100: bigint): Promise<TxInfo> {
    return this.serial(async () => {
      const contract = await this.contract(address);
      const tx = await contract.callTx.publishSurge(zone, slotStart, surgeX100);
      return { txId: tx.public.txId, blockHeight: tx.public.blockHeight };
    });
  }

  async surgeFor(address: string, zone: bigint, slotStart: bigint): Promise<bigint | undefined> {
    const ledger = await this.ledger(address);
    const key = Kanta.pureCircuits.slotKey(zone, slotStart);
    return ledger.surge.member(key) ? ledger.surge.lookup(key) : undefined;
  }

  /**
   * Pay one trip. `adjustPercent` exists only for the demo: it tries to pay one rider
   * differently from the rule, which the contract must refuse.
   */
  async recordPayout(
    address: string,
    facts: { riderKey: Uint8Array; zone: bigint; slotStart: bigint; distanceMetres: bigint; minutes: bigint },
    nowSeconds: number,
    adjustPercent = 0,
  ): Promise<{ receipt: ReceiptData; expected: bigint; paid: bigint } & TxInfo> {
    return this.serial(async () => {
      const inForce = Chain.ruleInForce(await this.rules(address), nowSeconds);
      if (inForce === undefined) throw new RefusedError('No pay rule is in force yet');
      const version = BigInt(inForce.version);
      const stored = (await this.privateState(address)).rules[version.toString()];
      if (stored === undefined) throw new Error(`No private copy of rule v${version} on this machine`);
      const surge = await this.surgeFor(address, facts.zone, facts.slotStart);
      if (surge === undefined) throw new RefusedError('No surge was announced for this zone and slot');

      const tripId = random32();
      const expected = expectedPayout(stored.rule, { ...facts, tripId }, surge);
      const paid = (expected * BigInt(100 + adjustPercent)) / 100n;
      const trip: Kanta.Trip = { ...facts, tripId, payout: paid };
      const salt = random32();

      const contract = await this.contract(address);
      let tx;
      try {
        tx = await contract.callTx.recordPayout(trip, version, salt);
      } catch (e) {
        const reason = assertionReason(e);
        if (reason !== undefined) throw new RefusedError(reason);
        throw e;
      }
      const receipt: ReceiptData = {
        contractAddress: address,
        network: this.config.network,
        ruleVersion: version.toString(),
        salt: hex(salt),
        trip: {
          riderKey: hex(trip.riderKey),
          tripId: hex(tripId),
          zone: trip.zone.toString(),
          slotStart: trip.slotStart.toString(),
          distanceMetres: trip.distanceMetres.toString(),
          minutes: trip.minutes.toString(),
          payout: trip.payout.toString(),
        },
      };
      return { receipt, expected, paid, txId: tx.public.txId, blockHeight: tx.public.blockHeight };
    });
  }

  async stop(): Promise<void> {
    await this.wallet.stop();
  }
}

/** A circuit assertion failed: the contract refused the action. */
export class RefusedError extends Error {}

const ASSERTION_MESSAGES = [
  'Payout does not follow the rule in force',
  'This rule version is not in force yet',
  'This rule version has been replaced',
  'Rule parameters do not match the published rule',
  'No surge was announced for this zone and slot',
  'This receipt is already recorded',
  'Only the platform operator can do this',
  'Rule must be announced at least noticeSeconds before it starts',
  'A new rule must start after the current one',
  'Surge for this zone and slot is already published',
  'Surge must be published before the slot starts',
  'activeFrom is too early',
  "This trip's slot has not started yet",
  "This trip's slot is too old to be paid now",
  'Unknown rule version',
];

const assertionReason = (e: unknown): string | undefined => {
  const text = e instanceof Error ? `${e.message} ${String((e as { cause?: unknown }).cause ?? '')}` : String(e);
  return ASSERTION_MESSAGES.find((m) => text.includes(m));
};

export const refusalReason = assertionReason;

function buildProviders(config: Config, env: EnvironmentConfiguration, wallet: MidnightWalletProvider) {
  const zkConfigProvider = new NodeZkConfigProvider<keyof Kanta.ProvableCircuits<KantaPrivateState> & string>(zkConfigPath);
  return createMidnightProviders({
    privateStateProvider: levelPrivateStateProvider<typeof PRIVATE_STATE_ID, KantaPrivateState>({
      midnightDbName: path.join(config.dataDir, 'private-state-db'),
      privateStateStoreName: 'kanta-private-state',
      signingKeyStoreName: 'kanta-signing-keys',
      privateStoragePasswordProvider: () => config.privateStorePassword,
      accountId: wallet.getCoinPublicKey(),
    }),
    publicDataProvider: indexerPublicDataProvider(env.indexer, env.indexerWS),
    zkConfigProvider,
    proofProvider: httpClientProofProvider(env.proofServer, zkConfigProvider),
    walletProvider: wallet,
    midnightProvider: wallet,
    config: { networkId: env.networkId, ttlSeconds: 3600 },
  });
}
