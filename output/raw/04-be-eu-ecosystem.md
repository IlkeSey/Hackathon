# Lens: 04-be-eu-ecosystem

## Ground truth used in all ideas (cited)
| Fact | Number | Source |
|---|---|---|
| Capacity tariff Flanders 2026 | €51.99–60.53/kW/yr per DSO area, ~€53.39 reference, excl. VAT; average of 12 monthly 15-min peaks; **minimum 2.5 kW** | [callmepower](https://callmepower.be/nl/energie/gids/tarief/capaciteitstarief), [Fluvius](https://www.fluvius.be/nl/factuur-en-tarieven/capaciteitstarief/gezinnen-en-kleine-ondernemingen/aangerekend) |
| Average Flemish household monthly peak | **4.24 kW**, so ~€226/yr capacity cost, of which ~€93/yr sits above the 2.5 kW floor | [Fluvius FAQ / VREG](https://www.fluvius.be/nl/veelgestelde-vragen/capaciteitstarief-gezinnen-kleine-ondernemingen) |
| Dynamic contract uptake Flanders | **0.89%** end 2025 (0.4% in 2024) | [VREG price report RAPP-2026-07](https://www.vlaamsenutsregulator.be/publicaties/rapp-2026-07), [VRT](https://www.vrt.be/vrtnws/nl/2025/04/24/prijzenrapport-vreg/) |
| Average cost by contract type 2025 | Dynamic **€1,203**, variable €1,265, fixed €1,396. **520 hours of negative prices** | [VREG RAPP-2026-07](https://www.vlaamsenutsregulator.be/publicaties/rapp-2026-07) |
| Switching rate Flanders 2025 | **19.35%** (562,481 households) | VREG Marktrapport 2025 ([PDF](https://assets.vlaamsenutsregulator.be/2026-06/RAPP-2026-12.pdf?VersionId=erVco19N12PHd.8FhFddnO11HbV_DFPy)) |
| Gate for dynamic, energy sharing and flex | **Meetregime 3** (15-min values activated; the supplier must request it) | [Fluvius kwartierwaarden](https://www.fluvius.be/nl/factuur-en-tarieven/kwartierwaarden), [VREG dashboard](https://www.vlaamsenutsregulator.be/cijfers/dashboards-digitale-meters-met-geactiveerde-kwartierwaarden) |
| Third-party data access | Fluvius API for energy service providers: customer consents per EAN, period and data type in Mijn Fluvius; data is informative and **D+1**; data access contract + OV certificate; mostly paid | [Fluvius partner API](https://partner.fluvius.be/nl/energiedienstverleners/ontsluiten-verbruiksdata-api), [API PDF](https://partner.fluvius.be/sites/fluvius/files/2024-11/ontsluiten-van-verbruiksdata-via-api-v3.pdf) |
| P1 port | Off by default; customer enables it in Mijn Fluvius (up to 72 h); electricity data **every second** | [Fluvius P1 spec](https://partner.fluvius.be/nl/technische-documenten/gebruikerspoort-specificaties/p1-poort), [June](https://help.june.energy/hc/nl-be/articles/360017951637-Hoe-activeer-ik-de-P1-poort-van-mijn-digitale-meter) |
| Energy sharing Flanders | Live since 2022–23 (person-to-person, with yourself, in communities). **Only the energy component is affected**; network costs and levies are not | [REScoop tracker](https://www.rescoop.eu/policy/transposition-tracker/enabling-frameworks-support-schemes/belgium-flanders), [Fluvius supplier role](https://www.fluvius.be/nl/groene-energie/delen-en-verkopen-van-energie/rol-van-leverancier-bij-energiedelen) |
| EU market design reform | Directive (EU) 2024/1711: right to energy sharing (Art. 15a), right to a fixed-price contract of at least 1 year alongside dynamic contracts | [EUR-Lex](https://eur-lex.europa.eu/eli/dir/2024/1711/oj/eng) |
| Consumentenakkoord | Suppliers must tell every customer **once a year** which of their own formulas is cheapest for that customer's consumption. The customer can switch to it immediately and free of charge | [Test-Aankoop](https://www.test-aankoop.be/woning-energie/gas-elektriciteit-mazout-pellets/nieuws/belgische-wet-koopkracht-energie), [FEBEG](https://www.febeg.be/nl/themas/consumentenbescherming) |
| Brussels (Brugel/Sibelga) | Two-period tariff from 1/1/2026: peak 7–11h and 17–22h. Capacity component €41.41/yr in 2025. There is **no** 15-min-peak capacity tariff like Flanders | [Brugel 2025–2029](https://brugel.brussels/nl_BE/actualites/brugel-keurt-de-elektriciteits-en-gasdistributietarieven-in-het-brussels-hoofdstedelijk-gewest-goed-voor-de-periode-2025-2029-670) |
| Injection compensation | Roughly 0.8–8.3 c/kWh (Aug 2026). Negative monthly injection prices are possible from 2026 | [Selectra](https://selectra.be/nl/energie/prijzen/injectietarief), [Engie](https://www.engie.be/nl/injectie-en-negatieve-prijzen/) |
| Flex market | Fluvius has FSP role (Marktflex, Fall-Back Flex, T-flex); winter test zones 1/12/2025–30/4/2026; requires controllable asset (EV, heat pump, battery) | [Fluvius FSP](https://partner.fluvius.be/nl/flexibility-service-provider), [Solar Magazine](https://solarmagazine.nl/nieuws-zonne-energie/i41351/fluvius-breidt-testzones-voor-flexibiliteit-uit) |
| EU AI Act | High-risk Annex III covers creditworthiness and safety components of critical infrastructure. Annex III obligations apply from **2 Dec 2027** (per search result, post-omnibus) | [Annex III](https://artificialintelligenceact.eu/annex/3/), [Baker Botts](https://www.bakerbotts.com/thought-leadership/publications/2026/march/the-eu-ai-act) |
| EU Data Act | Applies from 12 Sep 2025: users can direct connected-product data (incl. meters) to third parties, free of charge | [Enode](https://enode.com/blog/evolving-energy/the-eu-data-act-what-the-energy-industry-needs-to-know-before-september-12), [Hunton](https://www.hunton.com/privacy-and-cybersecurity-law-blog/key-provisions-of-the-eu-data-act-take-effect) |
| Funding | VLAIO development project: 25–50% subsidy, €25k–€3M. **Innoviris: no new calls in 2026** | [VLAIO](https://www.vlaio.be/nl/subsidies-financiering/ontwikkelingsproject), [Innoviris](https://www.innoviris.brussels/digital-innovation) |

**Voltera baseline math (reused below)** [ASSUMPTION on unit values]
- Churn: 18% × 350k = **63,000 customers lost per year**. One point of churn = 3,500 customers × (€90 gross margin/yr + €120 CAC to replace them) ≈ **€735k/yr**.
- Calls: assume a baseline of 0.6 calls per customer per year. After the +40% rise that is 0.84 × 350k ≈ 294k calls, at ~€7 per call ≈ **€2.06M/yr**. Roughly 84k of those calls are the "extra" ones.

---

## 1. SOLID: "Piekplafond" (Peak Ceiling): a capacity-tariff guarantee, not a graph
**Pitch:** Choose your kW ceiling. Voltera keeps you under it, quarter-hour by quarter-hour, or pays the difference.

- **Problem to solution:** The capacity tariff charges the **15-minute average** kW, and nobody can see a 15-minute window. Mechanism:
  1. A P1 dongle reads the meter every second (Fluvius spec) and keeps a running integral of kWh used in the current quarter-hour.
  2. At minute t it projects the quarter-hour average. If the projection is above the chosen ceiling, it throttles the controllable load: EV charger via OCPP current limit, heat-pump boiler via SG-ready contact, battery discharge.
  3. It releases the load at the next quarter-hour boundary.
  4. The **product** is contractual: "Piekplafond 4 kW for €2.99/month". If Fluvius bills a month above 4 kW because of controllable load, Voltera credits the difference on the next bill.
- **Target user:** Flemish households with an EV, heat pump or induction hob, where monthly peaks run 7–11 kW [ASSUMPTION]. That is about 15% of the base, ~52k customers [ASSUMPTION].
- **Why now:** 2026 is the first full calendar year in which the 12-month average peak bites. Rates are €52–60/kW/yr. The minimum of 2.5 kW means every kW above it is pure avoidable cost.
- **Money:**
  - Customer, EV household: 9 kW → 5 kW = 4 kW × €53.39 = **€214/yr excl. VAT** (€259 incl.). Average household: 4.24 → 3.0 kW = **€66/yr**.
  - Voltera: 20% of 52k = 10.4k subscribers × €36/yr = **€374k/yr**, plus ~€25 dongle margin per unit.
  - Churn: subscribers are locked in because the ceiling lives with the supplier. If their churn falls 18% → 10%, that saves 830 customers/yr × €210 = **€175k/yr** [ASSUMPTION].
  - Guarantee payouts are small because the controller enforces the ceiling. Budget €5/yr per subscriber.
- **Demo:** A split screen of a simulated house from mock 1-second data, starting at 18:00. Cooking (3 kW) + EV (7.4 kW) begin.
  - Left: without control, a 15-minute "bucket" fills and the peak hits 10.4 kW, costing €555/yr.
  - Right: at minute 6 the controller sees the projection is over and drops the EV to 6 A. The bucket stops at exactly 4.0 kW. The EV is still full by 07:00.
  - A counter shows **"€214/yr kept"**.
- **Brussels variant:** Brussels has no 15-min capacity tariff, so the same controller shifts load out of the 7–11h and 17–22h peak windows (Brugel 2026).
- **Biggest risk:** Hardware logistics and device compatibility (non-OCPP chargers, older heat pumps). Mitigation: launch only with the EV/battery packages Voltera already sells.

---

## 2. SOLID: "Spijtvrij Dynamisch" (Regret-free Dynamic): a backtested dynamic contract with a refund guarantee
**Pitch:** We replayed your last 12 months, quarter by quarter, on our dynamic tariff. If dynamic ever costs you more than variable, we refund the difference.

- **Problem to solution:** Dynamic uptake is **0.89%** even though it was the cheapest type in 2025 (€1,203 vs €1,265 variable). The blocker is fear of the unknown, not information. Mechanism:
  1. Voltera already needs meetregime 3 for dynamic. It asks for it together with consent to process the last 12 months of kwartierwaarden (GDPR Art. 6(1)(a)).
  2. A deterministic engine re-prices each of the customer's 35,040 quarter-hours at Belpex/EPEX day-ahead + Voltera margin, versus their current variable formula.
  3. Only customers whose backtest shows a saving of at least €40 get the offer.
  4. They receive a **12-month rolling guarantee**: at the anniversary, if dynamic total > variable total on actual usage, the delta is credited.
- **Compliance twist:** Belgium's Consumentenakkoord already forces an **annual "cheapest formula for you" notice**. Today that is a generic letter based on standard profiles. Voltera makes it a personal, 15-minute backtest with a one-tap switch. The EU 2024/1711 reform requires clear risk information on dynamic contracts, and the backtest is that disclosure. The engine is rule-based, not an AI recommender, so there is no AI Act high-risk exposure.
- **Target user:** Customers with solar, EV or heat pump who have flexible consumption. Also "confused" customers who call about the bill.
- **Why now:** 2025 had 520 negative-price hours and a daily spread of about €110/MWh (+18% on 2024). Suppliers must offer fixed alongside dynamic under 2024/1711, so risk framing becomes a competitive differentiator.
- **Money:**
  - Customer: average saving €62/yr vs variable (VREG). Flexible profiles plausibly €100–200 [ASSUMPTION].
  - Voltera: move 0.89% → 6% of 350k = **~17.9k new dynamic customers**.
  - Refund exposure: pre-filtering on backtest saving of at least €40 means maybe 10% land negative, averaging €30 → 1.8k × €30 = **€54k/yr**.
  - Value: dynamic customers carry no fixed-price hedging risk. Hedging/imbalance saving of ~€15/customer/yr [ASSUMPTION] = €268k. If churn falls 18% → 12% [ASSUMPTION], that saves 1,070 customers × €210 = **€225k**.
  - **Net ≈ +€440k/yr**, plus fewer "why this price" calls.
- **Demo:** Upload a mock 15-min CSV and get a live replay. Two cumulative € lines (variable vs dynamic) race through 12 months, and the gap is annotated with "your 3 worst weeks" and "your 3 best weeks". A single button reads "Switch with guarantee", which produces the annual Consumentenakkoord notice as a PDF.
- **Biggest risk:** Price regime change, e.g. a 2022-style spike, makes the guarantee expensive. Mitigation: cap the refund at €100/yr and reprice cohorts yearly.

---

## 3. SOLID: "Zonnebuur" (Solar Neighbour): supplier-run energy sharing that ties households together
**Pitch:** Your solar surplus goes to your mother, your kid's student room or your neighbour at 7 c instead of 3 c. Voltera handles all of the Fluvius paperwork.

- **Problem to solution:** Solar customers inject at roughly 1–4 c/kWh, and negative months are possible from 2026. Their family members buy at ~12 c on the energy component [ASSUMPTION]. Flemish energy sharing has been legal since 2022, but nobody uses it because it requires meetregime 3 on both sides, a Fluvius registration, a price agreement and allocation keys. Mechanism:
  1. In the app, the solar customer invites up to 3 EANs by phone number.
  2. Voltera, as supplier of both sides, requests meetregime 3 and registers the sharing arrangement with Fluvius.
  3. Fluvius allocates shared volumes per quarter-hour using the DSO protocol.
  4. Voltera settles: the sharer gets 7 c, the receiver pays 9 c, and Voltera keeps 1 c admin plus the retained energy spread.
- **Target user:** Voltera's solar customers (the case says it is actively selling solar), plus their non-solar relatives, who are **also acquisition leads**.
- **Why now:** EU 2024/1711 Art. 15a makes energy sharing a right. Flanders has the protocol live but no incentive, so the product layer is empty. Injection value is collapsing.
- **Money:** For a 5 kWp system injecting ~2,500 kWh/yr [ASSUMPTION], 35% matched in the same quarter-hour ≈ 875 kWh.
  - Sharer: +4 c × 875 = **+€35/yr**.
  - Receiver: –3 c × 875 = **–€26/yr** on their bill.
  - The real value is **the pair**. If 15k solar customers each bring in 1 new receiver, that is 15k × €210 (margin + saved CAC) = **€3.1M first-year value** [ASSUMPTION on 15k].
  - Paired customers churn less, because leaving breaks the family's deal. At 18% → 9%, 30k customers × 9% × €210 = **€567k/yr**.
  - Plus the 1 c fee: 13M kWh × €0.01 = €131k.
- **Demo:** A map with two houses. Mock 15-min production and consumption curves overlay, and green bars show matched kWh per quarter-hour. A monthly "shared ledger" reads "Mama received 71 kWh from you, you earned €4.97, she saved €2.13". The invite flow is a single SMS link.
- **Biggest risk:** Matching volumes are small in winter, and each participant must reach meetregime 3. Fluvius admin lead time [ASSUMPTION: weeks]. Mitigation: pitch it as a loyalty and acquisition mechanism, not a savings machine.

---

## 4. BOLD: "Flexdividend": Voltera becomes a Fluvius FSP and pays customers a fixed monthly dividend for their battery and EV
**Pitch:** Your home battery earns €6 a month from the grid, and the amount is guaranteed on your bill.

- **Problem to solution:** Voltera sells solar + battery packages, but customers get poor self-consumption and no visible return. Generic "battery optimisation" is banned, so the twist is a **financial product**:
  1. The customer signs a flex mandate (control rights within set comfort bounds, e.g. battery never below 30%, EV at 80% by 7:00).
  2. Voltera registers as a **Flexibility Service Provider** with Fluvius. It stacks Fluvius Marktflex/Fall-Back Flex in congested zones, Elia balancing via an aggregator partner, and its own **BRP imbalance reduction**.
  3. The customer gets a **fixed €6/month dividend** plus a transparent ledger ("22 Jan 18:15, you helped relieve Fluvius zone Gent-Noord").
- **Target user:** Voltera battery and EV-package buyers, and future buyers, because the dividend lowers payback (currently 7–10 years with no Flemish battery subsidy in 2026, per [Solarnation](https://solarnation.be/het-laatste-nieuws/premie-thuisbatterij-2026)).
- **Why now:** Fluvius expanded flex test zones for winter 2025–26. The home-battery market is no longer subsidy-driven. The aFRR market is open to aggregators ([Next Kraftwerke](https://www.next-kraftwerke.com/energy-blog/opening-afrr-market-belgium)).
- **Money:**
  - Pool of 6,000 assets × 5 kW = **30 MW**. Value stack of €35/kW/yr [ASSUMPTION: imbalance + flex + balancing] = **€1.05M/yr**.
  - Dividend payout 6,000 × €72 = €432k. **Net ~€620k/yr** before platform cost.
  - Sales uplift: a €72/yr dividend cuts payback on a €6k battery by ~1 year [ASSUMPTION], so +20% battery package sales.
- **Demo:** A live "Voltera Virtual Power Plant" view: 6,000 dots, one simulated Fluvius congestion event at 18:00, the pool responding in seconds (−8 MW), and one customer's dividend ledger updating.
- **Biggest risk:** Regulatory and technical onboarding: FSP accreditation, the TCK v4 requirement for supporting services, and uncertain flex prices. Mitigation: start with BRP imbalance value, which is internal and needs no accreditation. Reuse the Idea 1 dongle as the control plane.

---

## 5. WILD CARD: "Bewijs het maar" (Prove It): steal switchers with their own Fluvius data
**Pitch:** Don't compare tariffs. Give us 30 seconds of consent and we'll show you, with your own 15-minute data, what you would have paid with us, and we guarantee it.

- **Problem to solution:** Churn is fought on the outflow side. The inflow is huge: **562,481 Flemish households switched in 2025**, and every one of them compares on a flat-profile price table (V-test). Mechanism:
  1. A prospect clicks an ad and is sent to Mijn Fluvius to consent to data sharing with Voltera as a registered **energiedienstverlener** (API, per EAN, D+1). The EU Data Act strengthens this user-directed sharing.
  2. The engine from Idea 2 re-prices 12 months of the prospect's real quarter-hours on every Voltera product (fixed, variable, dynamic, + Piekplafond, + solar) and on their current supplier's public tariff card.
  3. It outputs a **binding quote**: "Your last 12 months: €1,412 at X. At Voltera dynamic + Piekplafond: €1,188. If your next 12 months are not at least €150 cheaper on the same usage, we pay the difference."
  4. For existing customers, the same engine turns **retention calls** into a proof screen.
- **Target user:** Active switchers (19% per year), and especially EV and solar households, whose flat-profile comparisons are most wrong.
- **Why now:** The Fluvius energy-service-provider API is live. The Data Act (Sep 2025) normalises user-directed data portability. No Belgian supplier quotes on real 15-minute data [ASSUMPTION, unverified].
- **Money:** Capture 0.5% extra of the Flemish switcher pool = **2,800 net new customers/yr** × €90 margin = €253k/yr recurring, plus lower CAC (€120 → €70 [ASSUMPTION]) on 10k acquisitions = **€500k/yr**. Guarantee exposure is pre-filtered by the backtest.
- **Demo:** A fake "Mijn Fluvius" consent screen (clearly labelled mock), a 3-second load, then a personal bill-replay: their actual winter EV-charging peaks, the price per product, and a signed quote PDF with a QR code.
- **Biggest risk:** GDPR purpose limitation and Fluvius API cost and latency. Ethical optics: if the engine finds they are cheaper elsewhere, it must say so. Turn that honesty into the pitch.

---

## STRONGEST INSIGHT:
Belgian rules already hand Voltera the three levers it needs, and one gate controls all of them.
- **The gate is meetregime 3** (activated 15-minute values). It is required for dynamic contracts, energy sharing and flexibility, and Flanders sits at only **0.89% dynamic uptake**. Voltera's hidden north-star KPI should be "% of customers in meetregime 3". Every idea above is a reason for the customer to say yes to that one consent.
- **The rules already require the moments of contact.** The Consumentenakkoord forces an annual "your cheapest formula" notice. EU 2024/1711 forces risk disclosure on dynamic contracts. The capacity tariff creates a monthly, bill-visible number (kW) that a machine can guarantee.
- **Winning pitch:** turn the compliance paperwork into the product. The annual notice becomes a personal 15-minute backtest with a refund guarantee (Idea 2). The capacity tariff becomes a ceiling you subscribe to (Idea 1). The shared engine also becomes an acquisition weapon (Idea 5).
- **Why this holds up:** it is deterministic (no AI Act high-risk exposure), consent-based (GDPR Art. 6(1)(a)), demoable on mock data, and VLAIO-fundable (25–50% subsidy).
