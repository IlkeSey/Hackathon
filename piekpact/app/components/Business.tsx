"use client";

import { useEffect, useState } from "react";
import { ASSUMPTIONS, businessCase, defaults, type Assumption } from "@/lib/business";
import { eur0, int } from "@/lib/format";

const fmt = (a: Assumption, v: number) =>
  a.unit === "%" ? `${(v * 100).toLocaleString("nl-BE", { maximumFractionDigits: 1 })}%` : a.unit === "€" ? eur0(v) : a.unit === "kW" ? `${v.toLocaleString("nl-BE")} kW` : int(v);

export default function Business() {
  const [pess, setPess] = useState(false);
  const [v, setV] = useState(() => defaults());
  const bc = businessCase(v);

  const togglePess = () =>
    setPess((p) => {
      setV(defaults(!p));
      return !p;
    });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key.toLowerCase() === "x" && !(e.target instanceof HTMLInputElement) && togglePess();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const rows = [
    { label: "Abonnementen (na garantie-uitbetalingen)", value: bc.feeNet },
    { label: "Minder churn bij abonnees", value: bc.churnValue },
    { label: "Minder factuurvragen", value: bc.callSavings },
    { label: "AI + WhatsApp-berichten", value: -bc.running },
  ];

  return (
    <section className="grid flex-1 grid-cols-1 gap-6 p-6 lg:grid-cols-[1.3fr_1fr]">
      <div className="rounded-3xl border border-line bg-panel p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="font-mono text-xs tracking-[0.25em] text-muted uppercase">Vertrouw ons getal niet</p>
            <h2 className="text-2xl font-semibold">Zet het zelf.</h2>
          </div>
          <button
            onClick={togglePess}
            className={`rounded-full border px-4 py-1.5 text-sm ${pess ? "border-warn bg-warn/10 text-warn" : "border-line text-muted"}`}
          >
            Pessimistisch {pess ? "AAN" : "UIT"} <kbd className="ml-1 font-mono text-xs opacity-60">X</kbd>
          </button>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
          {ASSUMPTIONS.map((a) => (
            <label key={a.key} className="block">
              <div className="flex justify-between text-sm">
                <span>{a.label}</span>
                <span className="num font-semibold">{fmt(a, v[a.key])}</span>
              </div>
              <input
                type="range"
                min={a.min}
                max={a.max}
                step={a.step}
                value={v[a.key]}
                onChange={(e) => setV({ ...v, [a.key]: +e.target.value })}
                className="w-full"
              />
              <div className="text-[11px] text-muted">{a.tag}</div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-3xl border border-volt/40 bg-volt/5 p-6">
          <div className="text-muted">Netto voor Voltera, per jaar</div>
          <div className={`num mt-1 text-6xl font-semibold ${bc.net >= 0 ? "text-volt" : "text-bad"}`}>{eur0(bc.net)}</div>
          <div className="num mt-2 text-muted">{int(bc.subs)} abonnees</div>
          <ul className="mt-5 space-y-2">
            {rows.map((r) => (
              <li key={r.label} className="num flex justify-between border-b border-line pb-2 text-sm">
                <span className="text-muted">{r.label}</span>
                <span className={r.value < 0 ? "text-bad" : ""}>{eur0(r.value)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Stat big={`${int(bc.mw)} MW`} small="minder avondpiek op het net" />
          <Stat big={eur0(bc.hardware)} small="eenmalig: P1-dongles (min eigen bijdrage)" />
        </div>
        <p className="text-sm text-muted">
          Volgende stap, zelfde motor: de jaarlijkse goedkoopste-formule-check met spijtgarantie.
        </p>
      </div>
    </section>
  );
}

function Stat({ big, small }: { big: string; small: string }) {
  return (
    <div className="rounded-2xl border border-line bg-panel p-5">
      <div className="num text-3xl font-semibold">{big}</div>
      <div className="mt-1 text-sm text-muted">{small}</div>
    </div>
  );
}
