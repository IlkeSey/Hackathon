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
