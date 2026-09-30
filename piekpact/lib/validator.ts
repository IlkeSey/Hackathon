// The AI writes the receipt; it never gets the last word.
// Every number it claims must match the ledger facts AND literally appear in the text.
import type { ReceiptFacts } from "./capacity";
import { eur, kw } from "./format";

export type Claim = { key: keyof ReceiptFacts; value: string | number };
export type Receipt = { sentences: { text: string; claims: Claim[] }[] };
export type Check = { ok: boolean; errors: string[] };

// Appliances we can't tell apart from 15-min data: never name them.
const BANNED = /waterkoker|oven|kookplaat|droogkast|föhn|vaatwas/i;

export const formatFact = (key: keyof ReceiptFacts, v: string | number) =>
  typeof v === "number" ? (key.endsWith("_eur") ? eur(v) : kw(v)) : v;

export function validate(r: Receipt, facts: ReceiptFacts): Check {
  const errors: string[] = [];
  const text = r.sentences.map((s) => s.text).join(" ").replace(/ /g, " ");
  for (const s of r.sentences)
    for (const c of s.claims) {
      if (!(c.key in facts)) {
        errors.push(`onbekend feit "${c.key}"`);
        continue;
      }
      const truth = facts[c.key];
      const tol = c.key.endsWith("_eur") ? 0.01 : 0.05;
      const match = typeof truth === "number" ? Math.abs(Number(c.value) - truth) <= tol : String(c.value) === truth;
      if (!match) errors.push(`AI zei ${formatFact(c.key, c.value)} · grootboek zegt ${formatFact(c.key, truth)}`);
      else if (!text.includes(formatFact(c.key, truth))) errors.push(`${formatFact(c.key, truth)} staat niet letterlijk in de tekst`);
    }
  if (BANNED.test(text)) errors.push("noemt een toestel dat we niet kunnen meten");
  return { ok: errors.length === 0, errors };
}

/** Deterministic fallback text, used whenever the AI draft is rejected. */
export function templateReceipt(f: ReceiptFacts): Receipt {
  return {
    sentences: [
      { text: `Di 13 jan, ${f.peak_start}–${f.peak_end}: ${kw(f.peak_kw)}.`, claims: [{ key: "peak_kw", value: f.peak_kw }] },
      { text: `Dat was een ${f.load_label}, bovenop de rest van je huis.`, claims: [{ key: "load_label", value: f.load_label }] },
      {
        text: `Dit ene kwartier kost je ${eur(f.extra_cost_eur)} extra, verspreid over je volgende 12 facturen.`,
        claims: [{ key: "extra_cost_eur", value: f.extra_cost_eur }],
      },
      {
        text: `Was de auto na 21:00 gestart, dan was je piek ${kw(f.shifted_peak_kw)} geweest.`,
        claims: [{ key: "shifted_peak_kw", value: f.shifted_peak_kw }],
      },
    ],
  };
}
