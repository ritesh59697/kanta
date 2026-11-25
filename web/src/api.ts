// SPDX-License-Identifier: Apache-2.0
// The platform console's API (platform/src/server.ts). Riders and the public board never use this.
import { env } from './chain';
import type { ReceiptData } from './receipt';

export type PayRule = { baseFare: string; perKm: string; perMinute: string; minPayout: string };
export type RuleRow = { version: number; activeFrom: number; commitment: string; inForce: boolean; params?: PayRule };
export type SurgeCell = { zone: number; slotStart: number; surgeX100: number | null };
export type Activity = { at: string; kind: 'deploy' | 'rule' | 'surge' | 'payout' | 'refused'; summary: string; txId?: string; blockHeight?: number };

export type PlatformState = {
  network: string;
  contractAddress: string;
  now: number;
  noticeSeconds: number;
  slotSeconds: number;
  currentSlot: number;
  zones: { id: number; name: string }[];
  riders: { name: string; riderKey: string }[];
  rules: RuleRow[];
  surge: SurgeCell[];
  payoutCount: number;
  activity: Activity[];
};

export type PayoutResult = {
  receipt: ReceiptData;
  receiptCode: string;
  expected: string;
  paid: string;
  txId: string;
  blockHeight: number;
};

export class ApiError extends Error {
  constructor(
    message: string,
    readonly refused: boolean,
  ) {
    super(message);
  }
}

const call = async <T>(path: string, body?: unknown): Promise<T> => {
  if (!env.api) throw new ApiError('No platform API configured (VITE_KANTA_API)', false);
  const res = await fetch(`${env.api}${path}`, {
    method: body === undefined ? 'GET' : 'POST',
    headers: body === undefined ? undefined : { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const json = (await res.json()) as T & { error?: string; refused?: boolean };
  if (!res.ok) throw new ApiError(json.error ?? `HTTP ${res.status}`, json.refused === true);
  return json;
};

export const api = {
  state: () => call<PlatformState>('/api/state'),
  publishRule: (rule: Record<string, number>) => call<{ version: number; activeFrom: number; txId: string }>('/api/rules', rule),
  publishSurge: (zone: number, slotStart: number, surgeX100: number) =>
    call<{ txId: string }>('/api/surge', { zone, slotStart, surgeX100 }),
  pay: (p: { rider: string; zone: number; distanceMetres: number; minutes: number; adjustPercent: number }) =>
    call<PayoutResult>('/api/payouts', p),
};
