// SPDX-License-Identifier: Apache-2.0
// All settings come from the environment (see .env.example). Nothing network-specific is hard-coded.
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const required = (name: string): string => {
  const value = process.env[name];
  if (value === undefined || value === '') throw new Error(`Missing environment variable ${name} (see .env.example)`);
  return value;
};

const optional = (name: string): string | undefined => {
  const value = process.env[name];
  return value === undefined || value === '' ? undefined : value;
};

export const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export type Config = {
  network: string;
  blockfrostProjectId: string | undefined;
  proofServerUrl: string;
  dataDir: string;
  seedFile: string;
  privateStorePassword: string;
  noticeSeconds: bigint;
  slotSeconds: bigint;
  settleSeconds: bigint;
  ruleStartBufferSeconds: bigint;
  contractAddress: string | undefined;
  port: number;
  corsOrigin: string;
  syncTimeoutMs: number;
};

export const loadConfig = (): Config => {
  const dataDir = path.resolve(packageRoot, required('KANTA_DATA_DIR'));
  return {
    network: required('KANTA_NETWORK'),
    blockfrostProjectId: optional('KANTA_BLOCKFROST_PROJECT_ID'),
    proofServerUrl: required('KANTA_PROOF_SERVER_URL'),
    dataDir,
    seedFile: path.resolve(dataDir, required('KANTA_SEED_FILE')),
    privateStorePassword: required('KANTA_PRIVATE_STORE_PASSWORD'),
    noticeSeconds: BigInt(required('KANTA_NOTICE_SECONDS')),
    slotSeconds: BigInt(required('KANTA_SLOT_SECONDS')),
    settleSeconds: BigInt(required('KANTA_SETTLE_SECONDS')),
    ruleStartBufferSeconds: BigInt(required('KANTA_RULE_START_BUFFER_SECONDS')),
    contractAddress: optional('KANTA_CONTRACT_ADDRESS'),
    port: Number(required('KANTA_PORT')),
    corsOrigin: required('KANTA_CORS_ORIGIN'),
    syncTimeoutMs: Number(required('KANTA_SYNC_TIMEOUT_MS')),
  };
};
