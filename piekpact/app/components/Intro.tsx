"use client";

// Scene 0: the opening of the film. Lotte is fictional; the tariff mechanics are real.
export default function Intro() {
  return (
    <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{ background: "radial-gradient(60% 50% at 50% 60%, #1c2a55 0%, transparent 70%)" }}
      />
      <p className="fade-up font-mono text-sm tracking-[0.3em] text-muted uppercase">Mechelen · dinsdag 13 januari · 18:15</p>
      <h1 className="fade-up mt-6 max-w-3xl text-5xl leading-tight font-semibold tracking-tight md:text-6xl" style={{ animationDelay: "0.3s" }}>
        Lotte komt thuis van haar dienst.
      </h1>
      <p className="fade-up mt-6 max-w-2xl text-xl text-muted" style={{ animationDelay: "0.9s" }}>
        Verpleegkundige, 34, twee kinderen. Ze steekt haar nieuwe elektrische auto in, zet water op voor de pasta.
        Een gewone avond.
      </p>
      <div className="fade-up mt-14 flex items-center gap-6 text-left" style={{ animationDelay: "1.8s" }}>
        <div className="rounded-2xl border border-line bg-panel px-6 py-4">
          <div className="num text-4xl font-semibold text-volt">1 kwartier</div>
          <div className="mt-1 text-sm text-muted">bepaalt je capaciteitstarief van de hele maand</div>
        </div>
        <div className="rounded-2xl border border-line bg-panel px-6 py-4">
          <div className="num text-4xl font-semibold">0</div>
          <div className="mt-1 text-sm text-muted">klanten die dat kwartier ooit te zien krijgen</div>
        </div>
      </div>
      <p className="absolute bottom-6 text-xs text-muted">→ druk 1 om haar avond te bekijken</p>
    </section>
  );
}
