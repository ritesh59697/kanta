// SPDX-License-Identifier: Apache-2.0
// Small JSON files in the data dir: deployed contract, demo riders, activity log.
import { randomBytes } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { packageRoot } from './config.js';

export type Seed = {
  zones: { id: number; name: string }[];
  riders: string[];
  firstRule: { baseFare: number; perKm: number; perMinute: number; minPayout: number };
  surgePlan: Record<string, number>;
  surgeSlotsAhead: number;
};

export const loadSeed = (): Seed => JSON.parse(fs.readFileSync(path.join(packageRoot, 'seed.json'), 'utf8')) as Seed;

const readJson = <T>(file: string, fallback: T): T =>
  fs.existsSync(file) ? (JSON.parse(fs.readFileSync(file, 'utf8')) as T) : fallback;

const writeJson = (file: string, value: unknown): void => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2));
};

export type Deployment = { contractAddress: string; txId: string; blockHeight: number; deployedAt: string; network: string };

export type Activity = {
  at: string;
  kind: 'deploy' | 'rule' | 'surge' | 'payout' | 'refused';
  summary: string;
  txId?: string;
  blockHeight?: number;
};

export type Rider = { name: string; riderKey: string };

export class Store {
  constructor(private readonly dataDir: string) {}

  private file(name: string): string {
    return path.join(this.dataDir, name);
  }

  get deployment(): Deployment | undefined {
    return readJson<Deployment | undefined>(this.file('contract.json'), undefined);
  }

  set deployment(d: Deployment | undefined) {
    writeJson(this.file('contract.json'), d);
  }

  /** Demo riders get a random pseudonymous key once; the platform never puts names on chain. */
  riders(names: string[]): Rider[] {
    const existing = readJson<Rider[]>(this.file('riders.json'), []);
    const all = names.map(
      (name) => existing.find((r) => r.name === name) ?? { name, riderKey: randomBytes(32).toString('hex') },
    );
    writeJson(this.file('riders.json'), all);
    return all;
  }

  activity(): Activity[] {
    return readJson<Activity[]>(this.file('activity.json'), []);
  }

  log(entry: Omit<Activity, 'at'>): Activity {
    const full = { at: new Date().toISOString(), ...entry };
    writeJson(this.file('activity.json'), [full, ...this.activity()].slice(0, 200));
    return full;
  }
}
