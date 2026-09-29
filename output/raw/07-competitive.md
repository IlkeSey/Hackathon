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
