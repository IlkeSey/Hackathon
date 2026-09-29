# JUDGE RANKING: Voltera (practice case)

Input: 45 ideas from 9 lenses, plus the red-team critique and its 3 hybrids (H1–H3). After deduplication there are **26 candidates**. Team: 1 business, 2 devs, 1 generalist. Time: 24 hours.

## 1. Weights

The case gives four judging criteria. Each of my 7 scoring criteria maps onto exactly one of them. The weight of each case criterion is split across the scoring criteria mapped to it.

| Case criterion (weight) | Scoring criterion | Weight | Why this split |
|---|---|---|---|
| Innovation & originality (25%) | **Originality** | 20% | This is the criterion itself. |
| | **Depth** | 5% | Measures how defensible the mechanism is, meaning a competitor can't copy it just by adding a UI. |
| Customer impact (25%) | **Problem fit** | 25% | How well the idea hits the four symptoms (calls, churn, dynamic uptake, self-consumption) and the stakeholders in the brief, including vulnerable customers. |
| Business value & feasibility (30%) | **Economic value** | 15% | Credible € per year for Voltera once the critic's haircuts (X2, X3) are applied. |
| | **Feasibility** | 15% | Legal fit (GDPR, VREG, AI Act, energy-sharing rules), a pilot path, and whether a mid-sized supplier can actually do it. |
| Prototype & pitch (20%) | **Demo-ability** | 12% | Whether 2 devs can build a demo in 24 hours that works live on mock or Fluvius open data. |
| | **Pitch appeal** | 8% | The one-liner, the story, and whether it survives the jury's first question. |
| **Total** | | **100%** | |

**Scale:** each criterion is scored 1–5.
- Originality: 1 = other teams will pitch it, 3 = a known idea with a fresh angle, 5 = the jury hasn't seen it.

**Harshness rules:**
- Any weighted total above 3.50 has to be earned on at least 5 of the 7 criteria.
- If the critic rated an idea **FATAL as scoped** and the fix isn't already built into the candidate, its total is **capped at 2.50** (marked with *).
- Where the critic's fix merges an idea into a hybrid, the fixed version is scored inside that hybrid, not as a separate candidate.
- Every "avoided hedging premium" line (X2) is removed from economic value.
- Every claim of kettle or oven detection (X7) counts against feasibility.

## 2. Ranked table

Scores in the order O / PF / EV / F / D / Dp / PA:
- O: Originality (20%)
- PF: Problem fit (25%)
- EV: Economic value (15%)
- F: Feasibility (15%)
- D: Demo-ability (12%)
- Dp: Depth (5%)
- PA: Pitch appeal (8%)

| Rank | Candidate (merged sources) | O | PF | EV | F | D | Dp | PA | **Weighted** |
|---|---|---|---|---|---|---|---|---|---|
| 1 | **H1 Voltera Piekpact**: explain the peak, then guarantee it (09-3 validator + 06-3 channel + 06-1 pricing + 04-1 controller + 09-1 demo + 08-1 lamp option) | 3 | 4 | 3 | 3 | 5 | 4 | 4 | **3.62** |
| 2 | **H2 Jaarcheck met Spijtgarantie**: the mandatory annual notice becomes a regret-free dynamic switch (04-2 + 09-2 engine + 02-2 P90 filter + 09-5 targeting + 08-3 lite step) | 3 | 4 | 2 | 4 | 4 | 4 | 4 | **3.50** |
| 3 | Peak guarantee, standalone (03-1 Piekgarantie, 04-1 Piekplafond, 05-3 Piekdekking, 06-1, 07-1) | 3 | 3 | 3 | 3 | 4 | 3 | 4 | **3.20** |
| 4 | **H3 Familiestroom**: family solar sale + same-supplier lock-in + bill delegation (01-3 + 04-3 + 01-5 without monitoring + 05-2 pot) | 4 | 3 | 2 | 3 | 3 | 3 | 4 | **3.13** |
| 5 | Voltera Vast: all-in flat monthly price (06-2, 01-4, 03-4) | 3 | 4 | 3 | 2 | 2 | 4 | 4 | **3.11** |
| 6 | Prijs per laadbeurt: a locked price per EV charge (05-4) | 5 | 2 | 2 | 2 | 4 | 3 | 4 | **3.05** |
| 7 | Peak receipt / footnoted bill, standalone (01-1, 02-1 receipt, 06-3, 09-3) | 2 | 3 | 2 | 4 | 4 | 3 | 3 | **2.92** |
| 8 | Meterafschrift + settlement pot (05-2) | 2 | 3 | 2 | 4 | 4 | 2 | 3 | **2.87** |
| 9 | PiekLicht: an app-free peak lamp (08-1) | 3 | 2 | 2 | 3 | 5 | 2 | 4 | **2.87** |
| 10 | Kwartierklok: a live peak controller with no guarantee (09-1, 02-1 Piekbewaker) | 2 | 3 | 2 | 3 | 5 | 2 | 3 | **2.84** |
| 11 | No-regret dynamic, standalone, benchmarked against fixed (01-2, 02-2, 03-2, 05-1, 07-2, 09-2) | 2 | 3 | 2 | 3 | 4 | 3 | 3 | **2.77** |
| 12 | Zonne-uren time-of-use tariff (08-3) | 2 | 3 | 2 | 4 | 3 | 2 | 3 | **2.75** |
| 13 | Energy-sharing matchmaker, sold on savings (02-4, 08-2, 04-3 as written) | 3 | 3 | 2 | 2 | 3 | 2 | 3 | **2.65** |
| 14 | Stekker-DNA: an asset-detection model (09-5) | 3 | 2 | 2 | 3 | 4 | 3 | 2 | **2.64** |
| 15 | Batterijvoorschot: €150 upfront for any battery (07-4) | 3 | 2 | 3 | 2 | 3 | 3 | 3 | **2.60** |
| 16 | Stroomcadeau: negative-price hot water (08-5) | 4 | 2 | 1 | 3 | 3 | 2 | 3 | **2.60** |
| 17 | Stroom-mantelzorger: presence alerts (01-5) FATAL | 5 | 2 | 2 | 1 | 4 | 2 | 3 | 2.77 → **2.50*** |
| 18 | Voltera Tweeling as the idea (09-4) FATAL | 3 | 1 | 1 | 4 | 5 | 3 | 3 | 2.59 → **2.50*** |
| 19 | Spaarkluis (03-5) FATAL | 4 | 2 | 2 | 1 | 3 | 2 | 3 | **2.45*** |
| 20 | Zonnebuur sun club (07-3) FATAL | 3 | 2 | 1 | 2 | 4 | 1 | 4 | **2.40*** |
| 21 | Voltera Nul: zero-bill retrofit (06-5) FATAL | 3 | 3 | 1 | 1 | 2 | 3 | 4 | **2.36*** |
| 22 | Battery on Vitality terms (05-5) FATAL | 4 | 2 | 1 | 1 | 3 | 3 | 3 | **2.35*** |
| 23 | Battery flex rent / dividend (03-3 Flexhuur, 04-4 Flexdividend, 06-4 Batterijhuur) | 2 | 2 | 2 | 2 | 3 | 3 | 3 | **2.25** |
| 24 | De factuur belt jou: monthly AI voice call (02-5) FATAL | 3 | 2 | 1 | 1 | 4 | 2 | 3 | **2.22*** |
| 25 | Profile comparator / win-back (02-3 Tegenbod, 04-5 Bewijs het maar, 07-5 Stuur me weg) | 1 | 2 | 2 | 3 | 4 | 2 | 2 | **2.19** |
| 26 | Leenbatterij: Voltera-owned battery for social tenants (08-4) FATAL | 3 | 2 | 1 | 1 | 3 | 3 | 3 | **2.15*** |

**Ties:**
- #8 and #9 both score 2.87. Rank 8 went to Meterafschrift because its problem fit is higher (3 vs 2).
- #15 and #16 both score 2.60. Rank 15 went to Batterijvoorschot because its economic value is higher.

## 3. Justifications

### 1. H1 Voltera Piekpact: 3.62
- **O 3:** Every team will have a peak receipt and peak controllers are a commodity (X8). But no Belgian supplier puts its own money behind a whole-house kW cap. That makes it a known idea with a fresh angle.
- **PF 4:** The free receipt tackles calls. A product that can't be compared on price per kWh tackles churn. The controller lowers the peak. It does not address dynamic uptake (H2 covers that), and its self-consumption effect is indirect.
- **EV 3:** The base case is about €0.75M per year (10k subscribers, churn in the segment down from 18% to 10%, 25% fewer calls). That is credible and has a pessimistic toggle, but it is modest.
- **F 3:** Open questions: the P1 port has to be activated, device APIs vary by brand, and the jury may ask "is this insurance?" (answer: it's framed as a tariff credit). The pilot path is to launch only on Voltera's own EV and battery packages.
- **D 5:** Two moments the jury can watch live. The kettle adds 0.44 kW and €0 while the EV turns the ring red at +€17, then the controller holds the cap. Then the validator catches a planted LLM error. All of it runs on Fluvius open-data EV profiles.
- **Dp 4:** Funnel → per-household pricing → control → guarantee. Voltera's money is on the line, so its incentives match the customer's.
- **PA 4:** "Other suppliers explain your bill. Voltera signs for it." The weak spot is the jury question "is it just HomeWizard plus a coupon?", so rehearse the answer.

### 2. H2 Jaarcheck met Spijtgarantie: 3.50
- **O 3:** V-test already replays 15-minute data (X1), so the replay counts for nothing. What's fresh is turning the legally required "cheapest formula" notice into a guaranteed one-tap switch.
- **PF 4:** A direct hit on dynamic uptake (0.89%), with churn support from the monthly "staying paid off" line. It helps calls somewhat and self-consumption not at all.
- **EV 2:** Once the hedging line is removed (X2) and margin cannibalisation is subtracted (X3), what's left is churn value (about €225k) against capped payouts. That's thin.
- **F 4:** A deterministic engine (outside the AI Act's high-risk scope), benchmarked against *variable* with a €100 cap and a P90 pre-filter. It rides on a legal obligation Voltera already has.
- **D 4:** Replaying a real year of 15-minute data against 2025 day-ahead prices is buildable in about 8 hours of dev time. Running it on a jury member's own CSV is a strong moment if they consent.
- **Dp 4:** Regulatory hook + targeting filter + a benchmark chosen to make the tail risk acceptable. These are real design decisions.
- **PA 4:** "The letter the law forces us to send becomes the product." Regulators like it.

### 3. Peak guarantee, standalone: 3.20
- **O 3:** A guarantee is fresh, but six lenses landed on it independently, which is a warning sign.
- **PF 3:** Only the EV and heat-pump segment (10–15%). There's no funnel for the other 85%.
- **EV 3:** €0.4–0.7M once sized realistically (the critic's correction of 03-1's 60k subscribers).
- **F 3:** Same insurance, P1 and device-API questions as H1.
- **D 4:** A slider replay with clipped peaks. Good, but it lacks H1's explanation moment.
- **Dp 3:** Per-household pricing is the only depth.
- **PA 4:** "Pick your peak. We pay if you go over." Strict subset of H1, so don't pitch it separately.

### 4. H3 Familiestroom: 3.13
- **O 4:** A family solar *sale*, plus the VREG same-supplier rule used as legal lock-in and a way to acquire the second household, plus bill delegation. No lens framed it this way.
- **PF 3:** Covers self-consumption, churn, and vulnerable parents, with modest help on calls. It does nothing for dynamic uptake.
- **EV 2:** €26–40 per side per year. The value depends on assumed pair uptake and assumed churn halving.
- **F 3:** Registration with Fluvius can't be integrated. The sale rules must be stated correctly (X5). The same-supplier rule is "for now", so it could change.
- **D 3:** Two phones and a quarter-hour animation. It's clickable, but the mechanism is simulated.
- **Dp 3:** Lock-in, acquisition and delegation reinforce each other.
- **PA 4:** "Your roof, your mother's bill." The strongest emotional beat in the set.

### 5. Voltera Vast: 3.11
- **O 3:** Holaluz and Endesa sell this in Spain. It's new in Belgium.
- **PF 4:** Removes the bill, so it addresses calls, churn and dynamic uptake (invisibly). Self-consumption depends on device control.
- **EV 3:** Real upside even at 2–5% uptake, but volume and price risk eat into it.
- **F 2:** Weather and volume risk, VREG itemisation and annual-statement rules, and device control needed in thousands of homes.
- **D 2:** A Monte Carlo price quote is dry on stage.
- **Dp 4:** A genuine transfer of risk, with the arbitrage captured behind the flat fee.
- **PA 4:** "You'll never read an energy bill again." The jury will ask "why pay a premium when dynamic is €193 cheaper?"

### 6. Prijs per laadbeurt: 3.05
- **O 5:** Uber-style upfront pricing per energy job. The most original idea in the set.
- **PF 2:** EV owners only. Touches dynamic uptake and peak, but not calls or the wider base.
- **EV 2:** About €86 per EV per year.
- **F 2:** Needs EV APIs and state-of-charge forecasting, and VREG still requires a €/kWh equivalent.
- **D 4:** "€4.10, locked." The jury spikes the price curve and the customer's price doesn't move.
- **Dp 3:** The optimiser and the pricing of risk are real.
- **PA 4:** Memorable. Best used as a feature inside H1.

### 7. Peak receipt / footnoted bill, standalone: 2.92
- **O 2:** Five lenses produced it, and so will other teams.
- **PF 3:** Strong on calls, weak on everything else.
- **EV 2:** Only call deflection, based on assumed call baselines and vendor claims.
- **F 4:** An LLM plus a deterministic validator is easy to build. Naming appliances is limited to large loads (X7).
- **D 4:** The validator catching the LLM's error is a strong moment.
- **Dp 3:** The validator and call predictor lift it above a chatbot.
- **PA 3:** A funnel, not a product.

### 8. Meterafschrift + settlement pot: 2.87
- **O 2:** A dashboard in list form (banned #2). The settlement pot is the only new part.
- **PF 3:** Removing surprise at the annual settlement targets a real call driver.
- **EV 2:** About €420k in call savings, based on assumptions.
- **F 4:** Easy to build.
- **D 4:** A phone feed plus an "adjust advance" tap.
- **Dp 2:** Thin.
- **PA 3:** "Your meter as a bank statement" is relatable. The settlement pot is worth keeping as a feature.

### 9. PiekLicht: 2.87
- **O 3:** An ambient physical signal for low-digital households is a real twist.
- **PF 2:** It gives feedback without control, and it relies on grandma reacting. The least digital customers are also the least likely to activate the P1 port.
- **EV 2:** €2.2M of hardware against €70 per household per year.
- **F 3:** Easy to prototype. Hardware logistics at scale are hard.
- **D 5:** A lamp that turns red on stage.
- **Dp 2:** Shallow on its own.
- **PA 4:** "Grandma saved €98 without an app." Keep it as H1's no-app option.

### 10. Kwartierklok (controller without a guarantee): 2.84
- **O 2:** A commodity (X8). HomeWizard, Smappee and load-balancing EV chargers already do this.
- **PF 3:** Covers peak and EV households only.
- **EV 2:** A 5.5-year payback on hardware.
- **F 3:** Charger API coverage is assumed.
- **D 5:** The best demo physics in the set. It carries into H1.
- **Dp 2:** Nothing that competitors can't copy.
- **PA 3:** "We tell you before the peak lands." The jury will reply "so does my dongle."

### 11. No-regret dynamic, standalone (against fixed): 2.77
- **O 2:** Seven lenses produced it, and the replay part duplicates V-test.
- **PF 3:** Covers dynamic uptake only.
- **EV 2:** Counts hedging savings twice, and correlated tail risk means €2–3M exposure in a spike year.
- **F 3:** A fixed-price benchmark is dangerous.
- **D 4:** Replay racing lines.
- **Dp 3:** Only the guarantee adds depth.
- **PA 3:** Fine. H2 is the fixed version of this idea.

### 12. Zonne-uren tariff: 2.75
- **O 2:** Time-of-use tariffs are old (day/night, Octopus Cosy).
- **PF 3:** An on-ramp to dynamic plus midday shifting.
- **EV 2:** Customers who don't shift still get the discount.
- **F 4:** Simple, but needs quarter-hour billing.
- **D 3:** A fridge-magnet view.
- **Dp 2:** Thin.
- **PA 3:** Useful as the "lite" step inside H2.

### 13. Energy-sharing matchmaker (savings framing): 2.65
- **O 3:** Legal but almost unused, so the idea is fresh.
- **PF 3:** Addresses self-consumption.
- **EV 2:** About €40 per side per year.
- **F 2:** Gets the rules wrong (the 1 Jan 2026 date, "sharing" vs a sale, the 1c fee). Street clustering doesn't fit a one-partner model.
- **D 3:** A matching map.
- **Dp 2:** No lock-in mechanism.
- **PA 3:** "So what?" at €40. Superseded by H3.

### 14. Stekker-DNA: 2.64
- **O 3:** Uses the labelled Fluvius dataset in a new way.
- **PF 2:** An internal targeting tool, so customers barely feel it.
- **EV 2:** €640k from assumed cross-sell conversion.
- **F 3:** GDPR profiling, and 300 samples per class is enough for a demo only.
- **D 4:** "Guess the house" plus an honest confusion matrix.
- **Dp 3:** Real machine learning.
- **PA 2:** "Voltera knows you bought an EV" is a creepy headline. Use it only inside H2's targeting.

### 15. Batterijvoorschot: 2.60
- **O 3:** The only battery idea with a new angle: acquiring the owners of 189k batteries not tied to any supplier.
- **PF 2:** Battery owners only.
- **EV 3:** About 5.7k new customers plus a trading margin.
- **F 2:** Battery-brand API access is unverified, the clawback is hard to enforce, and revenues are compressing.
- **D 3:** Onboarding plus a replay.
- **Dp 3:** Paying the advance turns doubt about flex revenue into cash.
- **PA 3:** A side arm, not a lead.

### 16. Stroomcadeau: 2.60
- **O 4:** Negative-price hours turned into free hot water for energy-poor households is a new pairing.
- **PF 2:** Many energy-poor homes heat water with gas, and there are few negative hours in winter.
- **EV 1:** About €46 per home, all of it passed on.
- **F 3:** A cheap relay, but legionella rules apply.
- **D 3:** An animation.
- **Dp 2:** Shallow.
- **PA 3:** "Free" is misleading once network costs are counted. A corporate-social-responsibility footnote at most.

### 17. Stroom-mantelzorger (presence alerts), FATAL: capped at 2.50
- **O 5:** No jury has seen it.
- **PF 2:** Doesn't address dynamic uptake or self-consumption.
- **EV 2:** €384k from an assumed add-on fee.
- **F 1:** Inferring presence and wellbeing comes close to GDPR Art. 9 health data, and consent from an elderly parent is shaky.
- **D 4:** A timeline with a phone alert.
- **Dp 2:** Shallow.
- **PA 3:** Easy for the jury to love, easy for a regulator to hate. The fixed version (bill delegation only) lives in H3.

### 18. Voltera Tweeling as the idea, FATAL: capped at 2.50
- **O 3:** A live business-case simulator is uncommon.
- **PF 1:** Doesn't solve the case, because the customer gets nothing.
- **EV 1:** Creates no value by itself.
- **F 4:** Easy to build.
- **D 5:** The jury chair moves the slider.
- **Dp 3:** Built on a real synthetic population.
- **PA 3:** Use it as H1's business-case slide, where it gives a big lift on the 30% criterion. Don't pitch it as the idea.

### 19. Spaarkluis, FATAL: 2.45
- **O 4:** Retention without lock-in is clever.
- **PF 2:** Addresses churn only.
- **EV 2:** €2.9M depends on 10% conversion to batteries.
- **F 1:** Holding customer money is deposit or e-money territory, and a 1.5x bonus lost on leaving looks like an exit barrier.
- **D 3:** A vault UI.
- **Dp 2:** Shallow.
- **PA 3:** Catchy but legally dead.

### 20. Zonnebuur sun club, FATAL: 2.40
- **O 3:** An Octopus Fan Club copy.
- **PF 2:** Banned #4 in disguise.
- **EV 1:** Worth nothing if these customers are settled on standard load profiles, and Belgium is a single price zone.
- **F 2:** Settlement doesn't work.
- **D 4:** Glowing roofs on a map.
- **Dp 1:** "Local" has no price mechanism behind it.
- **PA 4:** Pretty, but the story falls apart under questioning.

### 21. Voltera Nul, FATAL: 2.36
- **O 3:** Octopus Zero Bills applied as a retrofit.
- **PF 3:** Covers everything, but for very few homes.
- **EV 1:** €80 margin per home on €62.5M of capex.
- **F 1:** A moonshot that breaks the brief.
- **D 2:** A chart.
- **Dp 3:** The asset model is coherent.
- **PA 4:** At most one sentence as the "year 5 vision".

### 22. Battery on Vitality terms, FATAL: 2.35
- **O 4:** Loss-framed repayment is a new idea for energy.
- **PF 2:** Solar customers without a battery only.
- **EV 1:** About a 9-year payback by its own maths.
- **F 1:** Needs a consumer-credit licence (FSMA, Book VII).
- **D 3:** A calendar UI.
- **Dp 3:** The behavioural design is real.
- **PA 3:** Drop it.

### 23. Battery flex rent / dividend: 2.25
- **O 2:** Eneco and Frank already do this.
- **PF 2:** Battery owners only.
- **EV 2:** Once flex value is corrected to €15–40/kW per year, most of the margin disappears.
- **F 2:** Flexibility-provider accreditation, aggregator dependency and battery warranties.
- **D 3:** A simulated virtual power plant.
- **Dp 3:** Stacks several value sources.
- **PA 3:** Generic.

### 24. De factuur belt jou, FATAL: 2.22
- **O 3:** Outbound AI voice, but it reads as banned #1.
- **PF 2:** 624k outbound calls to save about 39k inbound ones.
- **EV 1:** Net-negative contacts.
- **F 1:** Flemish dialect speech recognition may fail live, and robocalling grandma carries consumer-protection risk.
- **D 4:** A live call on stage.
- **Dp 2:** Shallow.
- **PA 3:** Only survives as a shock-bill channel inside H1.

### 25. Profile comparator / win-back: 2.19
- **O 1:** V-test, Pieker and EnergyID already do this (X1).
- **PF 2:** Churn at the moment of switching only.
- **EV 2:** The binding quote version carries the full X2 downside, and the non-binding version is a lead magnet.
- **F 3:** The vision LLM works, but VREG may object to retention discounts offered only to leavers.
- **D 4:** The webcam tariff-card scan looks slick.
- **Dp 2:** A gimmick on top of public data.
- **PA 2:** Advertises competitors.

### 26. Leenbatterij, FATAL: 2.15
- **O 3:** A social-housing B2B2C angle.
- **PF 2:** Social tenants only.
- **EV 1:** 10-year payback.
- **F 1:** Tenants can switch supplier at any time, which strands Voltera's battery.
- **D 3:** A twin of one flat.
- **Dp 3:** The value stack is real.
- **PA 3:** Out of scope for a supplier.

## 4. TOP 3

1. **H1 "Voltera Piekpact": 3.62.** Lead with this. A free footnoted peak receipt, checked by a validator, feeds a per-household kW cap that Voltera enforces and guarantees with its own money.
   - Demo: the kettle-vs-EV physics, the validator catching a planted error, then the Tweeling slider as the business case.
   - Include PiekLicht as the no-app option and the locked "charge job" price as the EV feature.
2. **H2 "Jaarcheck met Spijtgarantie": 3.50.** The dynamic-tariff arm, and it shares H1's engine. The mandatory annual notice becomes a one-tap switch to dynamic.
   - The switch comes with a €100-capped regret refund measured against variable.
   - Only customers likely to win (P90 above €0) get the offer.
   - Show margin cannibalisation (X3) openly.
3. **H3 "Familiestroom": 3.13.** The 30-second self-consumption and vulnerable-customer chapter.
   - A family solar sale, with Voltera doing the Fluvius paperwork.
   - The same-supplier rule brings in and locks in the second household.
   - The adult child can manage the parent's bill, with no presence monitoring.

   The standalone peak guarantee (#3 by score, 3.20) is left out because it is fully contained in H1. Voltera Vast (3.11) is the fallback if the team wants a bolder single promise.

**Must-dos before building:**
- Resolve X4 at hour 0: does the supplier get 15-minute data by default, or only after requesting meetregime 3?
- Freeze one sourced number per fact (X6).
- Remove every hedging-premium line (X2).
- Never name a kettle or oven from 15-minute data (X7).
- Use the 2,400-meter Fluvius open dataset for every number shown on screen (X9).
