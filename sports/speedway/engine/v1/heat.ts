import { between } from "./rng";
import type { Conditions, EngineRider, Rng, Skills } from "./types";
import { LAP_WEIGHTS, LENGTH_WEIGHTS, lengthCategory, SURFACE_WEIGHTS, WEATHER_WEIGHTS } from "./weights";

export const LAPS = 4;

/** Tuning knob (MatchInput.luck): 1 = the original formulas, above 1 = more luck, below 1 = skill decides more. */
export const DEFAULT_LUCK = 1;

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
/** 30 and below = 0, 100 = 1. */
const factor = (skill: number) => clamp01((skill - 30) / 70);
const score = (skills: Skills, weights: Skills) =>
  skills.strength * weights.strength +
  skills.technique * weights.technique +
  skills.fighting * weights.fighting +
  skills.reflex * weights.reflex +
  skills.condition * weights.condition;

/** Step 1: form is a multiplier of every base skill. */
export function effectiveSkills(rider: EngineRider): Skills {
  const m = rider.form / 100;
  return {
    strength: rider.strength * m,
    technique: rider.technique * m,
    fighting: rider.fighting * m,
    reflex: rider.reflex * m,
    condition: rider.condition * m,
  };
}

const round3 = (n: number) => Math.round(n * 1000) / 1000;

/** One rider's four laps. Steps 2 and 3: four situational phases, then the three luck dimensions. */
export function simulateLaps(rider: EngineRider, conditions: Conditions, rng: Rng, luck = DEFAULT_LUCK): number[] {
  const eff = effectiveSkills(rider);
  const { trackLength, surface, weather } = conditions;

  // The phases that do not change lap by lap.
  const surfaceScore = score(eff, SURFACE_WEIGHTS[surface]);
  const lengthScore = score(eff, LENGTH_WEIGHTS[lengthCategory(trackLength)]);
  const weatherScore = score(eff, WEATHER_WEIGHTS[weather]);

  const laps: number[] = [];
  for (let lap = 0; lap < LAPS; lap++) {
    const lapScore = score(eff, LAP_WEIGHTS[lap]!);
    const baseScore = (lapScore + surfaceScore + lengthScore + weatherScore) / 4; // 0-100
    const baseSpeed = (1500 + baseScore * 10) / 100; // m/s

    // Fighting changes the METRES: a good line is shorter, a bad one drifts wide.
    const f = factor(eff.fighting);
    const distance = trackLength + between(rng, 2 - 7 * f, 12 - 12 * f) * luck;

    // Technique changes the SPEED (m/s).
    const t = factor(eff.technique);
    const speed = baseSpeed + between(rng, -0.5 + 0.6 * t, 0.2 + 0.6 * t) * luck;

    // Strength changes the SECONDS.
    const s = factor(eff.strength);
    const seconds = between(rng, -0.4 * s, 0.5 - 0.6 * s) * luck;

    laps.push(round3(distance / speed + seconds));
  }
  return laps;
}

export type HeatEntry = { rider: EngineRider; gate: number };
export type HeatRun = { riderId: string; gate: number; laps: number[]; time: number; position: number };

/** Four riders, one heat. Result is sorted by finishing position. */
export function simulateHeat(entries: HeatEntry[], conditions: Conditions, rng: Rng, luck = DEFAULT_LUCK): HeatRun[] {
  return entries
    .map(({ rider, gate }) => {
      const laps = simulateLaps(rider, conditions, rng, luck);
      return { riderId: rider.id, gate, laps, time: round3(laps.reduce((a, b) => a + b, 0)), position: 0 };
    })
    .sort((a, b) => a.time - b.time)
    .map((run, index) => ({ ...run, position: index + 1 }));
}
