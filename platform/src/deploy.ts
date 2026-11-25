// SPDX-License-Identifier: Apache-2.0
// Deploy Kanta, publish the first pay rule and the next few surge slots from seed.json.
// Usage: npm run deploy -w platform
import { Chain } from './chain.js';
import { loadConfig } from './config.js';
import { loadSeed, Store } from './store.js';
import { currentSlot } from './time.js';

const config = loadConfig();
const seed = loadSeed();
const store = new Store(config.dataDir);
const chain = await Chain.connect(config);

let address = config.contractAddress ?? store.deployment?.contractAddress;
if (address === undefined) {
  console.log('Deploying Kanta...');
  const d = await chain.deploy();
  address = d.contractAddress;
  store.deployment = { ...d, deployedAt: new Date().toISOString(), network: config.network };
  store.log({ kind: 'deploy', summary: `Deployed Kanta (notice ${config.noticeSeconds}s)`, txId: d.txId, blockHeight: d.blockHeight });
  console.log(`Deployed at ${address} (tx ${d.txId}, block ${d.blockHeight})`);
} else {
  console.log(`Using existing contract ${address}`);
}

const rules = await chain.rules(address);
if (rules.length === 0) {
  const r = seed.firstRule;
  // Earliest start the contract allows, plus a margin so block time can't overtake it.
  const activeFrom = BigInt(Math.floor(Date.now() / 1000)) + config.noticeSeconds + config.ruleStartBufferSeconds;
  const tx = await chain.publishRule(
    address,
    { baseFare: BigInt(r.baseFare), perKm: BigInt(r.perKm), perMinute: BigInt(r.perMinute), minPayout: BigInt(r.minPayout) },
    activeFrom,
  );
  store.log({ kind: 'rule', summary: `Published rule v1, in force from ${new Date(Number(activeFrom) * 1000).toISOString()}`, ...tx });
  console.log(`Rule v1 published (tx ${tx.txId}), in force from ${new Date(Number(activeFrom) * 1000).toISOString()}`);
}

const firstSlot = currentSlot(config.slotSeconds) + config.slotSeconds;
for (let i = 0n; i < BigInt(seed.surgeSlotsAhead); i++) {
  const slotStart = firstSlot + i * config.slotSeconds;
  for (const [zone, surge] of Object.entries(seed.surgePlan)) {
    if ((await chain.surgeFor(address, BigInt(zone), slotStart)) !== undefined) continue;
    const tx = await chain.publishSurge(address, BigInt(zone), slotStart, BigInt(surge));
    const name = seed.zones.find((z) => z.id === Number(zone))?.name ?? `zone ${zone}`;
    store.log({ kind: 'surge', summary: `${name}: ${surge / 100}x for slot ${new Date(Number(slotStart) * 1000).toISOString()}`, ...tx });
    console.log(`Surge ${name} ${surge} @ ${slotStart} (tx ${tx.txId})`);
  }
}

console.log(`Done. Contract: ${address}`);
await chain.stop();
process.exit(0);
