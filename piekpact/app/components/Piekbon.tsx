"use client";

import { useEffect, useMemo, useState } from "react";
import { receiptFacts, type ReceiptFacts } from "@/lib/capacity";
import { LOTTE_DAYS } from "@/lib/lotte";
import { validate, formatFact, type Receipt } from "@/lib/validator";
import { eur, hhmm } from "@/lib/format";

type Api = { facts: ReceiptFacts; draft: Receipt; template: Receipt; source: "claude" | "cache" };

const PLANTED_EUR = 9.1;

// Simulates the AI getting one number wrong: text and claim both say €9,10.
function plantError(r: Receipt, facts: ReceiptFacts): Receipt {
  return {
    sentences: r.sentences.map((s) =>
      s.claims.some((c) => c.key === "extra_cost_eur")
        ? {
            text: s.text.replace(eur(facts.extra_cost_eur), eur(PLANTED_EUR)),
            claims: s.claims.map((c) => (c.key === "extra_cost_eur" ? { ...c, value: PLANTED_EUR } : c)),
          }
        : s,
    ),
  };
}

export default function Piekbon() {
  const [api, setApi] = useState<Api | null>(null);
  const [planted, setPlanted] = useState(false);
  const [ja, setJa] = useState(false);
  const day = useMemo(() => receiptFacts(LOTTE_DAYS), []);

  useEffect(() => {
    fetch("/api/receipt").then((r) => r.json()).then(setApi);
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key.toLowerCase() === "p" && setPlanted((p) => !p);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!api) return <div className="grid flex-1 place-items-center text-muted">AI schrijft Lottes piekbon…</div>;

  const draft = planted ? plantError(api.draft, api.facts) : api.draft;
  const check = validate(draft, api.facts);
  const shown = check.ok ? draft : api.template;

  return (
    <section className="grid flex-1 grid-cols-1 items-center gap-10 p-6 lg:grid-cols-[auto_1fr]">
      {/* Phone */}
      <div className="mx-auto w-[340px] rounded-[44px] border-[10px] border-[#1b2233] bg-[#0b141a] p-3 shadow-2xl">
        <div className="flex items-center gap-2 border-b border-white/10 px-2 pb-3">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-volt text-bg">⚡</span>
          <div>
            <div className="text-sm font-semibold">Voltera</div>
            <div className="text-[11px] text-muted">zakelijk account</div>
          </div>
        </div>
        <div className="min-h-[430px] space-y-2 py-3">
          <div className="max-w-[92%] rounded-2xl rounded-tl-sm bg-[#1f2c34] p-3 text-[14px] leading-snug">
            <div className="mb-2 text-[11px] font-semibold text-volt">JE PIEKBON · JANUARI</div>
            <DayChart kW={day.dayKW} peakQh={day.peakQh} />
            {shown.sentences.map((s, i) => (
              <p key={i} className="mt-1.5">{s.text}</p>
            ))}
            <div className="mt-2 text-right text-[10px] text-muted">18:31</div>
          </div>
          {!ja ? (
            <button onClick={() => setJa(true)} className="w-full rounded-xl bg-[#1f2c34] py-2.5 text-sm font-semibold text-volt">
              Antwoord JA: hou me onder mijn plafond
            </button>
          ) : (
            <div className="ml-auto max-w-[70%] rounded-2xl rounded-tr-sm bg-[#005c4b] p-3 text-[14px]">JA</div>
          )}
        </div>
      </div>

      {/* Validator */}
      <div className="max-w-xl">
        <p className="font-mono text-xs tracking-[0.25em] text-muted uppercase">Geen verrassingen meer</p>
        <h2 className="mt-2 text-4xl font-semibold tracking-tight">
          Elke maand één bericht: welk kwartier je geld kostte, en hoeveel.
        </h2>
        <p className="mt-4 text-muted">
          AI ({api.source === "claude" ? "Claude, live" : "Claude, gecachte versie"}) schrijft het bericht in mensentaal. Maar AI krijgt nooit
          het laatste woord: elk getal wordt nagerekend tegen het grootboek.
        </p>

        <div className={`mt-6 rounded-2xl border p-5 transition ${check.ok ? "border-ok/40 bg-ok/5" : "border-bad bg-bad/10"}`}>
          <div className={`text-lg font-semibold ${check.ok ? "text-ok" : "text-bad"}`}>
            {check.ok ? "✓ Gevalideerd: elk getal klopt" : "✕ Geweigerd: sjabloontekst verstuurd"}
          </div>
          {!check.ok && check.errors.map((e) => <div key={e} className="num mt-1 text-bad">{e}</div>)}
          <ul className="mt-4 space-y-1.5 text-sm">
            {draft.sentences.flatMap((s) => s.claims).map((c) => {
              const ok = validate({ sentences: [{ text: draft.sentences.map((x) => x.text).join(" "), claims: [c] }] }, api.facts).ok;
              return (
                <li key={c.key} className="num flex justify-between gap-4 border-b border-line pb-1.5">
                  <span className="text-muted">{c.key}</span>
                  <span className={ok ? "text-ok" : "text-bad"}>{formatFact(c.key, c.value)} {ok ? "✓" : "✕"}</span>
                </li>
              );
            })}
          </ul>
        </div>
        <p className="mt-3 font-mono text-xs text-muted">P plant een fout in het AI-concept</p>
      </div>
    </section>
  );
}

function DayChart({ kW, peakQh }: { kW: number[]; peakQh: number }) {
  const max = Math.max(...kW);
  return (
    <div>
      <div className="flex h-16 items-end gap-px">
        {kW.map((v, q) => (
          <div key={q} className="flex-1 rounded-t-[1px]" style={{ height: `${(v / max) * 100}%`, background: q === peakQh ? "var(--bad)" : "#3b4a57" }} />
        ))}
      </div>
      <div className="mt-0.5 flex justify-between text-[9px] text-muted">
        <span>00:00</span><span>{hhmm(peakQh)}</span><span>24:00</span>
      </div>
    </div>
  );
}
