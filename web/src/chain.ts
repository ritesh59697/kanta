// SPDX-License-Identifier: Apache-2.0
// Walletless reads: the rider check and the public board only talk to the public Midnight indexer.
import { Kanta } from '@kanta/contract';
import { ContractState } from '@midnight-ntwrk/compact-runtime';

export const env = {
  api: import.meta.env.VITE_KANTA_API as string | undefined,
  indexer: import.meta.env.VITE_KANTA_INDEXER as string,
  contract: (import.meta.env.VITE_KANTA_CONTRACT as string | undefined) || undefined,
  network: import.meta.env.VITE_KANTA_NETWORK as string,
};

export const toHex = (b: Uint8Array): string => Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
export const fromHex = (s: string): Uint8Array => Uint8Array.from(s.match(/.{2}/g) ?? [], (h) => parseInt(h, 16));

export type ContractRead = { ledger: Kanta.Ledger; txHash: string; blockHeight: number };

/** Latest public state of a Kanta contract, straight from the indexer. */
export const readContract = async (address: string): Promise<ContractRead> => {
  const query = `{ contractAction(address: "${address}") { state transaction { hash block { height } } } }`;
  const res = await fetch(env.indexer, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error(`Indexer error ${res.status}`);
  const body = (await res.json()) as {
    data?: { contractAction: { state: string; transaction: { hash: string; block: { height: number } } } | null };
    errors?: { message: string }[];
  };
  if (body.errors?.length) throw new Error(body.errors[0].message);
  const action = body.data?.contractAction;
  if (!action) throw new Error('No Kanta contract at this address on this network');
  const state = ContractState.deserialize(fromHex(action.state));
  return { ledger: Kanta.ledger(state.data), txHash: action.transaction.hash, blockHeight: action.transaction.block.height };
};

export const slotKey = (zone: bigint, slotStart: bigint): Uint8Array => Kanta.pureCircuits.slotKey(zone, slotStart);

export const rupees = (paise: bigint | number | string): string =>
  `₹${(Number(paise) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const when = (unixSeconds: number | bigint): string =>
  new Date(Number(unixSeconds) * 1000).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

export const short = (h: string, n = 8): string => (h.length > n * 2 ? `${h.slice(0, n)}…${h.slice(-n)}` : h);
