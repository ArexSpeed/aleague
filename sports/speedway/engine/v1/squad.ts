import type { EngineRider } from "./types";

export const SQUAD_SIZE = 8;
export const JUNIOR_MAX_AGE = 21;

/** Overall rating shown to the engine's coach: mean skill, scaled by form. */
export const overall = (r: EngineRider) =>
  ((r.strength + r.technique + r.fighting + r.reflex + r.condition) / 5) * (r.form / 100);

/**
 * Default match squad of 8: slots 1-5 seniors, 6-8 juniors (age <= 21), each group best first.
 * A club short of juniors or seniors fills the gap with its best remaining riders.
 */
export function pickSquad<T extends EngineRider & { age: number }>(riders: T[]): T[] {
  const ranked = [...riders].sort((a, b) => overall(b) - overall(a) || a.id.localeCompare(b.id));
  const seniors = ranked.filter((r) => r.age > JUNIOR_MAX_AGE).slice(0, 5);
  const juniors = ranked.filter((r) => r.age <= JUNIOR_MAX_AGE).slice(0, 3);

  const taken = new Set([...seniors, ...juniors]);
  const rest = ranked.filter((r) => !taken.has(r));
  while (seniors.length < 5 && rest.length > 0) seniors.push(rest.shift()!);
  while (juniors.length < 3 && rest.length > 0) juniors.push(rest.shift()!);

  const squad = [...seniors, ...juniors];
  if (squad.length < SQUAD_SIZE) throw new Error(`Squad needs ${SQUAD_SIZE} riders, got ${riders.length}`);
  return squad;
}
