# RED TEAM CRITIQUE: Voltera (45 ideas, 9 lenses)

**Ratings:** FATAL = drop it or it loses the room. FIXABLE = survives only with the stated fix. MINOR = a jury nitpick, answer it in Q&A.

---

## 0. Cross-cutting kills (read these first)

| # | Problem | Hits | Evidence |
|---|---|---|---|
| X1 | **V-test already replays your own 15-min data.** You can upload Fluvius quarter-hour values and it prices dynamic and time-block products. So "Replay your year" / "profile-based comparator" is **not original** on its own. Pieker, EnergyID and the Ecopower simulator do it too. Only the **guarantee** is new. | 01-2, 02-2, 02-3, 04-5, 05-1, 07-2, 07-5, 09-2 | [VREG V-test FAQ](https://www.vlaamsenutsregulator.be/nl/faq/v-testr), [vtest.vreg.be](https://vtest.vreg.be/) |
| X2 | **The dynamic-guarantee maths double-counts.** Lenses book €15–30/customer of "avoided hedging premium" *and* sell a "never worse than fixed" guarantee. That guarantee is a written put option: Voltera takes back the exact price risk it claims to have shed. The risk is also **correlated**. In a 2022-type year it isn't "5–15% lose €40": nearly everyone loses at the same time, so the exposure is cap × all participants (€100–150 × 20k = **€2–3M in one bad year**). | 01-2, 02-2, 03-2, 04-2, 05-1, 07-2, 09-2 | Logic. A search summary cites VREG saying fixed contracts carry a 1–3 c/kWh risk premium ([source](https://www.gaslicht.com/energievergelijken/dynamisch-energiecontract-vergelijken)) [secondary source; check against the VREG price report] |
| X3 | **Migrating customers off fixed contracts cannibalises margin.** That 1–3 c/kWh risk premium (€35–105/yr) is partly Voltera's own margin. No lens nets it off. | same as X2 | same |
| X4 | **Is 15-min data "on by default" for the supplier?** Lens 01/02/03 say yes from 1 Jan 2026. Lens 04 says the supplier must request **meetregime 3** per customer. VREG publishes a dashboard of meters "with activated quarter-hour values", so activation is still a thing. **Verify on hour 0.** It decides whether ideas are "for all 350k" or opt-in only. | ~all | [VREG dashboard](https://www.vlaamsenutsregulator.be/cijfers/dashboards-digitale-meters-met-geactiveerde-kwartierwaarden) |
| X5 | **The lenses misstate energy-sharing rules.** VREG: *sharing* must be **free**. Charging a price is **person-to-person sale** (the parties set the price and settle it between themselves). Both parties need a digital meter, must be in Flanders and **provisionally need the same supplier**. It has been live since 2022–24, **not "since 1 Jan 2026"** (02-4). Lens 04-3's "up to 3 EANs at 7c/9c with Voltera keeping 1c" needs re-checking. **Upside nobody used:** the same-supplier rule is a *legal* lock-in and acquisition hook. | 01-3, 02-4, 04-3, 08-2 | [VREG energiedelen](https://www.vreg.be/en/energiedelen-en-persoon-aan-persoonverkoop), [Fluvius P2P-verkoop](https://www.fluvius.be/nl/groene-energie/energiedelen/persoon-aan-persoonverkoop) |
| X6 | **The lenses contradict each other on stats.** The jury will catch it. Dynamic uptake is quoted as 0.4 / 0.55 / 0.89%, and "20,552 contracts" is called both 0.4% and 0.89%. Switching is quoted as 18.94% and 19.35%. Energy sharing is dated 2022 and 2026. **Pick one sourced number per fact and freeze it in the assumption table.** | all | - |
| X7 | **NILM overclaims.** A 15-min average cannot see a kettle (lens 09: 2.2 kW × 3 min = 0.44 kW). "EV + oven + kettle" receipts will be wrong in front of the jury. Only big, long, flat loads (EV, heat pump, boiler) are reliably attributable. | 01-1, 02-1, 06-3, 09-3 | Lens 09 physics, [ETH NILM](https://dl.acm.org/doi/fullHtml/10.1145/3600100.3623731) |
| X8 | **Peak control is already commoditised.** HomeWizard, Smappee and several EV chargers with P1-based load balancing already cap capacity-tariff peaks, and Engie's app shows peaks. **A peak controller is not innovative. A peak *guarantee* backed by Voltera's money is.** | 04-1, 05-3, 07-1, 09-1, 08-1 | Lens 07 table, [HomeWizard API](https://api-documentation.homewizard.com/docs/v2/measurement/) |
| X9 | **Verified asset (good news):** the Fluvius open dataset of **2,400 labelled 15-min meters** (8 × 300 segments: solar / heat pump / EV combinations) exists. Use it and don't invent mock data. | 09-*, all demos | [Fluvius open data](https://opendata.fluvius.be/explore/dataset/1_50-verbruiksprofielen-dm-elek-kwartierwaarden-voor-een-volledig-jaar/) |

---

## 1. Duplicate clusters

| Cluster | Ideas | Best version to keep | Notes |
|---|---|---|---|
| **A. Peak receipt / explained bill** | 01-1 Piekbon, 02-1 Piekbon, 06-3 Piekbonnetje, 09-3 Factuur met voetnoten, 05-2 Meterafschrift, (08-1 paper piekkaart) | **09-3's LLM + deterministic validator + call predictor**, delivered through **06-3's channel** (WhatsApp/paper + "JA" upsell) | 5 lenses converged, so other teams will too. Alone it's a **FUNNEL, not a product**. |
| **B. Peak cap / guarantee** | 03-1 Piekgarantie, 04-1 Piekplafond, 05-3 Piekdekking, 06-1 Piekgarantie, 07-1 Piekplafond, 09-1 Kwartierklok (control, no guarantee), 08-1 PiekLicht (feedback, no control) | **06-1 actuarial pricing + 04-1 quarter-hour projection controller + 09-1 kettle demo** | Strongest cluster. 6 lenses agree. |
| **C. No-regret dynamic** | 01-2 Replay, 02-2 Schaduwfactuur, 03-2 Dynamisch Zonder Spijt, 04-2 Spijtvrij, 05-1 Schaduwfactuur, 07-2, 09-2 Herspeel je jaar | **04-2**: benchmark vs *variable* (less correlated risk), pre-filter, cap, **delivered as the mandatory Consumentenakkoord annual notice** | See X1–X3. The guarantee is the idea. The replay is plumbing. |
| **D. Profile comparator / win-back** | 02-3 Tegenbod, 04-5 Bewijs het maar, 07-5 Stuur me weg | none standalone | V-test does it (X1). Keep only as a retention-desk *use* of engine C. |
| **E. Energy sharing / P2P** | 01-3 Zon voor Moeder, 02-4 Buurtstroom, 04-3 Zonnebuur, 08-2 Zonnebuur, (07-3 sun club, different mechanism) | **01-3 family framing** + X5 same-supplier lock-in | Small € (€26–50/yr per side). Sells on emotion and pair-retention only. |
| **F. All-in flat price** | 01-4 Voltera Vast, 03-4 Vast Bedrag, 06-2 Voltera Vast, 05-4 Prijs per laadbeurt (per-job variant), 06-5 Voltera Nul (extreme) | **06-2** | Strong pitch line, but a heavy risk and regulatory story (see below). |
| **G. Battery/flex monetisation** | 03-3 Flexhuur, 04-4 Flexdividend, 06-4 Batterijhuur, 07-4 Batterijvoorschot, 05-5 Vitality-batterij, 08-4 Leenbatterij, 03-5 Spaarkluis (wrapper) | **07-4** (acquisition angle is new) | Eneco and Frank already do this in BE/NL, so originality is low. Flex € numbers are inflated. |
| **H. Low-digital / care channel** | 01-5 Mantelzorger, 02-5 De factuur belt jou, 08-1 PiekLicht | 08-1 as a *hardware skin* of B | Good for customer impact. Weak on business value. |
| Singletons | 08-3 Zonne-uren, 08-5 Stroomcadeau, 09-4 Tweeling, 09-5 Stekker-DNA | - | See below. |

---

## 2. Banned-list check

| Idea | Banned # | Real twist? | Verdict |
|---|---|---|---|
| 02-5 De factuur belt jou | #1 chatbot | Outbound voice, grounded on facts. The jury still hears "AI bot calls grandma". | **Borderline, likely read as banned** |
| 05-2 Meterafschrift | #2 dashboard | A feed of "transactions" is a dashboard in list form | **Banned without twist.** Settlement pot is the only new piece |
| 09-1 Kwartierklok | #4 push / #2 dashboard | Peak-not-price plus an action button. Twist is valid, but X8 kills originality | **Allowed, but unoriginal** |
| 07-3 Zonnebuur sun club | #4 push for cheap hours | "Your neighbour's roof" is a narrative on a midday price signal. BE is one bidding zone, so there is **no locational value**. It's the Bolt story Lens 07 itself mocked. | **Banned in disguise** |
| 08-3 Zonne-uren | (#4-adjacent) | Static ToU with no pushes. Legit, but old (day/night tariffs, Octopus Cosy) | Allowed, low originality |
| 03-3 / 04-4 / 06-4 / 05-5 / 08-4 | #5 battery optimisation | Each has a concrete financial product (rent, dividend, advance), so it passes, but competitors already ship it | Allowed, low originality |
| 08-1 PiekLicht | #2 dashboard | A physical, ambient, app-free object. Real twist | OK |
| 09-5 Stekker-DNA "guess the house" | #3 gamification | Pitch device only | OK |
| 09-4 Tweeling | #2 dashboard | Management cockpit, not a customer product | OK, but **not a solution** (see below) |

---

## 3. Idea-by-idea verdicts

### Lens 01: User pain
| Idea | Strongest jury objection | Rating | Fix |
|---|---|---|---|
| 1 Piekbon | "The HomeWizard/Engie app already shows my peak. Also, I don't own an oven." 15-min data can't see an oven or kettle (X7). No revenue, only call deflection built on invented baselines. | FIXABLE | Attribute only large flat loads. Otherwise say "large load at 18:15" plus a one-tap tag. Use it as the **funnel into Cluster B**, not as the product. |
| 2 Replay + guarantee | V-test already replays (X1). The guarantee's cost is modelled as idiosyncratic when it's systemic (X2). | FIXABLE | Benchmark vs variable, cap €100, price the cap as an option, drop the hedging-saving line. |
| 3 Zon voor Moeder | "€39 a year?" Also mislabels P2P sale as sharing (X5), and Fluvius registration can't be demoed. | FIXABLE | Pitch it as legal lock-in plus acquisition (same-supplier rule), not as savings. |
| 4 Voltera Vast | "Why pay a premium for certainty when dynamic is €193 cheaper?" Also volume risk, VREG itemisation, and OEM API dependence. | FIXABLE | Same as 06-2. Duplicate. |
| 5 Stroom-mantelzorger | Inferring presence or wellbeing from meter data is profiling close to GDPR Art. 9 health data. Consent from a cognitively declining parent is shaky. It addresses **0 of 4** symptoms for dynamic and self-consumption, and it's outside an energy supplier's licence to operate. | FATAL (as core) | Keep only the **bill-delegation** part (child manages dad's advance and bill) as a feature. Drop the presence alerts. |

### Lens 02: Tech-now
| Idea | Strongest jury objection | Rating | Fix |
|---|---|---|---|
| 1 Piekbon + Cap EV | Duplicate of 01-1. The "Piekbewaker €3/mo" is just Cluster B without a guarantee, so it's commoditised (X8). | FIXABLE | Merge into Hybrid 1. |
| 2 Schaduwfactuur | X1 + X2. The "€560k hedging saving" is double-counted against the guarantee. | FIXABLE | As 01-2. |
| 3 Tegenbod | Vision-LLM OCR of tariff cards is a gimmick: the cards are public structured data and V-test already exists. VREG may also frown on targeted retention discounts for leavers only. | FIXABLE (minor role) | Keep as a retention-desk mode of the engine. Not a headline. |
| 4 Buurtstroom | Says "legal since 1 Jan 2026" (wrong, X5). Street clustering is pointless with a family/one-partner P2P model. Small €. | FIXABLE | Merge into Cluster E and correct the rules. |
| 5 De factuur belt jou | Reads as banned #1. Calling 52k people monthly = **624k outbound calls to deflect ~39k inbound**: you create more contacts than you remove. Dialect ASR risk live on stage. | FATAL (as scoped) | Only call when the call predictor (09-3) flags a shock bill, which is ~5% of bills. Then it's a channel, not an idea. |

### Lens 03: Business model
| Idea | Strongest jury objection | Rating | Fix |
|---|---|---|---|
| 1 Piekgarantie | €2.6M assumes 60k subscribers (17%) while only ~10–15% have EV/heat pump. The "insurance licence" question. The saving comes from control, not the guarantee. | FIXABLE | Size to ~10k subscribers (~€0.4–0.7M). Frame it as a tariff discount or bill credit, not insurance. Price it actuarially per customer (06-1). |
| 2 Dynamisch Zonder Spijt (75/25 split) | X2/X3. Taking 25% of savings makes it **worse than any plain dynamic competitor** in a normal year, so savvy customers leave. | FIXABLE | Drop the split. Charge a flat fee or nothing, since the guarantee *is* the retention tool. |
| 3 Flexhuur | €50/kW/yr × 5 kW × 15k = €3.75M is fantasy. Residential batteries can't commit their full kW to FCR, prequalification is hard, and BE FCR prices have fallen as batteries flood in. Eneco pays "up to €250/yr" already. | FIXABLE | €15–25/kW/yr, imbalance value first, aggregator partner. It's a side revenue line, not a pitch. |
| 4 Vast Bedrag (elec + gas) | Adding gas doubles the weather/volume risk. A +5% certainty premium on €2,365 is a price rise the churners won't accept. | FIXABLE | Electricity only, as 06-2. |
| 5 Spaarkluis | To "deposit savings" Voltera must bill more and hold customer money: deposit / e-money territory (NBB). A 1.5x bonus lost on exit reads as an exit barrier, and Belgian switching rules are strict. | FATAL (as designed) | Re-cast as a Voltera-funded loyalty credit toward hardware, never withheld cash. |

### Lens 04: BE/EU ecosystem
| Idea | Strongest jury objection | Rating | Fix |
|---|---|---|---|
| 1 Piekplafond | Controller = X8. The P1 dongle has to be activated in Mijn Fluvius (up to 72 h) and hardware logistics apply. | FIXABLE | Launch only with Voltera's own EV/battery packages. Physics demo from 09-1. |
| 2 Spijtvrij Dynamisch | **Best of Cluster C.** Remaining gap: the €268k hedging saving (X2) and cannibalisation (X3). | FIXABLE (strong) | Keep the Consumentenakkoord hook: it turns a legal obligation into the product. Delete the hedging line. |
| 3 Zonnebuur | "Voltera settles 7c/9c with a 1c fee" conflicts with P2P rules (the parties settle between themselves) (X5). Winter matching is ~0. | FIXABLE | Voltera offers settlement as a free service. Value = pair retention + acquisition. |
| 4 Flexdividend (FSP) | FSP accreditation + TCK + aggregator: not credible in a pilot path for a mid-size supplier in year 1. €35/kW/yr is optimistic. | FIXABLE | Start with BRP imbalance only, as its own text admits. |
| 5 Bewijs het maar | A **binding "≥€150 cheaper next year" to strangers** means pricing risk on future prices, with the full downside of X2. The ESP API is paid, D+1, and needs certification. V-test does the comparison (X1). | FATAL (binding quote) / FIXABLE (non-binding) | Drop the binding guarantee for prospects. Use the free Fluvius CSV upload as the lead magnet. |

### Lens 05: Cross-industry
| Idea | Strongest jury objection | Rating | Fix |
|---|---|---|---|
| 1 Schaduwfactuur + Money-Back | Duplicate of C. Octopus Agile's "95% paid less" came from the UK in a falling-price window. It doesn't carry over to a spike year (X2). | FIXABLE | The Ofcom/Hopper analogy is gold for the **pitch slide**. Keep it. |
| 2 Meterafschrift | Banned #2 in list form. NILM mitigation "label by size and time" is fine. | FIXABLE (weak) | Salvage the **settlement pot** (auto-adjust advance so the annual bill is €0 surprise). It's a real call driver. |
| 3 Piekdekking | €1.7M flex revenue on 42 MW at €40/kW/yr is inflated, and EV chargers aren't dispatchable 24/7. EV company-car drivers: the employer pays the kWh. Who pays the fee? | FIXABLE | The company-car angle is a **real insight**: pitch it to fleet managers (B2B2C). Cut flex revenue by 3–4x. |
| 4 Prijs per laadbeurt | Most original in the whole set. Objections: VREG requires a €/kWh equivalent, and the margin is only €86/EV/yr. Needs EV API + SoC forecast. Demo needs a simulated car. | FIXABLE | A strong **feature inside Hybrid 1** for EV owners ("charge job: €4.10 locked, peak guaranteed"). Weak standalone. |
| 5 Batterij op Vitality-voorwaarden | 10-yr consumer financing = consumer-credit licensing (FSMA/Book VII). ~9-yr payback by its own maths. | FATAL | Drop. |

### Lens 06: Contrarian
| Idea | Strongest jury objection | Rating | Fix |
|---|---|---|---|
| 1 Piekgarantie (actuarial) | "Loss ratio 30%" is plucked from the air. The insurance-licence question. | FIXABLE (strong) | Best pricing logic in Cluster B. Demo the per-household premium computed from Fluvius open-data profiles. |
| 2 Voltera Vast | A 20% uptake (70k) is fantasy for a new product. Adverse selection (someone buys an EV mid-year). VREG bill-transparency rules / mandatory annual statement. Holaluz and Endesa already do it, so originality is medium. €2.5M arbitrage assumes device control for 21k households. | FIXABLE | 2–5% uptake. Customer must report new big assets. Itemised annex kept. It's the boldest *coherent* promise, but the demo is a Monte-Carlo, which judges find dry. |
| 3 Piekbonnetje | Duplicate A. WhatsApp at 350k × 12 costs money. Best channel design in cluster A (paper + WhatsApp + "JA"). | FIXABLE | Keep the "reply JA → subscribe to guarantee" conversion step. |
| 4 Batterijhuur | aFRR €100–150/kW-yr **net** is 3–5x too high for 2026. Battery warranty worries. | FIXABLE | Rerun the numbers at €30–40/kW-yr, and the margin mostly disappears. Side line only. |
| 5 Voltera Nul | €62.5M capex for 5k homes and an €80/yr margin. It breaks the brief's "no moonshots" rule. | FATAL | Drop. Mention as the "year 5 vision" in one sentence at most. |

### Lens 07: Competitive
| Idea | Strongest jury objection | Rating | Fix |
|---|---|---|---|
| 1 Piekplafond (whole house) | X8, but "**whole house** vs Tibber's EV-only" is the sharpest positioning line in Cluster B. Only a 3-pt churn assumption: honest but small. | FIXABLE | Reuse the competitor gap table in the pitch. |
| 2 Dynamisch zonder spijt | X2. The €525k hedging line contradicts the guarantee. **Ecopower's 1-year lock-out is a great foil.** | FIXABLE | As 04-2. |
| 3 Zonnebuur sun club | Banned #4 in disguise. The settlement caveat is its own admission: with SLP settlement Voltera gains nothing. One BE bidding zone means "local" has no price value. | FATAL | Drop. |
| 4 Batterijvoorschot | €150 upfront to non-customers with a clawback that is hard to enforce. Brand API access is unverified. Revenue compression. | FIXABLE | **It's the only battery idea with a new angle (acquisition of 189k non-customer batteries).** Keep it as the solar/battery arm. |
| 5 Stuur me weg | V-test already exists (X1), so it's not original. It advertises competitors, and the profile price guarantee bleeds money if Voltera is mid-priced. | FATAL | Drop. Keep "honesty" as a pitch tone. |

### Lens 08: Sustainability
| Idea | Strongest jury objection | Rating | Fix |
|---|---|---|---|
| 1 PiekLicht | €2.2M of hardware for a €70/yr customer gain. P1 activation friction for the least digital customers. Feedback without control means it relies on grandma reacting. | FIXABLE | Offer it as the **no-app skin of the guarantee** (the lamp turns red → controller acts). A physical demo object is a strong stage prop. |
| 2 Zonnebuur (energy-poor) | Must be a P2P sale, not sharing (X5). The energy-poor neighbour must switch to Voltera (same-supplier rule): the jury may see "recruiting the poor". Saving is €40/yr. | FIXABLE | Route it through OCMW/Energiehuis partners and say the modest € honestly. |
| 3 Zonne-uren Tarief | A known concept (ToU). The free-rider problem is admitted. Requires quarter-hour allocation. | FIXABLE (low originality) | Use it as a "dynamic-lite" step inside the Cluster C ladder, not as a headline. |
| 4 Leenbatterij | **Tenants can switch supplier at any time**, which strands Voltera's battery. 10-yr payback. Split landlord/tenant incentives. | FATAL (as supplier play) | It only works as a landlord-contracted asset independent of supply. Out of scope. |
| 5 Stroomcadeau | ~€46/home/yr. Many energy-poor homes heat water with gas. Summer only. Legionella. "Free" is misleading once network costs are counted. | MINOR value / FIXABLE | A nice CSR feature in a battery/flex story. Not a pitch. |

### Lens 09: Demo feasibility
| Idea | Strongest jury objection | Rating | Fix |
|---|---|---|---|
| 1 Kwartierklok | X8: HomeWizard already exposes `monthly_power_peak_w`, so this is a feature others ship. 5.5-yr hardware payback. | FIXABLE | **The kettle-vs-EV stage demo is the single best demo moment in all 45 ideas.** Use it to demo the guarantee. |
| 2 Herspeel je jaar | X1: V-test does exactly this. The lens itself admits "the differentiator must be that Voltera acts on the result". | FIXABLE | Engine only. Wrap it in the guarantee. Running on the jury's own CSV is a great moment, but it needs GDPR consent. |
| 3 Factuur met voetnoten | Cluster A duplicate. The "validator catches the LLM" moment is excellent for feasibility credibility. Idomoo/Synthesia deflection claims are vendor claims. | FIXABLE (strong) | This is the best explain-layer. Merge into Hybrid 1. |
| 4 Voltera Tweeling | **It's not a solution to the case**, it's a business-case tool. If pitched as the idea, the jury asks "what does the customer get?". €2.56M EV-shift assumes all 35k EVs are controlled. | FATAL as idea / MINOR as tool | Use it as the **business-case slide** (a live slider). Big edge on the 30% criterion. |
| 5 Stekker-DNA | Profiling creep (GDPR Art. 22-ish, purpose limitation). "Voltera knows you bought an EV" is a *negative* headline. 300 samples/class makes it a demo, not production. | FIXABLE | Internal targeting only: who gets offered the guarantee. Never customer-facing "we detected". |

---

## 4. Scoreboard (red-team view, not the judge's)

| Tier | Ideas |
|---|---|
| **Keep as core** | Cluster B (06-1 pricing + 04-1/07-1 mechanism + 09-1 demo), Cluster C via 04-2, 09-3 validator |
| **Keep as feature** | 06-3 channel, 05-2 settlement pot, 05-4 job price, 07-4 battery advance, 08-1 lamp, 09-4 Twin (business case), 09-5 targeting, 01-3 family P2P |
| **Drop** | 01-5 (core), 02-5, 03-5, 04-5 (binding), 05-5, 06-5, 07-3, 07-5, 08-4, 09-4 (as idea) |

---

## 5. HYBRIDS

### H1. **"Voltera Piekpact": we explain your peak, then we guarantee it**
**One-liner:** "Other suppliers explain your bill. Voltera signs for it: pick your kW, we keep you under it, or we pay."

**Mechanism:**
1. **Explain (free, all customers):** monthly footnoted receipt from 09-3 (LLM text + deterministic validator), sent via 06-3's channel (WhatsApp / paper line). It names only big loads (X7 fix): *"Tue 18:15, 8.4 kW, a large continuous load (EV?). This cost €X over the year."* Reply **JA** to subscribe.
2. **Price (actuarial):** per-household premium computed from the customer's own 15-min history (06-1). Demo it on Fluvius open-data EV profiles (X9).
3. **Enforce:** the quarter-hour projection controller (04-1) throttles *delegated* loads (EV first). An EV owner can book a charge as a fixed-price job (05-4).
4. **Guarantee:** any capacity cost above the cap caused by delegated loads is credited as a **tariff discount**, not insurance.
5. **No-app skin:** the PiekLicht lamp (08-1) for low-digital households.

**Demo (the best in the set):** the kettle-vs-EV physics on stage (09-1). The kettle adds +0.44 kW, "€0". The EV turns the ring red: "+€17". The controller acts, and the guarantee ledger shows "€0 owed". Then the validator catches a planted LLM error. The Twin slider (09-4) is the business-case close.

**Why it beats its parents:**
- Receipt alone (Cluster A) = no revenue and every team has it. Controller alone (09-1) = commoditised (X8). Guarantee alone (03-1) = no acquisition moment.
- Together: a free funnel → a paid, un-comparable product.
- A guarantee puts Voltera's money on the line, which is the only thing HomeWizard, Engie and Tibber don't do.
- It hits calls (explain), churn (a contract you can't compare on price per kWh), and self-consumption and peaks (control). The dynamic tariff can be layered on top via H2.

**Numbers to say out loud:** 10k subscribers × €36 fee minus a 30% payout reserve ≈ €250k. Churn 18→10% in the segment ≈ €200k. Bill-call deflection 25% ≈ €300k. **≈ €0.75M/yr base case.** Customer saves €150–220/yr (EV). Show the pessimistic toggle.

### H2. **"Jaarcheck met Spijtgarantie": the legally required letter becomes the product**
**One-liner:** "Every Belgian supplier must tell you once a year which formula is cheapest. We prove it on your own quarter-hours, and if we're wrong, we pay."

**Mechanism:**
1. The Consumentenakkoord's annual "cheapest formula" notice (04-2) is re-priced on the customer's real 15-min year (engine from 09-2).
2. Targeting from 09-5 plus a P90 filter (02-2): only customers who are very likely to win get the offer.
3. One-tap switch to dynamic, with a **12-month regret refund benchmarked against *variable*, not fixed**. A variable contract also tracks the market, so the refund risk is far less correlated than a fixed benchmark (X2 fix). Capped at €100.
4. "Dynamic-lite" rung for the timid: the Zonne-uren time blocks (08-3).
5. The monthly shadow-bill line becomes a one-line proof that it was worth staying (churn).

**Why it beats its parents:**
- V-test already does the replay (X1), so the replay alone scores 1/5 on originality.
- The guarantee alone scares the finance people (X2).
- Anchoring it to a **mandatory** notice gives zero marketing cost and a regulator-friendly story. Benchmarking vs variable makes the tail risk sellable.
- The P90 filter makes the payout budget defensible.
- Book the X3 cannibalisation honestly: it's a jury credibility point.

### H3. **"Familiestroom": your roof, your mother's bill, one supplier**
**One-liner:** "Sell your midday solar to your mum at the price you pick. Voltera does the Fluvius paperwork, and her bill stops surprising you."

**Mechanism:**
1. Family P2P **sale** (not sharing, X5) from 01-3, with a match simulation on both 15-min curves before signup.
2. The VREG same-supplier rule means the relative *joins Voltera*: the **acquisition** engine.
3. The adult child gets **bill delegation** (01-5 stripped of presence monitoring): manage mum's advance and payment plan, plus the settlement pot (05-2).
4. Optional PiekLicht (08-1) at mum's house.

**Why it beats its parents:** 01-3/04-3 are €26–40/yr savings ideas that die on "so what". 01-5 dies on GDPR. Combined, the value is **two households per contract, a legal lock-in, and the vulnerable-customer impact** without surveillance. Weakest of the three on business value (small € per pair), strongest on customer-impact storytelling. Use it as the **self-consumption chapter** of H1+H2 rather than as the lead.

---

## 6. Recommendation to the judge
- **Lead with H1 and fold H2 in as the dynamic-tariff arm. They share one engine, and one demo covers all 4 symptoms.**
- Use H3 as a 30-second "and for solar families" beat.
- Before the pitch:
  1. Resolve X4 (default data access vs meetregime 3).
  2. Freeze one number per fact (X6).
  3. Strip every "avoided hedging premium" line (X2).
  4. Never claim NILM can see a kettle (X7).
