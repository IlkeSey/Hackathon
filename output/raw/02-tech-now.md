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
