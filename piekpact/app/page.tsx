"use client";

import { useEffect, useState } from "react";
import Intro from "./components/Intro";
import Kwartierklok from "./components/Kwartierklok";
import Piekbon from "./components/Piekbon";
import Piekpact from "./components/Piekpact";
import Business from "./components/Business";

// The film: 0 story → 1 the evening (auto off) → 2 the receipt → 3 the offer → back to 1 (auto on) → 4 scale.
const SCENES = [
  { key: "0", label: "Lotte", el: Intro },
  { key: "1", label: "Kwartierklok", el: Kwartierklok },
  { key: "2", label: "Piekbon", el: Piekbon },
  { key: "3", label: "Piekpact", el: Piekpact },
  { key: "4", label: "Voltera", el: Business },
];

export default function Home() {
  const [scene, setScene] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      const i = SCENES.findIndex((s) => s.key === e.key);
      if (i >= 0) setScene(i);
      if (e.key === "ArrowRight") setScene((s) => Math.min(SCENES.length - 1, s + 1));
      if (e.key === "ArrowLeft") setScene((s) => Math.max(0, s - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const Scene = SCENES[scene].el;
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-line px-6 py-3">
        <div className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-volt text-bg">⚡</span>
          Voltera <span className="font-normal text-muted">Piekpact</span>
        </div>
        <nav className="flex gap-1">
          {SCENES.map((s, i) => (
            <button
              key={s.key}
              onClick={() => setScene(i)}
              className={`rounded-full px-3 py-1 text-sm transition ${i === scene ? "bg-volt text-bg" : "text-muted hover:text-ink"}`}
            >
              <span className="mr-1 font-mono text-xs opacity-60">{s.key}</span>
              {s.label}
            </button>
          ))}
        </nav>
      </header>
      <main key={scene} className="fade-up flex flex-1 flex-col">
        <Scene />
      </main>
    </div>
  );
}
