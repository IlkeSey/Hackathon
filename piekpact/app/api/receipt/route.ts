// Writes Lotte's "Piekbon" with Claude when ANTHROPIC_API_KEY is set; otherwise serves the cached draft.
// The validator runs on the client, so the jury sees it catch a planted error either way.
import { generateYear } from "@/lib/household";
import { receiptFacts, type ReceiptFacts } from "@/lib/capacity";
import { templateReceipt, type Receipt } from "@/lib/validator";
import { eur, kw } from "@/lib/format";

const MODEL = process.env.CLAUDE_MODEL ?? "claude-sonnet-5-5";

async function askClaude(facts: ReceiptFacts): Promise<Receipt | null> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  const prompt = `Je bent Voltera, een Vlaamse energieleverancier. Schrijf een kort, warm WhatsApp-bericht (3-4 zinnen, Vlaams-Nederlands, "je") aan Lotte over haar duurste kwartier van januari.
Gebruik ALLEEN deze feiten, en schrijf getallen exact zo: ${JSON.stringify(facts)}. Bedragen als "${eur(facts.extra_cost_eur)}", vermogen als "8,4 kW".
Noem nooit een specifiek toestel (geen waterkoker, oven, kookplaat, droogkast, föhn, vaatwas).
Antwoord ALLEEN met JSON: {"sentences":[{"text":"...","claims":[{"key":"<feitnaam>","value":<waarde>}]}]}. Elke zin met een getal vermeldt dat feit in claims.`;
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: MODEL, max_tokens: 600, messages: [{ role: "user", content: prompt }] }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text: string = data.content?.[0]?.text ?? "";
    return JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
  } catch {
    return null;
  }
}

// Cached draft in the AI's voice (used offline / without a key).
function cachedDraft(f: ReceiptFacts): Receipt {
  return {
    sentences: [
      {
        text: `Hoi Lotte! Dinsdag 13 januari tussen ${f.peak_start} en ${f.peak_end} trok je huis ${kw(f.peak_kw)}: je hoogste kwartier van de maand.`,
        claims: [{ key: "peak_kw", value: f.peak_kw }],
      },
      { text: `Dat kwam vooral door een ${f.load_label}.`, claims: [{ key: "load_label", value: f.load_label }] },
      {
        text: `Dat ene kwartier kost je ${eur(f.extra_cost_eur)} extra, verspreid over je volgende 12 facturen.`,
        claims: [{ key: "extra_cost_eur", value: f.extra_cost_eur }],
      },
      {
        text: `Was de auto na 21:00 beginnen laden, dan bleef je piek op ${kw(f.shifted_peak_kw)}.`,
        claims: [{ key: "shifted_peak_kw", value: f.shifted_peak_kw }],
      },
    ],
  };
}

export async function GET() {
  const all = receiptFacts(generateYear());
  const facts: ReceiptFacts = {
    date: all.date, peak_start: all.peak_start, peak_end: all.peak_end, peak_kw: all.peak_kw,
    load_label: all.load_label, shifted_peak_kw: all.shifted_peak_kw, extra_cost_eur: all.extra_cost_eur,
  };
  const ai = await askClaude(facts);
  return Response.json({
    facts,
    draft: ai ?? cachedDraft(facts),
    template: templateReceipt(facts),
    source: ai ? "claude" : "cache",
  });
}
