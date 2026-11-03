import type { Skills, Surface, Weather } from "./types";

/** Every phase turns three skills into one score; main 50%, second 30%, third 20% (laps differ). */
const mix = (weights: Partial<Skills>): Skills => ({
  strength: 0,
  technique: 0,
  fighting: 0,
  reflex: 0,
  condition: 0,
  ...weights,
});

/** Phase 1, the run: the weights change lap by lap. */
export const LAP_WEIGHTS: Skills[] = [
  mix({ reflex: 0.6, fighting: 0.25, condition: 0.15 }),
  mix({ fighting: 0.4, reflex: 0.3, condition: 0.3 }),
  mix({ condition: 0.45, fighting: 0.4, reflex: 0.15 }),
  mix({ condition: 0.65, fighting: 0.25, reflex: 0.1 }),
];

/** Phase 2, the surface. */
export const SURFACE_WEIGHTS: Record<Surface, Skills> = {
  soft: mix({ strength: 0.5, technique: 0.3, condition: 0.2 }),
  hard: mix({ technique: 0.5, condition: 0.3, strength: 0.2 }),
  medium: mix({ condition: 0.5, strength: 0.3, technique: 0.2 }),
};

/** Phase 3, the track length: short up to 330 m, medium 331-360 m, long above. */
export const LENGTH_WEIGHTS = {
  short: mix({ reflex: 0.5, technique: 0.3, condition: 0.2 }),
  medium: mix({ technique: 0.5, condition: 0.3, reflex: 0.2 }),
  long: mix({ condition: 0.5, reflex: 0.3, technique: 0.2 }),
};

/** Phase 4, the weather. */
export const WEATHER_WEIGHTS: Record<Weather, Skills> = {
  rain: mix({ strength: 0.5, fighting: 0.3, reflex: 0.2 }),
  cloud: mix({ fighting: 0.5, reflex: 0.3, strength: 0.2 }),
  sun: mix({ reflex: 0.5, strength: 0.3, fighting: 0.2 }),
};

export function lengthCategory(metres: number): keyof typeof LENGTH_WEIGHTS {
  if (metres <= 330) return "short";
  if (metres <= 360) return "medium";
  return "long";
}
