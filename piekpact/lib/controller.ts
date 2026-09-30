// Live "Kwartierklok": one quarter-hour simulated faster than real time.
// Only the quarter-hour AVERAGE counts for the capacity tariff, so the controller
// steers the EV so that the projected average ends just under the cap.
import { EV_KW, EV_MIN_KW } from "./household";
import { EUR_PER_PEAK_KW } from "./tariff";

export const QH_S = 900;

export type LiveState = {
  simTimeS: number; // 0..900 into the quarter-hour
  baseKW: number; // house (lights, fridge, hob on low)
  kettleKW: number;
  kettleLeftS: number;
  evRequested: boolean;
  evKW: number;
  auto: boolean;
  energyKWh: number;
  projectedKW: number;
  monthPeakKW: number;
  capKW: number;
  atStakeEur: number;
  light: "green" | "orange" | "red";
  ledgerOwedEur: number;
  finished: boolean;
  trace: { t: number; kW: number; p: number }[];
};

export const KETTLE_KW = 2.2;
export const KETTLE_S = 180;

export const initialState = (capKW: number, auto: boolean): LiveState => ({
  simTimeS: 0,
  baseKW: 1.0,
  kettleKW: 0,
  kettleLeftS: 0,
  evRequested: false,
  evKW: 0,
  auto,
  energyKWh: 0,
  projectedKW: 1.0,
  monthPeakKW: capKW,
  capKW,
  atStakeEur: 0,
  light: "green",
  ledgerOwedEur: 0,
  finished: false,
  trace: [],
});

export function step(s: LiveState, dt: number): LiveState {
  if (s.finished) return s;
  const n = { ...s };
  n.kettleKW = n.kettleLeftS > 0 ? KETTLE_KW : 0;
  n.kettleLeftS = Math.max(0, n.kettleLeftS - dt);

  const tLeftH = Math.max(0, QH_S - n.simTimeS) / 3600;
  let ev = n.evRequested ? EV_KW : 0;
  if (n.evRequested && n.auto && tLeftH > 0) {
    // Highest EV power that keeps the quarter-hour average 0.1 kW under the cap.
    const budgetKWh = (n.capKW - 0.1) * 0.25 - n.energyKWh;
    ev = Math.min(EV_KW, Math.max(0, budgetKWh / tLeftH - n.baseKW - n.kettleKW));
    if (ev < EV_MIN_KW) ev = 0;
  }
  n.evKW = ev;

  const nowKW = n.baseKW + n.kettleKW + n.evKW;
  n.energyKWh += (nowKW * dt) / 3600;
  n.simTimeS = Math.min(QH_S, n.simTimeS + dt);
  const leftH = (QH_S - n.simTimeS) / 3600;
  n.projectedKW = (n.energyKWh + nowKW * leftH) / 0.25;
  n.atStakeEur = Math.max(0, n.projectedKW - n.monthPeakKW) * EUR_PER_PEAK_KW;
  n.light = n.projectedKW <= n.monthPeakKW - 0.5 ? "green" : n.projectedKW <= n.monthPeakKW ? "orange" : "red";
  n.trace = [...n.trace, { t: n.simTimeS, kW: nowKW, p: n.projectedKW }];

  if (n.simTimeS >= QH_S) {
    n.finished = true;
    // The guarantee: if a load we control pushed the quarter-hour over the cap, Voltera pays.
    if (n.auto && n.projectedKW > n.capKW && n.evKW > 0) n.ledgerOwedEur += (n.projectedKW - n.capKW) * EUR_PER_PEAK_KW;
  }
  return n;
}
