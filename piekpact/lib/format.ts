const eurFmt = new Intl.NumberFormat("nl-BE", { style: "currency", currency: "EUR" });
const eur0Fmt = new Intl.NumberFormat("nl-BE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const numFmt = new Intl.NumberFormat("nl-BE", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const intFmt = new Intl.NumberFormat("nl-BE", { maximumFractionDigits: 0 });

// Intl uses a non-breaking space between € and the number; normalise so the validator can match text.
const nb = (s: string) => s.replace(/ /g, " ");

export const eur = (n: number) => nb(eurFmt.format(n));
export const eur0 = (n: number) => nb(eur0Fmt.format(n));
export const kw = (n: number) => `${numFmt.format(n)} kW`;
export const int = (n: number) => nb(intFmt.format(n));

export const hhmm = (qh: number) => {
  const m = qh * 15;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
};
