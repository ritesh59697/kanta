// SPDX-License-Identifier: Apache-2.0
// The landing page: what Kanta is, live numbers from the chain, and one-click checks of real receipts.
import {
  ArrowRight,
  CalendarClock,
  EyeOff,
  Eye,
  FileCheck2,
  FolderGit2,
  Landmark,
  Loader2,
  Play,
  ScrollText,
  Smartphone,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import seed from '../../../platform/seed.json';
import { type ContractRead, env, readContract, rupees, when } from '../chain';
import { decodeReceipt, type ReceiptData } from '../receipt';

const links = {
  video: (import.meta.env.VITE_KANTA_VIDEO_URL as string | undefined) || undefined,
  repo: (import.meta.env.VITE_KANTA_REPO_URL as string | undefined) || undefined,
  poster: (import.meta.env.VITE_KANTA_VIDEO_POSTER as string | undefined) || undefined,
};

// Sample receipts live in the repo's docs folder (docs/receipt-<name>.txt). Only receipts for the
// configured contract are offered, so an old deployment's receipt never shows up here.
type Sample = { name: string; code: string; receipt: ReceiptData };
const samples: Sample[] = Object.entries(
  import.meta.glob('../../../docs/receipt-*.txt', { query: '?raw', import: 'default', eager: true }) as Record<
    string,
    string
  >,
)
  .flatMap(([path, raw]) => {
    const name = path.match(/receipt-([^/]+)\.txt$/)?.[1] ?? '';
    try {
      const code = raw.trim();
      const receipt = decodeReceipt(code);
      if (!name || receipt.contractAddress !== env.contract) return [];
      return [{ name: name.charAt(0).toUpperCase() + name.slice(1), code, receipt }];
    } catch {
      return [];
    }
  })
  .sort((a, b) => seed.riders.indexOf(a.name) - seed.riders.indexOf(b.name));

const sameTrip = (a: ReceiptData, b: ReceiptData) =>
  a.trip.zone === b.trip.zone &&
  a.trip.slotStart === b.trip.slotStart &&
  a.trip.distanceMetres === b.trip.distanceMetres &&
  a.trip.minutes === b.trip.minutes;

// The pair that tells the story: two different riders, one identical trip.
const pair = (() => {
  for (const a of samples)
    for (const b of samples)
      if (a !== b && a.receipt.trip.riderKey !== b.receipt.trip.riderKey && sameTrip(a.receipt, b.receipt))
        return [a, b] as const;
  return samples.length >= 2 ? ([samples[0], samples[1]] as const) : null;
})();

const zoneName = (id: string) => seed.zones.find((z) => String(z.id) === id)?.name ?? `Zone ${id}`;
const checkHref = (s: Sample) => `#/rider?r=${s.code}`;

export function Home() {
  const [read, setRead] = useState<ContractRead | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!env.contract) return;
    readContract(env.contract).then(setRead, () => setError(true));
  }, []);

  const ledger = read?.ledger;
  const now = Math.floor(Date.now() / 1000);
  const rules = ledger ? [...ledger.rules].sort((a, b) => Number(b[0] - a[0])) : [];
  const inForce = rules.find(([, r]) => Number(r.activeFrom) <= now);
  const lead = pair?.[0] ?? samples[0];

  return (
    <main className="home">
      <section className="hero grid-2">
        <div className="hero-copy">
          <p className="eyebrow">Delivery pay, proven on Midnight</p>
          <h1 className="hero-title">
            {pair ? `Was ${pair[0].name} paid by the same rule as ${pair[1].name}?` : 'Was I paid by the same rule as everyone?'}
          </h1>
          <p className="hero-lede">
            Gig platforms set pay with an algorithm riders never see. Kanta records every payout with a zero-knowledge
            proof that it follows the one published pay rule, and that rule has no input for who the rider is. Riders
            check their own pay from any phone. Their trips and earnings never go on the public ledger.
          </p>
          <div className="row hero-ctas">
            {lead && (
              <a className="btn btn-primary" href={checkHref(lead)}>
                Check {lead.name}'s real receipt
                <ArrowRight size={16} aria-hidden />
              </a>
            )}
            {links.video && (
              <a className="btn btn-ghost" href="#demo">
                <Play size={16} aria-hidden />
                Watch the demo
              </a>
            )}
          </div>
          <p className="xs muted">No wallet, no sign-in. The check runs in your browser against the public ledger.</p>
        </div>

        <aside className="slip live-slip" aria-label="Live from the contract">
          <div className="slip-head">
            <span className="xs muted">Live from Midnight {env.network}</span>
            {!read && !error && <Loader2 size={14} className="spin" aria-label="Reading the ledger" />}
            {read && <span className="pill pill-live">updated at block {read.blockHeight.toLocaleString('en-IN')}</span>}
          </div>
          {error && <p className="small muted">Couldn't reach the indexer just now. The public record has a retry.</p>}
          <div className="slip-row">
            <span className="muted">Payouts proven against the rule</span>
            <span className="mono stat">{ledger ? Number(ledger.payoutCount).toLocaleString('en-IN') : '…'}</span>
          </div>
          <div className="slip-row">
            <span className="muted">Pay rule in force</span>
            <span className="mono stat">{inForce ? `v${inForce[0]}` : ledger ? 'none yet' : '…'}</span>
          </div>
          <div className="slip-row">
            <span className="muted">In force since</span>
            <span className="mono">{inForce ? when(inForce[1].activeFrom) : '…'}</span>
          </div>
          <div className="slip-row">
            <span className="muted">Surge announcements, before each slot</span>
            <span className="mono stat">{ledger ? Number(ledger.surge.size()).toLocaleString('en-IN') : '…'}</span>
          </div>
          <div className="slip-row">
            <span className="muted">New rule notice period</span>
            <span className="mono">{ledger ? `${Number(ledger.noticeSeconds) / 60} min` : '…'}</span>
          </div>
          <a className="slip-link small" href="#/board">
            <Landmark size={14} aria-hidden />
            Open the full public record
          </a>
        </aside>
      </section>

      {pair && (
        <section className="section">
          <div className="section-head">
            <h2>Same trip, same pay</h2>
            <p className="muted">
              Two real payouts on Midnight {env.network}. Open either receipt and the check recomputes it against the
              ledger. Edit the amount on the result page and the check fails.
            </p>
          </div>
          <div className="pair">
            {pair.map((s) => (
              <a key={s.name} className="receipt" href={checkHref(s)}>
                <div className="receipt-top">
                  <span className="receipt-name">{s.name}</span>
                  <span className="pill">rule v{s.receipt.ruleVersion}</span>
                </div>
                <div className="slip-row">
                  <span className="muted">Zone</span>
                  <span>{zoneName(s.receipt.trip.zone)}</span>
                </div>
                <div className="slip-row">
                  <span className="muted">Trip</span>
                  <span className="mono">
                    {(Number(s.receipt.trip.distanceMetres) / 1000).toLocaleString('en-IN')} km ·{' '}
                    {s.receipt.trip.minutes} min
                  </span>
                </div>
                <div className="slip-row">
                  <span className="muted">Paid</span>
                  <span className="amount receipt-amount">{rupees(s.receipt.trip.payout)}</span>
                </div>
                <span className="receipt-cta small">
                  Check this receipt <ArrowRight size={14} aria-hidden />
                </span>
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <div className="section-head">
          <h2>How it works</h2>
        </div>
        <ol className="steps">
          <li className="card">
            <ScrollText size={20} aria-hidden className="step-icon" />
            <h3>One rule, committed</h3>
            <p className="small muted">
              The platform commits its pay rule on chain. Only the commitment and start time are public, and a new rule
              can't start before the notice period.
            </p>
          </li>
          <li className="card">
            <CalendarClock size={20} aria-hidden className="step-icon" />
            <h3>Surge, announced first</h3>
            <p className="small muted">
              Each zone's surge is announced before its slot starts and can't be changed after.
            </p>
          </li>
          <li className="card">
            <FileCheck2 size={20} aria-hidden className="step-icon" />
            <h3>Every payout, proven</h3>
            <p className="small muted">
              A payout is recorded only with a proof that the amount equals the rule in force applied to the trip. A
              per-rider cut can't be proven, so it's refused.
            </p>
          </li>
          <li className="card">
            <Smartphone size={20} aria-hidden className="step-icon" />
            <h3>Checked by the rider</h3>
            <p className="small muted">
              The rider gets a receipt code. Their phone reads the public ledger and recomputes it. Nothing is sent to
              the platform.
            </p>
          </li>
        </ol>
      </section>

      <section className="section grid-2 split">
        <div className="card">
          <h3 className="with-icon">
            <Eye size={18} aria-hidden /> Public on Midnight
          </h3>
          <ul className="plain small">
            <li>Rule commitments and start times</li>
            <li>Surge per zone and slot</li>
            <li>That a payout happened, its rule version and zone/slot</li>
            <li>Receipt commitments</li>
          </ul>
        </div>
        <div className="card">
          <h3 className="with-icon">
            <EyeOff size={18} aria-hidden /> Private
          </h3>
          <ul className="plain small">
            <li>Rule parameters (base, per km, per minute, floor)</li>
            <li>Which rider was paid</li>
            <li>Trip distance, time and amount</li>
          </ul>
        </div>
      </section>

      {links.video && (
        <section className="section" id="demo">
          <div className="section-head">
            <h2>Demo</h2>
            <p className="muted">The platform console paying riders, a refused underpayment, and the rider check.</p>
          </div>
          <video className="demo-video" src={links.video} poster={links.poster} controls preload="metadata" playsInline />
        </section>
      )}

      <section className="section">
        <p className="notice">
          What it proves: one committed rule was applied to the recorded trip facts. It doesn't prove the rule is fair,
          or that the trip was measured honestly. Rider co-signed trips are on the roadmap.
        </p>
      </section>

      <footer className="foot row">
        {links.repo && (
          <a href={links.repo} className="with-icon">
            <FolderGit2 size={16} aria-hidden /> Source on GitHub
          </a>
        )}
        <a href="#/board" className="with-icon">
          <Landmark size={16} aria-hidden /> Public record
        </a>
        <span className="spacer" />
        {env.contract && <span className="hash">Contract {env.contract}</span>}
      </footer>
    </main>
  );
}
