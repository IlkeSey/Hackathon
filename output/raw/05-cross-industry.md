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
