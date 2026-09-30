import { Day, EV_KW, EV_MIN_KW, STORY_DATE, total } from "./household";
import { billedKW, CAPACITY_EUR_PER_KW_YEAR, EUR_PER_PEAK_KW, MIN_BILLED_KW } from "./tariff";

export type MonthPeak = { month: string; peakKW: number; date: string; qh: number };

function peaksOf(days: Day[], value: (d: Day, q: number) => number): MonthPeak[] {
  const byMonth = new Map<string, MonthPeak>();
  for (const d of days)
    for (let q = 0; q < 96; q++) {
      const v = value(d, q);
      const cur = byMonth.get(d.month);
      if (!cur || v > cur.peakKW) byMonth.set(d.month, { month: d.month, peakKW: v, date: d.date, qh: q });
    }
  return [...byMonth.values()];
}

export const monthlyPeaks = (days: Day[]) => peaksOf(days, total);

/**
 * Replay the year with the Piekpact controller: the EV only gets the room left under the cap.
 * Energy it couldn't take is carried into the next quarter-hours, so the car still gets all its kWh.
 */
export function controlledEv(days: Day[], capKW: number): number[][] {
  let pendingKWh = 0;
  return days.map((d) =>
    d.ev.map((evKW, q) => {
      pendingKWh += evKW / 4;
      if (pendingKWh <= 1e-9) return 0;
      const room = capKW - d.other[q];
      let kw = Math.min(EV_KW, pendingKWh * 4, room);
      if (kw < EV_MIN_KW) kw = 0;
      pendingKWh -= kw / 4;
      return kw;
    }),
  );
}

export function controlledPeaks(days: Day[], capKW: number): MonthPeak[] {
  const ev = controlledEv(days, capKW);
  const idx = new Map(days.map((d, i) => [d, i]));
  return peaksOf(days, (d, q) => d.other[q] + ev[idx.get(d)!][q]);
}

/** Suggested cap: 70th percentile of the monthly peaks without the EV, rounded up to 0.5 kW. */
export function suggestedCap(days: Day[]): number {
  const p = peaksOf(days, (d, q) => d.other[q]).map((m) => m.peakKW).sort((a, b) => a - b);
  const p70 = p[Math.floor(p.length * 0.7)];
  return Math.max(MIN_BILLED_KW, Math.ceil(p70 * 2) / 2);
}

/**
 * Monthly fee from the household's own history.
 * Voltera pays overshoot caused by the EV; with the controller that only happens if it's offline (5% risk).
 */
export function monthlyFee(days: Day[], capKW: number): number {
  const credit = (peaks: MonthPeak[]) => peaks.reduce((s, m) => s + Math.max(0, m.peakKW - capKW) * EUR_PER_PEAK_KW, 0);
  const evOnlyOvershoot = credit(controlledPeaks(days, capKW)) - credit(peaksOf(days, (d, q) => d.other[q]));
  const expected = Math.max(0, evOnlyOvershoot) + 0.05 * credit(monthlyPeaks(days));
  const raw = Math.max(1.99, (expected / 0.7 + 12) / 12);
  const whole = Math.floor(raw);
  return raw - whole <= 0.49 ? whole + 0.49 : whole + 0.99;
}

export function yearlySaving(days: Day[], capKW: number) {
  const avg = (ps: MonthPeak[]) => ps.reduce((s, m) => s + billedKW(m.peakKW), 0) / ps.length;
  const before = avg(monthlyPeaks(days)) * CAPACITY_EUR_PER_KW_YEAR;
  const after = avg(controlledPeaks(days, capKW)) * CAPACITY_EUR_PER_KW_YEAR;
  const fee = monthlyFee(days, capKW);
  return { before, after, capacitySaving: before - after, fee, net: before - after - fee * 12 };
}

/** The facts the receipt is allowed to state. The validator checks the AI text against these. */
export type ReceiptFacts = {
  date: string;
  peak_start: string;
  peak_end: string;
  peak_kw: number;
  load_label: string;
  shifted_peak_kw: number;
  extra_cost_eur: number;
};

export function receiptFacts(days: Day[]): ReceiptFacts & { dayKW: number[]; peakQh: number } {
  const d = days.find((x) => x.date === STORY_DATE)!;
  const dayKW = d.other.map((o, q) => o + d.ev[q]);
  const peakQh = dayKW.indexOf(Math.max(...dayKW));
  const peak = dayKW[peakQh];
  // Same evening, EV started after 21:00: the day's peak is the house alone.
  const shifted = Math.max(...d.other);
  const r1 = (n: number) => Math.round(n * 10) / 10;
  const hh = (q: number) => `${String(Math.floor(q / 4)).padStart(2, "0")}:${String((q % 4) * 15).padStart(2, "0")}`;
  return {
    date: d.date,
    peak_start: hh(peakQh),
    peak_end: hh(peakQh + 1),
    peak_kw: r1(peak),
    load_label: "grote continue belasting (waarschijnlijk EV)",
    shifted_peak_kw: r1(shifted),
    extra_cost_eur: Math.round((r1(peak) - r1(shifted)) * EUR_PER_PEAK_KW * 100) / 100,
    dayKW,
    peakQh,
  };
}
