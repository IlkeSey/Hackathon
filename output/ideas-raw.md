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
# Lens: 02-tech-now

**Lens:** what AI, data and automation can do in 2026 that was not possible, or not cheap, two years ago.

## Key facts used (with sources)

| Fact | Number | Source |
|---|---|---|
| Capacity tariff, Flanders 2026 | ~€53.39/kW/yr excl. VAT (€52.37 to €60.53 depending on region); minimum 2.5 kW; based on the 12-month average of monthly 15-min peaks | [callmepower](https://callmepower.be/nl/energie/gids/tarief/capaciteitstarief), [Fluvius](https://www.fluvius.be/nl/factuur-en-tarieven/capaciteitstarief/gezinnen-en-kleine-ondernemingen/aangerekend) |
| Dynamic contract uptake, Flanders | 0.09% (early 2024), 0.39% (early 2025), 0.89% (end 2025) | [VREG market report 2025](https://assets.vlaamsenutsregulator.be/2026-06/RAPP-2026-12.pdf?VersionId=erVco19N12PHd.8FhFddnO11HbV_DFPy), [VREG](https://www.vreg.be/nl/dynamische-energieprijzen) |
| Dynamic vs. variable/fixed saving (3,500 kWh, 2025) | €62/yr vs. variable, €193/yr vs. fixed | [Test-Aankoop](https://www.test-aankoop.be/woning-energie/gas-elektriciteit-mazout-pellets/nieuws/dynamische-energiecontracten), [EnergyID study](https://www.energyid.eu/media/abcmreqg/20251016_voor_wie_loont_een_dynamisch_elektriciteitscontract_energieid.pdf) |
| Supplier switching, Flanders households 2025 | 18.94% (562,481 households), a record | [VREG](https://www.vlaamsenutsregulator.be/nieuws-en-persoverzicht/leverancierswissels-2025) |
| Digital meter rollout | 80% of Flemish customers (2.95M meters); last 20% from 2026. P1 port is off by default and can be activated for free in the Fluvius portal | [pv-magazine](https://www.pv-magazine.com/2025/12/04/belgian-grid-operator-enters-final-phase-of-digital-meter-rollout/), [HomeWizard](https://helpdesk.homewizard.com/en/articles/5935311-is-my-smart-meter-compatible) |
| Fluvius data API for energy service providers | Daily and quarter-hour values with explicit customer consent; provider needs an OV certificate | [Fluvius partner API](https://partner.fluvius.be/nl/energiedienstverleners/ontsluiten-verbruiksdata-api) |
| EU Data Act | Users can make device makers share data with third parties from **12 Sept 2025**; design-for-access obligations from **12 Sept 2026** (two weeks ago) | [Morgan Lewis](https://www.morganlewis.com/blogs/sourcingatmorganlewis/2025/09/eu-data-act-begins-september-12-impacting-cloud-services-connected-products-and-other-data-industries), [Latham](https://www.lw.com/en/insights/eu-data-act-what-businesses-need-to-know) |
| EV cloud APIs | Read state of charge and start/stop charging; 20+ (Enode) to 35+ (Smartcar) brands | [Enode](https://enode.com/blog/guide/electric-vehicle-api), [Smartcar](https://smartcar.com/product/api/ev-charging) |
| Disaggregation (NILM) on 15-min data | Heat-pump load disaggregated from 15-min meter data (ETH, 363 homes); training-free EV charging detection at low sampling rates | [ACM/ETH](https://dl.acm.org/doi/fullHtml/10.1145/3600100.3623731), [arXiv 1404.5020](https://arxiv.org/pdf/1404.5020) |
| Energy sharing | Since 1 Jan 2026, surplus solar can be shared with neighbours or family, settled virtually per quarter hour | [Fluvius](https://www.fluvius.be/nl/groene-energie/energiedelen), [Soly](https://soly.be/kennisbank/elektriciteit-delen-in-vlaanderen-hoe-werkt-dat/) |
| Octopus Intelligent Go (UK benchmark) | 150k EVs = 1 GW of shiftable load; ~£771/yr typical saving | [Octopus press](https://octopus.energy/press/Intelligent-Octopus-Go-1GW/), [Octopus](https://octopus.energy/smart/intelligent-octopus-go/) |
| Real-time voice AI cost | ~$0.06 to $0.10/min model cost; ~$0.33 per call all-in | [Forasoft](https://www.forasoft.com/blog/article/openai-realtime-api-pricing), [Layer3](https://www.layer3labs.io/guides/openai-realtime-api-pricing) |
| Human contact-centre cost | €2 to €8 per contact (EU) | [yoummday](https://www.yoummday.com/blog/2026/08/26/call-center-costs/) |
| LLM extraction from electricity invoices | Works out of the box; date fields are the weak spot | [arXiv 2604.25927](https://arxiv.org/pdf/2604.25927), [arXiv 2609.15706](https://arxiv.org/pdf/2609.15706) |

**Shared assumptions** (all [ASSUMPTION]): Voltera gross margin is €120 per customer per year. Acquisition cost to replace a lost customer is €150. There are 0.8 inbound contacts per customer per year, about 280k, at €5 each. 10% of customers own an EV (35k). 25% have solar panels (87k).

---

## 1. SOLID: "Piekbon" (the Peak Receipt)
**Pitch:** every month the customer gets a receipt for their most expensive quarter-hour: what caused it, what it costs, and one button to stop it happening again.

- **Problem → solution:** The capacity tariff charges on one invisible 15-minute moment per month. Voltera runs disaggregation on that one peak quarter-hour and the quarters around it, not a full-year analysis. It separates the peak into signatures: EV charger (flat 7.4/11 kW block), induction hob, heat pump, oven. The output is a single "receipt" card, for example: *"Tue 14 Jan, 18:15: EV charging (7.2 kW) + cooking (2.1 kW) = 9.3 kW. This one quarter-hour adds €41 to your yearly bill."* The card has one action button. If the customer links their EV through an Enode/Smartcar-type API, "Cap my EV at 3.7 kW between 17:00 and 21:00" runs automatically. If not, a 10-second instruction appears for their charger app. This is **not a dashboard (banned #2)**: there are no graphs, just one event, one euro amount and one fix.
- **Target user:** EV and heat-pump households, who have the highest peaks, and anyone who calls about the "capaciteit" line.
- **Why now:** 15-min NILM for EVs and heat pumps is now published and reproducible (ETH 2023, see above). OEM EV APIs cover 20 to 35+ brands. LLMs can turn a load signature into a plain-Dutch sentence for ~€0.001 per customer per month [ASSUMPTION]. The Fluvius API provides quarter-hour data with consent.
- **Money:**
  - Customer: EV home drops its average monthly peak from 8 to 5 kW. 3 kW × €53.39 = **€160/yr** saved. A non-EV home drops 0.7 kW, saving €37/yr.
  - Voltera: capacity-tariff questions are about 25% of the 280k contacts [ASSUMPTION] = 70k. Deflecting 40% saves 28k × €5 = **€140k/yr**. An optional "Piekbewaker" (peak guard) at €3/month for 10k EV homes brings in **€360k/yr**. Reducing churn among EV customers by 3pp (35k × 3% × (€120 + €150)) is worth **€283k/yr**.
- **Demo:** Load a mock 15-min CSV. The receipt card appears, showing the peak split into EV and cooking. Click "Cap EV". The simulated next month shows the peak falling from 9.3 to 5.2 kW and a "−€219/yr" counter.
- **Biggest risk:** Disaggregation errors. Telling someone "your EV" when it was a sauna kills trust. Mitigation: show a confidence level and ask "Was this your EV? yes/no". The answer also improves the labels.

---

## 2. SOLID: "Schaduwfactuur" (the Shadow Bill: risk-free dynamic)
**Pitch:** stay on your current contract. Every month, we quietly calculate what dynamic pricing would have cost you, and once you switch, we guarantee you will not lose money.

- **Problem → solution:** Uptake is below 1% because switching to dynamic pricing feels like gambling. With the customer's consent to use quarter-hour data, Voltera prices their *actual* 15-min profile against day-ahead prices each month. A line on the normal bill says, for example, *"On dynamic you would have paid €11.40 less this month."* After 3 months, a one-tap switch comes with a **12-month no-regret guarantee**: if dynamic costs more than the old contract, Voltera refunds the difference. A cheap probabilistic model, trained on the customer's history plus a forward price curve, decides who gets the offer. The guarantee is only offered when the model's P90 saving is above €0. There are no push notifications (banned #4). The product is the guarantee.
- **Target user:** The 99% of customers on fixed or variable contracts, especially those with flexible loads.
- **Why now:** The Fluvius quarter-hour API and consent flow are live. Uptake growth (0.09% → 0.39% → 0.89%) shows latent demand. Gradient-boosted and small transformer forecasters are commodities, so pricing a guarantee on each profile costs pennies [ASSUMPTION].
- **Money:**
  - Customer: €62/yr vs. variable, €193/yr vs. fixed (Test-Aankoop 2025 average).
  - Voltera: target 8% dynamic = 28k customers. Guarantee payouts: 5% × 28k × €30 = **€42k/yr** (the offer is only made to customers the model expects to win). Upside: dynamic customers carry their own price risk, reducing Voltera's hedging/risk premium by an estimated €20/customer/yr [ASSUMPTION] = **€560k/yr**. Retention is also stronger, because a proven saving is sticky.
- **Demo:** A slider moves month by month through a mock customer's year. The shadow bill accumulates "you'd have saved €…". A switch button shows the guarantee certificate. The same view on a counter-example customer shows "Not for you — stay put." That honesty scores points with the regulator.
- **Biggest risk:** Tail risk from a price spike (2022-style). Mitigation: cap the guarantee at €100 per customer per year, and fund it from a small reserve.

---

## 3. SOLID: "Tegenbod" (Counter-offer Scanner)
**Pitch:** found a cheaper supplier? Snap a photo of their offer, and in 30 seconds we replay it on *your* real 15-min year. Then we either show you it isn't really cheaper, or we match it.

- **Problem → solution:** People compare suppliers on a headline €/kWh, but real cost depends on their profile: capacity, injection tariff, fixed fees, time of use. A vision LLM reads a photo or PDF of a competitor's tariff card or V-test result into structured tariff fields. A deterministic "bill engine" (the LLM does **no** arithmetic) replays the customer's last 12 months of quarter-hour data under both tariffs and returns one number: *"This offer would have cost you €38 MORE, because your injection price drops from 4.1 to 1.5 c."* If the offer really is cheaper, the retention desk gets an automatic, margin-checked counter-offer, such as moving to dynamic or a different product.
- **Target user:** Customers who are about to switch. Also usable by call-centre agents during "I'm leaving" calls.
- **Why now:** Vision LLMs extract data from invoices and tariff sheets out of the box (arXiv 2026 benchmarks above). Two years ago this required template-specific OCR per supplier. Record switching in 2025 (18.94%) makes retention urgent.
- **Money:**
  - Voltera churn is 18% × 350k = 63k leavers/yr. If 30% scan (19k) and 25% of those are kept: **4.7k customers retained × €270** (margin + avoided acquisition cost) = **€1.27M/yr**.
  - Customer: an avoided "fake saving" switch, plus an honest counter-offer.
- **Demo:** Hold a printed competitor tariff card up to a laptop webcam. The fields fill in live. Two bars appear: "Their offer on your year: €1,412 / Voltera: €1,374." Then the counter-offer button.
- **Biggest risk:** Fairness and legal. VREG may see this as steering customers. Mitigation: always show the result, even when the competitor wins. Honesty is the retention mechanism.

---

## 4. BOLD: "Buurtstroom" (neighbour power: an energy-sharing matchmaker)
**Pitch:** your solar surplus earns 3 cents from the grid. We find the neighbour three doors down who uses power at 13:00 and pays you 8 cents for it.

- **Problem → solution:** Solar customers have low self-consumption, and injection pays little. Energy sharing has been legal since 1 Jan 2026, with virtual quarter-hour settlement by Fluvius, but nobody knows who to share with. Voltera clusters its own customers' 15-min profiles by street or postcode and scores complementarity: *surplus kWh × deficit kWh in the same quarter-hours*. It proposes the best pairs or small groups. It then handles all the admin: registration with Fluvius, a sharing key and a price chosen by the producer. Sharing happens inside Voltera, which is a structural reason to stay [ASSUMPTION: whether both parties must use the same supplier in Flanders needs checking. At minimum, the supplier must support sharing: [Fluvius: role of supplier](https://www.fluvius.be/nl/groene-energie/delen-en-verkopen-van-energie/rol-van-leverancier-bij-energiedelen)].
- **Target user:** Voltera's ~87k solar customers [ASSUMPTION], matched with daytime consumers: retirees, home workers, heat pumps, or EVs charging at home.
- **Why now:** The legal framework started on 1 Jan 2026. Every customer has quarter-hour data. Matching thousands of profiles pairwise is a cheap vector-similarity job now.
- **Money:**
  - Assume sharing at €0.08/kWh vs. injection at ~€0.03 [ASSUMPTION] vs. an energy component of ~€0.12+ [ASSUMPTION].
  - 1,000 kWh shared/yr: the producer gains +€50, and the consumer saves ~€40 (grid costs still apply).
  - Voltera: 10k pairs × 1,000 kWh × €0.01 fee = **€100k/yr**, plus churn. If sharing members churn 10pp less: 20k people × 10% × €270 = **€540k/yr**. Each new group also brings non-Voltera neighbours in as leads.
- **Demo:** A street map with 12 mock houses. Solar surpluses (yellow) and midday consumers (blue) are matched with lines. Each line is labelled "Jan ↔ Marie: 1,140 kWh/yr, +€57 / −€46". Click "Invite Marie" to see the invitation that is sent.
- **Biggest risk:** Admin friction and regulation around energy sharing: registration delays, VAT/price rules, and the same-supplier question. Needs a check of Fluvius/VREG rules on day 1.

---

## 5. WILD CARD: "De factuur belt jou" (the bill calls you)
**Pitch:** for customers who never open an app, a 2-minute call once a month in their own Flemish register: "Hi, this is Voltera's assistant. Your bill is €8 higher, because of the cold week. One tip, want to hear it?"

- **Problem → solution:** Vulnerable and low-digital-literacy customers are the ones who call, or who get surprised by the annual settlement. This flips the chatbot (banned #1): it is **outbound, scheduled, voice-only, and grounded in their own data**. Each month, the deterministic bill engine from ideas 1 and 3 produces 3 facts: bill delta, cause and projected settlement. A real-time voice model reads them aloud, answers follow-up questions only from those facts, and hands over to a human with one word ("mens", "a person"). It discloses that it is an AI from the first sentence (AI Act transparency). Customers opt in, for example via a paper letter or at a call-centre interaction.
- **Target user:** Older customers and those with low digital skills. They are about 15% of the base [ASSUMPTION] = 52k.
- **Why now:** Natural real-time voice costs ~$0.08/min, about $0.33 per call all-in (sources above). In 2024 it was robotic, laggy and more expensive. Dutch/Flemish speech quality is now good enough [ASSUMPTION: test for dialects].
- **Money:**
  - Cost: 52k × 12 calls × 2 min × €0.08 = **€100k/yr**.
  - Saving: these customers make ~1.5 inbound contacts/yr [ASSUMPTION] = 78k × €5 = €390k. Deflecting 50% saves **€195k**. Preventing surprises at the annual settlement cuts debt/dunning costs [ASSUMPTION €20 × 5k cases = €100k].
  - Net ~**+€195k/yr**, plus a VREG/social-responsibility story.
- **Demo:** A live phone call on stage. The jury hears the AI explain a mock customer's bill in 40 seconds. A juror interrupts with a question and gets a grounded answer, then says "mens", and the handover screen appears.
- **Biggest risk:** Trust and creepiness ("a robot calls my grandmother"), and consumer-protection scrutiny. Mitigation: strictly opt-in, disclose the AI up front, never sell during the call, and always offer a one-word handover to a human.

---

## How they fit together
The ideas 1, 2, 3 and 5 all run on the same **deterministic "bill engine" (a digital twin of the customer's bill)**, fed by 15-min data. AI does only the perception (disaggregation, reading documents, voice), never the arithmetic. One engine, four interfaces: receipt, shadow bill, counter-offer, voice. That covers all four symptoms: calls (1, 5), churn (3, 4), dynamic uptake (2) and self-consumption (4).

**STRONGEST INSIGHT:** What has changed since 2024 is not that AI can "explain" a bill. It is that Voltera can now **replay a customer's real quarter-hour year under any alternative**: a different contract, a capped EV, a competitor's offer, or a neighbour sharing their solar. It can do this cheaply, for each customer, with consent-based data (Fluvius API) and device control (EV APIs, EU Data Act since Sept 2025/2026). That turns every confusing euro into a counterfactual the customer can act on: "this quarter-hour cost you €41 → one tap fixes it" and "that cheaper offer costs you €38 more". The winning pitch is not an AI advisor but a **provably honest bill twin**. The LLM never does the maths, so it is compliant with the AI Act and VREG, and honesty itself becomes the retention product. The bill twin's numbers come from a deterministic calculation, so customers can trust them and the regulator can audit them.
# Lens: 03-business-model

**Thesis for this lens:** Voltera should stop selling kWh and start selling **certainty**. The capaciteitstarief and dynamic prices moved price and peak risk onto households, and households can't see that risk or manage it. Voltera has 15-minute data, pools 350k customers, and runs a wholesale book, so it can price that risk and manage it cheaply. Each idea below turns part of that risk into a paid, sticky contract term.

## Fact base (with sources)

| Fact | Number | Source |
|---|---|---|
| Capacity tariff 2025 per Fluvius zone | EUR 52-61 per kW per year; minimum peak 2.5 kW (about EUR 160/yr incl. VAT) | [Fluvius prepaid](https://prepaid.fluvius.be/mijn-factuur/wat-kost-energie-bij-fluvius/capaciteitstarief), [Fluvius](https://www.fluvius.be/nl/factuur-en-tarieven/capaciteitstarief/gezinnen-en-kleine-ondernemingen/aangerekend) |
| Dynamic vs variable / fixed saving, average Flemish household 2025 | EUR 62 / EUR 193 per year | [VRT on the VREG price report](https://www.vrt.be/vrtnws/nl/2025/04/24/prijzenrapport-vreg/), [Solar Magazine on the VNR report](https://solarmagazine.nl/nieuws-zonne-energie/i43706/vnr-dynamisch-energiecontract-nog-altijd-goedkoopst-29-000-vlamingen-betalen-voor-terugleveren) |
| Dynamic-tariff uptake | 0.4% of Flemish households (Jan 2025); 20,552 contracts in Belgium at end 2025 | [Futech](https://futech.be/dynamische-elektriciteitscontracten-in-belgie-nog-steeds-een-markt-van-de-early-adaptors/), [CREG](https://www.creg.be/nl/nieuws/jaarlijks-rapport-over-contracten-met-een-dynamische-elektriciteitsprijs) |
| Average electricity cost on a dynamic contract | EUR 1,203 per year | [Solar Magazine / VNR](https://solarmagazine.nl/nieuws-zonne-energie/i43706/vnr-dynamisch-energiecontract-nog-altijd-goedkoopst-29-000-vlamingen-betalen-voor-terugleveren) |
| Prosumer economics 2025 | Self-consumption was worth EUR 469; injection earned EUR 107; injection price about 3 cents/kWh in Dec 2025; 520 negative-price hours | same |
| Digital meters | 79% of electricity meters in Flanders at end 2025; 15-minute data recorded by default for all digital meters from 1 Jan 2026 | [VREG dashboard](https://www.vlaamsenutsregulator.be/cijfers/dashboard-digitale-meters), [Fluvius press](https://pers.fluvius.be/last-group-of-solar-panel-owners-gets-digital-meters) |
| Home battery (BE) | Saves EUR 450-800 per year, of which EUR 100-300 comes from the capacity tariff; payback 7-9 years | [marssolar.be](https://marssolar.be/thuisbatterij/rendement/), [energiebewustontwerpen.be](https://www.energiebewustontwerpen.be/thuisbatterijen/rendement/) |
| Customer-service cost | Median USD 13.50 per assisted contact; utilities get 1.1-1.4 calls per customer per year | [Gartner](https://www.gartner.com/en/documents/5164231), [Blastpoint](https://blastpoint.com/discover-key-industry-benchmarks-utility/) |
| Precedents | Tibber: EUR 4-5/month fee + hardware + flex revenue. OVO Power Move: GBP 3-6/month rewards. Octopus sells 700 MW of residential flex; Intelligent Octopus Go saves GBP 343/yr; "Zero Bills" homes | [Tibber](https://en.wikipedia.org/wiki/Tibber), [OVO](https://www.ovoenergy.com/power-move), [Kraken case study](https://www.kraken.tech/case-studies/octopus-energy-residential-flexibility) |
| Energiedelen (energy sharing) in Flanders | Sharing must be free of charge (no selling); every party needs a commercial supplier | [VREG](https://www.vlaamsenutsregulator.be/elektriciteit-en-aardgas/energieprijzen-en-facturen/energiedelen-en-energie-verkopen) |
| Switching | No exit fees and one month's notice, so customers can leave at any time | [Brussels Times](https://www.brusselstimes.com/1238338/saving-over-e1000-per-year-fewer-households-are-switching-energy-suppliers) |

**Baseline economics used below (all [ASSUMPTION] unless sourced):**
- Churn: 18% x 350k = **63,000 customers lost per year** (from the case).
- Gross margin per customer (electricity + gas): **EUR 100/yr** [ASSUMPTION]. Cost to acquire a replacement: **EUR 150** [ASSUMPTION].
  - So each lost customer costs about **EUR 250** in year 1, and **each churn point = 3,500 customers = about EUR 0.9M/yr**.
- Calls: 350k x 1.2 = about 420k/yr (benchmark above). If 60% of these are bill or tariff calls [ASSUMPTION], that is about 250k calls at about EUR 12 each, or **about EUR 3M/yr** spent on bill confusion.

---

## Idea 1 (SOLID): "Piekgarantie": a capacity-tariff guarantee
**Pitch:** "Choose your kW. We guarantee it. If you go over, Voltera pays."

- **Problem:** The capacity tariff charges for a monthly peak that nobody can see. The bill shock comes weeks later, and it is the #1 reason customers call.
- **Solution / mechanism:**
  1. Voltera reads 12 months of the customer's 15-minute data and proposes a ceiling 1 kW below their historical average peak. Example: historical 5.0 kW becomes a guaranteed 4.0 kW.
  2. The customer pays a small monthly fee. Voltera **credits any capacity-tariff cost above the chosen ceiling** on the bill.
  3. Voltera is now financially motivated to keep the customer's peak down. It opts the customer into load limiting (EV charger via OCPP, heat pump/boiler setpoint, P1-dongle smart plug), plus a live "kW budget" meter in the app.
  - The alerts are a side effect. The product is the guarantee.
- **Target user:** Households with an EV, heat pump or induction hob, meaning peaky loads. About 30% of the base [ASSUMPTION].
- **Why now:** 15-minute data is recorded by default for all digital meters from 1 Jan 2026. The capacity-tariff rate rose to EUR 52-61/kW/yr in 2025. EV and heat-pump adoption is rising.
- **Money (math):**
  - Customer at 5.0 kW x EUR 57 = EUR 285/yr. With the guarantee at 4.0 kW: EUR 228. The customer saves **EUR 57** and pays a fee of EUR 2.50/month = **EUR 30**. Net gain for the customer: EUR 27, plus certainty.
  - Expected Voltera payout from overshoots after load control: EUR 8/customer/yr [ASSUMPTION]. That leaves **EUR 22 net per subscriber**.
  - 60k subscribers (17% of base) x EUR 22 = **EUR 1.3M/yr**.
  - Churn among subscribers falls from 18% to 11% [ASSUMPTION]: 4,200 customers kept x EUR 250 = **EUR 1.05M/yr**.
  - Bill calls from subscribers fall 50% [ASSUMPTION]: 60k x 0.7 calls x 0.5 x EUR 12 = **EUR 0.25M/yr**.
  - **Total about EUR 2.6M/yr.**
- **Demo:** Pick a household from the mock 15-minute data and drag the "my kW" slider. The app shows the price, a replay of last winter with and without load control (peaks clipped in red), and the credit Voltera would have paid.
- **Biggest risk:** Regulation. A guarantee could be classified as insurance. Mitigation: structure it as a supplier tariff discount or credit, not an insurance policy. Legal check needed [ASSUMPTION]. Second risk: adverse selection, since customers who expect peaks sign up. Mitigation: price the fee from their own history.

---

## Idea 2 (SOLID): "Dynamisch Zonder Spijt": no-regret dynamic tariff with shared savings
**Pitch:** "Go dynamic. If it turns out more expensive than fixed, we refund the difference. If it's cheaper, we split the win 75/25."

- **Problem:** Dynamic saves EUR 193/yr against fixed, yet only 0.4% of Flemish households use it. The blocker is fear of a price spike, not missing information.
- **Solution / mechanism:**
  - At the yearly settlement, Voltera re-bills the customer's actual 15-minute consumption at (a) their dynamic price and (b) a fixed price that was locked in on the signup date.
  - Customer pays **min(dynamic, fixed) + 25% of the gap when dynamic wins**.
  - Monthly statements show "you're EUR X ahead of fixed". This one number replaces the confusing tariff breakdown.
- **Target user:** Customers on fixed or variable contracts with a digital meter who are price-sensitive (the likely churners).
- **Why now:** Dynamic contracts are legally required under EU Directive 2019/944. There are 34 dynamic products on the market, but take-up is tiny. There were 520 negative-price hours in 2025.
- **Money (math):**
  - Customer saves an average of EUR 193 against fixed. Voltera takes 25% = **EUR 48/yr**, the customer keeps EUR 145.
  - Guarantee cost: 12% of customers lose on dynamic in a given year, by about EUR 60 each [ASSUMPTION] = EUR 7/customer/yr.
  - Voltera no longer carries hedging risk for these customers: saving of about EUR 20/customer/yr [ASSUMPTION].
  - Net about **EUR 61/customer/yr**. At 35k customers (10% of base) that is **EUR 2.1M/yr**, plus churn reduction on a product rivals can't compare line by line.
- **Demo:** "Replay 2025". Upload or pick a household and run its real consumption through Fixed vs Dynamic vs No-Regret, month by month, with the refund and the split drawn as a bar.
- **Biggest risk:** Voltera's worst case in a spike year like 2022. The fixed benchmark has to be hedged at signup, which puts hedging cost back in. Cap exposure with a volume band (for example ±20% kWh) [ASSUMPTION].

---

## Idea 3 (SOLID): "Flexhuur": a fixed monthly rent for your battery / EV charger / boiler
**Pitch:** "Your battery earns EUR 5 a month on your bill. Guaranteed. We handle the rest."

- **Problem:** Solar and battery owners get only about 3 cents/kWh for injection and use their assets badly. Meanwhile Voltera, as balance-responsible party, pays imbalance costs, and Elia pays for flexibility.
- **Solution / mechanism:**
  - The customer gives Voltera the right to steer 20-30% of their battery's capacity, or to shift their EV/boiler within limits the customer sets (for example "car full by 07:00", "battery never below 30%").
  - In return they get a **fixed bill credit per device per month**. It is fixed, not variable, so it is easy to understand.
  - Voltera stacks value from:
    1. its own imbalance/sourcing costs
    2. Elia FCR/mFRR through an aggregator partner (FCR is open to residential load; [Elia/Delta-EE](https://www.elia.be/-/media/project/elia/elia-site/public-consultations/2022/20221028_delta-ee_report-rtc_be_flex-published.pdf))
    3. soaking up negative-price hours
  - The rest of the capacity still maximises the customer's own self-consumption.
- **Target user:** Voltera's solar+battery package customers, plus any customer with an EV charger or heat-pump boiler.
- **Why now:** Octopus proves the model at scale (700 MW, GBP 343/yr per EV). Negative-price hours are rising in Belgium. Voltera already sells the batteries, so it can control them from day one.
- **Money (math):**
  - 15k steerable devices x 5 kW average = 75 MW.
  - Value EUR 50 per kW per year [ASSUMPTION; to be checked with an aggregator] = EUR 3.75M/yr gross.
  - Credits paid to customers: 15k x EUR 60/yr = EUR 0.9M.
  - **Net about EUR 2.8M/yr.**
  - Also a cross-sell hook: "your battery pays EUR 60 per year of rent" shortens the payback pitch for new battery sales.
- **Demo:** A "Flex ledger" per home. Last week's 15-minute timeline shows which slots Voltera used, what it earned, the fixed credit paid, and proof the car was full by 07:00. On the company side, a map of 75 MW aggregated.
- **Biggest risk:** Flex prices are uncertain and have fallen over time (FCR prices dropped by more than half from 2016 to 2019, per Elia sources). Mitigation: size the fixed credit well below expected value, and use a partner aggregator such as Flexcity or Next Kraftwerke rather than building a desk.

---

## Idea 4 (BOLD): "Voltera Vast Bedrag": one flat monthly price for all your energy
**Pitch:** "EUR 179 a month. Electricity, gas, capacity tariff, all in. No annual settlement bill, ever."

- **Problem:** The bill is a black box of kWh prices, network costs, capacity tariff, levies and advance payments. The annual settlement bill (afrekening) is the moment customers call or leave.
- **Solution / mechanism:**
  - Voltera builds a quote from 12 months of 15-minute data and weather-normalises it. It sells a **12-month all-inclusive flat fee** covering usage within a ±15% band (fair-use band).
  - In exchange the customer grants device-control rights (Ideas 1 and 3). Voltera then profits by lowering the real cost behind the flat fee: shifting to cheap hours in its own wholesale book, shaving peaks, and using flex.
  - This is the Octopus "Zero Bills" logic applied to existing homes.
- **Target user:** Families who value predictability. Low-digital-literacy and vulnerable customers who want "no surprises".
- **Why now:** 15-minute data makes the risk priceable per household. Capacity-tariff complexity makes an "all-in" price attractive for the first time.
- **Money (math):**
  - Expected real cost per customer: electricity EUR 1,265 + gas EUR 1,100 [ASSUMPTION] = EUR 2,365.
  - Flat fee = expected cost + 5% certainty premium = **+EUR 118/yr**.
  - Voltera's control lowers the real cost by about EUR 80/yr [ASSUMPTION: peak and shifting].
  - Margin uplift: 118 + 80 - 40 (weather and volume risk reserve) = **about EUR 158/customer/yr vs the current EUR 100 base**.
  - 20k customers x EUR 158 = **EUR 3.2M/yr**.
  - Price-comparison sites can't rank it next to kWh offers, so the price-shopping churn trigger goes away.
- **Demo:** A quote engine. Pick a mock household and show the 12-month Monte-Carlo of Voltera's cost vs the flat fee, the risk band, and the resulting single number: "EUR 179/month".
- **Biggest risk:** A cold winter or price spike leaves Voltera holding volume and price risk, and VREG may require a transparent breakdown. Mitigation: the ±15% band, a hedge bought at signup, and a line-item breakdown kept available on request.

---

## Idea 5 (WILD CARD): "Spaarkluis": your savings grow into a battery
**Pitch:** "Every euro we save you goes into a vault. Stay three years and it counts 1.5x toward a battery or heat pump. Leave, and you still get 1x back."

- **Problem:** In Belgium, loyalty can't be bought with exit fees, because switching is free. Savings such as EUR 62 from going dynamic are too small to notice when spread across 12 bills.
- **Solution / mechanism:**
  - Voltera does not net the savings into the bill. The savings from Ideas 1-3 (peak credits, dynamic gains, flex rent) are **deposited into a visible vault**.
  - The vault pays out at **1x in cash at any time**, including when you leave, so there is no exit penalty. It is worth **1.5x as a voucher toward Voltera hardware** (battery, heat pump, EV charger) after 36 months.
  - Retention without lock-in, turned into a cross-sell funnel.
- **Target user:** Engaged mid-income homeowners who are "thinking about a battery someday".
- **Why now:** Home batteries now pay back in 7-9 years, 5-6 with dynamic contracts. The vault closes the upfront-cost gap. Voltera already sells solar + battery packages.
- **Money (math):**
  - 30k vault customers x EUR 150/yr deposits [ASSUMPTION] = EUR 450 after 3 years.
  - 10% convert per year = 3,000 x (EUR 6,000 battery x 20% margin [ASSUMPTION] = EUR 1,200) = EUR 3.6M.
  - Minus the 0.5x bonus: 3,000 x EUR 225 = EUR 0.68M.
  - **Net about EUR 2.9M/yr**, plus a churn drop among vault holders because leaving means giving up the 50% bonus.
- **Demo:** The vault as the app's home screen: a single balance growing week by week with the source of each deposit. A slider shows "In 26 months your vault covers 18% of a 10 kWh battery."
- **Biggest risk:** Consumer-protection review. VREG or FOD Economie could read a conditional bonus as a disguised exit barrier. Legal check needed [ASSUMPTION]. Also cash-flow: the vault is a liability on Voltera's balance sheet.

---

## Comparison

| Idea | Voltera value per year (rough) | Build in 24h | Churn | Calls | Dynamic uptake | Self-consumption |
|---|---|---|---|---|---|---|
| 1 Piekgarantie | EUR 2.6M | Easy (15-min mock + slider) | ++ | ++ | 0 | + |
| 2 No-Regret Dynamic | EUR 2.1M+ | Easy (replay engine) | ++ | + | +++ | + |
| 3 Flexhuur | EUR 2.8M | Medium | + | 0 | + | +++ |
| 4 Vast Bedrag | EUR 3.2M | Medium (Monte Carlo) | +++ | +++ | (built in) | + |
| 5 Spaarkluis | EUR 2.9M | Easy UI | +++ | 0 | + | + |

**Recommended combo for the pitch:** "**Voltera Zeker**", one subscription made of Idea 2 as the entry product, Idea 1 as the add-on and Idea 5 as the wrapper. It covers all four symptoms (calls, churn, dynamic uptake, self-consumption) with one coherent business model rather than four features. One demo, the 15-minute replay engine, powers all three.

## STRONGEST INSIGHT:
The capacity tariff and dynamic prices did not only make bills confusing. They **moved risk from suppliers to households**, and households have neither the data nor the scale to manage it. Voltera has both: 15-minute data (recorded by default from 2026), a pool of 350k customers, and a wholesale book. So the winning business model is to **buy the risk back from the customer as a guarantee**: a kW ceiling, a "never worse than fixed" dynamic tariff, or a flat fee. Customers get certainty, which ends the confused calls. Voltera gets a product that can't be compared on price per kWh, which ends price-driven churn. And because Voltera now pays when the customer peaks or overspends, it has a real financial reason to switch on the flex, battery and dynamic levers it already owns. The guarantee is the one mechanism that turns Voltera from a bill-sender into the customer's co-pilot with money on the line. The jury can see and test it live on the same 15-minute replay.
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
# Lens: 05-cross-industry

**Approach:** Other industries have already dealt with Voltera's three problems: invisible cost drivers, bills nobody understands, and churn driven by price. I borrowed the *mechanism* each one used, not its UI. Each idea is marked with its source industry.

## Anchor numbers used throughout
| Fact | Value | Source |
|---|---|---|
| Capacity tariff, Flanders 2025 | ~€56/kW/yr (€48.87–56.93 depending on DSO); avg monthly peak 4.26 kW gives ~€239/yr | [Test-Aankoop](https://www.test-aankoop.be/woning-energie/gas-elektriciteit-mazout-pellets/antwoord-van-expert/capaciteitstarief-in-vlaanderen), [Fluvius/DBS tariff sheet](https://cdn.nimbu.io/s/4tn7vz5/channelentries/vjybw50/files/1753861944456/202510_dbs_tariefkaart.pdf?lmuahla=&dl=1) |
| Rule of thumb | ~€5 per kW above 2.5 kW, per month | [Victron community](https://community.victronenergy.com/t/capacity-tariff-peak-shaving-effekttariff-se-capaciteitstarief-be/53560) |
| Dynamic-contract penetration | 0.55% of Flemish customers, 0.40% of Belgium | [Ferranti / odot.be via search](https://www.ferranti.be/news/dynamic-contracts-the-pricing-model-for-a-sustainable-energy-future/) |
| EV share of new cars in BE, 2025 | ~35%, of which 89% are company cars | [go-electra](https://www.go-electra.com/en/newsroom/electric-car-subsidy-2025-flanders/), [ICCT](https://theicct.org/belgiums-tax-incentives-drive-electric-vehicles-in-corporate-fleets-may25/) |
| Switching behaviour | Average household has switched 3.4x since 2007; 36% "wait passively for a better offer" | [VRT/VREG](https://www.vrt.be/vrtnws/en/2024/09/26/fewer-households-changing-their-energy-supplier-even-though-they/) |
| Cost per contact (EU) | €2–8 per contact | [yoummday](https://www.yoummday.com/blog/2026/08/26/call-center-costs/) |
| Voltera baseline | 350k customers, 18% churn = **63,000 lost/yr** | case |

**Voltera unit economics [ASSUMPTION]:** gross margin €100 per customer per year; CAC €125 per new customer; ~390k contacts/yr after the +40% rise (0.8 → 1.1 per customer), 60% of them bill/tariff related = **~235k bill calls × €6 = €1.4M/yr**.
→ **Each 1 pt of churn = 3,500 customers ≈ €350k margin + €440k avoided CAC ≈ €0.8M/yr.**

---

## 1. SOLID: "Schaduwfactuur + Dynamic Money-Back" (telecom + airline/travel fintech)
**Pitch:** Each month we show you what you *would* have paid on every Voltera tariff. If you switch to dynamic and it costs you more over 12 months, we refund the difference.

- **Cross-industry mechanism:**
  - **Telecom (Ofcom).** Since 2020 UK providers must send "best tariff" notices, and renewals onto better deals rose **10–13 pp**, saving customers ~£110/yr ([Ofcom](https://www.ofcom.org.uk/phones-and-broadband/saving-money/end-of-contract-notifications-driving-better-deals-for-customers)).
  - **Hopper Price Freeze.** Hopper sells protection against price risk, and fintech products are **~50% of its revenue** ([Travel Weekly](https://www.travelweekly.com/Travel-News/Airline-News/Hopper-adds-new-fintech-options)).
  - Combined, this removes the one thing that keeps people off dynamic tariffs: **fear of downside**.
- **Problem → solution:** People don't adopt dynamic tariffs (0.55%) because they can't predict the result and fear a spike. Voltera re-prices each customer's real 15-min history under fixed, variable and dynamic tariffs (energy + capacity) and prints a one-line "shadow bill" on the monthly statement: *"On Dynamic you'd have paid €11.40 less in September."* Customers whose model shows a saving get a one-tap switch with a **12-month no-regret guarantee**. Voltera refunds any positive difference against their old tariff, paid as a credit on the annual bill.
- **Target:** Non-solar households with shiftable load (EV, heat pump, electric boiler). This is roughly the 20–30% of the base where the model shows more than €50/yr saving [ASSUMPTION].
- **Why now:** Day-ahead prices went to 15-min resolution in 2025 [ASSUMPTION: verify the SDAC 15-min go-live date]. Brussels has allowed dynamic contracts since 1 June 2025 ([VRT](https://www.vrt.be/vrtnws/en/2025/06/02/dynamic-electricity-tariffs-possible-in-brussels-from-1-june/)). There are 30+ suppliers offering dynamic contracts, but nobody offers a guarantee.
- **Money:**
  - Octopus Agile users averaged **£45/yr** less than Octopus's own fixed tariff, and 95% paid less ([Octopus Agile report](https://octoenergy-production-media.s3.amazonaws.com/documents/agile-report.pdf)). So only ~5% ever trigger a refund.
  - Refund cost: 20,000 switchers × 5% × avg €40 = **€40k/yr**.
  - Upside: switchers are engaged customers. Assuming churn among them falls from 18% to 12% [ASSUMPTION], that is 20,000 × 6% × (€100 + €125) = **€270k/yr**.
  - Flexibility is also worth money through lower sourcing cost at peak: [ASSUMPTION] €20 per customer per year × 20k = €400k.
  - **Net ≈ +€600k/yr.**
- **Demo:** Load a mock household's 15-min CSV. Three tariff columns calculate live, and a "Your shadow bill" card shows **"−€137/yr on Dynamic, guaranteed"**. Toggle "EV charges at 18:00 → 01:00" and watch the gap grow.
- **Biggest risk:** A price-spike winter (like 2022) makes the refund pool large. Mitigation: cap the refund (e.g. €100/customer) and hedge the refund pool.

---

## 2. SOLID: "Meterafschrift": your meter as a bank statement (fintech)
**Pitch:** Stop sending a bill and start sending an account statement. Every expensive quarter-hour appears as a transaction you can recognise, and the year-end settlement is always €0.

- **Cross-industry mechanism:**
  - **Monzo/Revolut** turned opaque bank balances into a **transaction feed + Pots + Salary Sorter** that sorts money into bills, spending and savings the moment salary arrives ([Monzo](https://monzo.com/blog/2019/09/26/introducing-salary-sorter-and-bills-pots)).
  - **Telecom bill-shock rules** (FCC/EU EECC) require an alert *before* a threshold is crossed ([FCC](https://www.fcc.gov/general/bill-shock-wireless-usage-alerts-consumers)).
- **Problem → solution (twist on the banned dashboard):** There are no graphs. The app shows a **ledger** of human-readable lines generated from 15-min data:
  - `Tue 18:15 · EV + oven · NEW monthly peak 6.2 kW · +€8.70 on this year's bill`
  - `Sat 13:00 · Dishwasher on own solar · −€0.40`

  Two "pots" come from the fintech playbook:
  - **Peak pot:** what this month's peak has cost so far.
  - **Settlement pot:** the running gap between your monthly advance (voorschot) and your real cost. When the gap passes €40, Voltera proposes a one-tap advance adjustment. The annual settlement then **never surprises**, which is the call driver.
- **Target:** All 350k customers, especially non-solar and less digitally literate ones. A transaction line reads like a bank app, a format everyone already knows.
- **Why now:** Digital meters and capacity tariff (2023+) make "one event → one euro amount" computable for the first time. Before them, the Ferraris meter only gave one number a year.
- **Money:**
  - Assume the ledger explains 30% of bill calls [ASSUMPTION] (Kraken claims up to 40% lower cost-to-serve via automation, [Kraken/Utility Week](https://utilityweek.co.uk/how-kraken-is-waking-up-customer-service-for-global-partners/)). 235k × 30% × €6 = **€420k/yr**.
  - Telecom reports ~5–7% churn reduction from proactive usage alerts ([Togai, vendor claim, treat as weak](https://www.togai.com/blog/telecom-customer-care-usage-based-billing-system/)). Assume 1 pt churn reduction: **+€0.8M/yr**.
  - Opower's randomized behavioral feedback cut consumption **2.0%** ([Allcott, J-PAL](https://www.povertyactionlab.org/evaluation/opower-evaluating-impact-home-energy-reports-energy-conservation-united-states)).
- **Demo:** A phone mockup with a scrolling feed of real mock-data transactions, one red "NEW PEAK" line, and a settlement pot that turns green after tapping "adjust advance to €112".
- **Biggest risk:** Mapping load to an appliance (NILM) is imprecise. Mitigation: label by time and size only ("large load, 18:15"), and let the user tag it once ("that's my car"), as Monzo does with merchant categories.

---

## 3. SOLID: "Piekdekking": peak cover in exchange for control (insurance telematics / Vitality)
**Pitch:** €3/month and your capacity-tariff peak is capped. In exchange, Voltera may throttle your EV charger or heat pump for a few minutes when you're about to set a new peak.

- **Cross-industry mechanism:**
  - **Usage-based car insurance.** You share data and accept terms, and you get a lower, predictable premium. Telematics cut hard braking by **up to 25%**, and habits persisted after incentives ended ([Penn Medicine](https://www.pennmedicine.org/news/usage-based-car-insurance-improves-driver-safety)).
  - **Vitality shared-value insurance.** The insurer shares the actuarial gain with the customer. Engaged members show **up to 67% lower lapse** ([Vitality](https://www.vitalitygroup.com/insights/discovery-vitality-linked-insurers-credited-pioneers-shared-value-insurance-2/)). Lapse is the insurance word for churn.
  - **Intelligent Octopus Go** shifts EV peak load by **42%** and saves £343/yr ([Octopus](https://octopus.energy/press/Intelligent-Octopus-Go-1GW/)).
- **Problem → solution:** An 11 kW home charger running for 15 minutes sets a monthly peak of ~12 kW instead of ~4 kW. Over 12 months that is 8 kW × €56 = **~€450/yr extra**, and the customer never sees it coming. With Piekdekking the customer picks a cap (e.g. 5 kW). Voltera connects to the charger/heat pump via OEM APIs or OCPP and modulates power when total load approaches the cap. **If the cap is breached for a reason Voltera controls, Voltera pays the difference.** This is an insurance *product* with a clear customer promise, not a generic optimisation algorithm.
- **Target:** EV households. That is 35% of new cars, and 89% of them are company cars ([ICCT](https://theicct.org/belgiums-tax-incentives-drive-electric-vehicles-in-corporate-fleets-may25/)). The employer usually reimburses the kWh but probably not the capacity-tariff hit [ASSUMPTION]. Heat-pump owners are the next segment.
- **Why now:** EV fleet growth plus the capacity tariff is a new, recurring €300–450/yr pain. Every home charger above 5 kW must be registered with Fluvius ([Mobility+](https://www.mobilityplus.be/en/blog/register-ev-charger)), so the target list is findable.
- **Money:**
  - Customer: saves ~€300/yr net of the €36 fee.
  - Voltera: 15,000 EV customers [ASSUMPTION] × 40% uptake = 6,000 × €36 = **€216k fees**.
  - Controllable flexibility: 6,000 × ~7 kW = **42 MW**, sellable to Elia balancing / used to avoid imbalance. At [ASSUMPTION] €40/kW/yr that is **€1.7M**. (Octopus sells 700 MW of flexibility from a similar fleet: [Octopus](https://octopus.energy/press/Intelligent-Octopus-Go-1GW/).)
  - Churn among covered customers falls to ~8% [ASSUMPTION]: 6,000 × 10% × €225 = **€135k**.
- **Demo:** A simulation in which the EV plugs in at 18:00, the "live kW" needle climbs toward the 5 kW cap, the charger visibly steps from 11 kW to 3.7 kW, and a counter shows "€37.40 peak cost avoided this month". A second run with cover off shows the new peak.
- **Biggest risk:** OEM/charger API access and liability if throttling leaves the car under-charged. Mitigation: the customer sets a "ready by 07:00, 80%" deadline, the same UX as Intelligent Octopus.

---

## 4. BOLD: "Vaste Prijs per Laadbeurt": upfront price for energy jobs (ride-hailing + airline yield management)
**Pitch:** You don't buy kWh, you book a job. "Charge to 80% by 7:00" is quoted at €4.10, locked, and Voltera carries all the price and peak risk.

- **Cross-industry mechanism:**
  - **Uber upfront pricing.** The rider accepts a fixed price for an outcome, and the platform absorbs the route and time risk.
  - **Airline yield management / fare lock.** A price is quoted and held ([Hopper](https://venturebeat.com/ai/hoppers-price-freeze-taps-ai-to-identify-and-lock-in-airfare-deals/)).
  - The customer never touches the three things that make energy confusing: time-of-use, 15-min prices and peak kW.
  - Uber's lesson: when the upfront price becomes a *minimum* instead of a fixed price, trust collapses and fare disputes follow ([Fast Company](https://www.fastcompany.com/40424171/lawsuit-accuses-uber-of-fare-fraud)). So the quote must be binding.
- **Problem → solution:** The customer taps a job (EV charge, pre-heat home via heat pump, boiler cycle, big wash). Voltera's optimiser uses day-ahead 15-min prices plus the peak cap to schedule it, then quotes a **fixed euro price**. Voltera keeps the spread between quoted and realised cost. This makes a dynamic tariff usable without the customer ever seeing a price curve. The app records "jobs" and their prices, which also feeds the bank-statement ledger from Idea 2.
- **Target:** EV and heat-pump owners who want savings with zero thinking, including the "passive 36%".
- **Why now:** 15-min day-ahead prices, smart-charger APIs, and a large company-car EV fleet with reimbursed kWh. An upfront price per job also gives a clean receipt for the employer [ASSUMPTION].
- **Money (per EV):**
  - 12,000 km × 18 kWh/100 km = 2,160 kWh/yr.
  - Unmanaged evening cost vs optimised night [ASSUMPTION: energy-only spread €0.08/kWh]. Quote at the midpoint: customer saves €0.04 × 2,160 = **€86/yr + ~€300 peak avoided**, and Voltera margin is €0.04 × 2,160 = **€86/yr**.
  - 5,000 EVs × €86 = **€430k/yr**, before flexibility revenue.
- **Demo:** Tap "Charge to 80% by 07:00". The screen shows "€4.10 · locked" and a hidden "under the hood" panel reveals the 15-min price curve and the chosen slots. Then the jury shocks the price curve (simulated spike) and the customer still pays €4.10 while Voltera's margin shrinks.
- **Biggest risk:** Regulatory. Is a "job price" a new tariff format under VREG/CREG transparency rules? It still needs a €/kWh equivalent shown. There is also forecast error on car state-of-charge.

---

## 5. WILD CARD: "Batterij op Vitality-voorwaarden": loss-framed home battery (health insurance)
**Pitch:** Get a home battery for €499. Your monthly payment drops to **€0** in every month you hit your self-consumption target and let Voltera trade the battery.

- **Cross-industry mechanism:** Under Vitality's **Active Rewards with Apple Watch**, you get the watch at a heavily discounted upfront price, and the monthly repayment **falls to zero if you hit activity goals** ([RAND evaluation](https://www.rand.org/content/dam/rand/pubs/research_reports/RR2800/RR2870/RAND_RR2870.pdf); [Sage study](https://journals.sagepub.com/doi/full/10.1177/2053951720950350)). It is loss framing: you *keep* money by behaving. Octopus Zero Bills shows the same idea in energy: a zero bill guaranteed for 10 years, funded by export and flexibility revenue ([Octopus](https://octopus.energy/press/octopus-launches-global-zero-bills-standard-for-energy-bill-free-living/)).
- **Problem → solution:** Solar customers in Flanders lost the reverse-running meter and self-consume poorly. Voltera already sells battery packages, but €5–7k upfront [ASSUMPTION] blocks most buyers. The offer: €499 down plus a €39/month "base" repayment over 10 years. Each month the customer earns €39 of credit from two sources:
  1. **Self-consumption ≥ 70%** (measured from 15-min data; the app shows a monthly bar they can influence by timing loads).
  2. **Battery available to Voltera** for trading and peak shaving for ≥ 90% of hours.

  Hit both and you pay €0. Loss framing keeps engagement high because customers check the app to avoid losing the €39.
- **Target:** Existing Voltera solar customers without a battery (estimate: 25% of the base has PV, 15% of those without a battery converting, ~13k households [ASSUMPTION]).
- **Why now:** No reverse-running meter plus the capacity tariff make batteries economically rational for the first time. Voltera already has the product and just needs a financing and engagement wrapper.
- **Money (per battery, 10 kWh / 5 kW) [ASSUMPTION]:**
  - Voltera-side value = imbalance/aFRR trading ~€250/yr + avoided sourcing at peak ~€100/yr + customer lock-in (10-yr relationship, churn → ~2%) worth 10 × €100 margin.
  - Voltera forgoes ~€468/yr of repayment in "perfect" months. Expect 60% of months earned, so ~€280/yr is forgone.
  - Cost: hardware €5,500 − €499 down ≈ €5,000 financed. Value: €350/yr trading + €190/yr collected repayments ≈ €540/yr → **~9-yr payback** before counting retention and cross-sell (heat pump).
  - Tight, and this is why it is the wild card. It becomes attractive if battery prices fall or flexibility prices hold.
  - Customer: saves ~€250–400/yr (self-consumption + peak) and pays ~€190/yr.
- **Demo:** A "months earned" calendar with 8/12 green. Tap a red month to see "self-consumption 61%: run the washing machine at noon on sunny days to earn next month's €39".
- **Biggest risk:** Balance-sheet financing (consumer credit law) and flexibility-revenue uncertainty. If revenue falls short, Voltera carries a lot of hardware.

---

## Cross-industry map (for the pitch slide)
| Industry | Mechanism | Voltera transfer |
|---|---|---|
| Telecom (Ofcom, FCC) | Best-tariff notice, bill-shock alert before threshold | Shadow bill (1), peak alert *before* the peak is set (2) |
| Travel fintech (Hopper) | Sell price-risk protection | No-regret dynamic guarantee (1) |
| Fintech (Monzo) | Transactions + pots + salary sorter | Meter statement, settlement pot (2) |
| Car insurance telematics | Data/control in exchange for a predictable, lower premium | Peak cover (3) |
| Ride-hailing (Uber) | Upfront fixed price for an outcome | Price per energy job (4) |
| Health insurance (Vitality) | Loss-framed device repayment linked to behaviour | Battery repaid by self-consumption (5) |

---

## STRONGEST INSIGHT:
**Every industry that fixed "invisible cost drivers" did it by moving risk, not by explaining more.**
- Telecom didn't teach people what a megabyte is. It capped the bill and alerted before the threshold.
- Uber didn't show riders surge maths. It quoted a fixed price.
- Insurers didn't lecture drivers. They traded a predictable premium for data and control.

Voltera's customers don't need to understand kW peaks or 15-min prices. They need **someone to own that complexity for a fee they can see.** The winning pitch combines Ideas 1, 3 and 4 into one promise: *"Voltera takes the risk: you get a guaranteed price, we manage the peak."* That covers all four symptoms with a single mechanism:
- **Calls:** there is nothing to explain.
- **Churn:** a guarantee is something competitors' price-per-kWh can't be compared against.
- **Dynamic uptake:** the downside is insured.
- **Self-consumption:** Voltera schedules against solar.

It also creates a new revenue line: aggregated flexibility (Octopus sells 700 MW of it). That is feasible with 2 devs in 24h on mock 15-min data.
# Lens: 06-contrarian

**Assumption under attack:** the case says "confused customers need to *understand* their bill." The data says they don't want to.
- Dynamic contracts: only **0.40%** of the Belgian market, even though suppliers with >200k customers must offer them ([VRT, citing CREG 2025](https://www.vrt.be/vrtnws/en/2025/06/02/dynamic-electricity-tariffs-possible-in-brussels-from-1-june/)).
- Energy sharing in Flanders: **7,779** access points, or **0.2%** ([Futech](https://futech.be/hoeveel-vlamingen-doen-aan-energiedelen/)).
- Groen reports that only about **5%** of digital meters are used as "smart" meters ([Groen](https://www.groen.be/5-procent-gebruikt-digitale-meter-als-slimme-meter)). Rollout itself is at **80%**, or 2.95M meters ([Fluvius](https://pers.fluvius.be/fluvius-starts-final-phase-of-digital-meter-rollout-and-informs-rai-premium-customers)).
- Octopus's managed charging works because customers do nothing: the new setting is "enabled automatically" and **~80%** of sessions finish well under the limit ([Octopus](https://octopus.energy/blog/intelligent-octopus-go-charge-limit/)).

**Contrarian thesis:** Voltera shouldn't sell *information* (dashboards, explanations, tips). It should sell **outcomes**: a capped peak, a fixed price, a rented battery. The complexity is a risk that Voltera can price, hedge and earn from, the way an insurer does. The app is also mostly the wrong channel.

Shared numbers used below:
- Capacity tariff: **€52–61/kW/yr** depending on the Fluvius area, with a minimum of 2.5 kW, calculated on the average of 12 monthly 15-min peaks ([callmepower](https://callmepower.be/nl/energie/gids/tarief/capaciteitstarief)). I use **€55/kW/yr**.
- Buying power from the grid costs ~**30 c/kWh** all-in. Injecting earns ~**4.4 c/kWh** on average (July 2026) ([Selectra](https://selectra.be/nl/energie/prijzen/injectietarief), [Test-Aankoop](https://www.test-aankoop.be/woning-energie/hernieuwbare-energie/nieuws/kosten-geinjecteerde-zonnestroom)).
- Flanders switching rate: **19.35%** for electricity in 2025 ([VREG](https://www.vlaamsenutsregulator.be/nieuws-en-persoverzicht/leverancierswissels-2025)). That matches Voltera's 18% churn.
- Human call cost in Europe: **€2–8 per contact** ([yoummday](https://www.yoummday.com/blog/2026/08/26/call-center-costs/)). I use **€6**.
- Voltera call baseline [ASSUMPTION]: ~1.26 contacts per customer per year after the +40% rise, so ~441k contacts. About 60% are bill or tariff questions, so **~265k bill calls, worth ~€1.6M/yr**.
- Customer economics [ASSUMPTION]: CAC **€150**, gross margin **€100/customer/yr**.

---

## 1. PIEKGARANTIE: insure the peak (SOLID)
**Pitch:** "Pick your peak. Voltera guarantees it, or pays the difference."

- **Problem → solution:** Customers can't manage a 15-minute kW peak they never see. So don't ask them to.
  - The customer picks a cap (e.g. 4 kW) and pays a small monthly premium.
  - Voltera guarantees that the capacity component of the bill is never billed above that cap. If the monthly peak goes over, Voltera credits the excess kW × €55/12.
  - Voltera limits its exposure with a consented control hook on one or two big loads (EV charger or heat-pump API, or a €30–50 P1 dongle plus smart relay [ASSUMPTION]). When the rolling 15-minute average heads towards the cap, the EV charger slows down for a few minutes.
  - Pricing is actuarial: every customer's past 15-minute data gives an exceedance probability, so the premium differs per household.
- **Target user:** EV and heat-pump households whose peaks are 6–9 kW. They are also the churn-prone, high-value segment.
- **Why now:**
  - The capacity tariff exists since 2023 and is billed on the 12-month average, so one bad evening costs money for a year.
  - EV chargers and heat pumps now expose control APIs.
  - The capacity tariff rises every year (€52–61/kW in 2026).
- **Money (customer):** 7 kW average peak capped at 4 kW → 3 kW × €55 = **€165/yr saved**. Minus the €60/yr premium, the customer nets **€105/yr**.
- **Money (Voltera):**
  - Segment: 350k × 15% EV/heat pump [ASSUMPTION] = 52k households. At 20% uptake, that is **10.5k customers**.
  - Premium revenue: 10.5k × €60 = **€630k/yr**, minus payouts (target loss ratio 30%) → ~€440k/yr.
  - Churn among subscribers drops from 18% to 10% [ASSUMPTION], so 840 fewer churners × €250 (CAC + 1 year of margin) = **€210k/yr**.
  - Total ≈ **€650k/yr**, plus peak-reduction data that is worth something to Fluvius.
- **Demo:**
  - A slider sets the cap from 3 to 8 kW. The mock 15-minute year replays at 100× speed.
  - Red spikes (the 18:00 oven + EV + dishwasher moment) get "shaved" live as the charger throttles.
  - A counter shows the result: "€165 saved, 0 extra minutes of charging on 97% of days."
- **Biggest risk:** Regulators may see a guaranteed cap as insurance, which could need an insurance licence or a partnership [ASSUMPTION]. Workaround: frame it as a "tariff option with bill credit". Second risk: adverse selection, which actuarial pricing on 15-minute history is meant to handle.

## 2. VOLTERA VAST: no bill at all, one number per month (SOLID)
**Pitch:** "€118 a month, all-in, for 12 months. You'll never read an energy bill again."

- **Problem → solution:** The call volume comes from bills that change and can't be explained. Take away the bill.
  - Voltera offers one all-in monthly price covering energy, network, capacity tariff and taxes. It is set from the customer's own 15-minute history plus a risk margin (~5%), with a comfort band of ±15% on consumption. Only a sharp overrun triggers a conversation.
  - Behind the scenes, Voltera buys at dynamic prices and captures the dynamic-tariff saving itself. It shifts consented loads (EV, boiler, heat pump) to cheap hours. The customer never touches a dynamic tariff, and **Voltera keeps the arbitrage** that 99.6% of customers leave unused today.
  - Once a year Voltera checks the customer's profile against the market and runs a "best-of" review: "you'd have paid €41 more on a standard contract."
  - Precedents: Holaluz's all-inclusive flat rate ([Holaluz](https://www.holaluz.com/en/electricity/flat-tariff)) and Endesa Única's fixed monthly quota with money back if you use less ([Endesa](https://www.endesa.com/en/unica/flat-rate-tariff-electricity-gas)).
- **Target user:** Non-solar households who want predictability, including vulnerable and low-digital customers.
- **Why now:**
  - The capacity tariff plus 15-minute data make a household's cost profile predictable enough to price.
  - The dynamic-contract obligation means Voltera already runs dynamic procurement.
  - After the 2022 crisis, bill shock is still fresh in customers' minds.
- **Money:**
  - At 20% uptake, 70k subscribers.
  - Calls: bill calls for these customers fall 70% [ASSUMPTION]. That is 70k × 0.76 bill calls × 70% ≈ 37k calls × €6 = **€224k/yr**.
  - Churn: 18% → 9% on a 12-month subscription [ASSUMPTION], so 6.3k fewer churners × €250 = **€1.58M/yr**.
  - Load-shift arbitrage: 30% of the 70k have a shiftable load, each shifting 1,500 kWh × 8 c spread [ASSUMPTION] = €120 each → **€2.5M/yr**.
  - Risk margin on 5% of ~€1,400/yr bill = €70 per subscriber (partly consumed by volume risk).
  - Total upside ≈ **€4M+/yr**.
- **Demo:**
  - Screen 1: the old 4-page bill with 23 line items fades into a single card: "€118/month. Fixed until Oct 2027."
  - Screen 2: the "Voltera engine room", a 15-minute mock profile where Voltera moves the EV load to cheap hours and a live P&L counter ticks up.
- **Biggest risk:** Volume and price risk, since warm-winter or cold-winter swings land on Voltera. Mitigations are hedging, the ±15% band, and pricing from actual 15-minute data. VREG billing-transparency rules may require a legally compliant annual statement anyway [ASSUMPTION].

## 3. PIEKBONNETJE: the bill explains itself, outside the app (SOLID)
**Pitch:** "One sentence, once a month, on WhatsApp or paper: what cost you money, when, and one YES to fix it."

- **Problem → solution:** The app is the wrong channel. Only ~5% of digital meters are used smartly, and the Voltera app only handles bills and payments.
  - Once a month Voltera sends a *causal receipt*, not a graph: "€14 of this month came from **Tuesday 3 Sep, 18:15–18:30: 7.2 kW** (probably EV + oven). Reply **JA** and we'll keep your peak under 4 kW from now on."
  - Mechanism: take the peak quarter-hour from the 15-minute data, attribute it to an appliance using a rule-based signature (EV ≈ flat 7.4/11 kW block, heat pump ≈ cold-morning ramp, oven ≈ 2–3 kW spike at dinner), and turn it into euros with €55/kW/12.
  - One reply converts the customer to Piekgarantie (#1) or Vast (#2).
  - Low-digital customers get the same receipt as one printed line on the paper bill.
  - This isn't a chatbot and it isn't a push for cheap hours. It comes after the fact and explains cause, sent once a month.
- **Target user:** All 350k customers. It is the funnel for #1 and #2.
- **Why now:** Kwartierwaarden (15-minute values) are available through the digital meter, which is at 80% rollout. The WhatsApp Business API is standard. The capacity tariff makes a single quarter-hour worth real money.
- **Money:**
  - Deflects 30% of the ~265k bill calls → 79k × €6 = **€476k/yr**.
  - Conversion: 3% of 350k reply JA → 10.5k upsells into #1 and #2.
  - Build and running cost: WhatsApp at ~€0.05 per message × 12 × 350k ≈ €210k/yr, but only for opted-in customers (say 40%) → ~€84k [ASSUMPTION]. **Net ~€390k/yr before upsell.**
- **Demo:** A phone mockup receives the message live, generated from mock 15-minute data. The jury member replies "JA" and the next month's simulation shows the peak flattened and €14 saved. Next to it is the paper-bill version of the same sentence.
- **Biggest risk:** If appliance attribution is wrong ("it wasn't the oven!"), trust is lost. Mitigation: always phrase it as "probably" and allow a one-tap correction, which also trains the rules. GDPR: 15-minute data needs explicit opt-in.

## 4. BATTERIJHUUR: Voltera rents your battery (BOLD)
**Pitch:** "You bought the battery. We pay you a fixed rent for 30% of it, and you never open a setting again."

- **Problem → solution:** Solar customers self-consume poorly. Each kWh they inject earns ~4.4 c, but each kWh they later buy back costs ~30 c. Batteries are running on dumb default modes.
  - Voltera signs a 3-year lease on a slice of the customer's battery (e.g. 3 kW / 3 kWh) for a **fixed €150/yr** credit on the bill.
  - Voltera then operates the battery with a clear priority order:
    1. Maximise self-consumption: the 25.6 c/kWh spread belongs to the customer.
    2. Keep the customer's capacity-tariff peak low.
    3. Use the rented slice for Elia balancing (FCR/aFRR) and Voltera's own imbalance position.
  - The customer gets a guaranteed rent and a better battery, without having to understand it.
- **Target user:** Voltera's solar + battery customers, then any of the **174k+ home batteries** in Flanders (~30k added in 2025) ([Solar Magazine](https://solarmagazine.nl/nieuws-zonne-energie/i43646/de-harde-cijfers-fluvius-verhoogt-jaargroei-tot-29-469-thuisbatterijen)).
- **Why now:**
  - Battery fleet +52% in 2025.
  - Residential aggregation into Elia services is barely served: Delta-EE's report for Elia found **Thermovault** was the only residential FCR provider ([Delta-EE for Elia](https://www.elia.be/-/media/project/elia/elia-site/public-consultations/2022/20221028_delta-ee_report-rtc_be_flex-published.pdf)).
  - The aFRR market is open to independent aggregators ([Flexcity](https://www.flexcity.energy/en/afrr-en-belgique)).
- **Money:**
  - Historic aFRR availability reached **€420k/MW-yr (up)** in 2021 ([Flexcity](https://www.flexcity.energy/en/afrr-en-belgique)). Prices have fallen since, so I use a conservative **€100–150/kW-yr** net [ASSUMPTION].
  - 3 kW × €125 = €375/yr gross per battery. After the €150 rent, Voltera keeps **€225**.
  - At 10k batteries [ASSUMPTION], that is **€2.25M/yr**.
  - Customer side: +€150 rent, plus ~300 kWh/yr of extra self-consumption × 25.6 c = **~€225/yr** in total.
  - Churn among renters is effectively zero during the 3-year lease.
- **Demo:** A split screen. Left, the customer's view: one card saying "€12.50 credited this month". Right, the Voltera fleet view: 10k mock batteries answering an Elia frequency dip in 4 seconds, plus a euro counter.
- **Biggest risk:** Elia prequalification and telemetry for small distributed assets, compatibility across battery brands and APIs, and warranty worries about cycling. Mitigation: start with 2 battery brands and use the imbalance and self-consumption value first, before FCR/aFRR.

## 5. VOLTERA NUL: the zero-bill retrofit (WILD CARD)
**Pitch:** "Octopus builds zero-bill *new* homes. Voltera makes *your existing* terraced house zero-bill."

- **Problem → solution:** The most extreme way to end bill confusion is to have no bill.
  - Octopus guarantees **no energy bill for 5–10 years** in new-build homes with solar, battery and heat pump, funded partly by export revenue. It targets 100k homes by 2030 and is already in the UK, DE, NZ and FR ([Octopus](https://octopus.energy/press/Wave-goodbye-to-energy-bills-Octopus-targets-100000-Zero-Bills-homes-by-2030/)).
  - Voltera does it as a retrofit. Voltera owns the solar (6 kWp) and battery (10 kWh) on the customer's roof and operates them as part of the #4 fleet.
  - The customer pays a fixed **€89/month for 15 years** for all their electricity, with no kWh, capacity tariff or injection lines. Today they pay ~€108/month [ASSUMPTION: 3,500 kWh × €0.33 + ~€150 capacity].
- **Target user:** Owner-occupiers who can't or won't spend €12.5k upfront. That fits a bank-loan-averse Flemish segment [ASSUMPTION].
- **Why now:** Batteries got "fors goedkoper" (much cheaper) in 2025–26 ([Batibouw](https://www.batibouw.com/nl/articles/1414/thuisbatterijen-fors-goedkoper-waarom-de-markt-opnieuw-boomt-in-belgie)). The reverse-running meter is gone, so self-consumption plus flexibility is now the only way to make solar pay, and that is exactly what a professional operator is good at.
- **Money per home per year** [ASSUMPTIONS]:

| | €/yr |
|---|---|
| Revenue: fixed fee (€89 × 12) | 1,068 |
| Revenue: battery flex (from #4) | 300 |
| Revenue: surplus sold via energy sharing / injection | 150 |
| Cost: residual grid import (1,400 kWh × €0.25) | −350 |
| Cost: capex €12.5k at 3.5% over 15 yrs (annuity) | −1,085 |
| **Net per home** | **≈ +€80/yr** |

  - The margin is thin. The real value is a customer locked in for 15 years with no CAC and no churn: roughly €150 CAC + €1,500 of lifetime margin preserved per home.
  - At 5k homes, the capex is €62.5M, so this needs green asset financing.
- **Demo:** Type an address and the mock roof gets solar and battery. It shows "€89/month, fixed until 2041", with a 15-year chart of the customer's flat line against rising standard-tariff bills.
- **Biggest risk:** Capital intensity (€62.5M for 5k homes) and a thin margin that depends on flex revenue lasting. It needs a green-bond or financing partner, and it goes beyond the brief's rule of "no 10-year moonshots without a pilot path". The pilot path is 100 homes in one Fluvius area, financed off #4's cash flow.

---

**How they stack into one story:**
- #3 (Piekbonnetje) is the free funnel for every customer.
- The "JA" reply converts customers into #1 (Piekgarantie) or #2 (Vast).
- Solar customers get #4 (Batterijhuur).
- #5 (Voltera Nul) is the endgame.

Together they cover all four symptoms with one principle: **Voltera takes on the complexity and gets paid for it.**
- Calls: #3 and #2.
- Churn: #1, #2 and #4.
- Dynamic-tariff uptake: #2 captures the value without the customer ever choosing a dynamic tariff.
- Self-consumption: #4 and #5.

## STRONGEST INSIGHT:
The case assumes confusion is a knowledge gap that clearer information will fix. The market has already tested that assumption and it failed. Dynamic contracts sit at **0.40%**, energy sharing at **0.2%** of access points, and only about **5%** of digital meters are used smartly, even with mandatory offers and 80% meter rollout. Belgian households don't want to become energy traders who watch 15-minute peaks. The capacity tariff and dynamic prices have turned the electricity bill into a *risk*, and risk is something a company can **price, pool, hedge and earn a margin on**. A household can't. Voltera's winning move is to act like an insurer and fleet operator rather than a teacher. It should sell guaranteed outcomes (a capped peak, a fixed monthly number, a fixed battery rent) and run the flexibility behind them itself with the 15-minute data. Then the value that customers leave unused today (arbitrage, peak shaving, balancing revenue) becomes Voltera's margin, and the reason customers call and churn goes away. **Pitch line: "Other suppliers explain the bill. Voltera guarantees it."**
# Lens: 07-competitive

## TL;DR: the landscape in 60 seconds
| Player | What they already do (BE unless noted) | What they do NOT do |
|---|---|---|
| **Engie** | Smart app shows monthly peaks plus a "cost-neutral monthly peak", and next-day quarter-hour prices ([engie.be/smart-app](https://www.engie.be/nl/capaciteitstarief/smart-app/), [Dynamic](https://www.engie.be/nl/dynamic-tarief/)) | Passive. It shows you the peak but doesn't act on it or guarantee anything |
| **Luminus** | Dynamic Online. App links PV, battery and charger. Smart charging on the next-day prices published at 14:00 ([luminus.be](https://www.luminus.be/nl/prive/energietarieven/dynamic/), [batteries](https://www.luminus.be/nl/prive/energieoplossingen/thuisbatterijen/)) | Value only for households that bought hardware |
| **Bolt** (Luminus/EDF) | You pick your local producer ([boltenergie.be/producers](https://www.boltenergie.be/nl/producers), [wiki](https://nl.wikipedia.org/wiki/Bolt_Energie)) | The producer link is a story only: no price or timing effect |
| **Eneco** | "Slimme thuisbatterij" (launched 26 Jun 2025): automatic steering, grid-balancing cashback up to €250/yr, **no dynamic contract needed** ([Eneco news](https://news.eneco.be/eneco-lanceert-als-eerste-leverancier-een-slimme-thuisbatterij-met-jaarlijkse-netbalans-beloning), [product](https://eneco.be/nl/energieoplossingen/slimme-thuisbatterij/)) | Only for batteries bought from Eneco. Cashback paid after the fact |
| **Frank Energie** | Active in NL/BE/ES/FR. Smart charging on Belpex **plus imbalance** prices. Battery imbalance trading with an 85/15 split, brand-open ([Luna press](https://luna.be/en/press-releases-customers/frank-energie-biedt-als-enige-slim-laden-op-basis-van-dynamische-markt-en-onbalansprijzen/), [Frank slim handelen](https://www.frankenergie.nl/nl/slimme-diensten/slim-handelen)) | Hardware owners only. Whether battery trading is fully live in BE is unconfirmed [ASSUMPTION] |
| **Ecopower** | Dynamic "Burgerstroom" (quarter-hour pricing). Cooperative energy sharing. Dynamic-price simulator with EnergyID ([ecopower](https://ecopower.be/groene-stroom/dynamische-burgerstroom), [simulator](https://ecopower.be/nieuws/ecopower-en-energieid-lanceren-simulator-dynamische-prijs)) | If you leave dynamic, you wait **1 year** before you can come back: the opposite of de-risking |
| **Mega** | Cheapest-price positioning, 4 months of free energy for new customers, telco bundle, quarter-hour dynamic ([selectra](https://selectra.be/nl/energie/leverancier/mega)) | Competes on price alone |
| **Octopus** (UK/DE/US) | Fan Club: 50% off when the local turbines spin, ~£200/yr average saving, 36k requests to expand ([Octopus press](https://octopus.energy/press/sea-breezes-and-bill-eases-octopus-energys-offshore-wind-fan-club-delivers-one-year-of-savings-for-grimsby-residents/)). AI email handles 34% of queries (≈250 FTE) ([CityAM](https://www.cityam.com/ai-doing-the-work-of-over-200-people-at-octopus-chief-executive-says/)). In BE it only licenses Kraken to Noven ([Octopus press](https://octopus.energy/press/octopus-energy-groups-kraken-will-control-heat-pumps-and-other-energy-tech-to-automatically-reduce-bills-for-belgian-households/)) | Not a BE retail supplier [ASSUMPTION] |
| **Tibber** (NL) | Dynamic only. Can cap EV charge power ([easyswitch](https://www.easyswitch.nl/energieleveranciers/tibber/)) | Not in BE [ASSUMPTION]. The cap covers the EV, not the whole house |

### Market facts that frame every idea
- **Flemish household switching rate in 2025 was 18.94%** (562,481 households) ([VREG](https://www.vlaamsenutsregulator.be/nieuws-en-persoverzicht/leverancierswissels-2025)). Voltera's 18% churn is **the market average**. The whole market is a revolving door.
- **Dynamic contracts: 20,552 at end of 2025, which is 0.4% of households**, even though 18 suppliers offer 34 dynamic products ([VREG via search](https://www.vlaamsenutsregulator.be/publicaties/rapp-2026-07), [VRT](https://www.vrt.be/vrtnws/nl/2025/04/24/prijzenrapport-vreg/)). There's plenty of supply and almost no demand. The bottleneck is fear, not availability.
- **Capacity tariff 2026: about €53.39/kW/yr excl. VAT (≈€56.6 incl.). Average monthly household peak is 4.24 kW. Minimum is 2.5 kW** ([callmepower](https://callmepower.be/nl/energie/gids/tarief/capaciteitstarief)).
- **189,100 home batteries in Flanders (Sep 2026)**, +52% growth in 2025 ([Solar Magazine](https://solarmagazine.nl/nieuws-zonne-energie/i44898/de-harde-cijfers-vlamingen-installeerden-dit-jaar-al-ruim-10-000-thuisbatterijen-daadwerkelijke-groei-nog-fors-hoger)). Eneco says ~150k of them are "underused", about 1 GW of potential.
- Energy sharing: 1,076 projects, 497 of them person-to-person ([Fluvius](https://pers.fluvius.be/meer-dan-1000-projecten-rond-energiedelen)). It exists but it's niche and paperwork-heavy.

**Pattern:** every competitor's digital feature is either **passive** (it shows a peak or a price) or **hardware-gated** (buy a battery, EV or charger first). Nobody in BE **carries the new tariff risk for the customer**. That is the open position.

### Shared baseline math (used below)
- Margin per residential customer: **€100/yr** [ASSUMPTION, electricity + gas]. CAC (comparator fee plus welcome bonus): **€150** [ASSUMPTION; Mega's "4 months free" suggests CAC is even higher].
- **1 churn point = 3,500 customers × (€100 margin + €150 CAC) ≈ €875k/yr.**

---

## 1. SOLID: "Piekplafond": a whole-house capacity-tariff guarantee
**Pitch:** "Pick your peak. We guarantee your capacity tariff never exceeds it, or we pay the difference."

- **Gap vs competitors:** Engie *shows* the cost-neutral peak. Tibber caps *only the EV*. Nobody caps the **whole house** or puts money behind it.
- **Problem → solution:** EV, heat pump and cooking loads stack at 18:00 and set one expensive quarter-hour per month. The customer finds out weeks later.
  - A P1-port dongle (~€40 [ASSUMPTION]) reads live 15-min average power.
  - The customer ranks the loads they delegate (EV charger via OCPP/cloud API, boiler via relay, heat pump via SG-Ready).
  - When the rolling quarter-hour average heads toward the cap, the controller pauses delegated loads in the customer's priority order. Non-delegated loads are never touched.
  - If the monthly peak still breaks the cap, Voltera credits (actual − cap) × tariff on the next bill.
- **Target:** EV, heat-pump and large-battery households, roughly 10% of the base, so ~35k [ASSUMPTION].
- **Why now:** the capacity tariff started in 2023 and still confuses people. EV and heat-pump growth keeps pushing peaks up. The digital meter must be everywhere by July 2029 ([VREG dashboard](https://www.vlaamsenutsregulator.be/cijfers/dashboard-digitale-meters)).
- **Money:**
  - Customer: an uncontrolled EV home peaks around 7.5 kW → capped at 4 kW → 3.5 kW × €56.6 = **€198/yr saved**.
  - Voltera: €2.99/month = €36/yr. 30% of 35k = 10.5k subscribers → **€378k/yr**, minus a guarantee payout reserve of ~10% [ASSUMPTION].
  - Plus a 3-point churn drop in that segment [ASSUMPTION]: 315 customers × €250 = **€79k/yr**.
  - Plus fewer "why is my network cost so high" calls.
- **Demo:** a live meter shows house load climbing (EV + oven + heat pump). At 3.8 kW the EV throttles automatically and the cap line holds. A month view shows "Guarantee: €0 owed. Saved vs last year: €16.40."
- **Biggest risk:** integration friction per device brand. The customer has to activate the P1 port in Mijn Fluvius.

## 2. SOLID: "Dynamisch zonder spijt": dynamic tariff with a 12-month regret refund
**Pitch:** "Try dynamic for a year. If your old contract would have been cheaper, we refund every cent."

- **Gap vs competitors:** there are 34 dynamic products and 0.4% uptake. Ecopower even adds a **1-year lock-out** if you leave dynamic. Nobody removes the downside, and the downside (memories of the 2022 price spike) is the real barrier.
- **Problem → solution:**
  - A shadow-bill engine prices the customer's actual 15-min data every month on **both** the dynamic contract and the variable contract they left.
  - The app shows one number: the running difference.
  - At month 12, if the dynamic total is higher, Voltera pays the gap, capped at €150 [design choice].
  - The same engine answers "why is my bill this amount?" line by line (kWh × quarter-hour price, capacity peak, fees). That targets the +40% call volume.
- **Target:** digital-meter households with some flexible load (dishwasher, washing machine, EV, battery). That's 150k+ customers [ASSUMPTION].
- **Why now:** VREG's price report says dynamic was cheaper than variable or fixed ([VRT](https://www.vrt.be/vrtnws/nl/2025/04/24/prijzenrapport-vreg/)). Quarter-hour dynamic pricing is now standard (Ecopower and Mega). Supply doubled in 2025.
- **Money:**
  - Move 5% of the base (17.5k) to dynamic.
  - Refund cost: 20% of participants lose, by €60 on average [ASSUMPTION] → €12/participant → **€210k/yr**.
  - Gain: Voltera no longer hedges these volumes. A hedge/risk premium of €30/customer/yr is avoided [ASSUMPTION] → **€525k**.
  - Plus a churn drop from 18% to 12% for dynamic users [ASSUMPTION], because the shadow bill shows them what staying earns: 1,050 customers × €250 = **€262k**.
  - Net ≈ **+€575k/yr**.
- **Demo:** upload a mock 15-min CSV and see two bill lines race month by month. The "regret meter" stays at €0. Click any day to see which quarter-hours made money and which cost money.
- **Biggest risk:** a winter price spike makes the refund pool expensive. Mitigate with a per-customer cap and by reinsuring the tail through the wholesale desk.

## 3. SOLID: "Zonnebuur": a neighbourhood sun club (Octopus Fan Club, built from Voltera's own roofs)
**Pitch:** "When your street's Voltera roofs overproduce, your electricity is 30% cheaper, and your solar neighbour earns more."

- **Gap vs competitors:** Bolt tells a local-producer *story* with no price effect. Octopus proved local-asset discounts work (~£200/yr, 36k requests), but it uses wind farms and isn't in BE. Voltera already **owns the asset**: tens of thousands of solar customers it sold panels to.
- **Problem → solution:**
  - Every 15 minutes, compute net export per postcode from Voltera's solar customers (mock data in the demo).
  - When it's above a threshold, non-solar Voltera customers in that postcode get a "Zonnebuur" discount on energy used in that window. Delay-start appliances or one smart plug run automatically.
  - Prosumers get +1 c/kWh on surplus that is matched locally.
  - Twist vs banned #4: this is not a generic cheap-hour push. The signal is **"your neighbour's roof"**, it runs automatically, and it pays both sides.
- **Target:** Voltera's non-solar customers living near solar customers, plus prosumers who are unhappy since the reverse-running meter ended.
- **Why now:** midday prices are often ≤€0 in summer. The reverse-running meter is gone, so prosumers feel robbed on injection. Batteries (+52%) will make midday surplus scarcer later, so the window to own the "local sun" brand is now.
- **Money:**
  - 50k participants shift 300 kWh/yr each into solar hours = 15 GWh.
  - Spread between evening and midday wholesale price ≈ €0.12/kWh [ASSUMPTION] → €1.8M gross value.
  - Pay 50% out as discounts and prosumer bonus → **€0.9M/yr retained**.
  - Churn: 2 points lower among participants → 1,000 × €250 = **€250k**.
- **Demo:** a Gent postcode map with glowing roofs. "Now: 312 Voltera roofs are exporting 1.1 MW. Your washing machine just started. −€0.41." The prosumer view shows "Your roof powered 4 neighbours today (+€0.37)."
- **Biggest risk:** settlement. If non-dynamic customers are still settled on synthetic load profiles rather than their measured quarter-hours, the shift doesn't lower Voltera's actual sourcing cost [ASSUMPTION, verify the current Flemish allocation rules]. Fallback: offer it only to customers on quarter-hour allocation.

## 4. BOLD: "Batterijvoorschot": €150 on day one for the battery you already own
**Pitch:** "Bring any home battery to Voltera. We pay you €150 upfront and trade it for you."

- **Gap vs competitors:** Eneco only pays for *its own* batteries, after the fact. Frank splits 85/15 but pays in arrears. There are **189k batteries in Flanders**, mostly bought through installers and not tied to any supplier. The customer's objection is "I don't believe the flex revenue", so turn it into cash up front.
- **Problem → solution:**
  - Onboarding connects the battery by brand cloud API (Huawei, SMA, SolarEdge, Sessy etc. [ASSUMPTION on API access]).
  - Voltera, as balance-responsible party, pools the batteries against imbalance prices (and later aFRR via an aggregator partner such as Flexcity ([flexcity](https://www.flexcity.energy/en/afrr-en-belgique))).
  - €150 is credited on signup and recouped from the first earnings. After that the split is 80/20. A pro-rata clawback applies if the customer leaves within 24 months.
- **Target:** the ~189k Flemish battery owners, most of whom are **not** Voltera customers. This is an **acquisition** play, not just retention.
- **Why now:** battery stock grew 52% in 2025. Eneco (Jun 2025) and Frank are moving in. The first supplier to lock these owners in wins the flex pool before imbalance spreads shrink.
- **Money:**
  - Gross trading per 10 kWh battery: €250–400/yr [ASSUMPTION; Eneco's "up to €250" cashback is the customer share, a lower bound].
  - Voltera's 20% = €60–80.
  - Capture 3% of 189k = 5,700 → **≈€400k/yr trading margin**.
  - Plus 5,700 new customers × €100 margin = **€570k/yr**, with the €150 advance roughly replacing the €150 CAC and then being recouped.
  - Plus ~6 MW / 57 MWh of flex to offset Voltera's own imbalance.
- **Demo:** a 3-click onboarding flow: brand → connect → "€150 credited". Then a replay of last week's real-shaped imbalance prices, with the battery charging and discharging and the euro counter rising.
- **Biggest risk:** revenue compression as batteries flood balancing markets (Elia expects flex needs to rise 54–64% over a decade ([Elia study](https://www.elia.be/en/electricity-market-and-system/adequacy/adequacy-studies)), but supply is growing faster). Also advance write-offs from early churners.

## 5. WILD CARD: "Stuur me weg": a profile-based comparator that sometimes recommends a competitor
**Pitch:** "Upload your quarter-hour data. We price it on every Belgian tariff card, and if someone else is cheaper for *your* profile, we tell you, or we match them."

- **Gap vs competitors:** V-test and the commercial comparators price on **annual kWh**. After the capacity tariff and dynamic pricing, **when** you use power and **your peak** decide the bill, and no comparator uses the 15-min profile [ASSUMPTION, verify V-test roadmap]. Tariff cards are public PDFs (e.g. [Engie Dynamic card](https://dtcmedia.s3.eu-central-1.amazonaws.com/tariffcard/1319611/nl-be-engie-dynamic-electricity-september-2025.pdf)).
- **Problem → solution:**
  - Anyone downloads their quarter-hour CSV from Mijn Fluvius and drops it in.
  - The engine (the same shadow-bill engine as idea 2) reprices it across the ~120 fixed, variable and dynamic cards on the market.
  - The result shows the top 3, **including competitors**, plus which Voltera product fits best.
  - For existing customers there's an annual "profiel-prijsgarantie": if a same-type competitor card is more than €50 cheaper on their actual profile, Voltera credits the difference (capped) or helps them leave.
- **Target:** the 562k Flemish households that switch every year, reached at the exact moment they compare.
- **Why now:** 123 contracts on the market (25 fixed, 64 variable, 34 dynamic) make comparison impossible by hand. Every switcher is shopping anyway.
- **Money:**
  - Lead gen: convert 1% of annual switchers = 5,600 customers × €100 = **€560k/yr**, at near-zero CAC versus €150 through comparators (**€840k CAC avoided**).
  - Guarantee cost: 10% of 350k eligible, 10% claim × €50 [ASSUMPTION] = **€175k**.
  - The trust brand effect on churn is unpriced upside.
- **Demo:** drag in a CSV. Leaderboard: "Voltera Dynamic €1,142 · Competitor X €1,168 · Your current contract €1,390". Flip a profile (add an EV) and watch the ranking reshuffle live.
- **Biggest risk:** if Voltera is mid-priced, the tool advertises competitors and the guarantee bleeds money. Comparator rules (VREG/CREG charter) may also apply [ASSUMPTION]. Limit the guarantee to same-type cards and cap it.

---

## STRONGEST INSIGHT:
Voltera's 18% churn is not a Voltera problem. It is the **Flemish market average (18.94% in 2025, 562k households)**. In a market where 123 contracts look identical, the only thing a customer can compare is price. Every competitor's digital answer is either **passive** (Engie shows your peak, Mega shows the price) or **hardware-gated** (Eneco, Frank and Luminus pay only if you bought a battery or EV charger). Meanwhile 99.6% of households stay off dynamic, despite 34 products and VREG saying dynamic is cheaper. That means **fear of the new tariff risk** is the barrier, not information. Suppliers manage price risk for a living. The unowned position in Belgium is to **sell certainty on top of the new complexity**: a peak cap with a guarantee, a dynamic tariff with a refund, and a battery revenue advance. All three run on one shadow-bill engine over 15-min data (demoable on mock data in 24h), and each one gives the customer a reason to stay that a cheaper competitor's price card can't copy overnight.
# Lens: 08-sustainability

Lens: sustainability and societal impact that also has to make economic sense. Topics: energy poverty, grid congestion, peak shaving, self-consumption, and customers with low digital literacy.

## Fact base (researched, used below)

| Fact | Number | Source |
|---|---|---|
| Capacity tariff price 2026 | ~€53.39/kW/yr excl. VAT (DSO range 2025: €48.87–60.53) | [callmepower](https://callmepower.be/nl/energie/gids/tarief/capaciteitstarief), [Fluvius](https://www.fluvius.be/nl/factuur-en-tarieven/capaciteitstarief/gezinnen-en-kleine-ondernemingen/aangerekend) |
| Average Flemish household monthly peak | 4.24 kW, about €237/yr incl. VAT. The 2.5 kW floor costs about €140–150/yr | [callmepower piekvermogen](https://callmepower.be/nl/energie/gids/tarief/piekvermogen) |
| Energy poverty | 16.4% of households in Flanders, 28.2% in Brussels | [KBS Barometer Energiearmoede 2024](https://media.kbs-frb.be/nl/media/11815/Barometer%20Energiearmoede%202024) |
| Digital vulnerability | 40% of Belgians aged 16–74. 35% of Flemings have weak digital skills (53% among the low-educated) | [KBS Barometer Digitale Inclusie 2024](https://kbs-frb.be/nl/barometer-digitale-inclusie-2024), [Mediawijs](https://www.mediawijs.be/nl/artikels/cijfers-over-digitale-inclusie-vlaanderen) |
| Solar self-consumption without a battery | 30–40%. Injection is paid €0.04–0.06/kWh | [surgepv](https://www.surgepv.com/blog/solar-self-consumption-rules-europe), [bebat](https://www.bebat.be/en/academy/the-home-battery-interesting-investment) |
| All-in household retail price | about €0.358/kWh (Dec 2025) | [globalpetrolprices](https://www.globalpetrolprices.com/Belgium/electricity_prices/) |
| Negative day-ahead hours in BE | 519 h over 103 days in 2025, up from 404 in 2024, mostly Mar–Sep | [Electricity Maps 2025](https://www.electricitymaps.com/grid-in-review-2025/belgium) |
| Inverter trips from overvoltage | 5,042 complaints in 2023; 2,613 by Sept 2024 | [Fluvius pers](https://pers.fluvius.be/minder-klachten-over-uitvallende-omvormers-door-actieplan-fluvius) |
| Energy sharing in Flanders | 6,549 share with themselves, 2,494 sell peer-to-peer, 551 share within a building | [VREG](https://www.vlaamsenutsregulator.be/elektriciteit-en-aardgas/energieprijzen-en-facturen/energiedelen-en-energie-verkopen) |
| Home batteries in Flanders | more than 185k registered. Only about 1 in 10 Belgians knows a battery must be registered | [Solar Magazine](https://solarmagazine.nl/nieuws-zonne-energie/i43646/de-harde-cijfers-fluvius-verhoogt-jaargroei-tot-29-469-thuisbatterijen), [VRT 2026](https://www.vrt.be/vrtnws/nl/2026/09/01/thuisbatterijen/) |
| Social tariff | covers about 20% of households. The 2025 government agreement plans to reform it into an income-based lump sum | [klimaat.be 2025](https://klimaat.be/doc/2025-landscape-of-carbon-and-energy-taxation.pdf) |
| Household flexibility precedent | Octopus Saving Sessions: 700k households, 1.86 GWh shifted, £5.4m paid out | [Octopus analysis](https://octoenergy-production-media.s3.amazonaws.com/documents/Octopus_Energy_Saving_Sessions_Analysis.pdf) |
| Residential FCR | open to residential load; aFRR in trials | [Delta-EE for Elia](https://www.elia.be/-/media/project/elia/elia-site/public-consultations/2022/20221028_delta-ee_report-rtc_be_flex-published.pdf) |

**Voltera baseline assumptions** (used in all the math):
- 350k customers. 18% churn is about 63k customers lost per year.
- About 18% of customers are energy-poor, roughly **63k households** (Flemish/Brussels weighted mix) [ASSUMPTION].
- Replacing a churned customer costs €120 in acquisition [ASSUMPTION].
- A support call costs €7 [ASSUMPTION].
- VAT on household electricity is 6% [ASSUMPTION: current BE rate].

---

## 1. PiekLicht (SOLID): a €25 traffic light on the meter, no app needed

**Pitch:** A plug-in lamp shows green, orange or red for your capacity tariff *right now*. It is built for the 40% of people who will never open an energy app.

- **Problem → solution:** The capacity tariff charges you for the highest 15 minutes of each month, but nobody can *see* that 15-minute window. Voltera ships a dongle that plugs into the P1 port of the digital meter (the same hardware as HomeWizard-type readers) and drives an LED light or plug-in night light:
  - **Green:** under 2.5 kW, which is below the tariff floor and costs you nothing extra.
  - **Orange:** above 2.5 kW but still below this month's peak so far. The extra is already paid for.
  - **Red:** you are about to set a new monthly peak. The light blinks and a short tone plays.
  - Once a month a **paper "piekkaart"** arrives with the bill. It says in plain language which moment set the peak (for example "Tuesday 18:15: oven + kettle + dryer") and what it cost.
  - It works offline, needs no smartphone, and takes zero literacy.
- **Why it isn't banned idea #2 (dashboard) or #4 (push notifications):** there's no screen and no notifications. It is ambient feedback in the moment that matters, aimed at the least digital customers. The "feedback arrives weeks later" problem goes to zero latency.
- **Target user:** elderly, energy-poor and low-digital households. Also every capacity-tariff "why is my bill higher" caller. Distributed through OCMWs and Energiehuizen as a trusted channel.
- **Why now:** the capacity tariff has run since 2023 and is now ~€53/kW. Digital meters are mandatory everywhere by 2029. Heat pumps and EVs are pushing peaks up.
- **Money:**
  - *Customer:* moving the average peak from 4.24 to ~3.0 kW saves 1.24 × 53.39 × 1.06 = **€70/yr**. Going all the way to the 2.5 floor saves **€98/yr**.
  - *Voltera, if rolled out to 63k vulnerable households:*
    - Hardware at €25 (bulk) plus €10 shipping is €2.2M one-off [ASSUMPTION].
    - Calls: if these households make 1.2 bill calls/yr and PiekLicht removes 0.5 of them, that is 31.5k calls × €7 = **€220k/yr** [ASSUMPTION].
    - Churn: if it drops from 18% to 12% in this group, that is 3.8k customers kept × €120 = **€454k/yr**.
    - Payback is about 3 years. It can also be co-funded by municipalities or the social climate fund [ASSUMPTION].
- **Demo:** An ESP32 with an LED strip on the table, replaying mock 15-minute data. A dev "switches on" oven + kettle + EV in a simulator and the lamp turns red in real time. The paper piekkaart is printed live. Punchline: "Grandma saved €98 without ever downloading an app."
- **Biggest risk:** hardware logistics and support at scale. Customers also have to activate the P1 port through Fluvius, which is an extra step. Mitigation: bundle P1 activation into the installation visit by a partner NGO.

---

## 2. Zonnebuur (SOLID): the solar surplus from your roof goes to the energy-poor neighbour down the street

**Pitch:** Your midday surplus earns €0.04 today. Voltera pays you €0.09 by sharing it with a vulnerable neighbour, who pays less than Voltera's normal energy price.

- **Problem → solution:**
  - A prosumer without a battery injects 60–70% of their production and gets €0.04–0.06/kWh for it.
  - Meanwhile energy-poor households are often at home at midday (pensioners, job seekers, single parents).
  - Flanders already allows **peer-to-peer sales and energy sharing** through Fluvius, which calculates the allocation from the digital meters. Only 2,494 people use it, because setting it up is a bureaucratic ordeal.
  - Voltera becomes the **matchmaker and paperwork engine**: it signs up both sides, registers the group in Mijn Fluvius, and settles the kWh on both bills.
  - The prosumer sees "€61 extra: you powered Maria's washing machine for 212 days." Maria sees a lower energy line on her bill.
- **Target user:** Voltera's solar customers (the self-consumption problem) paired with non-solar energy-poor customers who rent or live in apartments.
- **Why now:** 519 negative-price hours show that midday solar has almost no market value. The sharing framework is live but used by fewer than 10k people. The social tariff is being reformed, so a market-based complement is timely.
- **Money (per pair, 1,000 kWh/yr shared)** [ASSUMPTION: 5 kWp at 950 kWh/kWp is 4,750 kWh; 35% self-consumed leaves ~3,090 kWh injected]:
  - Prosumer: €0.09 instead of €0.04 is **+€50/yr**.
  - Neighbour: pays €0.10 instead of a ~€0.14 energy component [ASSUMPTION]. That is **−€40/yr**. Network costs and levies on shared kWh still apply, and the pitch must say so honestly.
  - Voltera: takes a €0.01/kWh platform fee, which is €10 per pair. The bigger gain is retention: two linked customers are sticky.
  - *At 10k pairs:*
    - Fees: €100k.
    - Churn falls from 18% to 9% on 20k customers, keeping 1.8k customers × €120 = **€216k/yr**.
    - Social headline: **10 GWh/yr** of local solar used locally, and €400k/yr stays in energy-poor households.
- **Demo:** A street map with mock households. A slider for sun intensity shows the prosumer's surplus flowing to matched neighbours in 15-minute steps, and both bills update side by side.
- **Biggest risk:**
  - Shared kWh still carry network costs, so the saving for the neighbour is modest.
  - The regulatory detail may differ from our model, e.g. whether sharing is allowed across suppliers or across different distribution areas [ASSUMPTION].
  - Matching only works when midday demand really exists, so it must be checked against the 15-minute data.

---

## 3. Zonne-uren Tarief (SOLID): a dynamic tariff grandma can remember

**Pitch:** Three fixed colours per day instead of 96 prices. Midday is cheap because the sun makes it cheap. The idea is to get about 70% of what a dynamic tariff is worth, with no complexity at all.

- **Problem → solution:**
  - Dynamic tariffs see low uptake because customers fear price risk and can't track hourly prices.
  - Voltera sells a **solar-shaped time-of-use tariff**:
    - Sun-block 11:00–16:00, cheap (for example energy component −€0.06).
    - Evening block 17:00–21:00, expensive (+€0.04).
    - The rest of the day at the normal price.
  - The blocks are the same every day all year. It fits on a fridge magnet.
  - Voltera hedges it by buying solar-hour baseload, which is cheap and increasingly negative.
  - After 12 months each customer gets a "you would have saved €X on the full dynamic tariff" letter. That letter is the on-ramp to upgrading.
- **Why it isn't banned idea #4:** nothing is pushed. The rule is so simple that people form habits (washing machine and dishwasher at midday, on a timer set once).
- **Target user:** non-solar households with daytime presence (pensioners, home workers), heat pump owners (pre-heating at midday), and EV owners.
- **Why now:** 519 negative hours in 2025, up 28% on 2024. The midday price dip is structural and still widening. Every supplier already offers the full dynamic version, and almost nobody offers a *simple* one.
- **Money:**
  - *Customer:* shifting 800 kWh/yr from evening to midday gives 800 × (€0.04 + €0.06) = **€80/yr**.
  - *Voltera:*
    - Sourcing: midday capture price is ~€0.03–0.05/kWh below baseload [ASSUMPTION], giving ~€0.04 × 800 = €32/customer/yr, which funds most of the sun-block discount.
    - Evening load it avoids has high imbalance risk.
    - *At 30k customers (8.5%):* about 24 GWh/yr moved into solar hours. Churn drops from 18% to 12% for 1.8k customers kept × €120 = **€216k/yr** [ASSUMPTION].
- **Demo:** Load a mock 15-minute profile. A "fridge magnet" view shows three colours. A replay compares one year on a fixed tariff, the Zonne-uren tariff and a full dynamic tariff, plus the letter that recommends the next step.
- **Biggest risk:** customers who don't shift still get the discount (free-riding). Mitigation: price the blocks neutrally for an average load profile, so only shifters win. There is also basis risk if solar build-out slows.

---

## 4. Leenbatterij (BOLD): Voltera owns the battery; the social tenant gets a guaranteed bill ceiling

**Pitch:** Voltera places *its own* 5 kWh battery in social housing. The tenant gets a peak that stays under 2.5 kW for good plus a capped bill. Voltera earns from the battery on the market.

- **Problem → solution:**
  - Home batteries (185k in Flanders) sit almost entirely with wealthier homeowners. Energy-poor renters can't invest and don't own the roof or the meter cupboard.
  - Voltera partners with social housing companies and installs and owns the battery (battery-as-infrastructure). The battery:
    1. caps the household's peak at the 2.5 kW floor, worth €98/yr to the tenant;
    2. charges during cheap or negative hours and discharges in the evening (arbitrage for Voltera's sourcing book);
    3. is pooled as FCR capacity, which is open to residential load.
  - The tenant signs one contract: a "Voltera Zekerheid" bill ceiling, with **no app required** (PiekLicht, idea 1, can be included).
- **Why it isn't banned idea #5:** there is a concrete asset owner, a concrete customer (social tenants via a B2B2C landlord deal) and a concrete value stack, not "an algorithm".
- **Target user:** Flemish social housing companies and their tenants, and Brussels social housing (28.2% energy poverty).
- **Why now:** battery prices keep falling, as the 2025 market boom shows. 519 negative hours create arbitrage value. The social tariff reform opens the door to structural solutions instead of subsidies. EU Social Climate Fund money becomes available from 2026 [ASSUMPTION: amount for BE not verified].
- **Money (per battery):**
  - Capex €3,000 installed [ASSUMPTION].
  - Yearly value:
    - Tenant peak saving €98.
    - Arbitrage: 250 cycles × 4.5 kWh × €0.08 spread = €90 [ASSUMPTION].
    - FCR at 2.5 kW × ~€40/kW/yr = €100 [ASSUMPTION].
    - Total **~€290/yr, payback ~10 years**, or ~5 years if the landlord or social fund co-funds 50%.
  - *1,000-battery pilot:* €3M capex, €290k/yr value, 2.5 MW of flexible capacity, and 1,000 households with a guaranteed peak.
- **Demo:** A digital twin of one social flat. Mock load plus a battery simulation shows three stacked revenue bars over a year, the peak line that never crosses 2.5 kW, and a "tenant view" that is just a paper bill with a ceiling.
- **Biggest risk:** capex, and a 10-year payback that is marginal without co-funding. Pooling a small FCR volume needs an aggregator partner. Landlord and tenant incentives are split. A pilot path is essential: 100 homes with one social housing company.

---

## 5. Stroomcadeau (WILD CARD): when the grid pays Voltera to take power, vulnerable homes get it as hot water

**Pitch:** In 519 hours a year, electricity has *negative* value. Voltera turns those hours into free hot water for energy-poor households with an electric boiler.

- **Problem → solution:**
  - At midday on sunny days, prices go negative and inverters trip on overvoltage (5,042 complaints in 2023).
  - At the same time, energy-poor households ration hot water.
  - Voltera installs a €40 smart relay on existing **electric hot-water boilers** (200 L, ~2.4 kW) in vulnerable homes.
  - When the day-ahead price is below zero, or Voltera's sourcing book is long, the relay heats the boiler to 65°C. The boiler works as a thermal battery.
  - The household sees one line on the paper bill: "Stroomcadeau: 480 kWh hot water, energy cost €0."
- **Twist:** it reframes the solar surplus problem, a *grid* problem, as an energy-poverty solution, and it needs no behaviour change at all.
- **Target user:** energy-poor households with an electric boiler, especially in areas with many solar roofs (the overvoltage hotspots).
- **Why now:** negative hours are growing ~28%/yr. The grid is struggling with the midday solar peak. Relays are cheap.
- **Money (per home):**
  - About 5 kWh/day of boiler capacity × ~103 negative-price days gives **~515 kWh/yr**.
  - Voltera's sourcing for that energy goes from ~€0.08/kWh to ≤€0 [ASSUMPTION: average negative price ~−€0.01]. That is about €46/home/yr of value, fully given to the customer as an energy-cost credit.
  - The household still pays network costs and levies on those kWh, so the net saving is about €45–60/yr [ASSUMPTION].
  - *At 20k homes:* 10 GWh/yr absorbed at the worst grid moments. Relay capex is €0.8M. Voltera's gains are retention (2.4k customers kept at 18%→6% churn gives ~€290k/yr) and a strong ESG and PR story.
- **Demo:** A live animation of a Belgian day-ahead curve where prices dip below zero. Boilers in a mock neighbourhood "light up", the tank temperature rises, and a counter shows "kWh the grid didn't have to curtail" and "€ gifted".
- **Biggest risk:**
  - Network costs and levies mean it is not truly "free", so the pitch has to be honest about that.
  - Many energy-poor homes use gas for hot water, which shrinks the addressable base [ASSUMPTION: share unknown].
  - The water must stay above 60°C to rule out legionella.
  - Few negative hours in winter.

---

## STRONGEST INSIGHT:

At midday, a single kWh has two prices depending on which side of the meter you're on. A Voltera prosumer is paid €0.04 for it, or nothing during 519 negative hours. An energy-poor neighbour three houses away pays about €0.36 for the same kWh in the evening, and on top of that pays ~€53/kW/yr for a peak they can't see. That midday spread is Voltera's value pool. Voltera is the only party that holds **both** customers' 15-minute data and both invoices, so it can move value across that spread: in time (Zonne-uren, Stroomcadeau, Leenbatterij) or between people (Zonnebuur). The winning pitch should present the energy-poor and low-digital customer as **the cheapest flexibility on the grid**, because they are home at midday, have simple loads and churn when they are confused. They should not be framed as a cost to protect. A single physical, app-free object (PiekLicht) plus a paper bill line lets the system reach the 40% who are digitally vulnerable. That covers all four symptoms with one mechanism:
- **Calls:** the cause of the bill becomes visible.
- **Churn:** the customer is tied to a neighbour or an asset, not just a price.
- **Dynamic uptake:** a simple solar-shaped on-ramp.
- **Self-consumption:** the surplus is shared locally.
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
