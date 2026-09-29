# HANDOFF: build session, Voltera Piekpact

**Read this first.** It is everything the build session needs. Background lives in `top3.md` (business case, Q&A, pitch), `ranking.md`, `critique.md`.
Team: **A** = dev (data + engine), **D** = dev (UI), **G** = generalist (hardware, copy, fallbacks), **B** = business (numbers, pitch). 24 h.

---

## 1. Chosen idea

**Voltera Piekpact:** *"Other suppliers explain your bill. Voltera signs for it: pick your kW, we keep you under it, or we pay."*

1. **Explain (free):** a monthly footnoted peak receipt (Piekbon). LLM writes it, a deterministic validator checks every number.
2. **Price:** a per-household monthly fee from the customer's own 15-min history.
3. **Enforce:** a quarter-hour controller slows handed-over loads (EV first) when the projected quarter-hour average heads over the cap.
4. **Guarantee:** overshoot caused by handed-over loads is credited on the bill: (peak − cap) × €4.72.

Roadmap line only (no build): *"Same engine, next: the annual cheapest-formula notice with a regret refund"* (H2), and *"for solar families: Familiestroom"* (H3).

### Hard rules for every screen
- **Never name a kettle, oven, hob, dryer or hair dryer from 15-min data (X7).** Receipt labels allowed: "grote continue belasting (waarschijnlijk EV)", "grote continue belasting (waarschijnlijk warmtepomp)", "korte pieken". The live kettle on stage is measured by a smart plug, not detected, so that's fine.
- **No "avoided hedging premium" anywhere (X2).**
- **Every number on screen** comes from the Fluvius open dataset, the tariff table below, or `assumptions.json` (visible on screen 4). No hard-coded marketing numbers.
- Money shown to customers is **incl. 6% VAT**, formatted nl-BE (`€18,41`). Business-case numbers are in € excl. VAT.

---

## 2. Core features

### MUST (demo breaks without it)
| # | Feature | Owner |
|---|---|---|
| M1 | Data pipeline: Fluvius open data → normalised `Household` JSON for 3 demo households (EV, EV+PV, HP) + segment aggregates | A |
| M2 | Capacity engine: monthly peaks, 12-month rolling average, 2.5 kW floor, € per month and per year | A |
| M3 | Screen 1, Piekbon receipt in a phone frame: peak quarter-hour, kW, €, load label, "what if EV after 21:00" line, **JA** button | D |
| M4 | LLM receipt text + **deterministic validator** + "plant an error" toggle that gets caught in red | A |
| M5 | Screen 2, Piekpact offer: cap slider, per-household fee, year replay chart with/without controller, net saving | D (UI), A (model) |
| M6 | Screen 3, live Kwartierklok: countdown ring, projected kW, € at stake, EV start button, auto controller, guarantee ledger (€0 owed) | D (UI), A (sim) |
| M7 | Kettle input: Shelly plug polled locally **or** keyboard fallback (`K` = kettle on/off) | G |
| M8 | Screen 4, business case: sliders for every assumption, live totals, pessimistic toggle | D (UI), B (numbers) |
| M9 | Offline mode: cached LLM output + all data served locally; runs with Wi-Fi off | A |
| M10 | Recorded fallback video of screens 1–3 | G |

### SHOULD (do if M-list is green by hour 15)
- **PiekLicht:** a second phone on the table showing full-screen green/orange/red, polling `/api/state`. (No hardware purchase needed.)
- Paper-bill version of the receipt (printable one-liner + QR) next to the WhatsApp version.
- EV "charge job" chip on screen 3: "Laden tot 80% tegen 07:00: prijs vast, piek gegarandeerd".
- Segment distribution on screen 4 (P10/P50/P90 customer saving from the open data).

### WON'T (explicitly out of scope, say so if asked)
- Real Fluvius API, real Mijn Fluvius consent, real OCPP/charger control, real WhatsApp sending (phone mockup only).
- H2 replay/regret refund and H3 family sale screens (one roadmap sentence only).
- Appliance detection beyond large continuous loads. No ML model.
- Logins, accounts, database, multi-user.
- Brussels (no 15-min capacity tariff there). Demo is Flanders only; mention Brussels variant only in Q&A.

---

## 3. Demo script (4 screens, ~2:00 of the 5:00 pitch)

Pitch runs: hook 0:20 → problem 0:40 → solution 0:40 → **demo 2:00** → impact 0:40 → ask 0:20. Screen 3's kettle moment is also used as the opening hook.

### Screen 1: "Je Piekbon" (the receipt) — 35 s
**On screen:** phone frame, WhatsApp-style message from Voltera for household "EV #1187" (open-data meter), month January.
- Headline: `Di 14 jan, 18:15–18:30: 8,4 kW`
- `Grote continue belasting (waarschijnlijk EV) + de rest van je huis`
- `Dit kwartier kost je €18,41 extra, verspreid over je volgende 12 facturen.`
- `Was de EV na 21:00 gestart: piek 4,5 kW, €0 extra.`
- Tiny chart: the day's 96 quarter-hours, peak bar highlighted.
- Button: `Antwoord JA: wij houden je onder 4,5 kW`
- Operator toggle (off-screen corner): "plant error". When on, the LLM draft says €9,10; the validator banner turns red: `LLM zei €9,10 · grootboek zegt €18,41 · geweigerd, sjabloontekst gebruikt`.

**Presenter says:** "Every month, every customer gets one sentence: which fifteen minutes cost them money, and how much. AI writes it. But AI doesn't get the last word. Watch: we planted a wrong number, and the validator checks every euro against the ledger and blocks it. Nothing reaches a customer that the maths hasn't signed. And there's one button: JA."

### Screen 2: "Jouw Piekpact" (the offer) — 30 s
**On screen:** same household.
- Cap slider (2,5–8,0 kW, step 0,5; default = suggested cap).
- Big number: `€2,99/maand` (recomputed per slider position).
- Line: `Je bespaart €221/jaar op capaciteit. Na je abonnement: +€185/jaar.`
- Chart (Recharts): 12 monthly peaks, grey = without Piekpact, blue = with controller, dashed line = cap. Clipped parts shaded red.
- Small print: `Prijs berekend op jouw eigen 15-minutenhistoriek. Gaat een apparaat dat je aan ons toevertrouwt toch over je plafond, dan betalen wij het verschil.`

**Presenter says:** "Your price isn't a table price. It comes from your own year of quarter-hours: how often you'd go over, by how much. Pick 4.5 kilowatts, it's €2.99 a month, and you keep €185 a year. And this product can't be compared on a price-per-kWh site."

### Screen 3: "Kwartierklok" (live) — 40 s
**On screen:** big ring = the current quarter-hour (sim clock at 10×, so a quarter-hour lasts 90 s). Inside: projected kW for this quarter-hour and `€ op het spel`. Beside it: live kW trace, this month's peak (4,5 kW), cap (4,5 kW), buttons `Start EV (7,4 kW)` and `Auto: aan/uit`. Bottom: guarantee ledger `Deze maand: €0,00 verschuldigd door Voltera`.
Sequence:
1. Jury member switches on the real kettle. Ring moves a little: `+0,44 kW · +€0,00`. Caption: `Alleen het kwartiergemiddelde telt.`
2. Presenter taps `Start EV`, auto **off**. Ring turns red: `Dit kwartier eindigt op 8,4 kW · +€18,41 · nog 11:40`.
3. Presenter flips auto **on**. EV power steps down live, projection falls to 4,4 kW, ring back to green, `€0,00`. Ledger stays €0. PiekLicht phone turns red then green (if built).

**Presenter says:** "The kettle you've been feeling guilty about: 0.44 kilowatts, zero euros. The EV: plus €18. Now Piekpact takes over: it slows the charger for a few minutes, the car is still full by seven, and the ledger says Voltera owes nothing, because we kept our promise."

### Screen 4: "Voltera-tweeling" (business case) — 35 s
**On screen:** left, sliders (all from `assumptions.json`, each with a source/[ASSUMPTION] tag): EV/HP share, uptake, fee, payout ratio, churn before/after, call deflection %, cost per call, bill-call share, WhatsApp opt-in, dongle cost/co-pay. Right, live totals: fee net of payouts, churn value, call savings, running costs, **net €/yr**, one-off hardware, MW of evening peak avoided. Toggle `Pessimistisch`. Footer: roadmap line for H2/H3.
Default result: **≈ €655k/yr net**, pessimistic **≈ €225k/yr**, **~39 MW** evening peak, customer **+€185/yr**.

**Presenter says (hands the laptop to the jury chair):** "Don't trust our uptake number. Set it yourself." Then: "Even at half our assumptions it pays back the hardware in year one, and call deflection alone covers the build. Next, the same engine powers the annual cheapest-formula notice with a regret refund."

---

## 4. Mock data needed (exact shapes)

### 4.1 Source: Fluvius open data (X9)
- Dataset: "Verbruiksprofielen digitale meters, elektriciteit, kwartierwaarden voor een volledig jaar", https://opendata.fluvius.be/explore/dataset/1_50-verbruiksprofielen-dm-elek-kwartierwaarden-voor-een-volledig-jaar/
- 2,400 meters, 8 segments × 300 (combinations of solar / heat pump / EV). **Verify column names at hour 0**; expected: meter ID, timestamp, offtake kWh, injection kWh, segment label. Download as CSV (the export API supports CSV/Parquet).
- A picks: 1 EV (no PV), 1 EV+PV, 1 HP household with clear 18:00–21:00 EV blocks and an 8+ kW January peak. Name them by open-data ID, e.g. "EV #1187".
- **Fallback if download fails:** synthetic generator (4.4), same schema, flagged `source: "synthetic"` and labelled on screen.

### 4.2 Normalised schema (TypeScript, `lib/types.ts`)
```ts
// One row per quarter-hour, local time Europe/Brussels, start of interval.
export type QuarterHour = {
  ts: string;          // "2025-01-14T18:15:00+01:00"
  importKWh: number;   // offtake in this 15 min (kW = kWh * 4)
  exportKWh: number;   // injection in this 15 min
};

export type Segment = "BASE" | "PV" | "HP" | "HP_PV" | "EV" | "EV_PV" | "EV_HP" | "EV_HP_PV";

export type Household = {
  id: string;                 // "EV-1187" (open-data ID)
  segment: Segment;
  source: "fluvius-open-data" | "synthetic";
  region: "Vlaanderen-referentie";
  series: QuarterHour[];      // 35,040 rows (35,136 in a leap year)
};

// Derived by the engine, cached to public/data/<id>.derived.json
export type MonthPeak = {
  month: string;              // "2025-01"
  peakKW: number;             // max(importKWh * 4) in the month
  peakTs: string;
  billedKW: number;           // max(2.5, peakKW)
  delegatedKW: number;        // part of the peak from large continuous load (EV/HP)
  controlledPeakKW: number;   // after controller replay at the chosen cap
};

export type ReceiptFacts = {  // the ONLY facts the LLM may use; validator checks against these
  household_id: string;
  month: string;
  peak_start: string;         // "2025-01-14T18:15"
  peak_end: string;           // "2025-01-14T18:30"
  peak_kw: number;            // 8.4
  prev_month_peak_kw: number;
  load_label: "grote continue belasting (waarschijnlijk EV)" | "grote continue belasting (waarschijnlijk warmtepomp)" | "korte pieken";
  extra_cost_eur: number;     // (peak_kw - prev_billed_reference_kw) * 4.72, incl. VAT
  shifted_peak_kw: number;    // peak if delegated load started after 21:00
  shift_saving_eur: number;
};

export type LlmReceipt = {
  sentences: { text: string; claims: { key: keyof ReceiptFacts; value: string | number }[] }[];
};

export type LiveState = {     // screen 3 + PiekLicht, served by /api/state
  simTimeS: number;           // seconds into current quarter-hour (0..900)
  baseKW: number;             // simulated house baseline, 1.0
  plugKW: number;             // real Shelly plug reading (kettle)
  evKW: number;               // 0..7.4, set by controller
  energySoFarKWh: number;
  projectedKW: number;
  monthPeakKW: number;        // 4.5 at demo start
  capKW: number;              // 4.5
  atStakeEur: number;
  light: "green" | "orange" | "red";
  ledgerOwedEur: number;
};
```

### 4.3 Tariff table (`public/data/tariffs-2026.json`)
Values labelled. Only the capacity rows are needed for screens 1–3.
```json
{
  "vatRate": 0.06,
  "capacity": {
    "unit": "EUR/kW/year excl. VAT",
    "reference_flanders_2026": 53.39,
    "range_2026": { "min": 51.99, "max": 60.53, "note": "Limburg lowest, West highest (callmepower.be / Fluvius)" },
    "minimumKW": 2.5,
    "billing": "average of the last 12 monthly 15-min peaks, each floored at 2.5 kW",
    "perKWMonthExclVAT": 4.45,
    "perKWMonthInclVAT": 4.72,
    "source": "callmepower.be/nl/energie/gids/tarief/capaciteitstarief ; fluvius.be capaciteitstarief"
  },
  "averageFlemishPeakKW": { "value": 4.24, "source": "Fluvius FAQ / VREG" },
  "annualBill2025_3500kWh": {
    "fixed": 1396, "variable": 1265, "dynamic": 1203,
    "source": "VREG price report RAPP-2026-07"
  },
  "allInEnergyPriceEurPerKWh": { "value": 0.30, "label": "[ASSUMPTION] energy + network + levies excl. capacity, only for the receipt's month total" },
  "evCharger": { "singlePhaseMinKW": 1.4, "typicalKW": 7.4, "label": "6 A min current x 230 V; 32 A x 230 V" }
}
```
**Per-DSO rows other than Limburg and West are not verified: the demo uses the Flemish reference €53.39 only.** If the jury asks, say "reference tariff; real product uses the customer's DSO area".

### 4.4 Synthetic fallback generator (only if 4.1 fails)
Per quarter-hour kW = base + evening + EV + HP − PV, then kWh = kW / 4.
- base: 0.25 kW night, 0.45 kW day, 1.1 kW 17:00–21:00, noise ±15% [ASSUMPTION]
- EV (EV segments): 7.4 kW blocks, start 17:45–19:00 on 60% of weekdays, 2–4 h, energy 8–20 kWh per session [ASSUMPTION]
- HP (HP segments): 1.5–3 kW, scaled by heating degree days, morning ramp 06:00–08:00 [ASSUMPTION]
- PV: 4 kWp, bell curve 08:00–18:00 (summer) / 10:00–15:00 (winter), ~950 kWh/kWp/yr [ASSUMPTION]
- Target: January EV-household peak ≈ 8.4 kW; annual offtake 3,500–6,000 kWh.

### 4.5 Precomputed business-case inputs (`public/data/assumptions.json`)
```json
[
  { "key": "customers", "value": 350000, "tag": "case" },
  { "key": "churnBase", "value": 0.18, "tag": "case" },
  { "key": "marginPerCustomer", "value": 100, "tag": "[ASSUMPTION]" },
  { "key": "cac", "value": 150, "tag": "[ASSUMPTION]" },
  { "key": "evHpShare", "value": 0.12, "tag": "[ASSUMPTION] lenses 10-15%" },
  { "key": "uptake", "value": 0.25, "pessimistic": 0.125, "tag": "[ASSUMPTION]" },
  { "key": "feePerYear", "value": 36, "tag": "model average, per-household" },
  { "key": "payoutRatio", "value": 0.30, "tag": "[ASSUMPTION]" },
  { "key": "churnSubscribers", "value": 0.10, "pessimistic": 0.14, "tag": "[ASSUMPTION]" },
  { "key": "callsPerCustomer", "value": 0.84, "tag": "0.6 [ASSUMPTION] x 1.40 (case)" },
  { "key": "billCallShare", "value": 0.60, "tag": "[ASSUMPTION]" },
  { "key": "deflection", "value": 0.25, "pessimistic": 0.125, "tag": "[ASSUMPTION] below vendor claims 20-75%" },
  { "key": "costPerCall", "value": 7, "tag": "[ASSUMPTION] EU range 2-8" },
  { "key": "llmCostPerReceipt", "value": 0.005, "tag": "[ASSUMPTION]" },
  { "key": "whatsappOptIn", "value": 0.40, "tag": "[ASSUMPTION]" },
  { "key": "whatsappCostPerMsg", "value": 0.05, "tag": "[ASSUMPTION]" },
  { "key": "dongleCost", "value": 40, "tag": "[ASSUMPTION]" },
  { "key": "dongleCoPay", "value": 15, "tag": "[ASSUMPTION]" },
  { "key": "peakReductionKW", "value": 3.9, "tag": "open data EV household 8.4 -> 4.5" }
]
```
Formulas (screen 4, show them on hover):
- subs = floor(customers × evHpShare × uptake / 1000) × 1000  (10,500 → 10,000; pessimistic 5,250 → 5,000)
- feeNet = subs × feePerYear × (1 − payoutRatio)
- churnValue = subs × (churnBase − churnSubscribers) × (marginPerCustomer + cac)
- callSavings = customers × callsPerCustomer × billCallShare × deflection × costPerCall
- running = customers × 12 × llmCostPerReceipt + customers × whatsappOptIn × 12 × whatsappCostPerMsg
- net = feeNet + churnValue + callSavings − running  → default ≈ €655k, pessimistic ≈ €225k
- hardware (one-off) = subs × (dongleCost − dongleCoPay)
- MW = subs × peakReductionKW / 1000 → ≈ 39 MW

Optional `segments.json` (SHOULD): per segment `{ segment, n, medianPeakKW, p10SavingEur, p50SavingEur, p90SavingEur, medianFeeEur }` computed over all 300 meters of each segment.

---

## 5. Engine logic (A)

**Capacity cost of a peak (receipt):** `extra_cost_eur = max(0, peak_kw − reference_kw) × 4.72`, where `reference_kw = max(2.5, prev_month_peak_kw)` [demo simplification; say "extra compared with last month"].

**Suggested cap:** 70th percentile of monthly peaks with delegated load removed, rounded up to 0.5 kW, min 2.5.

**Replay with controller (15-min data, screen 2):** per quarter-hour, `delegated = max(0, kW − rollingBaselineMedian)` inside detected EV/HP blocks (≥ 3.3 kW above baseline for ≥ 4 consecutive quarter-hours). Controlled `kW' = max(kW − delegated, min(kW, cap))`; the removed energy is pushed into the next quarter-hours where `kW' < cap`, before 07:00, so energy is conserved. Show "auto vol om 07:00: ja/nee".

**Per-household fee:** `expectedCredit = Σ_months max(0, controlledPeak − cap) × 4.72` (overshoot only from delegated load that couldn't be moved) + 5% controller-offline risk × uncontrolled overshoot; `fee/month = max(1.99, (expectedCredit / 0.7 + 12 ops) / 12)`, rounded to x.49 / x.99.

**Customer saving:** `(avg(billedKW before) − avg(billedKW after)) × 53.39 × 1.06` − fee × 12.

**Live controller (screen 3), every 1 s real = 10 s sim:**
- `energySoFarKWh += (baseKW + plugKW + evKW) × 10/3600`
- `tRemH = (900 − simTimeS) / 3600`
- `projectedKW = (energySoFarKWh + (baseKW + plugKW + evKW) × tRemH) / 0.25`
- `atStakeEur = max(0, projectedKW − monthPeakKW) × 4.72`
- Auto on and `projectedKW > capKW − 0.1`: `evKW = clamp((capKW × 0.25 − 0.025 − energySoFarKWh) / tRemH − baseKW − plugKW, 0, 7.4)`; if `evKW < 1.4` set 0.
- light: green if projected ≤ 2.5; orange if ≤ monthPeakKW; red otherwise.
- At quarter-hour end: if final kW > cap and the excess came from EV → `ledgerOwedEur += (final − cap) × 4.72`.
- Kettle check: 2.2 kW for 3 sim minutes (18 real s) → +0.44 kW on the quarter-hour. Tune baseline so kettle alone never beats 4.5 kW.

**Validator:** for each claim, the key must exist in `ReceiptFacts`, numbers must match within ±€0.01 / ±0.05 kW, the formatted nl-BE value must literally appear in `text`, and `text` must not contain any of `waterkoker|oven|kookplaat|droogkast|föhn|vaatwas` (X7). Any failure → red banner + deterministic template text.

---

## 6. Tech stack (fast for 2 devs)

| Layer | Choice | Why |
|---|---|---|
| App | **Next.js 14 (App Router) + TypeScript** | one repo, API routes for LLM and live state |
| Styling | **Tailwind CSS** | fast, consistent; phone frame via a simple rounded container |
| Charts | **Recharts** (bar/line); ring = hand-rolled SVG | Recharts is enough; SVG ring animates smoothly |
| Data prep | **Python + pandas** script in `scripts/prepare.py` (or Node if A prefers) → `public/data/*.json` | runs once; app only reads JSON |
| LLM | **Claude API** via `@anthropic-ai/sdk` in `app/api/receipt/route.ts`; model ID from env `CLAUDE_MODEL` (check the current ID at build time); key in `ANTHROPIC_API_KEY`, server-side only | structured JSON output with claims; the validator does the maths |
| LLM offline | `public/data/receipt-cache.json` with last good output per household | stage Wi-Fi fails |
| Live plug | **Shelly Plug S (Gen2/Gen3)** local RPC: `GET http://<ip>/rpc/Switch.GetStatus?id=0` → `apower` (W), polled 1×/s from `app/api/plug/route.ts` | no cloud, no auth; fallback key `K` |
| State | in-memory store in the API route + client polling every 500 ms | no DB needed |
| PiekLicht | second phone opens `/lamp` (full-screen colour from `/api/state`) | zero hardware cost |
| Run | `npm run build && npm start` on the stage laptop, Wi-Fi-independent; Vercel deploy as backup URL | |
| Language | UI copy in Dutch (Flemish), numbers nl-BE (`Intl.NumberFormat("nl-BE")`) | realism for a Belgian jury |

Suggested structure:
```
app/
  page.tsx              # screen switcher (keys 1-4), presenter hotkeys
  receipt/ offer/ live/ business/ lamp/
  api/receipt/route.ts  api/state/route.ts  api/plug/route.ts
lib/
  types.ts  capacity.ts  controller.ts  fee.ts  validator.ts  format.ts
public/data/
  EV-1187.json  EV-1187.derived.json  ...  tariffs-2026.json  assumptions.json  receipt-cache.json
scripts/prepare.py
```

Presenter hotkeys: `1–4` screens, `K` kettle, `E` start EV, `A` auto on/off, `P` plant LLM error, `R` reset quarter-hour, `X` pessimistic toggle.

---

## 7. Build order and checkpoints

| By hour | Checkpoint (must be true) |
|---|---|
| 1 | X4 answered (B); fact sheet frozen; open data downloaded or synthetic fallback chosen |
| 4 | 3 households as normalised JSON; monthly peaks correct (A checks one by hand) |
| 8 | Screens 1 and 2 render real numbers; fee model works |
| 12 | Screen 3 runs end to end with keyboard kettle; Shelly works or is dropped |
| 15 | LLM + validator + planted error work; cache written. **Go/no-go on SHOULD list** |
| 18 | Screen 4 done; fallback video recorded; full run offline |
| 21 | **Feature freeze.** Only bug fixes after this |
| 24 | 3 timed rehearsals done, each with one fallback deliberately triggered |

**Hour-0 X4 question (B):** does Voltera receive 15-min values by default from 1 Jan 2026, or only after requesting meetregime 3 per customer (VREG dashboard "digitale meters met geactiveerde kwartierwaarden")? The product works either way: subscribers opt in anyway. Only the reach of the free receipt changes, so adjust the call-deflection default on screen 4 if the answer is "opt-in only".
