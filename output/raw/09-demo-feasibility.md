# Lens: 09-demo-feasibility

**Lens:** what 2 devs + 1 generalist + 1 business person can build in 24h and show live. Every idea is built so that its demo is the wow moment, and every number on screen comes from real public data rather than random mock data.

## Demo ammunition: real, free, and usable tonight (cited)

| Asset | What it gives us | Source |
|---|---|---|
| **Fluvius open data: 2,400 anonymised digital meters, 15-min values, full year**, **labelled** by segment (300 each: solar, no solar, heat pump ± solar, EV ± solar, ...) | Real household curves instead of made-up ones. The labels also let us train a model. | [opendata.fluvius.be](https://opendata.fluvius.be/explore/dataset/1_50-verbruiksprofielen-dm-elek-kwartierwaarden-voor-een-volledig-jaar/), [data.europa.eu](https://data.europa.eu/data/datasets/1_50-verbruiksprofielen-dm-elek-kwartierwaarden-voor-een-volledig-jaar?locale=nl) |
| Customer's own 15-min CSV via Mijn Fluvius ("Historiek downloaden", itsme login) | A jury member could load their *own* data live | [fluvius.be/kwartierwaarden](https://www.fluvius.be/nl/factuur-en-tarieven/kwartierwaarden), [qgrid.be guide](https://www.qgrid.be/kwartierverbruik-downloaden-mijn-fluvius) |
| Pilot path: Fluvius API for energy service providers (customer mandate via Mijn Fluvius) | "Mock today, real API in the pilot" is credible | [partner.fluvius.be](https://partner.fluvius.be/nl/energiedienstverleners) |
| Belgian day-ahead prices (ENTSO-E Transparency API, `entsoe-py`) | Real 2025 hourly prices for dynamic-tariff replays | [Elia](https://www.elia.be/en/grid-data/transmission/day-ahead-reference-price), [entsoe-py](https://github.com/EnergieID/entsoe-py) |
| Capacity tariff 2026: ~€53.39/kW/yr excl. VAT (€4.45/kW/month), 2.5 kW minimum, varies by region (€51.99–60.53) | Exact euro value of a peak | [callmepower.be](https://callmepower.be/nl/energie/gids/tarief/capaciteitstarief), [Fluvius FAQ](https://www.fluvius.be/nl/veelgestelde-vragen/capaciteitstarief-gezinnen-kleine-ondernemingen) |
| Average Flemish monthly peak 4.24–4.37 kW, about €231–239/yr | Baseline for "average household" | [Test-Aankoop](https://www.test-aankoop.be/woning-energie/gas-elektriciteit-mazout-pellets/antwoord-van-expert/capaciteitstarief-in-vlaanderen), [callmepower piekvermogen](https://callmepower.be/nl/energie/gids/tarief/piekvermogen) |
| HomeWizard P1 dongle local API exposes `active_power_w`, `average_power_15m_w`, `monthly_power_peak_w` | Live hardware demo, same fields a real customer would have | [HA community](https://community.home-assistant.io/t/homewizard-energy-wi-fi-p1-meter-capacity-tarif-captar/524733), [HomeWizard API docs](https://api-documentation.homewizard.com/docs/v2/measurement/) |
| 2025: dynamic contract €1,203 vs fixed €1,396 (**−€193**) vs variable €1,265; 520 negative-price hours; **29,000 prosumers paid to inject**; solar capture rate 54%; average self-consumption value €468.69 | Every figure in the business case | [Solar Magazine on VNR price report](https://solarmagazine.nl/nieuws-zonne-energie/i43706/vnr-dynamisch-energiecontract-nog-altijd-goedkoopst-29-000-vlamingen-betalen-voor-terugleveren), [VNR RAPP-2026-07](https://www.vlaamsenutsregulator.be/publicaties/rapp-2026-07) |
| Dynamic contracts: 20,552 at end of 2025 = **0.89%** of consumers (8,337 in 2024) | "Uptake is tiny even though it saves €193" | [VRT](https://www.vrt.be/vrtnws/nl/2025/04/24/prijzenrapport-vreg/), [Solar Magazine](https://solarmagazine.nl/nieuws-zonne-energie/i43706/vnr-dynamisch-energiecontract-nog-altijd-goedkoopst-29-000-vlamingen-betalen-voor-terugleveren) |
| Switching 2025: 18.94% of Flemish households (562,481) | Voltera's 18% churn is the market norm, so churn is the fight | [VNR leverancierswissels 2025](https://www.vlaamsenutsregulator.be/nieuws-en-persoverzicht/leverancierswissels-2025) |
| CAC €75–200 per dual-fuel customer; CLV about €200–300 | Value of 1 pp less churn | [net2grid](https://www.net2grid.com/post/energy-comparison-websites-friend-or-foe-of-the-energy-supplier) |
| Contact cost: EU-27 average €3.71 per 7-min contact; €2–8 per contact in Europe | Value of a deflected call | [yoummday](https://www.yoummday.com/blog/2026/08/26/call-center-costs/), [Sono](https://callsono.com/blog/cost-per-contact-ai-vs-human/) |
| Brussels (Sibelga) has **no capacity tariff** | The capacity-tariff features are Flanders-only; Brussels gets day/night + dynamic (allowed since June 2025) | [Ayvens](https://www.ayvens.com/en-be/leasing/capacity-tariff/), [VRT](https://www.vrt.be/vrtnws/en/2025/06/02/dynamic-electricity-tariffs-possible-in-brussels-from-1-june/) |

**The physics behind the demos.** The capacity tariff bills the **15-minute average**, and the monthly bill uses the rolling average of the last 12 monthly peaks. So:
- **1 extra kW of peak in one month costs €53.39 / 12 = €4.45 excl. VAT**, spread over the next year.
- A **2.2 kW kettle for 3 minutes adds only 2.2 × 3/15 = 0.44 kW** to the quarter-hour. A **7.4 kW EV charger for the full 15 minutes adds 7.4 kW**. The kettle myth is wrong; the EV is what drives the peak.
- A quarter-hour peak **builds up over up to 15 minutes before it is locked in**. That makes it the only line on the energy bill a customer can see coming and still prevent.

---

## 1. SOLID: "De Kwartierklok" (the Quarter-Hour Clock): a live peak countdown with an undo button

**Pitch:** You get a 15-minute warning, in euros, before a peak lands on your bill, plus one tap that prevents it.

**Problem → solution**
- Problem: customers learn about their peak weeks later on the bill. Nobody understands that only the 15-min *average* counts, so people worry about kettles and ignore the EV.
- Mechanism: Voltera ships a P1 dongle (HomeWizard-type, local API) to Flemish customers with an EV, heat pump, or peak above 5 kW. The app reads `average_power_15m_w` every 10 s and projects where the current quarter-hour will end: `projected = (energy_so_far + current_power × remaining_time) / 15 min`. If `projected > this month's peak`, it shows **"This quarter-hour will cost you +€X on your bill"**, where X = (projected − current month peak) × €4.45 × 1.06 VAT, with a countdown ring. There is one button: **"Pause EV charging for 10 min"**, sent through the charger's API (OCPP/cloud API [ASSUMPTION: works for the top 3 charger brands in BE]). Opt-in auto mode: "never let my EV set a new peak."
- **Not banned push #4:** this is not a "cheap hours" nudge. It is a closed-loop, real-time *peak* control with an exact euro price and an action attached.

**Target user:** Flemish households with an EV or heat pump (the Fluvius dataset segments exist because these are the peak drivers). [ASSUMPTION] 10–15% of Voltera's Flemish base, about 30–45k households.

**Why now:** the capacity tariff has been in force since 2023. The local P1 API with 15-min averages and a monthly peak field is standard on consumer dongles ([HA thread](https://community.home-assistant.io/t/homewizard-energy-wi-fi-p1-meter-capacity-tarif-captar/524733)). EV home charging keeps growing.

**Money (show the math)**
- Customer: an EV household peaking at 8.4 kW (1 kW baseline + 7.4 kW charger) vs capped at 4.5 kW = 3.9 kW × €53.39 × 1.06 = **€221/yr saved**. That beats the €193 dynamic-vs-fixed gap by itself.
- Voltera: dongle about €30–40 [ASSUMPTION retail price], subsidised in exchange for a 2-year contract. If churn in this segment drops from 18% to 13% [ASSUMPTION]: 35k × 5% = 1,750 customers kept × €125 average CAC avoided ([net2grid](https://www.net2grid.com/post/energy-comparison-websites-friend-or-foe-of-the-energy-supplier)) = **€219k/yr** against €1.2M one-off hardware (35k × €35). Payback about 5.5 years on churn alone. With a dongle co-paid by the customer at €15: payback about 3 years. This is weak alone and strong combined with #2 and #4, because the dongle is also the flex/dynamic enabler.
- Grid: 35k × 3.9 kW = **~136 MW** of evening peak removed [ASSUMPTION all EVs would otherwise overlap]. This is the argument for Fluvius.

**Demo concept (the wow): a physical kettle on stage**
1. On the table: a kettle and a hair dryer on a Shelly Plug (local HTTP API `apower`) or a HomeWizard energy socket. The laptop adds a simulated house baseline plus a simulated 7.4 kW EV.
2. A jury member turns on the kettle. The ring barely moves: **"+0.44 kW, +€0.00, it's the 15-min average."** Myth busted live.
3. The simulated EV starts. The ring turns red: **"This quarter-hour will end at 8.4 kW, +€17.36 on your bill. 11:40 left."**
4. Tap "Pause EV". The projection drops back to 4.1 kW and shows €0.
- Build: 1 dev × 8h (plug polling + projection + UI), 1 dev × 3h (EV sim + fallback replay). Fallback: a recorded Fluvius EV profile replayed at 60× speed if the venue Wi-Fi fails.

**Biggest risk:** hardware cost and installation friction at 350k scale. The P1 port must be activated at Fluvius (customer does it in Mijn Fluvius) [ASSUMPTION ~1 day]. Fix: target only the ~10% with peaks above 5 kW, where the savings are €150+.

---

## 2. SOLID: "Herspeel je jaar" (Replay your year) on the jury's own meter data

**Pitch:** Drop in your Fluvius CSV. In 5 seconds you see what your last 12 months *would have cost* on four Voltera setups, down to the quarter-hour.

**Problem → solution**
- Problem: dynamic uptake is 0.89% even though dynamic was €193 cheaper than fixed on average in 2025. Customers can't calculate *their* case, and the downside feels unlimited.
- Mechanism: a deterministic billing engine, not an LLM, takes 35,040 quarter-hour rows × 2025 hourly Belgian day-ahead prices (ENTSO-E) × Fluvius 2026 grid tariffs × capacity tariff and re-bills four scenarios:
  A) current fixed, B) dynamic as-is, C) dynamic + EV/dishwasher shifted by the rules from idea 1, D) C + 5 kWh battery (simple greedy dispatch).
  The output is four annual bills plus the **worst single month** (the "regret check"). An LLM writes a 3-sentence plain-Dutch summary from the result JSON only.
- Other lenses turn this into a guarantee ("Spijtvrij Dynamisch", "Schaduwfactuur"). My point is that **the engine is the same code as the guarantee's back-test**, so the demo *is* the product.

**Target user:** switch-considering customers (the 18.94% who switch each year), prosumers (29k paid to inject in 2025), and Voltera's sales team (as an acquisition tool on the V-test audience, [1.36M V-test uses in 2025](https://www.vlaamsenutsregulator.be/nieuws-en-persoverzicht/leverancierswissels-2025)).

**Why now:** customers can already download 15-min CSVs; the day-ahead API is free; negative-price hours hit 520 in 2025, so the scenario gap is larger than ever.

**Money**
- Customer: −€62 to −€193/yr going to dynamic (VNR 2025 averages), plus capacity savings in scenario C.
- Voltera: move 5% of the base (17,500) to dynamic. [ASSUMPTION] Dynamic customers carry their own price risk, so Voltera avoids a hedging/risk premium of about €25/customer/yr: **€437k/yr**. If dynamic + replay customers churn 5 pp less [ASSUMPTION]: 875 × €125 = **€109k/yr**. Total **≈ €550k/yr**.
- Acquisition: the replay as a lead magnet. If 1% of 1.36M V-test users try it and 10% convert: 1,360 new customers × €125 CAC saved vs comparison-site channel = **€170k/yr**.

**Demo concept:** the night before, ask one jury member or a mentor to download their Mijn Fluvius CSV (60 s with itsme), with explicit consent and processed locally in the browser only. On stage: drag, drop, and four bills fly out. Fallback: pick any of the 2,400 real open-data meters ("EV + solar household #1187"). The line on screen: **"Your 2025 on dynamic: −€214. Your worst month: February, +€9."**
- Build: dev A 8h engine (Python/pandas or TypeScript in the browser so nothing leaves the laptop, which makes a strong GDPR point); dev B 4h UI. ENTSO-E prices pre-fetched to JSON.

**Biggest risk:** duplicated by other teams and by existing tools (Pieker already analyses Fluvius CSVs for purchase decisions, [pieker.be](https://pieker.be/gids)). The differentiator must be that Voltera acts on the result (one-tap switch plus guarantee), not the analysis itself.

---

## 3. SOLID: "Factuur met voetnoten" (the Footnoted Bill): every euro links to the quarter-hour that caused it

**Pitch:** A bill where every amount has a footnote you can tap to see the moment you spent it. It's written by AI and checked by maths, so it can't hallucinate.

**Problem → solution**
- Problem: support calls are up 40%, mostly "why is this amount different?". Explanations arrive late, generic, and in tariff jargon.
- Mechanism: 
  1. The engine from #2 decomposes the monthly bill into drivers: energy by time band, capacity (with the exact peak quarter-hour), injection, and taxes.
  2. An LLM writes 4–6 plain sentences with **structured citations** (`{claim, value, source_rows}`).
  3. A **deterministic validator** recomputes every number in the text against the ledger and rejects any mismatch. This is AI-Act-friendly and VREG-transparent: no free-form advice, only verifiable explanation.
  4. A **"call predictor"** rule flags bills likely to trigger a call (bill Δ > 20% vs same month last year, new 12-month peak, first negative injection month) and sends the footnoted explanation **3 days before the bill lands**.
- **Not banned chatbot #1:** there is no conversation. It is one pre-emptive, verified document per bill. **Not dashboard #2:** it starts from the bill, the one thing every customer opens.

**Target user:** every Voltera customer, and especially the low-digital-literacy ones, because the same footnotes print on the paper bill as a QR code plus two plain sentences.

**Why now:** 2026 LLMs reliably emit structured JSON with citations; cost is about €0.005–0.01 per explanation [ASSUMPTION ~2k tokens] → 350k × 12 = 4.2M bills ≈ **€21–42k/yr**. Vendors of personalised bill-explainer videos report 20–75% fewer billing calls ([Idomoo](https://www.idomoo.com/use-cases/bill-explainer/), [Synthesia](https://www.synthesia.io/post/personalized-videos-prevent-support-calls); vendor claims, treat as upper bound).

**Money**
- [ASSUMPTION] 350k customers × 1.0 contacts/yr, 60% bill/tariff related = 210k calls. At €6/contact (Belgian labour cost above the EU average of €3.71 per 7 min; tariff calls run longer): €1.26M/yr.
- A conservative 25% deflection (below every vendor claim) saves **€315k/yr** against about €40k LLM cost plus about €100k build = positive in year 1.
- Measurable in a pilot: A/B test on 10k customers, KPI = calls per 1,000 bills.

**Demo concept:** split screen. **Left: today's Voltera PDF** ("Capaciteitstarief: €21,40"). **Right: the footnoted bill**. The jury taps €21,40 and the chart zooms to "**Tue 14 Jan, 18:15–18:30: 6.3 kW, oven + EV at the same time.** Charging after 21:00 would have saved €7.10." Then we show the validator catching a planted hallucination live, in red: "LLM said €9.10, ledger says €7.10, rejected." That second moment is what earns trust from a 30%-feasibility jury.
- Build: dev B 6h (renderer + chart zoom), dev A 3h (LLM + validator), generalist 2h (writing the Dutch tone of voice).

**Biggest risk:** overlaps with "Piekbon/Piekbonnetje" from other lenses. The distinct asset here is the **validator plus the call predictor**. Merge rather than compete.

---

## 4. BOLD: "Voltera Tweeling" (Voltera Twin): the business case as a live simulator the jury can play with

**Pitch:** 350,000 synthetic Voltera customers built from 2,400 real Fluvius meters. Move a slider and watch calls, churn, peak MW, and margin recompute.

**Problem → solution**
- Problem: hackathon business cases are static slides with invented numbers, and the criterion worth 30% of the score (business value & feasibility) is where teams lose credibility.
- Mechanism: bootstrap 350k customers by resampling the 2,400 labelled profiles, weighted to a Flemish segment mix [ASSUMPTION mix: 60% no solar, 25% solar, 8% heat pump, 7% EV] plus a Brussels share without a capacity tariff. Run every customer through the billing engine (#2) against real 2025 prices. Levers (sliders): % on dynamic, % EVs with peak-cap (#1), % with battery, % reached by footnoted bills (#3). Outputs: customer € saved (median/p10/p90), Voltera sourcing-cost delta (evening vs noon load, priced at real day-ahead), aggregate evening peak MW, calls avoided, churn delta and € value. Every assumption is a visible, editable field.
- It's a **management cockpit, not a customer dashboard** (so banned #2 does not apply). After the hackathon it becomes Voltera's pilot-planning tool.

**Target user:** Voltera management and the jury. Later also Fluvius (flex/peak value) and the regulator (distribution of winners and losers across customer types, including vulnerable ones).

**Why now:** the open labelled dataset makes a credible population synthesis possible without Voltera data. Running 350k × 35,040 rows is about 12 billion cells, so we compute per-segment representative profiles and scale (6 segments × 2,400 meters is enough) [ASSUMPTION: aggregation error < 5%].

**Money (default slider positions, all visible)**
- Calls: #3 at 25% deflection → €315k
- Churn: −2 pp across the base = 7,000 customers × €125 CAC = €875k
- Dynamic risk premium: 17.5k × €25 = €437k
- EV sourcing shift: 35k EVs × 5 kWh/day shifted from 18–21h to 01–05h × 365 × €0.04/kWh spread [ASSUMPTION; 2025 intraday spread shape per [Xemex](https://www.xemex.eu/en/dynamic-energy-prices-in-belgium-turning-risk-into-value/)] = **€2.56M/yr** of value to split with customers
- **Total ≈ €4.2M/yr**, shown with a "pessimistic" toggle that halves everything, so the jury sees the floor too (≈ €2.1M).

**Demo concept:** in the last 60 s of the pitch we hand the jury chair the slider: "Put dynamic uptake where you think it'll really land." The numbers recompute in under 1 s (precomputed segment cubes). **This turns the business case into the demo.**
- Build: dev A 5h (segment cubes offline in pandas → JSON), dev B 5h (slider UI), business person owns the assumption table.

**Biggest risk:** a jury member picks apart one assumption and the whole number wobbles. Fix: cite each default, show the pessimistic case, and make the point that the tool *is* the answer to "how do you know?".

---

## 5. WILD CARD: "Stekker-DNA" (Plug DNA): Voltera knows you bought an EV before you tell them

**Pitch:** A model trained on Fluvius's own labelled meters reads your 15-min curve and detects your EV, heat pump, or solar panels, then offers the one product that fits, with the euro amount attached.

**Problem → solution**
- Problem: Voltera sells solar, batteries, and dynamic/EV tariffs, but has no idea who owns what. Cross-sell is spray-and-pray, and an EV owner on a fixed day tariff with an 8 kW peak is both a churn risk and a missed sale.
- Mechanism: the open dataset labels 2,400 meters by segment (solar / heat pump / EV and combinations). We engineer about 20 features per meter: night blocks > 3 kW lasting 2–4 h (EV), winter-vs-summer ratio and cold-morning ramps (heat pump), midday net injection (solar), and peak coincidence with 17–20h. Then we train gradient boosting (LightGBM) with an 80/20 split. The output per consenting customer is an asset fingerprint plus a "next best action" rule table: *EV detected + no smart-charging + peak > 6 kW → offer peak-cap (#1), value €221/yr.* *Solar + injection in negative hours → offer battery/dynamic injection, value €X from replay (#2).*
- Consent-first: runs only on customers who activated quarter-hour values *and* ticked "personalised advice" (GDPR purpose limitation; profiling is disclosed, not hidden). [ASSUMPTION] Not high-risk under the AI Act, but it needs transparency.

**Target user:** Voltera commercial team; customers with an unrecognised asset (EV owners on the wrong contract).

**Why now:** labelled 15-min training data is **public for the first time at this scale** from the DSO itself. Quarter-hour activation (SMR3) grew by more than 3 pp in 2025 ([VNR dashboard](https://www.vlaamsenutsregulator.be/cijfers/dashboards-digitale-meters-met-geactiveerde-kwartierwaarden)).

**Money**
- [ASSUMPTION] Cross-sell conversion for battery/EV-tariff offers rises from 1% (untargeted) to 5% (targeted) on 20k flagged customers = 800 extra sales. Battery margin about €800 [ASSUMPTION] → **€640k/yr**. EV-tariff switches reduce churn in the highest-value segment.
- Marketing waste avoided: stop sending battery mailings to renters without solar.

**Demo concept:** "**Guess the house**" (a 30-second moment in the pitch, not a gamification feature). Three anonymous real load curves on screen. The jury guesses which one has an EV; then the model reveals its answer with a confidence score and the offer it would send. Then show the confusion matrix on the 480-meter hold-out set. Real accuracy, measured tonight: a live, honest ML result on real DSO data.
- Build: dev A 6h (features + LightGBM + evaluation), UI 2h. If accuracy is below 80% on a class, we drop that class and show only the strong ones.

**Biggest risk:** "creepy" perception and GDPR profiling objections from the jury or regulator. Secondary risk: the dataset year and segments may not match Voltera's base. Fix: opt-in framing ("tell us nothing, we'll figure out what saves you money, and you can switch it off").

---

## 24h build plan if we combine (recommended demo arc: 4 minutes)

| Hour | Dev A | Dev B | Generalist | Business |
|---|---|---|---|---|
| 0–2 | Download the Fluvius dataset + ENTSO-E 2025 BE prices; tariff table | App shell, design system | Buy/borrow smart plug + kettle; test venue Wi-Fi | Assumption table with sources |
| 2–10 | Billing engine (#2), shared by everything | Kwartierklok UI (#1) + plug polling | Dutch copy, footnote tone (#3) | Business case in the Twin (#4) |
| 10–16 | LLM + validator (#3); segment cubes (#4) | Footnoted bill UI; replay UI | Recorded fallback videos of every demo | Pitch storyline |
| 16–22 | (optional) Stekker-DNA model (#5) | Twin sliders; polish | Rehearse x3 with a timer | Jury Q&A sheet |
| 22–24 | Freeze. No new features. | Freeze | Final rehearsal | Final rehearsal |

**Demo arc:** kettle on stage (#1, 45 s) → "and here's what that did to your bill" footnoted bill (#3, 60 s) → "what if you'd been on dynamic" replay (#2, 45 s) → jury chair moves the Twin slider (#4, 60 s). One engine, four moments, all four symptoms (peak/self-consumption, calls, dynamic uptake, churn) covered.

---

## STRONGEST INSIGHT:
The capacity tariff bills a **15-minute average**, so a peak builds up for up to 15 minutes before it is locked in. That makes it the only part of a Flemish energy bill that is predictable, preventable, and priced to the cent (**€4.45 per extra kW per month**) *while it is happening*. Every other team will show graphs of the past. We can show a cost **that hasn't happened yet**, and stop it on stage with a kettle and an EV-pause button. The kettle adds 0.44 kW; the EV adds 7.4 kW. Customers fear the wrong appliance, and Voltera can be the one to correct that. The demo can also be 100% real rather than mocked, because Fluvius publishes **2,400 labelled real 15-min household profiles**, ENTSO-E prices are free, and customers can download their own CSV in a minute. A jury weighing feasibility at 30% will notice when every number on screen traces back to a public source, and even more when one of those numbers is from a jury member's own house.
