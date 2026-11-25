# Kanta

**Every delivery payout is proven to follow the one pay rule in force, with no per-rider factor. Riders check their own pay without a wallet, and nobody's trips or earnings go on the public ledger.**

Built on [Midnight](https://midnight.network) for the Midnight Buildathon (Wave 3). Deployed on Midnight **Preview** testnet.

**Live app:** https://kanta-site-seven.vercel.app (rider check and public record) · **Demo video:** [watch (1:55, synthetic narration)](https://kanta-site-seven.vercel.app/kanta-demo.mp4) · [download](https://github.com/ritesh59697/kanta/releases/tag/v0.3.0-wave3)

*Kanta* (काँटा) is the needle of a weighing scale. A *dharam kanta* is the public weighbridge that a buyer and a seller both trust. Kanta does the same for a rider and a platform.

---

## Judges: start here

| Path | Time | What you do | What you see |
|---|---|---|---|
| **A. Rider check, no setup** | 1 min | Open [Salma's receipt in the hosted rider check](https://kanta-site-seven.vercel.app/#/rider?r=eyJjb250cmFjdEFkZHJlc3MiOiI4ZjgxYjRhOTc3OTBlODNlZGMzMDRmOTNlZjRlOTk3ZTE1ZDE0NThmMGMwZGNiZWIxYjgyZWZiYzIzMmU5ZDZhIiwibmV0d29yayI6InByZXZpZXciLCJydWxlVmVyc2lvbiI6IjEiLCJzYWx0IjoiODU1YzM3NWJhYzI1ZWQwOGExYjhhYWI4M2IxNjI3YzlmNDIyYmM5Yjc0N2M5NjViY2VmYTdhMjZjMDE3MzJiYyIsInRyaXAiOnsicmlkZXJLZXkiOiI1NzE0MmY5ODU3MzViZWQ2NjdkYmMxZjk3YjQ2Nzc5OTAzMjY4MTAwOWZlNTlmMTNlYTJjZmM5MzM2YzVlZTIyIiwidHJpcElkIjoiZDEwOTA2YWY2YTgyM2UxM2JjMzU1OWFlMGQ1YTBkOTEzYTZlZmVkYWUxNzJjNWEyNDQ0M2Y0YTU2YTYwYjhlYSIsInpvbmUiOiIxIiwic2xvdFN0YXJ0IjoiMTc5NTUzNjAwMCIsImRpc3RhbmNlTWV0cmVzIjoiMzIwMCIsIm1pbnV0ZXMiOiIyMiIsInBheW91dCI6Ijc5NDQifX0) (or open https://kanta-site-seven.vercel.app → *Check my pay* → paste any receipt from [Live evidence](#live-evidence)) | Green: "Paid by the published rule". Then click *Try a receipt edited by ₹10*: red, not on the ledger |
| **B. Public record** | 1 min | Open *Public record* | The rule history (commitments + start times), the surge table, payout count, and what's public vs private, all read live from the Preview indexer |
| **C. Full platform run** | 15 min | [Run it locally](#run-it-locally) → *Platform console* → record a payout, then tick **Pay this rider 10% less** | The honest payout lands on Preview with a receipt; the underpayment is refused by the contract before any transaction exists |
| **D. Contract tests** | 2 min | `npm install && npm run compact && npm test` | 19 simulator tests drive the compiled contract through every rule |

---

## The problem

Ravi delivers food in Bengaluru. His pay per order fell last month. Did the platform change its formula for everyone, or only for him? He has no way to tell. Pay is set by an algorithm he can't see, and every rider gets a different number for a different trip.

Law is moving on this:

- **Karnataka Platform-Based Gig Workers (Social Security and Welfare) Act, 2025** requires platforms to tell gig workers how automated systems affect their work and earnings. ([PRS summary](https://prsindia.org/files/bills_acts/bills_states/karnataka/2025/Brief_Karnataka_Gig_Workers_Bill_2025.pdf))
- **EU Platform Work Directive 2024/2831** must be in national law by **2 December 2026**. It makes platforms inform workers about automated monitoring and decision-making. ([EP legislative summary](https://oeil.europarl.europa.eu/oeil/en/procedure-document-summary/pdf?id=1794723))

Explaining a pay algorithm is not the same as proving it was applied. And publishing every payout to prove it would expose riders' movements and earnings.

## What Kanta does

1. The platform publishes a **commitment** to its pay rule and when it comes into force. A new rule can't start until a notice period has passed, fixed when the contract is deployed.
2. The platform announces each zone's **surge** for a time slot **before** the slot starts. Once announced, it can't be changed.
3. Each payout is recorded with a **zero-knowledge proof** that the amount equals the rule in force applied to that trip and the announced surge. The rule has no input for who the rider is.
4. The rider gets a **receipt**. Their phone recomputes the commitment and finds it on the public ledger. No wallet and no sign-in, and the platform isn't asked.

Try to pay one rider 10% less, or 1 paisa more, and the proof can't be built. The transaction never exists.

## What's public, what's private

| Data | Where it lives |
|---|---|
| Rule commitment and start time | Public ledger |
| Surge per zone and slot | Public ledger |
| That a payout happened, its rule version, and its zone/slot key | Public ledger |
| Rule parameters (base fare, per km, per minute, floor) | Platform's private state only |
| Which rider was paid | Private (inside a commitment) |
| Trip distance, time and amount | Private (inside a commitment) |

Honest limits:
- Kanta proves the **same rule** was applied to the **recorded trip facts**. It does not prove the rule is fair, or that the distance and time were measured correctly. The rider checks those against their own trip.
- A rider who keeps several receipts could work out a simple rule's parameters. The privacy that matters here is riders' data, not the formula.
- The zone and slot of each payout are visible, because the contract looks up the announced surge by that key. A Merkle-path lookup would hide it (see roadmap).

## Midnight integration

- **Compact contract** [`contract/src/kanta.compact`](contract/src/kanta.compact): 3 provable circuits (`publishRule`, `publishSurge`, `recordPayout`) plus 5 pure circuits that riders run in the browser (`payoutCommitment`, `slotKey`, `ruleCommitment`, `grossScaled`, `payoutFollowsRule`).
- **Private state and witnesses** [`contract/src/witnesses.ts`](contract/src/witnesses.ts): the operator secret and the pay-rule parameters never leave the platform. `ruleParams(version)` feeds them into the proof, and the circuit checks them against the published `persistentCommit`.
- **Dual ledger**:
  - Public: `rules`, `surge`, `payouts` (a `Set` of receipt commitments) and counters.
  - Private: each rule's parameters and the trip itself.
  - Only `disclose()`d values reach the ledger, and receipts use `persistentCommit` with a random salt.
- **Access control**: operator key is `persistentHash(secret)` sealed at deploy; every state-changing circuit checks it.
- **Block time**:
  - `blockTimeLte` enforces the notice period.
  - `blockTimeGte` and `blockTimeLt` pick the rule in force, and tie each trip to its slot: a trip can only be paid once its slot has started, and no later than `slotSeconds + settleSeconds` after it (both sealed at deploy).
  - `blockTimeLt` stops surge announced late.
- **Pay maths without division**: Compact has no `/`, so the circuit checks `payout * 100000 <= gross < (payout + 1) * 100000`, with a floor branch for the minimum payout.
- **SDK**: midnight-js 5.0.1 (ledger 9), compact-runtime 0.21.0, compiler 0.36.1, proof server 9.0.2. The browser decodes contract state from the indexer with `ContractState.deserialize` and the generated `ledger()`.
- **Compiles** on Compact compilers 0.30.0, 0.31.1, 0.35.0 and 0.36.1 (`--skip-zk`); proving keys are built with 0.36.1.
- **Why no browser wallet**: the operator's secret and pay-rule parameters belong on the platform's server, so the console calls the platform service, which holds the wallet and runs the proof server. Riders need no wallet at all; that is the point of the rider check.

## Architecture

```
contract/   Compact contract, witnesses, pay calculator, simulator tests
platform/   Operator service: wallet (midnight testkit), proof server client, REST API, deploy script
web/        React app: rider check (walletless), public record (walletless), platform console (calls platform/)
```

The rider check and the public record need only the public Midnight indexer, so they can be hosted as static files.

## Privacy, checked on the live chain

`npm run check-privacy -w platform <receipt-file> <payout-tx-id>` fetches the contract's public state and the payout transaction's raw bytes from the Preview indexer, and searches them for the rider's key, the trip id and the receipt salt. It also confirms the receipt commitment *is* on the ledger (a positive control). On the first live payout, none of the three secrets appears in 9.1 KB of contract state or the 9.7 KB transaction.

## Live evidence

Preview testnet. Contract: `8f81b4a97790e83edc304f93ef4e997e15d1458f0c0dcbeb1b82efbc232e9d6a`

| What | Transaction id | Block |
|---|---|---|
| Deploy (notice 600 s, 30-min slots, 1 h settle window) | `00a65b8332a365548604f94254c0c88a06d88c9fe3fb973cdfce8bbedc055e5c16` | 250743 |
| Rule v1 (₹25 base, ₹6/km, ₹1/min, ₹30 floor; parameters private) | `00e7330a9a132828a7edab403c13a62eae5d2bbbbc1d887f75daf310b8972bc493` | |
| Surge announced before each slot, e.g. Koramangala 1.2× | `0051aa99460bfe90f4e0b65f251ade873f2f4b8697a9da41c6ee6d5c57147ba227` | |
| Payout: Ravi, Koramangala, 3.2 km, 22 min → ₹79.44 | `0097e55f9e6d394df82261b72d7cc792b020e775fd4cf68e4d71d3fb32b3d3a467` | 253424 |
| Payout: Salma, **same trip** → **₹79.44** (same rule, no per-rider factor) | `00f42f5f938235ed07ac6d2185e9bee17dc6a35ef80be52ca97988779104ee41ab` | 253428 |
| Payout: Joseph, Indiranagar, 1.5 km, 12 min → ₹46.00 | `0070782b25e1cbb4937a0df543f471d3916759ddc344ccdb672e1b59f0e223a5a1` | 253432 |
| Payout: Meena, HSR Layout, 0.2 km, 2 min → ₹31.02 | `00b97405708dff5fa28eb3fd58ae8de2d3843d139df0210451b79843cbd72303af` | 253436 |
| Payouts recorded for the demo video: Ravi, Koramangala, 3.2 km, 22 min → ₹79.44 (a new trip each time) | `00f0bccaeaeb2ee83ad2c946b26ba44811961a62f6c7be6b08814c63f06daacde8` | 264056 |
| | `008111fabcce41d2b397c135ee03b1ea7b23427035b8c893f7a84dcecef107eba1` | 264078 |
| Ravi's trip again, 10% less | **refused** by the contract, no transaction ("Payout does not follow the rule in force") | – |

6 payouts on chain as of Nov 25. Receipts to paste into *Check my pay*: [Ravi](docs/receipt-ravi.txt), [Salma](docs/receipt-salma.txt), [Joseph](docs/receipt-joseph.txt), [Meena](docs/receipt-meena.txt).

An earlier deployment (`dfb56ac1…`, before the slot was bound to block time) is kept for history: [docs/receipt-ravi-v1.txt](docs/receipt-ravi-v1.txt).

## Run it locally

Requirements: Node 22+, Docker, the [Compact toolchain](https://docs.midnight.network/getting-started/installation) (`compact update 0.36.1`).

```bash
npm install
npm run compact            # builds the circuits and proving keys
npm test                   # 19 simulator tests
docker run -d -p 6300:6300 midnightntwrk/proof-server:9.0.2 midnight-proof-server -v
cp platform/.env.example platform/.env   # set a strong KANTA_PRIVATE_STORE_PASSWORD
npm run deploy -w platform               # prints the operator address: fund it at https://faucet.preview.midnight.network/
npm start -w platform                    # platform API on :8790
cp web/.env.example web/.env.local       # set VITE_KANTA_CONTRACT
npm run dev -w web                       # http://localhost:5210
```

## Who it's for, and who pays

- **Riders** check their pay for free, on any phone.
- **Unions and regulators** audit the rule history and surge table for free.
- **Platforms** pay, because the new laws ask them to explain automated pay, and a proof is a stronger answer than a PDF. It also helps them recruit riders in a tight market: "no per-rider pay".

This is unvalidated. No platform, union or regulator has been asked yet.

## Roadmap

- Hide each payout's zone and slot with a Merkle-path surge lookup.
- Union dashboard: payouts per rule version over time.
- Shielded token payouts, so the money and the proof move in one transaction.
- Signed trip facts from the rider's own app, so distance and time are co-signed.

## License

Apache-2.0. See [LICENSE](LICENSE).
