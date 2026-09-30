// Voltera-level business case. Every input is a slider on screen with its source tag.
export type Assumption = {
  key: string;
  label: string;
  value: number;
  pessimistic?: number;
  min: number;
  max: number;
  step: number;
  unit: "%" | "€" | "#" | "kW";
  tag: string;
};

export const ASSUMPTIONS: Assumption[] = [
  { key: "customers", label: "Klanten", value: 350000, min: 100000, max: 500000, step: 10000, unit: "#", tag: "case" },
  { key: "churnBase", label: "Churn vandaag", value: 0.18, min: 0.05, max: 0.3, step: 0.01, unit: "%", tag: "case" },
  { key: "evHpShare", label: "Aandeel EV/warmtepomp", value: 0.12, min: 0.05, max: 0.3, step: 0.01, unit: "%", tag: "aanname" },
  { key: "uptake", label: "Neemt Piekpact", value: 0.25, pessimistic: 0.125, min: 0.05, max: 0.5, step: 0.005, unit: "%", tag: "aanname" },
  { key: "feePerYear", label: "Abonnement per jaar", value: 36, min: 12, max: 72, step: 1, unit: "€", tag: "model" },
  { key: "payoutRatio", label: "Uitbetaald via garantie", value: 0.3, min: 0, max: 0.6, step: 0.05, unit: "%", tag: "aanname" },
  { key: "churnSubscribers", label: "Churn abonnees", value: 0.1, pessimistic: 0.14, min: 0.02, max: 0.18, step: 0.01, unit: "%", tag: "aanname" },
  { key: "marginPerCustomer", label: "Marge per klant/jaar", value: 100, min: 40, max: 200, step: 5, unit: "€", tag: "aanname" },
  { key: "cac", label: "Kost nieuwe klant", value: 150, min: 50, max: 300, step: 10, unit: "€", tag: "aanname" },
  { key: "callsPerCustomer", label: "Oproepen per klant/jaar", value: 0.84, min: 0.3, max: 1.5, step: 0.02, unit: "#", tag: "0,6 × 1,4 (case)" },
  { key: "billCallShare", label: "Aandeel factuurvragen", value: 0.6, min: 0.2, max: 0.9, step: 0.05, unit: "%", tag: "aanname" },
  { key: "deflection", label: "Minder factuurvragen", value: 0.25, pessimistic: 0.125, min: 0, max: 0.6, step: 0.005, unit: "%", tag: "aanname" },
  { key: "costPerCall", label: "Kost per oproep", value: 7, min: 2, max: 12, step: 0.5, unit: "€", tag: "EU 2–8" },
  { key: "peakReductionKW", label: "Minder piek per abonnee", value: 3.9, min: 1, max: 6, step: 0.1, unit: "kW", tag: "aanname · Lotte: 8,4 → 4,0 kW" },
];

export const defaults = (pessimistic = false) =>
  Object.fromEntries(ASSUMPTIONS.map((a) => [a.key, pessimistic && a.pessimistic !== undefined ? a.pessimistic : a.value]));

const LLM_COST_PER_RECEIPT = 0.005;
const WHATSAPP_OPT_IN = 0.4;
const WHATSAPP_COST = 0.05;
const DONGLE_NET = 25; // €40 P1 dongle − €15 co-pay

export function businessCase(v: Record<string, number>) {
  const subs = Math.floor((v.customers * v.evHpShare * v.uptake) / 1000) * 1000;
  const feeNet = subs * v.feePerYear * (1 - v.payoutRatio);
  const churnValue = subs * (v.churnBase - v.churnSubscribers) * (v.marginPerCustomer + v.cac);
  const callSavings = v.customers * v.callsPerCustomer * v.billCallShare * v.deflection * v.costPerCall;
  const running = v.customers * 12 * LLM_COST_PER_RECEIPT + v.customers * WHATSAPP_OPT_IN * 12 * WHATSAPP_COST;
  return {
    subs,
    feeNet,
    churnValue,
    callSavings,
    running,
    net: feeNet + churnValue + callSavings - running,
    hardware: subs * DONGLE_NET,
    mw: (subs * v.peakReductionKW) / 1000,
  };
}
