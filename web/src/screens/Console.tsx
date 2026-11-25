// SPDX-License-Identifier: Apache-2.0
// The platform's own console. It talks to the platform API, which holds the operator wallet
// and the private pay rules. This is the only screen that can change anything on chain.
import {
  Ban,
  BadgeCheck,
  CircleCheck,
  CircleX,
  Clock,
  Copy,
  ExternalLink,
  Gauge,
  Loader2,
  Receipt,
  RefreshCw,
  ScrollText,
  Send,
  Zap,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { ApiError, api, type PayoutResult, type PlatformState } from '../api';
import { rupees, short, when } from '../chain';

type Busy = null | 'rule' | 'surge' | 'pay';

export function Console() {
  const [s, setS] = useState<PlatformState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<Busy>(null);

  const load = useCallback(async () => {
    try {
      setS(await api.state());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  useEffect(() => {
    void load();
    const t = setInterval(load, 15_000);
    return () => clearInterval(t);
  }, [load]);

  if (error && !s) return <div className="result result-bad" role="alert">Platform API unreachable: {error}</div>;
  if (!s) return <p className="muted row"><Loader2 size={16} className="spin" aria-hidden /> Loading platform state…</p>;

  return (
    <main>
      <div className="page-head">
        <h1>Platform console</h1>
        <p className="muted">
          A delivery platform's side. Every action here is a Midnight transaction from the operator wallet; the pay
          rule's parameters stay on this server.
        </p>
      </div>
      <div className="grid-2">
        <div className="stack">
          <PayCard s={s} busy={busy} setBusy={setBusy} reload={load} />
          <RuleCard s={s} busy={busy} setBusy={setBusy} reload={load} />
        </div>
        <div className="stack">
          <SurgeCard s={s} busy={busy} setBusy={setBusy} reload={load} />
          <ActivityCard s={s} reload={load} />
        </div>
      </div>
    </main>
  );
}

type CardProps = { s: PlatformState; busy: Busy; setBusy: (b: Busy) => void; reload: () => Promise<void> };

function PayCard({ s, busy, setBusy, reload }: CardProps) {
  const [rider, setRider] = useState(s.riders[0]?.name ?? '');
  const [zone, setZone] = useState(s.zones[0]?.id ?? 1);
  const [km, setKm] = useState('3.2');
  const [minutes, setMinutes] = useState('22');
  const [underpay, setUnderpay] = useState(false);
  const [result, setResult] = useState<{ ok: PayoutResult } | { refused: string } | { error: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const inForce = s.rules.find((r) => r.inForce);
  const surge = s.surge.find((c) => c.zone === zone && c.slotStart === s.currentSlot)?.surgeX100 ?? null;

  const pay = async () => {
    setBusy('pay');
    setResult(null);
    setCopied(false);
    try {
      const ok = await api.pay({
        rider,
        zone,
        distanceMetres: Math.round(Number(km) * 1000),
        minutes: Math.round(Number(minutes)),
        adjustPercent: underpay ? -10 : 0,
      });
      setResult({ ok });
    } catch (e) {
      setResult(e instanceof ApiError && e.refused ? { refused: e.message } : { error: e instanceof Error ? e.message : String(e) });
    } finally {
      setBusy(null);
      void reload();
    }
  };

  const link = (code: string) => `${window.location.origin}${window.location.pathname}#/rider?r=${code}`;

  return (
    <section className="card stack" aria-labelledby="pay-h">
      <div className="card-head" style={{ marginBottom: 0 }}>
        <h2 id="pay-h">Record a payout</h2>
        <span className="xs muted">
          {inForce ? `rule v${inForce.version}` : 'no rule in force'} · surge {surge === null ? 'not announced' : `${(surge / 100).toFixed(2)}x`}
        </span>
      </div>
      <div className="fields four">
        <label>
          Rider
          <select value={rider} onChange={(e) => setRider(e.target.value)}>
            {s.riders.map((r) => <option key={r.name}>{r.name}</option>)}
          </select>
        </label>
        <label>
          Zone
          <select value={zone} onChange={(e) => setZone(Number(e.target.value))}>
            {s.zones.map((z) => <option key={z.id} value={z.id}>{z.name}</option>)}
          </select>
        </label>
        <label>
          Distance (km)
          <input inputMode="decimal" value={km} onChange={(e) => setKm(e.target.value)} />
        </label>
        <label>
          Time (min)
          <input inputMode="numeric" value={minutes} onChange={(e) => setMinutes(e.target.value)} />
        </label>
      </div>
      <label className="toggle" data-on={underpay}>
        <input type="checkbox" aria-label="Pay this rider 10% less" checked={underpay} onChange={(e) => setUnderpay(e.target.checked)} />
        <span>
          <strong>Pay this rider 10% less</strong>
          <br />
          <span className="xs muted">What a per-rider pay cut would look like. The contract should refuse it.</span>
        </span>
      </label>
      <div className="row">
        <button className={underpay ? 'btn btn-danger' : 'btn btn-primary'} onClick={pay} disabled={busy !== null || !inForce}>
          {busy === 'pay' ? <Loader2 size={16} className="spin" aria-hidden /> : <Send size={16} aria-hidden />}
          {busy === 'pay' ? 'Proving and submitting…' : underpay ? 'Try to underpay' : 'Pay and prove'}
        </button>
        {busy === 'pay' && <span className="xs muted">A zero-knowledge proof is generated locally, then sent to Midnight. About 30–60 s.</span>}
      </div>

      {result && 'ok' in result && (
        <div className="result result-ok" role="status">
          <div className="result-title"><CircleCheck size={18} aria-hidden /> Paid {rupees(result.ok.paid)} under the rule</div>
          <p className="small mono">tx {short(result.ok.txId, 10)} · block {result.ok.blockHeight}</p>
          <div className="row">
            <button
              className="btn btn-ghost"
              onClick={() => {
                void navigator.clipboard.writeText(link(result.ok.receiptCode));
                setCopied(true);
              }}
            >
              <Copy size={16} aria-hidden /> {copied ? 'Copied' : "Copy rider's receipt link"}
            </button>
            <a className="btn btn-ghost" href={`#/rider?r=${result.ok.receiptCode}`}>
              <Receipt size={16} aria-hidden /> Open as rider
            </a>
          </div>
        </div>
      )}
      {result && 'refused' in result && (
        <div className="result result-bad" role="alert">
          <div className="result-title"><Ban size={18} aria-hidden /> Refused by the contract</div>
          <p className="small">{result.refused}. No transaction was created and nothing reached the chain.</p>
        </div>
      )}
      {result && 'error' in result && (
        <div className="result result-bad" role="alert">
          <div className="result-title"><CircleX size={18} aria-hidden /> Something went wrong</div>
          <p className="small">{result.error}</p>
        </div>
      )}
    </section>
  );
}

function RuleCard({ s, busy, setBusy, reload }: CardProps) {
  const current = [...s.rules].reverse().find((r) => r.params)?.params;
  const [form, setForm] = useState({
    baseFare: Number(current?.baseFare ?? 0) / 100,
    perKm: Number(current?.perKm ?? 0) / 100,
    perMinute: Number(current?.perMinute ?? 0) / 100,
    minPayout: Number(current?.minPayout ?? 0) / 100,
  });
  const [msg, setMsg] = useState<string | null>(null);

  const publish = async () => {
    setBusy('rule');
    setMsg(null);
    try {
      const paise = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, Math.round(v * 100)]));
      const r = await api.publishRule(paise);
      setMsg(`Rule v${r.version} published. It comes into force at ${when(r.activeFrom)}; until then v${r.version - 1} keeps applying.`);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
      void reload();
    }
  };

  return (
    <section className="card stack" aria-labelledby="rule-h">
      <div className="card-head" style={{ marginBottom: 0 }}>
        <h2 id="rule-h">Pay rule</h2>
        <span className="xs muted">notice period {s.noticeSeconds / 60} min</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Version</th><th>Base</th><th>Per km</th><th>Per min</th><th>Floor</th><th>In force from</th></tr>
          </thead>
          <tbody>
            {[...s.rules].reverse().map((r) => (
              <tr key={r.version}>
                <td>
                  v{r.version}{' '}
                  {r.inForce ? <span className="pill pill-live"><BadgeCheck size={12} aria-hidden /> in force</span> : r.activeFrom > s.now ? <span className="pill pill-soon"><Clock size={12} aria-hidden /> announced</span> : null}
                </td>
                <td className="mono">{r.params ? rupees(r.params.baseFare) : '—'}</td>
                <td className="mono">{r.params ? rupees(r.params.perKm) : '—'}</td>
                <td className="mono">{r.params ? rupees(r.params.perMinute) : '—'}</td>
                <td className="mono">{r.params ? rupees(r.params.minPayout) : '—'}</td>
                <td className="mono">{when(r.activeFrom)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="xs muted">Only the commitment and start time go on chain; the amounts above stay private to the platform.</p>
      <div className="fields four">
        {(['baseFare', 'perKm', 'perMinute', 'minPayout'] as const).map((k) => (
          <label key={k}>
            {{ baseFare: 'Base (₹)', perKm: 'Per km (₹)', perMinute: 'Per min (₹)', minPayout: 'Floor (₹)' }[k]}
            <input inputMode="decimal" value={form[k]} onChange={(e) => setForm({ ...form, [k]: Number(e.target.value) })} />
          </label>
        ))}
      </div>
      <div className="row">
        <button className="btn btn-ghost" onClick={publish} disabled={busy !== null}>
          {busy === 'rule' ? <Loader2 size={16} className="spin" aria-hidden /> : <ScrollText size={16} aria-hidden />}
          Announce new rule
        </button>
        <span className="xs muted">Earliest start: now + {s.noticeSeconds / 60} min notice.</span>
      </div>
      {msg && <p className="small">{msg}</p>}
    </section>
  );
}

function SurgeCard({ s, busy, setBusy, reload }: CardProps) {
  const slots = [...new Set(s.surge.map((c) => c.slotStart))].sort();
  const next = s.currentSlot + s.slotSeconds;
  const [zone, setZone] = useState(s.zones[0]?.id ?? 1);
  const [slot, setSlot] = useState(next);
  const [mult, setMult] = useState('1.2');
  const [msg, setMsg] = useState<string | null>(null);

  const announce = async () => {
    setBusy('surge');
    setMsg(null);
    try {
      await api.publishSurge(zone, slot, Math.round(Number(mult) * 100));
      setMsg('Surge announced.');
    } catch (e) {
      setMsg(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
      void reload();
    }
  };

  const fmt = (t: number) => new Date(t * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <section className="card stack" aria-labelledby="surge-h">
      <div className="card-head" style={{ marginBottom: 0 }}>
        <h2 id="surge-h">Surge</h2>
        <span className="xs muted">{s.slotSeconds / 60}-min slots, locked once announced</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Zone</th>{slots.map((t) => <th key={t} className="mono">{fmt(t)}{t === s.currentSlot ? ' · now' : ''}</th>)}</tr>
          </thead>
          <tbody>
            {s.zones.map((z) => (
              <tr key={z.id}>
                <td>{z.name}</td>
                {slots.map((t) => {
                  const v = s.surge.find((c) => c.zone === z.id && c.slotStart === t)?.surgeX100 ?? null;
                  return <td key={t} className="mono">{v === null ? <span className="muted">—</span> : `${(v / 100).toFixed(2)}x`}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="fields">
        <label>
          Zone
          <select value={zone} onChange={(e) => setZone(Number(e.target.value))}>
            {s.zones.map((z) => <option key={z.id} value={z.id}>{z.name}</option>)}
          </select>
        </label>
        <label>
          Slot
          <select value={slot} onChange={(e) => setSlot(Number(e.target.value))}>
            {slots.filter((t) => t > s.now).map((t) => <option key={t} value={t}>{fmt(t)}</option>)}
          </select>
        </label>
        <label>
          Multiplier
          <input inputMode="decimal" value={mult} onChange={(e) => setMult(e.target.value)} />
        </label>
      </div>
      <div className="row">
        <button className="btn btn-ghost" onClick={announce} disabled={busy !== null}>
          {busy === 'surge' ? <Loader2 size={16} className="spin" aria-hidden /> : <Zap size={16} aria-hidden />} Announce surge
        </button>
        <span className="xs muted">Must be announced before the slot starts.</span>
      </div>
      {msg && <p className="small">{msg}</p>}
    </section>
  );
}

function ActivityCard({ s, reload }: { s: PlatformState; reload: () => Promise<void> }) {
  const icon = { deploy: Gauge, rule: ScrollText, surge: Zap, payout: CircleCheck, refused: Ban } as const;
  return (
    <section className="card stack" aria-labelledby="act-h">
      <div className="card-head" style={{ marginBottom: 0 }}>
        <h2 id="act-h">Activity</h2>
        <div className="row">
          <span className="xs muted">{s.payoutCount} payouts on chain</span>
          <button className="btn btn-ghost" onClick={reload} aria-label="Refresh"><RefreshCw size={16} aria-hidden /></button>
        </div>
      </div>
      <div className="activity">
        {s.activity.map((a) => {
          const Icon = icon[a.kind];
          return (
            <div className="activity-item" key={a.at + a.summary}>
              <Icon size={16} aria-hidden color={a.kind === 'refused' ? 'var(--destructive)' : 'var(--accent)'} />
              <div>
                <div>{a.summary}</div>
                <div className="xs muted mono">
                  {new Date(a.at).toLocaleTimeString('en-IN')}
                  {a.txId && <> · tx {short(a.txId, 6)}</>}
                  {a.blockHeight !== undefined && <> · block {a.blockHeight}</>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <a className="small row" href={`#/board?c=${s.contractAddress}`}>
        <ExternalLink size={14} aria-hidden /> Public record for this contract
      </a>
    </section>
  );
}
