# PLAN: Voltera Piekpact (4-hour cut, story-first)

Source: `output/HANDOFF.md` (24h version). This file replaces it for the build: fewer features, one film, one WOW.

**One-liner:** "Other suppliers explain your bill. Voltera signs for it: pick your kW, we keep you under it, or we pay."

## The film (about 3 min)
**Protagonist:** Lotte, 34, nurse in Mechelen, two kids, just got her first EV. [fictional persona]

| # | Scene | Screen | Time |
|---|---|---|---|
| 1 | **Normal life.** Tuesday in January, 18:15. Lotte gets home from her shift, plugs in the car, puts the pasta on, kettle on for the kids. | Kwartierklok replaying her evening, auto OFF | 30s |
| 2 | **Tension.** A message from Voltera: *"That one quarter-hour costs you €23,58 extra, spread over your next 12 bills."* She had no idea. Nobody does: the capacity tariff bills your single worst quarter-hour of the month. | Piekbon receipt (phone). AI writes it, validator catches a planted wrong number. | 30s |
| 3 | **Solution.** One button: JA. Voltera prices a personal kW cap from *her own* data: 4,0 kW for €2,49/month. | Piekpact offer: cap slider + 12-month chart with/without | 30s |
| 4 | **WOW.** Same evening, replayed live with Piekpact ON. A jury member presses the kettle key. The ring stays green; the car slows down for 10 minutes, is still full by 07:00. Ledger: Voltera owes €0. | Kwartierklok, auto ON | 50s |
| 5 | **Resolution + scale.** Lotte keeps €212/yr net. Voltera: ≈€655k/yr net, 39 MW less evening peak. "Don't trust our uptake: set it yourself." | Business case sliders | 40s |

## MUST features (build in this order; WOW first)
1. **Kwartierklok (WOW):** live 15-min simulation, ring with projected kW, € at stake, controller auto on/off, hotkeys `K` kettle, `E` EV, `A` auto, `R` reset.
2. **Piekbon receipt:** phone frame, peak of the day chart, AI text + deterministic validator, `P` plants an error that gets caught in red.
3. **Business case:** assumption sliders with tags, live totals, pessimistic toggle.
4. **Piekpact offer** (SHOULD if time): cap slider, fee, 12-month chart.

## FAKE vs BUILD
| Build (real logic) | Fake |
|---|---|
| Capacity maths, controller, validator, business-case formulas | Meter data: seeded synthetic year for Lotte's household (Fluvius open data later) |
| Claude API call for the receipt when `ANTHROPIC_API_KEY` is set | Without a key: cached AI text (demo never depends on Wi-Fi) |
| | WhatsApp delivery: phone mockup only. Kettle: keyboard key (smart plug later) |

## Component contracts
- `lib/household.ts` → `generateYear(seed)` returns `QuarterHour[]` `{ts, kW}` → consumed by receipt chart + offer chart.
- `lib/capacity.ts` → `monthlyPeaks(series)` returns `{month, peakKW, peakTs}[]`; `costOfPeak(peak, ref)` → € incl. VAT.
- `lib/controller.ts` → `step(state, dtSim)` returns new `LiveState` `{simTimeS, baseKW, plugKW, evKW, energySoFarKWh, projectedKW, monthPeakKW, capKW, atStakeEur, light, ledgerOwedEur}` → rendered by Kwartierklok.
- `lib/validator.ts` → `validate(receipt, facts)` returns `{ok, errors[]}` → receipt banner.
- `app/api/receipt` → `{sentences:[{text, claims:[{key,value}]}], source: "claude"|"cache"}`.

## Run it
```
cd piekpact && npm install && npm run dev
```
Keys: `0–4` or ←/→ scenes · `K` kettle · `E` EV · `A` Piekpact · `R` reset · space pause · `P` plant AI error · `X` pessimistic. Set `ANTHROPIC_API_KEY` for a live Claude receipt; without it the cached draft is used.

## Stack
Next.js (App Router) + TypeScript + Tailwind + Recharts, in `piekpact/`. UI copy in Dutch, numbers `nl-BE`.

## Checkpoints (hackathon clock)
| By | Must be true |
|---|---|
| 0:25 | Plan + contracts locked, app scaffolded |
| 1:30 | Kwartierklok runs end to end with hotkeys |
| 2:15 | Receipt + validator + planted error |
| 2:45 | Business case screen. **Feature freeze.** |
| 3:15 | Polish visuals, record fallback video |
| 4:00 | Film rehearsed 3× |
