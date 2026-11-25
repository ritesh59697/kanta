// SPDX-License-Identifier: Apache-2.0
// Walletless rider check. Runs entirely in the browser against the public indexer.
import { CircleCheck, CircleX, Loader2, PencilLine, ShieldCheck } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import seed from '../../../platform/seed.json';
import { rupees, short, when } from '../chain';
import { checkReceipt, type CheckResult, decodeReceipt, encodeReceipt, type ReceiptData } from '../receipt';

type Status =
  | { kind: 'idle' }
  | { kind: 'checking' }
  | { kind: 'done'; receipt: ReceiptData; result: CheckResult; edited: boolean }
  | { kind: 'error'; message: string };

export function Rider({ initialCode }: { initialCode: string }) {
  const [code, setCode] = useState(initialCode);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const check = useCallback(async (c: string, edited = false) => {
    setStatus({ kind: 'checking' });
    try {
      const receipt = decodeReceipt(c);
      const result = await checkReceipt(receipt);
      setStatus({ kind: 'done', receipt, result, edited });
    } catch (e) {
      setStatus({ kind: 'error', message: e instanceof Error ? e.message : String(e) });
    }
  }, []);

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
      void check(initialCode);
    }
  }, [initialCode, check]);

  // Demo of tampering: the same receipt, ₹10 higher.
  const editAmount = () => {
    if (status.kind !== 'done') return;
    const r = status.receipt;
    const edited = { ...r, trip: { ...r.trip, payout: String(BigInt(r.trip.payout) + 1000n) } };
    const c = encodeReceipt(edited);
    setCode(c);
    void check(c, true);
  };

  return (
    <main>
      <div className="page-head">
        <h1>Was I paid by the same rule as everyone?</h1>
        <p className="muted">
          Paste the receipt code from your payout. Your phone checks it against the public Midnight ledger. No wallet,
          no sign-in, and nothing is sent to the platform.
        </p>
      </div>

      <div className="grid-2">
        <section className="card stack" aria-labelledby="receipt-h">
          <h2 id="receipt-h" className="sr-only">Receipt</h2>
          <label>
            Receipt code
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste the code or link from your payout message"
              spellCheck={false}
            />
          </label>
          <div className="row">
            <button className="btn btn-primary" disabled={!code.trim() || status.kind === 'checking'} onClick={() => check(code)}>
              {status.kind === 'checking' ? <Loader2 size={16} className="spin" aria-hidden /> : <ShieldCheck size={16} aria-hidden />}
              Check my payout
            </button>
            {status.kind === 'done' && status.result.found && (
              <button className="btn btn-ghost" onClick={editAmount}>
                <PencilLine size={16} aria-hidden />
                Try a receipt edited by ₹10
              </button>
            )}
          </div>
          {status.kind === 'error' && (
            <div className="result result-bad" role="alert">
              <div className="result-title">
                <CircleX size={18} aria-hidden /> Couldn't read this receipt
              </div>
              <p className="small">{status.message}</p>
            </div>
          )}
          {status.kind === 'done' && <Verdict {...status} />}
        </section>

        <aside className="card stack">
          <h3>What this check proves</h3>
          <ul className="small" style={{ margin: 0, paddingLeft: 'var(--s4)', display: 'grid', gap: 'var(--s2)' }}>
            <li>Your payout was recorded only after a zero-knowledge proof that it equals the platform's published rule applied to your trip.</li>
            <li>The rule has no input for who you are, so the same trip pays every rider the same.</li>
            <li>The surge for your zone and slot was announced before the slot began, and can't be changed.</li>
            <li>A new rule can't apply until its notice period has passed.</li>
          </ul>
          <div className="notice">
            <span>
              It does not prove the rule is fair, or that your trip's zone, distance and time were recorded correctly. Check
              those against your own trip.
            </span>
          </div>
        </aside>
      </div>
    </main>
  );
}

function Verdict({ receipt, result, edited }: { receipt: ReceiptData; result: CheckResult; edited: boolean }) {
  const t = receipt.trip;
  if (!result.found) {
    return (
      <div className="result result-bad" role="status">
        <div className="result-title">
          <CircleX size={18} aria-hidden />
          {edited ? 'Edited receipt: not on the ledger' : 'No matching payout on the ledger'}
        </div>
        <p className="small">
          No payout with these exact details was ever proven against the platform's rule. {edited && `The amount was changed to ${rupees(t.payout)}.`}
        </p>
      </div>
    );
  }
  return (
    <div className="stack">
      <div className="result result-ok" role="status">
        <div className="result-title">
          <CircleCheck size={18} aria-hidden /> Paid by the published rule
        </div>
        <p className="small">This exact payout is on the Midnight ledger, proven against rule v{receipt.ruleVersion}.</p>
      </div>
      <div className="slip">
        <div className="row" style={{ alignItems: 'baseline' }}>
          <span className="amount">{rupees(t.payout)}</span>
          <span className="spacer" />
          <span className="pill pill-live">Rule v{receipt.ruleVersion}</span>
        </div>
        <div className="slip-row">
          <span className="muted">Trip</span>
          <span className="mono">
            {(Number(t.distanceMetres) / 1000).toFixed(1)} km · {t.minutes} min
          </span>
        </div>
        <div className="slip-row">
          <span className="muted">Zone recorded (check it's yours)</span>
          <span className="mono">{seed.zones.find((z) => String(z.id) === t.zone)?.name ?? `Zone ${t.zone}`}</span>
        </div>
        <div className="slip-row">
          <span className="muted">Surge for your zone and slot</span>
          <span className="mono">
            {result.surgeX100 !== undefined ? `${(Number(result.surgeX100) / 100).toFixed(2)}x` : 'none'} · slot {when(BigInt(t.slotStart))}
          </span>
        </div>
        {result.rule && (
          <div className="slip-row">
            <span className="muted">Rule v{receipt.ruleVersion} in force since</span>
            <span className="mono">{when(result.rule.activeFrom)}</span>
          </div>
        )}
        <div className="slip-row">
          <span className="muted">Contract</span>
          <span className="hash">{short(receipt.contractAddress)}</span>
        </div>
        <div className="slip-row">
          <span className="muted">Ledger read at block</span>
          <span className="mono">{result.read.blockHeight.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );
}
