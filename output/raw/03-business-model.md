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
