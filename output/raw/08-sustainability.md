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
