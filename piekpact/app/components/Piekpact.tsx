"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { controlledPeaks, monthlyPeaks, yearlySaving } from "@/lib/capacity";
import { LOTTE_CAP, LOTTE_DAYS } from "@/lib/lotte";
import { eur, eur0, kw } from "@/lib/format";

const MONTHS = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];

export default function Piekpact() {
  const [cap, setCap] = useState(LOTTE_CAP);
  const before = useMemo(() => monthlyPeaks(LOTTE_DAYS), []);
  const { after, saving } = useMemo(
    () => ({ after: controlledPeaks(LOTTE_DAYS, cap), saving: yearlySaving(LOTTE_DAYS, cap) }),
    [cap],
  );
  const data = before.map((m, i) => ({
    month: MONTHS[Number(m.month.slice(5)) - 1],
    zonder: +m.peakKW.toFixed(1),
    met: +after[i].peakKW.toFixed(1),
  }));

  return (
    <section className="grid flex-1 grid-cols-1 gap-6 p-6 lg:grid-cols-[1fr_1.4fr]">
      <div className="flex flex-col justify-center">
        <p className="font-mono text-xs tracking-[0.25em] text-muted uppercase">Jouw Piekpact</p>
        <h2 className="mt-2 text-4xl font-semibold tracking-tight">Kies je kW. Wij houden je eronder, of wij betalen.</h2>

        <div className="mt-8 rounded-3xl border border-line bg-panel p-6">
          <div className="flex items-baseline justify-between">
            <span className="text-muted">Jouw plafond</span>
            <span className="num text-3xl font-semibold text-volt">{kw(cap)}</span>
          </div>
          <input type="range" min={2.5} max={8} step={0.5} value={cap} onChange={(e) => setCap(+e.target.value)} className="mt-4 w-full" />
          <div className="mt-6 flex items-baseline gap-2">
            <span className="num text-6xl font-semibold">{eur(saving.fee)}</span>
            <span className="text-muted">/ maand</span>
          </div>
          <p className="mt-4 text-lg">
            Je bespaart <b className="num">{eur0(saving.capacitySaving)}</b>/jaar op capaciteit.
            <br />
            Na je abonnement: <b className={`num ${saving.net >= 0 ? "text-ok" : "text-bad"}`}>{saving.net >= 0 ? "+" : ""}{eur0(saving.net)}/jaar</b>.
          </p>
          <p className="mt-4 text-xs leading-relaxed text-muted">
            Prijs berekend op jouw eigen kwartierwaarden van het voorbije jaar. Gaat de laadpaal die je aan ons toevertrouwt toch over je
            plafond, dan betalen wij het verschil.
          </p>
        </div>
      </div>

      <div className="flex flex-col rounded-3xl border border-line bg-panel p-6">
        <div className="mb-4 text-muted">Lottes maandpiek, voorbije 12 maanden</div>
        <div className="min-h-[360px] flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={2}>
              <CartesianGrid stroke="var(--line)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--muted)" tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted)" tickLine={false} axisLine={false} unit=" kW" width={56} domain={[0, 10]} />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
                contentStyle={{ background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 12 }}
                formatter={(v) => kw(Number(v))}
              />
              <Legend />
              <Bar dataKey="zonder" name="zonder Piekpact" fill="#3b4a66" radius={[4, 4, 0, 0]} />
              <Bar dataKey="met" name="met Piekpact" fill="var(--volt)" radius={[4, 4, 0, 0]} />
              <ReferenceLine y={cap} stroke="var(--volt)" strokeDasharray="6 5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
