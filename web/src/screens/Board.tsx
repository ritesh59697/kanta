// SPDX-License-Identifier: Apache-2.0
// The public record: anyone (a union, a regulator, a rider) can audit the rule history
// and the surge table straight from the indexer. No trips or amounts exist here to show.
import { CircleCheck, Clock, EyeOff, Eye, Loader2, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import seed from '../../../platform/seed.json';
import { type ContractRead, readContract, short, slotKey, toHex, when } from '../chain';


const LOOKBACK_SLOTS = Number(import.meta.env.VITE_KANTA_BOARD_LOOKBACK_SLOTS);

export function Board({ address }: { address: string | undefined }) {
  const [read, setRead] = useState<ContractRead | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    setError(null);
    try {
      setRead(await readContract(address));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!address) return <p className="muted">No contract address configured.</p>;

  const now = Math.floor(Date.now() / 1000);
  const ledger = read?.ledger;
  const SLOT_SECONDS = ledger ? Number(ledger.slotSeconds) : 1;
  const slot = Math.floor(now / SLOT_SECONDS) * SLOT_SECONDS;
  const announced = (t: number) =>
    ledger !== undefined && seed.zones.some((z) => ledger.surge.member(slotKey(BigInt(z.id), BigInt(t))));
  // If nothing is announced around now, anchor the table on the latest announced slot instead.
  let anchor = slot;
  if (ledger && ![0, 1, 2, 3].some((i) => announced(slot + i * SLOT_SECONDS))) {
    for (let i = 1; i <= LOOKBACK_SLOTS; i++) {
      if (announced(slot - i * SLOT_SECONDS)) {
        anchor = slot - (i + 3) * SLOT_SECONDS;
        break;
      }
    }
  }
  const slots = [-1, 0, 1, 2, 3].map((i) => anchor + i * SLOT_SECONDS);
  const rules = ledger ? [...ledger.rules].sort((a, b) => Number(b[0] - a[0])) : [];
  const inForce = rules.find(([, r]) => Number(r.activeFrom) <= now)?.[0];

  return (
    <main>
      <div className="page-head">
        <h1>Public record</h1>
        <p className="muted">
          Everything the platform has committed to, read live from Midnight. Riders' trips and earnings aren't here,
          because they never touch the public ledger.
        </p>
      </div>

      <div className="row" style={{ marginBottom: 'var(--s4)' }}>
        <span className="hash">Contract {address}</span>
        <span className="spacer" />
        <button className="btn btn-ghost" onClick={load} disabled={loading}>
          {loading ? <Loader2 size={16} className="spin" aria-hidden /> : <RefreshCw size={16} aria-hidden />} Refresh
        </button>
      </div>
      {error && <div className="result result-bad" role="alert">{error}</div>}

      {ledger && (
        <div className="grid-2">
          <div className="stack">
            <section className="card">
              <div className="card-head">
                <h3>Pay rule history</h3>
                <span className="xs muted">notice period {Number(ledger.noticeSeconds) / 60} min</span>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>Version</th><th>In force from</th><th>Commitment</th></tr>
                  </thead>
                  <tbody>
                    {rules.map(([v, r]) => (
                      <tr key={String(v)}>
                        <td>
                          v{String(v)}{' '}
                          {v === inForce ? (
                            <span className="pill pill-live"><CircleCheck size={12} aria-hidden /> in force</span>
                          ) : Number(r.activeFrom) > now ? (
                            <span className="pill pill-soon"><Clock size={12} aria-hidden /> announced</span>
                          ) : (
                            <span className="pill">replaced</span>
                          )}
                        </td>
                        <td className="mono">{when(r.activeFrom)}</td>
                        <td className="hash">{short(toHex(r.commitment), 10)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="card">
              <div className="card-head">
                <h3>Surge announced per zone</h3>
                <span className="xs muted">
                  {SLOT_SECONDS / 60}-minute slots{anchor !== slot ? ' · showing the last announced slots' : ''}
                </span>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Zone</th>
                      {slots.map((s) => (
                        <th key={s} className="mono">{new Date(s * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}{s === slot ? ' · now' : ''}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {seed.zones.map((z) => (
                      <tr key={z.id}>
                        <td>{z.name}</td>
                        {slots.map((s) => {
                          const key = slotKey(BigInt(z.id), BigInt(s));
                          const v = ledger.surge.member(key) ? Number(ledger.surge.lookup(key)) : null;
                          return <td key={s} className="mono">{v === null ? <span className="muted">—</span> : `${(v / 100).toFixed(2)}x`}</td>;
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <div className="stack">
            <section className="card">
              <p className="muted small">Payouts proven against the rule</p>
              <p className="amount">{Number(ledger.payoutCount).toLocaleString('en-IN')}</p>
              <p className="xs muted">Ledger read at block {read.blockHeight.toLocaleString('en-IN')}</p>
            </section>
            <section className="card stack">
              <h3>What's public, what's private</h3>
              <table>
                <tbody>
                  {[
                    ['Rule commitment and start time', true],
                    ['Surge per zone and slot', true],
                    ['That a payout happened, its rule version and zone/slot', true],
                    ['Rule parameters (base, per km, per minute, floor)', false],
                    ['Which rider was paid', false],
                    ['Trip distance, time and amount', false],
                  ].map(([what, pub]) => (
                    <tr key={String(what)}>
                      <td>{what}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        {pub ? (
                          <span className="pill"><Eye size={12} aria-hidden /> public</span>
                        ) : (
                          <span className="pill pill-live"><EyeOff size={12} aria-hidden /> private</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        </div>
      )}
    </main>
  );
}
