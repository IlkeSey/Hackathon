// Flemish capacity tariff (capaciteitstarief), 2026 reference values.
// Source: Fluvius / callmepower.be. Per-DSO rates differ; the demo uses the Flemish reference.
export const VAT = 0.06;
export const CAPACITY_EUR_PER_KW_YEAR_EXCL = 53.39;
export const CAPACITY_EUR_PER_KW_YEAR = CAPACITY_EUR_PER_KW_YEAR_EXCL * (1 + VAT); // 56.59
// The yearly bill uses the average of 12 monthly peaks, so one monthly peak kW costs 1/12 of that.
export const EUR_PER_PEAK_KW = CAPACITY_EUR_PER_KW_YEAR / 12; // ≈ 4.72
export const MIN_BILLED_KW = 2.5;

export const billedKW = (peakKW: number) => Math.max(MIN_BILLED_KW, peakKW);

/** Yearly capacity cost (incl. VAT) for 12 monthly peaks. */
export const yearlyCapacityCost = (monthlyPeaks: number[]) =>
  (monthlyPeaks.reduce((s, p) => s + billedKW(p), 0) / monthlyPeaks.length) * CAPACITY_EUR_PER_KW_YEAR;
