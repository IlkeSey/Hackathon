// Lotte's household: a seeded synthetic year of quarter-hour data (Oct 2025 – Sep 2026).
// Same shape as the Fluvius open data (quarter-hour offtake), so it can be swapped later.

export type Day = {
  date: string; // "2026-01-13"
  month: string; // "2026-01"
  weekday: number; // 0 = Sunday
  other: number[]; // 96 values, kW of everything except the EV
  ev: number[]; // 96 values, kW of the EV charger (uncontrolled)
};

export const EV_KW = 7.4;
export const EV_MIN_KW = 1.4; // 6 A single phase

// The receipt's story day: Tuesday 13 January 2026, EV plugged in at 18:15 next to the cooking peak.
export const STORY_DATE = "2026-01-13";

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const iso = (d: Date) => d.toISOString().slice(0, 10);

export function generateYear(seed = 1187): Day[] {
  const rnd = mulberry32(seed);
  const days: Day[] = [];
  const start = Date.UTC(2025, 9, 1);
  const end = Date.UTC(2026, 8, 30);
  for (let t = start; t <= end; t += 86_400_000) {
    const d = new Date(t);
    const date = iso(d);
    const month = date.slice(0, 7);
    const weekday = d.getUTCDay();
    const m = d.getUTCMonth();
    const winter = [10, 11, 0, 1].includes(m) ? 1 : [2, 9].includes(m) ? 0.5 : 0;

    const other = Array.from({ length: 96 }, (_, q) => {
      const h = q / 4;
      let kw = h < 6.5 ? 0.25 : h < 17 ? 0.45 : h < 21.5 ? 1.0 + 0.3 * winter : 0.5;
      if (h >= 6.5 && h < 8) kw += 0.6; // breakfast
      return kw * (0.85 + 0.3 * rnd());
    });
    const isStory = date === STORY_DATE;
    // Cooking peak (oven / hob), bigger in winter. On the story day it ends just before the EV arrives.
    const cookStart = isStory ? 69 : 71 + Math.floor(rnd() * 3);
    for (let q = cookStart; q < cookStart + 4; q++) other[q] += 1.4 + 0.8 * winter * rnd();

    const ev = new Array(96).fill(0);
    if (isStory || (weekday >= 1 && weekday <= 5 && rnd() < 0.6)) {
      const startQ = isStory ? 73 : 71 + Math.floor(rnd() * 6); // 17:45–19:15
      const quarters = isStory ? 12 : 8 + Math.floor(rnd() * 8);
      for (let q = startQ; q < Math.min(96, startQ + quarters); q++) ev[q] = EV_KW;
    }
    days.push({ date, month, weekday, other, ev });
  }

  // Story quarter-hour 18:15–18:30 = house 1.0 kW + EV 7.4 kW = 8.4 kW, and the highest of January.
  const story = days.find((d) => d.date === STORY_DATE)!;
  for (let q = 74; q < 96; q++) story.other[q] = Math.min(story.other[q], 0.9);
  story.other[73] = 1.0;
  // Keep other days in a realistic range for a 7.4 kW charger (≈ 7.8–8.3 kW), below the story peak.
  for (const d of days) {
    if (d === story) continue;
    const limit = 7.8 + 0.5 * rnd();
    for (let q = 0; q < 96; q++) if (d.other[q] + d.ev[q] > limit) d.other[q] = limit - d.ev[q];
  }
  return days;
}

export const total = (d: Day, q: number) => d.other[q] + d.ev[q];
