# Lens: 01-user-pain

## Researched pains (what households actually run into)

| # | Pain | Hard number | Source |
|---|---|---|---|
| P1 | **One quarter-hour sets the month's network bill.** The capacity charge is based on the single highest 15-min peak of each month. Nobody knows *which* 15 minutes it was. | ~€56/kW/yr on average (Fluvius West €60.53, Limburg €51.99); minimum 2.5 kW = €137.5/yr; an average 4.26 kW peak = ~€239/yr | [Test-Aankoop](https://www.test-aankoop.be/woning-energie/gas-elektriciteit-mazout-pellets/antwoord-van-expert/capaciteitstarief-in-vlaanderen), [Fluvius](https://www.fluvius.be/nl/factuur-en-tarieven/capaciteitstarief/gezinnen-en-kleine-ondernemingen/aangerekend) |
| P2 | **Network costs jumped and nobody can say why.** | Network tariffs for 3,500 kWh / 4.26 kW: €483 in 2025, +€120 (+33%) vs 2024 | [Futech](https://futech.be/vlaamse-nettarieven-stijgen-tientallen-procenten/) |
| P3 | **EV owners get punished without knowing it.** | Charging at 11 kW on top of the house load can push grid costs to over €580/yr, or up to ~€500 extra | [Engie](https://www.engie.be/nl/blog/mobiliteit/capaciteitstarief-elektrische-auto-besparing/), [Eneco eMobility](https://www.eneco-emobility.com/be-nl/thuis/kennis-en-tips/capaciteitstarief) |
| P4 | **Dynamic tariffs save money, but almost nobody takes one.** | Dynamic was €193/yr cheaper than fixed and €62 cheaper than variable in 2025, *even without shifting use*. Uptake was still only 0.89% of Flemish consumers at the end of 2025 | [VREG price report via Solarmagazine](https://solarmagazine.nl/nieuws-zonne-energie/i43706/vnr-dynamisch-energiecontract-nog-altijd-goedkoopst-29-000-vlamingen-betalen-voor-terugleveren), [VREG market report 2025](https://assets.vlaamsenutsregulator.be/2026-06/RAPP-2026-12.pdf?VersionId=erVco19N12PHd.8FhFddnO11HbV_DFPy) |
| P5 | **Solar owners feel robbed.** They inject for 1–3 c/kWh on a fixed contract and buy back at ~30 c. On dynamic contracts injection can go negative, and ~29,000 Flemings *pay* to inject | Self-consumption averages ~27–30%, and ~35% is reachable with small behaviour changes | [Selectra injection tariff](https://selectra.be/nl/energie/prijzen/injectietarief), [Solarmagazine](https://solarmagazine.nl/nieuws-zonne-energie/i27572/vlaanderen-zelfconsumptie-eigenaren-zonnepanelen-11-procent-hoger-in-eerste-helft-2022), [Test-Aankoop](https://www.test-aankoop.be/woning-energie/hernieuwbare-energie/dossier/zelfverbruik-verhogen) |
| P6 | **Negative prices are the new normal.** | 520 h of negative day-ahead prices in Belgium in 2025 (+27.5%). Since 1 Oct 2025 the market settles per quarter-hour | [CREG note Z3151](https://www.creg.be/sites/default/files/assets/Publications/Notes/Z3151NL.pdf), [VRT](https://www.vrt.be/vrtnws/nl/2026/01/06/520-uur-negatieve-prijs-elektriciteit/) |
| P7 | **Billing is the top complaint.** | Billing issues are 22.6% of the 10,091 complaints to the federal Energy Ombudsman in 2025. Complaints about payment plans and collection costs are rising | [Ombudsdienst jaarverslag 2025](https://docs.vlaamsparlement.be/files/pfile?id=2299034) |
| P8 | **Price is the only thing people compare on.** | 18.94% of Flemish households (562,481) switched electricity supplier in 2025, a record, driven by group purchases | [VREG switches 2025](https://www.vlaamsenutsregulator.be/nieuws-en-persoverzicht/leverancierswissels-2025) |
| P9 | **The data exists but is locked.** | 4.83M digital meters. Quarter-hour data is mandatory from 1 Jan 2026. Only 7.8% of meters have the P1 port activated | [Nelectra / VREG dashboards](https://www.nelectra.be/digitale-meters-standaard-kwartierwaarden-marktcijfers), [VREG dashboard](https://www.vlaamsenutsregulator.be/cijfers/dashboards-digitale-meters-met-geactiveerde-kwartierwaarden) |
| P10 | **Energy sharing is legal but nobody uses it.** A digital-meter owner can share surplus with one other household (family, a neighbour) at €0 or a set price, settled per quarter-hour | – | [Fluvius energiedelen](https://www.fluvius.be/nl/groene-energie/energiedelen/met-een-persoon-een-organisatie) |

**Jobs-to-be-done, in the customer's words:**
1. "Tell me *what I did* that made this bill high, in one sentence."
2. "Let me try the cheaper contract without the risk of being the idiot who lost money."
3. "Don't let my solar power go to waste at 2 c while my mother pays 30 c."
4. "I want one predictable number per month."
5. "Make sure my 81-year-old dad isn't overwhelmed (or in trouble)."

---

## Idea 1 (SOLID): **Piekbon: the 15-minute receipt**
**Pitch:** Every month, Voltera sends you a receipt for the one quarter-hour that cost you the most, saying what caused it and what it cost.

- **Problem → solution:** The capacity charge depends on one 15-min slot per month (P1) that the customer never sees. A dashboard (banned) doesn't fix that, because people don't read graphs. The Piekbon is a **single card on the bill and in the app**:
  > "Tue 14 Oct, 18:15–18:30: **11.8 kW**. Probably EV charging (flat 7.4 kW block) + oven + kettle. This quarter-hour cost you **€36 extra this month**. Had the EV started at 21:00, your peak would have been 4.4 kW."
  - **Mechanism:** (1) take the argmax of the monthly 15-min series. (2) Run rule-based appliance fingerprinting on step changes: a flat block of 3.7/7.4/11 kW for 1–4 h = EV; a ~2 kW cyclic load = heat pump or dryer; a 2–3 kW spike under 10 min = kettle or oven. (3) Replay a counterfactual ("move the biggest shiftable block") and translate the kW difference into € using the DSO tariff.
  - The same engine also produces a **"why is my bill different" delta** compared with last month (kWh effect vs peak effect vs price effect), so the customer-service agent sees the same card.
- **Target user:** All 350k customers. The sharpest pain is for EV and heat-pump households and for people surprised by the +33% network costs.
- **Why now:** Quarter-hour data has been mandatory for all digital meters since 1 Jan 2026 (P9), so Voltera has the data by default and no longer needs the customer to opt in. Network costs rose 33% in 2025 (P2).
- **Money:**
  - Peak cost math: €56/kW/yr ÷ 12 = **€4.67 per kW per month**. EV + oven peak of 11.8 kW vs a 4.3 kW baseline = 7.5 kW × €4.67 = **€35/month** from one quarter-hour. For an EV household that does this every month, that is ~€420/yr avoidable.
  - Call deflection for Voltera: assume a 0.6 calls/customer/yr baseline [ASSUMPTION] → 210k calls, +40% → 294k. If 60% are about bills or tariffs [ASSUMPTION] → 176k calls. Deflecting 30% [ASSUMPTION] at €7/call [ASSUMPTION] = 53k × €7 = **~€370k/yr**.
- **Demo:** Upload a mock 15-min CSV → the receipt card animates in, showing the peak time, a stacked "what ran" bar, the € amount, and a "what if EV at 21:00" toggle that recomputes the peak live. A second screen shows the CS agent view with the same card.
- **Biggest risk:** Wrong disaggregation damages trust ("I don't own an oven"). Mitigation: phrase it as "probably", add a one-tap "this was X" correction that improves the labels, and use confidence thresholds.

---

## Idea 2 (SOLID): **Replay: your last 12 months, on the other contract, with a no-regret guarantee**
**Pitch:** "You would have saved €171 last year on dynamic. Try it for 12 months. If you end up paying more, we refund the difference."

- **Problem → solution:** Dynamic tariffs were €193/yr cheaper than fixed in 2025 without any behaviour change, yet only 0.89% of customers take them (P4). The blocker is **fear of regret**, not information. Replay does two things:
  1. **Replay:** re-prices the customer's *own* past 15-min consumption and injection against the historical Belpex quarter-hour prices + Voltera's dynamic formula, and shows the € difference per month (including the negative-price hours they would have been paid in).
  2. **No-regret guarantee:** during year 1, Voltera shadow-bills the old fixed contract. If dynamic ends up more expensive, Voltera credits the difference automatically.
- **Target user:** Customers with a digital meter on fixed or variable contracts, especially solar and EV owners.
- **Why now:** 15-min data is available by default. Negative-price hours hit 520 in 2025. Flanders has 33 suppliers offering dynamic, and the first supplier to remove the risk wins the timid 99%.
- **Money:**
  - Guarantee cost: if ~15% of switchers lose on average €40 [ASSUMPTION] → €6 per converted customer per year.
  - Churn value: 18% churn = 63k lost customers/yr. Assume dynamic + guarantee customers churn at 10% instead of 18% [ASSUMPTION; engaged customers stay longer]. 20k converts × 8 pp = 1,600 retained customers × ~€100 margin/yr [ASSUMPTION] = **€160k/yr**, plus avoided re-acquisition at €120/customer [ASSUMPTION] = **€192k**.
  - Customer: avg **€193/yr** vs fixed (VREG number).
- **Demo:** Customer picks a mock household (EV / solar / pensioner). The app replays 12 months as a monthly bar of "you paid" vs "you would have paid" and highlights the 5 best and worst days. A "Start with guarantee" button follows.
- **Biggest risk:** A 2022-style price spike makes the guarantee expensive. Mitigation: cap the refund (e.g. max €150) and offer it only in year 1. Regulatory: VREG must accept the replay as a fair comparison [ASSUMPTION], so disclose the methodology.

---

## Idea 3 (SOLID): **Zon voor Moeder: one-tap family energy sharing**
**Pitch:** Your panels feed your mother's fridge, legally, settled per quarter-hour, and Voltera handles the paperwork.

- **Problem → solution:** Solar owners inject 70%+ of their production for 1–3 c while family members buy at ~30 c (P5). Flanders already allows sharing with one other household (P10), but it needs Fluvius portal steps, a price agreement and quarter-hour matching. Nobody does it. Voltera turns it into a **family pairing flow**: invite by phone number → both consent → Voltera registers the sharing with Fluvius → a monthly "you gave Mama 64 kWh = €9" card for both.
  - The engine simulates the match before signup, using both households' 15-min curves, and recommends the partner with the best daytime overlap (a retired parent or a home-working sibling), not just whoever the user thought of first.
- **Target user:** Solar owners with 2–4k kWh surplus/yr and a relative with daytime consumption.
- **Why now:** Energy-sharing rules are live, 15-min data is on by default, and injection tariffs are collapsing (sometimes negative).
- **Money:**
  - A 4 kWp system produces ~3,600 kWh, of which ~72% is injected ≈ 2,600 kWh [ASSUMPTION on yield]. Simultaneous match with a pensioner's daytime load is ~25% ≈ 650 kWh [ASSUMPTION].
  - Sold at 8 c instead of injected at 2 c: the giver earns +€39/yr. The receiver still pays network costs, but on energy (~14 c) saves ~6 c × 650 = **€39/yr**. That's small money, but emotionally it's huge ("I help my mum").
  - Voltera's value: **two households locked to Voltera per pair**. Paired-household churn halves [ASSUMPTION]. 5,000 pairs × 2 × 9 pp × €100 margin = **€90k/yr**, plus acquisition of the receiver household (the invite is a referral engine) at €120 CAC saved per new receiver.
- **Demo:** Two phones side by side (Dad's solar roof, Mum's flat). A slider for "sunny October day" shows a quarter-hour animation of kWh flowing and € ticking up on both sides, then the monthly card.
- **Biggest risk:** The match rate is lower than hoped, so the savings feel trivial. Mitigation: show emotional framing plus kWh first. Only one sharing partner is allowed, and registration depends on Fluvius processes that can't be integrated in a prototype.

---

## Idea 4 (BOLD): **Voltera Vast: a phone-plan price for power**
**Pitch:** One fixed monthly price, capacity charge included. Behind the scenes Voltera plays the dynamic market with your flexible devices, and splits the gain with you.

- **Problem → solution:** Households want *one predictable number* (JTBD 4, P7). The savings, though, sit in dynamic prices and peak avoidance, which they don't want to manage. So flip who carries the complexity: the customer buys an **all-in monthly plan** (e.g. "€119/month, up to 5 kW peak, up to 350 kWh"). In return they let Voltera steer 1–2 flexible assets through their OEM cloud APIs (EV charger, heat pump boiler, home battery). Voltera buys on the quarter-hour market, schedules charging into cheap and negative slots, and caps peaks. The customer sees **one number, not a price feed** (no push notifications).
- **Target user:** EV / heat pump / battery owners (the most exposed to peaks and the most valuable to keep).
- **Why now:** The day-ahead market has settled per quarter-hour since Oct 2025, the average daily spread is €110/MWh, and EV peaks cost ~€500/yr (P3, P6).
- **Money (per EV household):**
  - Shifting 3,000 kWh of EV charging, capturing ~€60/MWh of the spread [ASSUMPTION] = **€180/yr**.
  - Peak cut from ~10 kW to 5 kW = 5 kW × €56 = **€280/yr**.
  - Pool = **€460/yr**. Customer gets 40% (€184 lower than their current all-in cost); Voltera keeps ~€275.
  - 10,000 customers × €275 = **€2.75M/yr gross margin**. Plan customers churn far less, because comparing a bundle on a price-comparison site is hard [ASSUMPTION].
- **Demo:** A plan picker (like a telecom shop), then a split screen: on the left the customer sees "€119, on track ✔". On the right, Voltera's ops view shows the same week, with EV charging moved to 02:00 and negative-price slots, peak flattened, and margin earned.
- **Biggest risk:** Price and volume risk (a cold winter or a price spike) and regulation. The VREG rules on transparent itemised bills mean network costs must stay visible [ASSUMPTION: legal as "all-in with itemised annex"]. Control also depends on OEM APIs.

---

## Idea 5 (WILD CARD): **Stroom-mantelzorger: energy data as a care signal**
**Pitch:** Your father's meter tells you he's OK, and makes sure he isn't overpaying.

- **Problem → solution:** Vulnerable and low-digital customers are the most confused and often have an adult child handling the paperwork anyway [ASSUMPTION]. With explicit consent from the parent, Voltera offers a **delegated "care mode"**. The adult child gets:
  1. a weekly plain-language summary ("Dad's bill on track, €4 over the advance").
  2. **Routine anomaly alerts** from the 15-min curve: no morning kettle or coffee spike by 10:30, or heating running with windows likely open (a sudden load jump while the outdoor temperature is low) [ASSUMPTION on detectability]. That is *not* a dashboard or push-for-cheap-hours; it's a wellbeing signal based on deviation from the person's own routine.
  3. One-tap actions on the parent's behalf: adjust the advance, switch to monthly billing, check eligibility for the social tariff.
- **Target user:** 75+ living alone and their mantelzorgers (family caregivers).
- **Why now:** Quarter-hour data is on by default and Flanders' population is ageing. Billing and payment-plan complaints are rising (P7). Every other supplier talks only to the account holder.
- **Money:**
  - Care add-on at €4/month [ASSUMPTION], or paid by a health insurer (mutualiteit) / OCMW as a prevention service.
  - 8,000 users × €48 = **€384k/yr**.
  - The larger value is loyalty: the savvy child becomes the decision-maker and brings their own household (family bundle). If 25% do so → 2,000 new customers × €120 CAC saved = **€240k**.
- **Demo:** A timeline for "Dad, Tuesday": the normal kettle and TV spikes are missing → at 10:45 the daughter's phone gets a message: "No morning activity detected. Call Dad?" She taps call. A second card shows "Dad's bill: €4 above plan. Fix advance?"
- **Biggest risk:** Privacy and ethics. Inferring presence or health from meter data is sensitive under GDPR and could look like surveillance. It needs explicit, revocable consent from the resident, false-alarm handling, and careful positioning. It's easy for the jury to love and easy for a regulator to hate.

---

## Cross-check vs the 4 symptoms
| Idea | Calls ↓ | Churn ↓ | Dynamic uptake ↑ | Self-consumption ↑ |
|---|---|---|---|---|
| 1 Piekbon | ●●● | ●● | ● | ● |
| 2 Replay + guarantee | ● | ●● | ●●● | ● |
| 3 Zon voor Moeder | – | ●●● | – | ●●● (shared use) |
| 4 Voltera Vast | ●● | ●●● | ●●● (invisible) | ●● |
| 5 Mantelzorger | ●● | ●●● | – | – |

**Combo suggestion:** Piekbon (1) is the entry point that explains the pain. Replay (2) is the call to action ("…and this is what dynamic would have saved you, risk-free"). Together they give one story ("show the cause, remove the fear") that one prototype can carry.

---

**STRONGEST INSIGHT:** Flemish households aren't short on information. They're short on **attribution and safety**. Since 2023, one single quarter-hour per month decides a big part of the network bill (~€4.67 per kW per month), and dynamic tariffs were €193/yr cheaper than fixed in 2025 even *without* behaviour change. Yet uptake is still under 1%. People don't act because (a) they can't connect a bill euro to a moment in their own life, and (b) the downside of trying something new feels personal ("I'll be the one who got burned"). The winning move is therefore not more graphs or tips. It is to **name the exact 15 minutes that cost them money, in euros, and then remove the regret risk of fixing it** (a guarantee, or Voltera carrying the complexity itself). With 15-min data on by default since Jan 2026, Voltera can do this for all 350k customers without asking them to opt in.
