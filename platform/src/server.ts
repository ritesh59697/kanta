// SPDX-License-Identifier: Apache-2.0
// The platform's console API. It holds the operator wallet and the private pay rules,
// and is the only thing that can publish rules, announce surge and record payouts.
// Riders never call it: they check receipts against the public ledger directly.
import http from 'node:http';

import { Chain, encodeReceipt, fromHex, RefusedError, refusalReason } from './chain.js';
import { loadConfig } from './config.js';
import { loadSeed, Store } from './store.js';
import { currentSlot, nowSeconds } from './time.js';

const config = loadConfig();
const seed = loadSeed();
const store = new Store(config.dataDir);
const address = config.contractAddress ?? store.deployment?.contractAddress;
if (address === undefined) throw new Error('No contract yet: run `npm run deploy -w platform` first');

const chain = await Chain.connect(config);
const riders = store.riders(seed.riders);
const zoneName = (id: number) => seed.zones.find((z) => z.id === id)?.name ?? `Zone ${id}`;
const fmtTime = (s: number | bigint) => new Date(Number(s) * 1000).toISOString();
const rupees = (paise: bigint) => `₹${(Number(paise) / 100).toFixed(2)}`;

class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

const int = (v: unknown, name: string): bigint => {
  if (typeof v === 'number' && Number.isInteger(v) && v >= 0) return BigInt(v);
  if (typeof v === 'string' && /^\d+$/.test(v)) return BigInt(v);
  throw new HttpError(400, `${name} must be a non-negative integer`);
};

const json = (res: http.ServerResponse, status: number, body: unknown) => {
  res.writeHead(status, {
    'content-type': 'application/json',
    'access-control-allow-origin': config.corsOrigin,
    'access-control-allow-headers': 'content-type',
    'access-control-allow-methods': 'GET,POST,OPTIONS',
  });
  res.end(JSON.stringify(body, (_k, v) => (typeof v === 'bigint' ? v.toString() : v)));
};

const readBody = async (req: http.IncomingMessage): Promise<Record<string, unknown>> => {
  const chunks: Buffer[] = [];
  for await (const c of req) chunks.push(c as Buffer);
  if (chunks.length === 0) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8')) as Record<string, unknown>;
  } catch {
    throw new HttpError(400, 'Body must be JSON');
  }
};

const state = async () => {
  const now = nowSeconds();
  const ledger = await chain.ledger(address);
  const rules = await chain.rules(address);
  const inForce = Chain.ruleInForce(rules, now);
  const priv = await chain.privateState(address);
  const slot = currentSlot(config.slotSeconds, now);
  const slots = [-1n, 0n, 1n, 2n, 3n].map((i) => slot + i * config.slotSeconds);
  const surge = [];
  for (const z of seed.zones) {
    for (const s of slots) {
      const key = (await import('@kanta/contract')).Kanta.pureCircuits.slotKey(BigInt(z.id), s);
      surge.push({ zone: z.id, slotStart: Number(s), surgeX100: ledger.surge.member(key) ? Number(ledger.surge.lookup(key)) : null });
    }
  }
  return {
    network: config.network,
    contractAddress: address,
    deployment: store.deployment,
    now,
    noticeSeconds: Number(ledger.noticeSeconds),
    slotSeconds: Number(ledger.slotSeconds),
    settleSeconds: Number(ledger.settleSeconds),
    currentSlot: Number(slot),
    zones: seed.zones,
    riders: riders.map((r) => ({ name: r.name, riderKey: r.riderKey })),
    rules: rules.map((r) => ({
      ...r,
      inForce: inForce?.version === r.version,
      // The platform's own console may show its private parameters; they never leave this server otherwise.
      params: priv.rules[String(r.version)]?.rule,
    })),
    surge,
    payoutCount: Number(ledger.payoutCount),
    activity: store.activity().slice(0, 30),
  };
};

const routes: Record<string, (body: Record<string, unknown>) => Promise<unknown>> = {
  'GET /api/health': async () => ({ ok: true }),
  'GET /api/state': async () => state(),

  'POST /api/rules': async (b) => {
    const rule = {
      baseFare: int(b.baseFare, 'baseFare'),
      perKm: int(b.perKm, 'perKm'),
      perMinute: int(b.perMinute, 'perMinute'),
      minPayout: int(b.minPayout, 'minPayout'),
    };
    const earliest = BigInt(nowSeconds()) + config.noticeSeconds + config.ruleStartBufferSeconds;
    const activeFrom = b.activeFrom === undefined ? earliest : int(b.activeFrom, 'activeFrom');
    const tx = await chain.publishRule(address, rule, activeFrom);
    const version = (await chain.rules(address)).length;
    store.log({ kind: 'rule', summary: `Published rule v${version}, in force from ${fmtTime(activeFrom)}`, ...tx });
    return { version, activeFrom: Number(activeFrom), ...tx };
  },

  'POST /api/surge': async (b) => {
    const zone = int(b.zone, 'zone');
    const slotStart = int(b.slotStart, 'slotStart');
    const surgeX100 = int(b.surgeX100, 'surgeX100');
    const tx = await chain.publishSurge(address, zone, slotStart, surgeX100);
    store.log({ kind: 'surge', summary: `${zoneName(Number(zone))}: ${Number(surgeX100) / 100}x for slot ${fmtTime(slotStart)}`, ...tx });
    return tx;
  },

  'POST /api/payouts': async (b) => {
    const rider = riders.find((r) => r.name === b.rider);
    if (rider === undefined) throw new HttpError(400, 'Unknown rider');
    const zone = int(b.zone, 'zone');
    const adjustPercent = b.adjustPercent === undefined ? 0 : Number(b.adjustPercent);
    if (!Number.isInteger(adjustPercent) || adjustPercent < -100 || adjustPercent > 100) {
      throw new HttpError(400, 'adjustPercent must be an integer between -100 and 100');
    }
    const now = nowSeconds();
    const facts = {
      riderKey: fromHex(rider.riderKey),
      zone,
      slotStart: currentSlot(config.slotSeconds, now),
      distanceMetres: int(b.distanceMetres, 'distanceMetres'),
      minutes: int(b.minutes, 'minutes'),
    };
    const label = `${rider.name}, ${zoneName(Number(zone))}, ${Number(facts.distanceMetres) / 1000} km, ${facts.minutes} min`;
    try {
      const r = await chain.recordPayout(address, facts, now, adjustPercent);
      store.log({ kind: 'payout', summary: `Paid ${label}: ${rupees(r.paid)}`, txId: r.txId, blockHeight: r.blockHeight });
      return { ...r, receiptCode: encodeReceipt(r.receipt) };
    } catch (e) {
      const reason = e instanceof RefusedError ? e.message : refusalReason(e);
      if (reason === undefined) throw e;
      const what = adjustPercent === 0 ? '' : ` (tried ${adjustPercent > 0 ? '+' : ''}${adjustPercent}% for this rider)`;
      store.log({ kind: 'refused', summary: `Refused ${label}${what}: ${reason}` });
      throw new HttpError(422, reason);
    }
  },
};

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') return json(res, 204, {});
  const route = routes[`${req.method} ${(req.url ?? '').split('?')[0]}`];
  if (route === undefined) return json(res, 404, { error: 'Not found' });
  readBody(req)
    .then(route)
    .then((body) => json(res, 200, body))
    .catch((e: unknown) => {
      const status = e instanceof HttpError ? e.status : 500;
      if (status === 500) console.error(e);
      json(res, status, { error: e instanceof Error ? e.message : String(e), refused: status === 422 });
    });
});

server.listen(config.port, () => console.log(`Kanta platform API on http://localhost:${config.port} (contract ${address})`));
