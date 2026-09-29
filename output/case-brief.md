# CASE BRIEF: Voltera (practice case, dry run)

**Case:** Voltera, a fictional Belgian energy supplier with ~350k residential customers in Flanders and Brussels. It sells electricity and gas, and recently started selling solar + home battery packages.
**Question:** How can Voltera use digital solutions to turn confused customers into engaged, loyal customers while creating new value for the company?
**Team:** 4 people: 1 business, 2 dev, 1 unspecified (generalist). **Time:** 24 hours.

## The real problem behind the stated problem
- Customers aren't confused because of a lack of information. The bill no longer maps to anything they can see or control. After the reverse-running meter ended in Flanders (2021+) and the capaciteitstarief arrived (2023), the bill depends on **when** you use power and on your **monthly peak (kW)**. Customers never see either of these.
- So the underlying problem is **invisible cause and effect**. Behaviour (charging the EV at 18:00, running the dishwasher at noon versus at night) drives cost, but feedback arrives weeks later as a lump sum.
- For Voltera: every confused customer creates a **cost** (support calls up 40%) and a **churn risk** (18%/yr). Price is the only thing they compare on. Voltera has no relationship with them beyond the invoice.
- Hidden opportunity: Voltera already has 15-minute data, dynamic tariffs, and solar + battery products. These are levers that *can* save customers money, but no one activates them.

## Stakeholders
| Stakeholder | Wants |
|---|---|
| Residential customer (non-solar) | A predictable, fair bill; to understand "why this amount"; low effort |
| Solar/battery customer | Return on the investment; use their own production; understand injection vs. consumption |
| Vulnerable / low-digital-literacy customers | No surprises, plain language, not being penalised by complexity |
| Voltera management | Lower cost-to-serve, lower churn, higher margin per customer, cross-sell (solar, battery, heat pump, EV) |
| Customer service | Fewer repetitive bill calls |
| DSO (Fluvius) / grid | Lower peaks, flexibility |
| Regulator (VREG / CREG / Brugel) | Transparency, consumer protection, no misleading tariff advice |

## Hard constraints
- **Time:** 24 hours, team of 4 (2 devs, so there's real build capacity).
- **Data:** anonymised 15-minute smart meter sample (mock data allowed), public tariff info, and the current basic app (view bills, pay).
- **Legal:** GDPR, since 15-minute data is personal data. Detailed-data access needs consent (the Fluvius "kwartierwaarden" opt-in). The EU AI Act applies if an AI gives advice that affects customers. VREG supplier rules on tariff transparency.
- **Tech:** the prototype must run on mock data. No real integration with Fluvius or Voltera systems is possible.
- **Budget:** implied to be realistic for a mid-sized supplier. No 10-year moonshots without a pilot path.

## Judging criteria (verbatim)
- Innovation & originality (25%)
- Customer impact (25%)
- Business value & feasibility (30%)
- Quality of prototype & pitch (20%)

**Implicit criteria:** a credible business case with numbers, a demo that *works* live, a memorable one-liner, awareness of Belgian specifics (capaciteitstarief, digital meter, Flemish context), and addressing all four symptoms (calls, churn, dynamic-tariff uptake, self-consumption) with one coherent idea rather than four features.

## Deliverables
5-minute pitch, a working prototype or clickable demo, and a business case.

## BANNED list (obvious ideas every team will pitch; only allowed with a clearly non-obvious twist)
1. **An AI chatbot** that answers bill questions.
2. **An energy dashboard / consumption graphs** in the app ("visualise your usage").
3. **Gamification**: points, badges, leaderboards, comparing with neighbours.
4. **Push notifications for cheap hours** in a dynamic tariff ("run your dishwasher now").
5. **A generic "smart home automation / battery optimisation" algorithm** without a concrete customer-facing mechanism or business model.
