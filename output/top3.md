# TOP 3, SHARPENED: Voltera (practice case)

Team: **B** = business, **A** = dev A (data + engine), **D** = dev B (UI), **G** = generalist (hardware, copy, fallbacks, rehearsal). Time: 24 h.
Source ranking: judge scores H1 3.62, H2 3.50, H3 3.13 (see `ranking.md`, `critique.md`).

---

## 0. Frozen fact sheet (one number per fact, X6)

Every idea below uses only these numbers. Anything not in this table is labelled [ASSUMPTION].

| Fact | Frozen value | Source |
|---|---|---|
| Capacity tariff, Flanders 2026 | **€53.39/kW/yr excl. VAT** reference (DSO range €51.99–60.53); **€56.59 incl. 6% VAT** | callmepower.be, Fluvius |
| Cost of 1 extra kW of monthly peak | €53.39 / 12 = **€4.45 excl. VAT = €4.72 incl. VAT**, spread over the next 12 bills (12-month rolling average) | derived |
| Minimum billed peak | **2.5 kW** | Fluvius |
| Average Flemish monthly peak | **4.24 kW** | Fluvius FAQ / VREG |
| 2025 average bill, 3,500 kWh | dynamic **€1,203**, variable €1,265, fixed €1,396 (dynamic **−€193** vs fixed, **−€62** vs variable) | VREG price report RAPP-2026-07 |
| Dynamic uptake, Flanders, end 2025 | **0.89%** of consumers | VREG market report 2025 |
| Supplier switching, Flanders 2025 | **18.94%** (562,481 households) | VREG leverancierswissels 2025 |
| Negative day-ahead hours, BE 2025 | **520** | CREG note Z3151 |
| Person-to-person energy sales, Flanders | **2,494** participants | VREG |
| Open 15-min data | **2,400 labelled Fluvius meters**, 8 segments × 300, one full year | opendata.fluvius.be |
| Kettle vs EV physics | 2.2 kW × 3 min = **0.44 kW** on a quarter-hour; EV 7.4 kW × 15 min = **7.4 kW** | derived |

**Voltera baseline [ASSUMPTION, shared by all three cases]**

| Item | Value | Note |
|---|---|---|
| Customers | 350,000 | case |
| Churn | 18% = **63,000 lost/yr** | case |
| Gross margin per customer | **€100/yr** [ASSUMPTION] | elec + gas |
| CAC to replace a customer | **€150** [ASSUMPTION] | comparator fee + welcome bonus |
| Value of 1 customer kept (yr 1) | **€250** | margin + avoided CAC |
| Calls before the rise | 0.6/customer/yr [ASSUMPTION] → 210k | |
| Calls now (+40%) | 0.84/customer/yr → **294k** | case |
| Share about bills/tariffs | 60% [ASSUMPTION] → **176k bill calls** | |
| Cost per call | **€7** [ASSUMPTION] (EU range €2–8) | → bill calls cost **€1.23M/yr** |
| EV + heat-pump households | 12% [ASSUMPTION] → **42k** | lenses quoted 10–15% |
| Solar households | 25% [ASSUMPTION] → **87.5k** | |

**Rules we obey everywhere:** no "avoided hedging premium" line (X2); never name a kettle or oven from 15-min data, only large, long, steady loads (EV, heat pump, boiler) (X7); every on-screen number traces to the Fluvius open dataset or the table above (X9).

**X4 (hour 0, B owns it):** does Voltera get 15-min values by default, or only after requesting meetregime 3 per customer? Each idea below is designed to survive the "opt-in only" answer; the impact is stated per idea.

---

## 1. H1 VOLTERA PIEKPACT (judge score 3.62)

### Name + killer one-liner
**Voltera Piekpact.** *"Other suppliers explain your bill. Voltera signs for it: pick your kW, we keep you under it, or we pay."*

### Problem
- One quarter-hour per month sets the capacity charge. The customer never sees it and finds out weeks later. An EV charging at 18:00 on top of cooking can push the monthly peak from ~4.5 kW to 8.4 kW, which costs **€221/yr** incl. VAT.
- People worry about the wrong appliance. The kettle adds 0.44 kW, the EV adds 7.4 kW.
- These bills drive the +40% calls. Price is the only thing customers compare on, so 18% leave.

### Solution (four steps, one product)
1. **Explain (free, all customers):** a monthly footnoted **Piekbon** (peak receipt). It names the peak quarter-hour, its kW, its € cost, and only large steady loads ("Tue 14 Jan 18:15, 8.4 kW, large continuous load, probably EV"). An LLM writes the text, a **deterministic validator** recomputes every number and blocks mismatches. Sent via WhatsApp or as one printed line on the paper bill. Reply **JA** to subscribe.
2. **Price:** a **per-household monthly fee**, computed from that customer's own 15-min history (how often and by how much they would exceed the cap after control).
3. **Enforce:** a P1 dongle plus a quarter-hour controller projects the quarter-hour average live and slows down the loads the customer hands over (EV first, then boiler or heat pump). It releases them at the next quarter-hour.
4. **Guarantee:** if a handed-over load still pushes the monthly peak over the cap, Voltera credits (peak − cap) × €4.72 on the next bill. It is a tariff credit, not insurance.
- **No-app option:** **PiekLicht**, a lamp that turns red when a new peak is about to be set, for low-digital households.
- **EV extra:** "Charge to 80% by 07:00: locked price, peak guaranteed".

### Why us (Voltera)
- Voltera is the only party that holds the 15-min data **and** the bill, so it can price the guarantee per household and pay it out as a bill line. HomeWizard, Smappee and Tibber can't credit a bill.
- Voltera already sells EV, solar and battery packages. That is the pilot base with devices already installed.
- A supplier's own money on the line makes its incentive match the customer's: Voltera earns more when the peak stays low.

### Why now
- 2026 is a full year of 12-month-average capacity billing at €53.39/kW. The monthly bill hurts now.
- 15-min values are on the digital meter, and P1 dongles expose `average_power_15m_w` locally.
- EV and heat-pump adoption keeps pushing evening peaks up. Grid operators want exactly this peak reduction.

### Back-of-envelope business case (350k customers)

| Line | Math | €/yr |
|---|---|---|
| Subscribers | 42k EV/HP households × 25% uptake [ASSUMPTION] = **~10.5k**, rounded to **10k** | |
| Fee revenue | 10k × €36/yr (€2.99/month average; per-household price) | 360k |
| Guarantee payout reserve | 30% loss ratio [ASSUMPTION; controller keeps real payouts lower] | −108k |
| Churn in subscriber segment | 18% → 10% [ASSUMPTION] = 800 kept × €250 | 200k |
| Call deflection (receipt, all customers) | 176k bill calls × 25% [ASSUMPTION, below every vendor claim] × €7 | 308k |
| Receipt running cost | LLM 4.2M receipts × €0.005 ≈ €21k; WhatsApp 40% opt-in × 350k × 12 × €0.05 ≈ €84k | −105k |
| **Net recurring** | | **≈ €655k/yr** |
| One-off hardware | 10k dongles × €40, customer co-pays €15 [ASSUMPTION] | −250k (once) |
| **Pessimistic toggle** | uptake 12.5% (5k subs), deflection 12.5%, churn 18→14%: 126k + 50k + 154k − 105k | ≈ €225k/yr |

- **Customer:** EV household 8.4 → 4.5 kW = 3.9 kW × €53.39 × 1.06 = **€221/yr**, minus €36 fee = **~€185/yr net**. Average non-EV household moving 4.24 → 3.5 kW saves ~€42/yr on the receipt alone (no subscription needed).
- **Grid:** 10k × 3.9 kW = **~39 MW** of evening peak held off the Fluvius grid.
- **If X4 = opt-in only:** the free receipt reaches only opted-in customers, so call deflection shrinks. Subscribers opt in anyway (they need the dongle and consent), so fee + churn lines hold. Drive the opt-in from the JA reply on the paper bill.

### Hour-by-hour MVP / demo plan (24 h)

| Hours | A (data + engine) | D (UI) | G (generalist) | B (business) |
|---|---|---|---|---|
| 0–1 | Download Fluvius open dataset; pick 3 households (EV, EV+PV, HP) | Next.js + Tailwind scaffold, design tokens | Buy/borrow Shelly plug + kettle; test venue Wi-Fi | **Resolve X4**; freeze fact sheet |
| 1–4 | Normalise to `QuarterHour[]`; monthly peak finder; capacity cost calc | Screen 1 layout: phone frame + receipt card | Dutch copy for receipt (plain, "probably", no kettle claims) | Assumption table in `assumptions.json` |
| 4–8 | Per-household fee model + year replay with/without controller | Screen 2: cap slider, clipped-peak chart (Recharts) | Wire Shelly local API; fallback "kettle" key | Competitor gap table (HomeWizard, Engie, Tibber, Eneco) |
| 8–12 | Quarter-hour projection + controller sim (EV throttle); guarantee ledger | Screen 3: countdown ring, live kW, ledger | Second phone as PiekLicht (full-screen colour) | Business-case model; pessimistic case |
| 12–15 | LLM receipt route + deterministic validator + planted-error toggle | Receipt text rendering; validator red banner | Record fallback videos of screens 1–3 | Insurance/legal answer; pilot plan |
| 15–18 | Precompute Tweeling segment JSON | Screen 4: business-case sliders | End-to-end test on stage laptop, offline mode | Pitch script v1, 5:00 timed |
| 18–21 | Bug fixes, offline cache for LLM output | Polish, mobile widths, transitions | Rehearsal 1 + 2 (timer, fallbacks triggered on purpose) | Q&A sheet; slide deck |
| 21–23 | **Feature freeze.** Only fixes | Freeze | Rehearsal 3 | Final numbers check vs fact sheet |
| 23–24 | Stand by | Stand by | Pack hardware, charge phones | Final run-through |

### 3 hardest jury questions
1. **"Isn't this just a HomeWizard dongle plus a coupon?"**
   The dongle is a commodity and we say so. What nobody sells is a kW promise backed by the supplier's money, priced per household from 15-min history, paid as a bill credit, and sold at the moment of pain via the receipt. HomeWizard shows a peak; it can't credit your bill. The product also can't be compared on price per kWh, which is what kills churn.
2. **"Is a guarantee insurance? Do you need a licence?"**
   It covers only overshoot caused by loads Voltera itself controls. That is a service-level credit on our own tariff (like an SLA credit), not cover against a random event. It is structured as a tariff option with a bill credit. We have flagged it for legal review before the pilot [ASSUMPTION], and we launch only on Voltera's own EV and battery packages, where we control the device.
3. **"Your numbers depend on uptake and churn assumptions. Why should I believe €0.65M?"**
   Every assumption is a slider on screen 4; move it. The pessimistic case is ~€225k/yr, and call deflection alone (€308k at 25%, below every vendor claim) pays for the build. The pilot is designed to measure exactly these: A/B on 10k receipts (calls per 1,000 bills) and 1,000 Piekpact subscribers (churn vs control).

### Pitch storyline (5:00)
- **Hook (0:20):** A jury member switches on a kettle. The ring barely moves: +0.44 kW, €0. "You've been blaming the wrong appliance."
- **Problem (0:40):** One quarter-hour a month sets your network bill. Nobody sees it. Calls +40%, churn 18%, and people compare only on price.
- **Solution (0:40):** Piekpact: we explain your peak for free, then we sign for it. Pick your kW, we keep you under it, or we pay.
- **Demo (2:00):** Screen 1 receipt + validator catching a planted LLM error → Screen 2 your personal price → Screen 3 the simulated EV turns the ring red, +€18.40, controller holds the cap, ledger €0 owed → PiekLicht turns red on the table.
- **Impact (0:40):** Screen 4: the jury chair moves the uptake slider. €185/yr per EV household, ~€0.65M/yr for Voltera, ~39 MW off the evening grid.
- **Ask (0:20):** A 1,000-household pilot on Voltera's own EV-package customers in one Fluvius region, 6 months, KPIs: calls per 1,000 bills and churn vs control.

---

## 2. H2 JAARCHECK MET SPIJTGARANTIE (judge score 3.50)

### Name + killer one-liner
**Jaarcheck met Spijtgarantie.** *"Every Belgian supplier must tell you once a year which formula is cheapest. We prove it on your own quarter-hours, and if we're wrong, we pay."*

### Problem
- Dynamic was €62 cheaper than variable and €193 cheaper than fixed in 2025, yet uptake is 0.89%. The blocker is fear of regret, not information.
- V-test, Pieker and EnergyID already replay 15-min data (X1), so a replay alone is not new.
- The legally required annual "cheapest formula" notice (Consumentenakkoord) is today a generic letter nobody acts on.

### Solution
1. The mandatory annual notice is re-priced on the customer's real 15-min year (deterministic engine, 35,040 quarter-hours × day-ahead prices).
2. **P90 filter:** the offer goes only to customers whose predicted saving is above €0 in 90% of price scenarios. Internal targeting may use asset detection (EV/solar) but the customer is never told "we detected".
3. **One tap** switches to dynamic with a **12-month regret refund measured against variable** (not fixed), **capped at €100**. Variable also follows the market, so refunds are much less likely to all fall due in the same year.
4. **Dynamic-lite** for the hesitant: Zonne-uren, three fixed time blocks.
5. A monthly one-line **"staying paid off"** shadow bill keeps the customer.

### Why us (Voltera)
- The obligation already exists, so the channel costs nothing.
- Voltera can pay a refund on its own bill; a comparison site can't.
- The engine is deterministic, so it is outside the AI Act high-risk scope and easy for VREG to audit.

### Why now
- 520 negative-price hours in 2025 and quarter-hour day-ahead settlement since 1 Oct 2025 widen the gap between profiles.
- EU 2024/1711 requires clear risk information on dynamic contracts; the replay is that disclosure.

### Back-of-envelope business case

| Line | Math | €/yr |
|---|---|---|
| Eligible (digital meter + 15-min data) | 80% × 350k = 280k [ASSUMPTION; **X4 may shrink this**] | |
| Pass P90 filter | 30% [ASSUMPTION] → **84k offers** | |
| Switch | 15% [ASSUMPTION; Ofcom best-tariff notices moved renewals 10–13 pp] → **12.6k** | |
| Churn among switchers | 18% → 12% [ASSUMPTION] = 756 kept × €250 | 189k |
| Calls avoided | 84k × 0.1 "am I on the right tariff" calls × €7 | 59k |
| Regret refunds, normal year | 8% × 12.6k × €40 average | −40k |
| **Margin cannibalisation (X3, shown openly)** | 50% of switchers come from fixed = 6.3k × €15 net lost margin [ASSUMPTION: half of the 1–3 c/kWh premium is hedging cost that disappears] | −95k |
| **Net, normal year** | | **≈ €113k/yr** |
| Upside, soft | Honest notice lowers churn 1 pp among the 71k offered who don't switch: 714 × €250 | +179k |
| **Stress year (2022-type)** | 50% × 12.6k × €100 cap = −€630k refunds | **≈ −€477k** |

- **Customer:** −€62/yr vs variable on average (VREG); flexible EV/solar profiles more [ASSUMPTION].
- **Honest verdict:** a regulator-friendly retention tool, not a profit engine. Its value is defensive: customers who would leave for a dynamic competitor get the cheapest formula at Voltera.

### Hour-by-hour MVP / demo plan (24 h)

| Hours | A (data + engine) | D (UI) | G (generalist) | B (business) |
|---|---|---|---|---|
| 0–1 | Fetch Fluvius dataset + ENTSO-E 2025 BE day-ahead prices to JSON | Scaffold | Ask a mentor to download their Mijn Fluvius CSV (with written consent) | **X4**; freeze facts; confirm Consumentenakkoord wording |
| 1–6 | Tariff engine: variable vs dynamic, per quarter-hour, incl. capacity | Annual-notice letter layout (paper + phone) | Dutch letter copy | Assumption table |
| 6–10 | Scenario generator (bootstrap price years) → P10/P50/P90 saving | Racing cumulative € lines, worst/best weeks | CSV upload flow, all local in browser | Cannibalisation + stress-year model |
| 10–14 | Refund ledger with €100 cap; Zonne-uren block tariff | "Switch with guarantee" certificate; "not for you, stay put" state | Record fallback videos | Business-case slide |
| 14–18 | LLM 3-sentence summary from result JSON + validator | Monthly "staying paid off" line | Test on 5 open-data meters incl. a loser | Pitch v1 |
| 18–21 | Fixes, offline cache | Polish | Rehearsals 1–2 | Q&A sheet |
| 21–24 | Freeze | Freeze | Rehearsal 3, pack | Final numbers check |

### 3 hardest jury questions
1. **"V-test already does this. What's new?"**
   V-test compares. It doesn't switch you, and it doesn't pay if it's wrong. We turn a legal obligation into a one-tap switch with a refund, sent only to customers the maths says will win.
2. **"What happens in a 2022-type year?"**
   We benchmark against variable, not fixed, so both sides move with the market. We cap at €100 and pre-filter on P90. Worst case ~€630k refunds, shown on the slide, which is the cost of ~2,500 lost customers. Cohorts are repriced yearly.
3. **"You're moving customers off fixed contracts, where you earn more. Why would Voltera do this?"**
   We show it: about −€95k/yr. The alternative is that they leave for the €193 anyway; 18.94% of Flemings switched last year. Keeping them on a lower margin beats €150 to buy a replacement.

### Pitch storyline (5:00)
- **Hook:** Hold up a real annual notice letter. "The law forces every supplier to send this. Nobody reads it."
- **Problem:** Dynamic saved €193 vs fixed in 2025; 0.89% took it. Fear, not information.
- **Solution:** The letter becomes the product: your own quarter-hours, one tap, and a refund if we're wrong.
- **Demo:** Drop in a mentor's CSV → two lines race → "−€214, worst month +€9" → switch certificate. Then an open-data customer where the answer is "stay put".
- **Impact:** Uptake 0.89% → ~4.5% (3.1k + 12.6k); churn down among switchers; stress case shown honestly.
- **Ask:** Pilot the 2027 annual notice for one customer cohort (20k letters), measure switch rate and refund cost.

---

## 3. H3 FAMILIESTROOM (judge score 3.13)

### Name + killer one-liner
**Familiestroom.** *"Sell your midday solar to your mum at the price you pick. Voltera does the Fluvius paperwork, and her bill stops surprising you."*

### Problem
- Solar owners inject for a few cents and buy back at ~30 c; on dynamic contracts injection can go negative.
- Flanders allows a **person-to-person sale** (not free "sharing") between two households with digital meters, but only 2,494 people use it because the paperwork is heavy.
- Older parents are often the most confused bill payers, and an adult child already handles it informally.

### Solution
1. A family **sale** flow: invite by phone number; both consent; a simulation matches both 15-min curves before signup; Voltera files the Fluvius registration; the two parties set the price and Voltera settles it on both bills as a free service (X5).
2. The VREG rule that both parties **for now** need the same supplier brings the second household to Voltera: acquisition plus legal lock-in.
3. **Bill delegation:** the adult child manages the parent's advance, payment plan and a settlement pot (auto-adjust advance so the annual settlement never surprises). No presence monitoring.
4. Optional PiekLicht at the parent's house.

### Why us (Voltera)
- Voltera sells the solar panels, so it has the producers. The same-supplier rule is an advantage only a supplier can use.
- Voltera sees both curves and both bills, so it can match and settle.

### Why now
- Injection value is collapsing (520 negative hours) and self-consumption without a battery is ~30–40%.
- The sale framework is live; the product layer on top of it is empty.

### Back-of-envelope business case

| Line | Math | €/yr |
|---|---|---|
| Solar customers | 87.5k [ASSUMPTION] | |
| Pairs | 5% uptake [ASSUMPTION] → **4.4k pairs** | |
| New households | 50% of receivers not yet Voltera [ASSUMPTION] → **2.2k new customers** | |
| Margin from new customers | 2.2k × €100 | 220k |
| CAC avoided (one-off) | 2.2k × €150 vs comparator channel | 330k (yr 1) |
| Churn among pair members | 8.8k × (18% → 9%) [ASSUMPTION] × €250 | 198k |
| Fewer calls from parents | 4.4k × 0.4 calls × €7 | 12k |
| Onboarding + Fluvius admin | 4.4k × €25 [ASSUMPTION] | −110k (yr 1) |
| **Year 1** | | **≈ €650k** |
| **Recurring** | | **≈ €430k/yr** |
| **Pessimistic** | 2% pair uptake, 30% new receivers, churn 18→13% | ≈ €120k/yr |

- **Customer:** ~€26–40/yr per side (650–875 kWh matched at a few cents' spread; network costs still apply to the receiver). Say this honestly; the value is family and certainty, not savings.

### Hour-by-hour MVP / demo plan (24 h)

| Hours | A (data + engine) | D (UI) | G (generalist) | B (business) |
|---|---|---|---|---|
| 0–1 | Pick a PV meter + a non-PV daytime-heavy meter from the open dataset | Scaffold two-phone layout | Check VREG/Fluvius sale rules (same supplier, digital meters, Flanders) | **X4**; freeze facts |
| 1–6 | Quarter-hour matching engine: min(surplus, demand) per slot, € split at chosen price | Invite + consent flow | Copy for both phones (child, parent) | Assumption table |
| 6–10 | Monthly ledger, season view (why winter is small) | Quarter-hour flow animation, sunny-day slider | Registration mock screen, clearly labelled | Business case, pessimistic case |
| 10–14 | Settlement pot: advance vs real cost, adjust proposal | Delegation view: child manages mum's advance | Record fallback videos | Vulnerable-customer angle, GDPR note (no monitoring) |
| 14–18 | Aggregate: pairs × kWh × churn → € | Business-case slide | End-to-end test | Pitch v1 |
| 18–24 | Fixes → freeze | Polish → freeze | Rehearsals ×3 | Q&A sheet, final check |

### 3 hardest jury questions
1. **"€30 a year? So what?"**
   Agreed, it's small for the customer, and we don't sell it as savings. For Voltera it's two households per contract, one of them new, held together by a rule only a supplier can use. That's ~€430k/yr recurring on our assumptions.
2. **"The same-supplier rule is 'for now'. What if it goes?"**
   Then the lock-in weakens, but delegation and the settlement pot still hold the parent, and the match engine plus paperwork service is still the easiest way to do it. We would also lose the acquisition effect, so we show the pessimistic case.
3. **"Isn't recruiting mum a pushy sales tactic?"**
   Mum pays less for energy, gets a bill her child manages, and there is no monitoring of her presence or habits. Both consent separately, and either can end it at any time.

### Pitch storyline (5:00)
- **Hook:** "Your roof sells power for 2 cents at noon. Your mother pays 30 cents three streets away."
- **Problem:** Solar is wasted, sales are legal but unused, and parents' bills confuse the family.
- **Solution:** Familiestroom: a family sale Voltera sets up in one tap, plus the child managing mum's bill.
- **Demo:** Two phones; sunny October day slider; kWh and € flow; monthly card; the child adjusts mum's advance.
- **Impact:** 2 households per contract, ~€430k/yr, local solar used locally.
- **Ask:** Pilot with 500 solar-package customers and their families.

---

## RECOMMENDATION

Build and pitch **H1 Voltera Piekpact**: it has the highest judge score (3.62), the strongest live demo (kettle vs EV, validator catching the LLM, jury-controlled business case), and the strongest pessimistic case of the three (~€225k/yr) with no exposure to a price-spike year. It answers three of the four symptoms directly (calls through the free receipt, churn through a product that can't be compared on price per kWh, peaks through control), and it stays robust if X4 turns out to be "opt-in only", because paying subscribers opt in anyway. H2 is the natural next arm on the same engine, but its net value is thin (~€113k/yr) and turns negative in a spike year, so it gets one roadmap sentence ("same engine, next: the annual notice with a regret refund"), not demo time. H3 is the best emotional beat but the weakest mechanism to demo live, so keep it as a 15-second "and for solar families" line at most. Spend the first hour freezing the fact sheet and resolving X4, and freeze features at hour 21 so the last three hours go to rehearsal, since 20% of the score is the pitch.
