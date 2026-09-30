"use client";

import { useEffect, useRef, useState } from "react";
import { initialState, KETTLE_S, QH_S, step, type LiveState } from "@/lib/controller";
import { EV_KW } from "@/lib/household";
import { LOTTE_CAP } from "@/lib/lotte";
import { eur, kw } from "@/lib/format";

const SIM_PER_TICK = 1.5; // 100 ms real = 1.5 s sim → one quarter-hour in 60 s
const COLORS = { green: "var(--ok)", orange: "var(--warn)", red: "var(--bad)" };

export default function Kwartierklok() {
  const [s, setS] = useState<LiveState>(() => initialState(LOTTE_CAP, false));
  const [running, setRunning] = useState(true);
  const auto = useRef(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setS((prev) => step(prev, SIM_PER_TICK)), 100);
    return () => clearInterval(id);
  }, [running]);

  const toggleAuto = () => {
    auto.current = !auto.current;
    setS((p) => ({ ...p, auto: auto.current }));
  };
  const kettle = () => setS((p) => ({ ...p, kettleLeftS: KETTLE_S }));
  const ev = () => setS((p) => ({ ...p, evRequested: !p.evRequested }));
  const reset = () => {
    setS(initialState(LOTTE_CAP, auto.current));
    setRunning(true);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "k") kettle();
      if (k === "e") ev();
      if (k === "a") toggleAuto();
      if (k === "r") reset();
      if (k === " ") {
        e.preventDefault();
        setRunning((r) => !r);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const color = COLORS[s.light];
  const left = QH_S - s.simTimeS;
  const mmss = `${Math.floor(left / 60)}:${String(Math.floor(left % 60)).padStart(2, "0")}`;
  const R = 150;
  const C = 2 * Math.PI * R;

  let caption = "Een gewoon kwartier. Huis: 1,0 kW.";
  if (s.evRequested && !s.auto) caption = `De auto laadt op ${kw(EV_KW)}. Dit kwartier eindigt op ${kw(s.projectedKW)}.`;
  if (s.evRequested && s.auto)
    caption =
      s.evKW > 0
        ? `Piekpact laadt de auto aan ${kw(s.evKW)}. Om 07:00 is ze nog altijd vol.`
        : "Piekpact pauzeert de laadpaal even. Het kwartier blijft onder je plafond.";
  if (s.kettleKW > 0 && !s.evRequested) caption = "Waterkoker: 2,2 kW, maar amper +0,4 kW op het kwartiergemiddelde. Alleen het gemiddelde telt.";
  if (s.finished)
    caption = s.projectedKW > s.monthPeakKW ? `Nieuwe maandpiek: ${kw(s.projectedKW)}. Kost: ${eur(s.atStakeEur)}.` : `Kwartier voorbij op ${kw(s.projectedKW)}. €0 extra.`;

  return (
    <section className="grid flex-1 grid-cols-1 gap-6 p-6 lg:grid-cols-[1fr_1.2fr]">
      {/* The ring: this quarter-hour, live */}
      <div className="flex flex-col items-center justify-center rounded-3xl border border-line bg-panel p-6">
        <div className="mb-2 font-mono text-xs tracking-[0.25em] text-muted uppercase">Kwartier 18:15 – 18:30</div>
        <svg viewBox="0 0 360 360" className="w-full max-w-[380px]">
          <circle cx="180" cy="180" r={R} fill="none" stroke="var(--line)" strokeWidth="18" />
          <circle
            cx="180"
            cy="180"
            r={R}
            fill="none"
            stroke={color}
            strokeWidth="18"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - s.simTimeS / QH_S)}
            transform="rotate(-90 180 180)"
            style={{ transition: "stroke 0.4s" }}
          />
          <text x="180" y="150" textAnchor="middle" fill="var(--muted)" fontSize="14">
            verwacht kwartiergemiddelde
          </text>
          <text x="180" y="205" textAnchor="middle" fill={color} fontSize="58" fontWeight="600" className="num" style={{ transition: "fill 0.4s" }}>
            {kw(s.projectedKW)}
          </text>
          <text x="180" y="240" textAnchor="middle" fill="var(--ink)" fontSize="20" className="num">
            {s.atStakeEur > 0 ? `+${eur(s.atStakeEur)} op je factuur` : "€0,00 extra"}
          </text>
          <text x="180" y="272" textAnchor="middle" fill="var(--muted)" fontSize="14" className="num">
            nog {mmss} · plafond {kw(s.capKW)}
          </text>
        </svg>
        <p className="mt-4 min-h-[3.5rem] max-w-md text-center text-lg">{caption}</p>
      </div>

      <div className="flex flex-col gap-4">
        <TraceChart s={s} />

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Load title="Huis" value={kw(s.baseKW)} />
          <Load title="Waterkoker" hotkey="K" value={kw(s.kettleKW)} active={s.kettleKW > 0} onClick={kettle} />
          <Load title="Laadpaal" hotkey="E" value={kw(s.evKW)} active={s.evRequested} onClick={ev} bar={s.evKW / EV_KW} />
          <button
            onClick={toggleAuto}
            className={`rounded-2xl border p-4 text-left transition ${s.auto ? "border-volt bg-volt/10" : "border-line bg-panel"}`}
          >
            <div className="flex items-center justify-between text-sm text-muted">
              Piekpact <kbd className="font-mono text-xs">A</kbd>
            </div>
            <div className={`mt-2 text-2xl font-semibold ${s.auto ? "text-volt" : "text-muted"}`}>{s.auto ? "AAN" : "UIT"}</div>
          </button>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-line bg-panel px-5 py-4">
          <div>
            <div className="text-sm text-muted">Garantie deze maand</div>
            <div className="text-lg">
              Voltera is je <span className="num font-semibold text-volt">{eur(s.ledgerOwedEur)}</span> verschuldigd
            </div>
          </div>
          <div className="text-right font-mono text-xs text-muted">
            K waterkoker · E laadpaal · A Piekpact
            <br />R opnieuw · spatie pauze
          </div>
        </div>
      </div>
    </section>
  );
}

function Load(p: { title: string; value: string; hotkey?: string; active?: boolean; onClick?: () => void; bar?: number }) {
  return (
    <button
      onClick={p.onClick}
      disabled={!p.onClick}
      className={`rounded-2xl border p-4 text-left transition ${p.active ? "border-ink/40 bg-ink/5" : "border-line bg-panel"}`}
    >
      <div className="flex items-center justify-between text-sm text-muted">
        {p.title} {p.hotkey && <kbd className="font-mono text-xs">{p.hotkey}</kbd>}
      </div>
      <div className="num mt-2 text-2xl font-semibold">{p.value}</div>
      {p.bar !== undefined && (
        <div className="mt-2 h-1.5 rounded bg-line">
          <div className="h-full rounded bg-ink transition-all" style={{ width: `${p.bar * 100}%` }} />
        </div>
      )}
    </button>
  );
}

// Instant power (area) vs the projected quarter-hour average (line), with the cap.
function TraceChart({ s }: { s: LiveState }) {
  const W = 640, H = 240, P = 32, MAX = 10;
  const x = (t: number) => P + (t / QH_S) * (W - 2 * P);
  const y = (v: number) => H - P - (v / MAX) * (H - 2 * P);
  const pts = s.trace;
  const area = pts.length ? `M${x(0)},${y(0)} ` + pts.map((p) => `L${x(p.t)},${y(p.kW)}`).join(" ") + ` L${x(pts[pts.length - 1].t)},${y(0)} Z` : "";
  const line = pts.map((p, i) => `${i ? "L" : "M"}${x(p.t)},${y(p.p)}`).join(" ");
  return (
    <div className="rounded-3xl border border-line bg-panel p-4">
      <div className="mb-1 flex gap-4 text-xs text-muted">
        <span><span className="mr-1 inline-block h-2 w-3 rounded-sm bg-ink/30" />vermogen nu</span>
        <span><span className="mr-1 inline-block h-0.5 w-3 bg-ink align-middle" />verwacht gemiddelde</span>
        <span><span className="mr-1 inline-block h-0.5 w-3 bg-volt align-middle" />jouw plafond</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {[0, 2, 4, 6, 8, 10].map((v) => (
          <g key={v}>
            <line x1={P} x2={W - P} y1={y(v)} y2={y(v)} stroke="var(--line)" />
            <text x={P - 8} y={y(v) + 4} textAnchor="end" fontSize="10" fill="var(--muted)">{v}</text>
          </g>
        ))}
        {[0, 5, 10, 15].map((m) => (
          <text key={m} x={x(m * 60)} y={H - 10} textAnchor="middle" fontSize="10" fill="var(--muted)">18:{15 + m}</text>
        ))}
        <path d={area} fill="var(--ink)" opacity="0.18" />
        <path d={line} fill="none" stroke="var(--ink)" strokeWidth="2" />
        <line x1={P} x2={W - P} y1={y(s.capKW)} y2={y(s.capKW)} stroke="var(--volt)" strokeWidth="2" strokeDasharray="6 5" />
        <text x={W - P} y={y(s.capKW) - 6} textAnchor="end" fontSize="11" fill="var(--volt)">plafond {kw(s.capKW)}</text>
      </svg>
    </div>
  );
}
