// SPDX-License-Identifier: Apache-2.0
// Checks the live chain for leaks: fetches the contract's public state and the payout
// transaction's raw bytes from the indexer, then searches them for the rider's key,
// the trip id and the receipt salt. A positive control confirms the receipt commitment IS there.
//
// Usage: npx tsx --env-file=.env src/check-privacy.ts <receipt-file> <payout-tx-id>
// (tx id = the identifier midnight-js returns, as shown in the console's activity log)
import fs from 'node:fs';

import { Kanta } from '@kanta/contract';
import { networks } from '@midnight-ntwrk/midnight-js-utils';

const [receiptFile, txId] = process.argv.slice(2);
if (!receiptFile || !txId) throw new Error('Usage: check-privacy <receipt-file> <payout-tx-id>');
if (process.env.KANTA_NETWORK !== 'preview') throw new Error('This check reads the keyless Preview indexer; set KANTA_NETWORK=preview');
const indexer = networks.preview().indexer.queryURL;

type Receipt = { contractAddress: string; ruleVersion: string; salt: string; trip: Record<string, string> };
const code = fs.readFileSync(receiptFile, 'utf8').trim();
const receipt = JSON.parse(Buffer.from(code, 'base64url').toString('utf8')) as Receipt;

const gql = async <T>(query: string): Promise<T> => {
  const res = await fetch(indexer, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ query }) });
  const body = (await res.json()) as { data: T; errors?: { message: string }[] };
  if (body.errors?.length) throw new Error(body.errors[0].message);
  return body.data;
};

const { contractAction } = await gql<{ contractAction: { state: string } }>(
  `{ contractAction(address: "${receipt.contractAddress}") { state } }`,
);
const { transactions } = await gql<{ transactions: { hash: string; raw: string }[] }>(
  `{ transactions(offset: { identifier: "${txId}" }) { hash ... on RegularTransaction { raw } } }`,
);
const raw = transactions[0]?.raw;
if (!raw) throw new Error(`Transaction ${txId} not found`);
console.log(`payout transaction hash: ${transactions[0].hash}`);

const hex = (b: Uint8Array) => Buffer.from(b).toString('hex');
const commitment = hex(
  Kanta.pureCircuits.payoutCommitment(
    {
      trip: {
        riderKey: Buffer.from(receipt.trip.riderKey, 'hex'),
        tripId: Buffer.from(receipt.trip.tripId, 'hex'),
        zone: BigInt(receipt.trip.zone),
        slotStart: BigInt(receipt.trip.slotStart),
        distanceMetres: BigInt(receipt.trip.distanceMetres),
        minutes: BigInt(receipt.trip.minutes),
        payout: BigInt(receipt.trip.payout),
      },
      ruleVersion: BigInt(receipt.ruleVersion),
    },
    Buffer.from(receipt.salt, 'hex'),
  ),
);

const sources = { 'contract state': contractAction.state.toLowerCase(), 'payout transaction': raw.toLowerCase() };
const secrets = { 'rider key': receipt.trip.riderKey, 'trip id': receipt.trip.tripId, 'receipt salt': receipt.salt };

let leaks = 0;
for (const [where, bytes] of Object.entries(sources)) {
  console.log(`${where}: ${bytes.length / 2} bytes`);
  for (const [what, value] of Object.entries(secrets)) {
    const found = bytes.includes(value.toLowerCase());
    if (found) leaks++;
    console.log(`  ${found ? 'LEAK ' : 'ok   '} ${what} ${found ? 'FOUND' : 'not present'}`);
  }
}
const control = sources['contract state'].includes(commitment);
console.log(`control: receipt commitment ${control ? 'present in contract state (expected)' : 'MISSING'}`);
if (leaks > 0 || !control) process.exit(1);
console.log('PASS: no rider key, trip id or salt on chain; the receipt is findable by its commitment.');
