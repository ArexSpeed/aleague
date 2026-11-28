import type { RiderRaw } from "@/sports/speedway/data/schema";
import type { IndividualDefinition, IndividualDivision } from "@/sports/speedway/types/individual";
import { divisionPool } from "./definition";

/** What the selection needs from the season stats of one rider (a subset of `RiderStats`). */
export type SeasonAverage = { heats: number; avgHeat: number };

export type SelectRidersInput = {
  riders: RiderRaw[];
  /** Nation code, any case. */
  country: string;
  division: IndividualDivision;
  /** Season stats by rider id. A rider without an entry has no heats yet. */
  stats: ReadonlyMap<string, SeasonAverage>;
  selection: IndividualDefinition["selection"];
  /** How many riders the cycle needs. */
  count: number;
  /** Hand-picked riders of this cycle. When set, it wins over the automatic selection. */
  override?: readonly string[] | undefined;
};

/** Mean of the five skills, without form: stable for the whole cycle (the fallback ranking). */
export const skillsMean = (r: RiderRaw) =>
  (r.strength + r.technique + r.fighting + r.reflex + r.condition) / 5;

/**
 * The riders of one cycle (nation x division), best first. Called once, when the first
 * tournament starts; the caller stores the result and the same riders ride the whole cycle.
 *
 * Ranking: season average points per heat (`avgHeat`), best first, for riders with at least
 * `selection.minHeats` heats. Everybody else follows, ranked by `skillsMean`. Before any heat
 * is played that is simply the skills ranking. Ties: higher skills, then id (deterministic).
 */
export function selectRiders(input: SelectRidersInput): string[] {
  const { riders, country, division, stats, selection, count, override } = input;

  if (override) return [...override];

  const pool = divisionPool(riders, country, division);
  if (pool.length < count) {
    throw new Error(`${country} ${division}: ${pool.length} riders, ${count} needed`);
  }

  const heatsOf = (rider: RiderRaw) => stats.get(rider.id)?.heats ?? 0;
  const ranked = (rider: RiderRaw) => heatsOf(rider) > 0 && heatsOf(rider) >= selection.minHeats;

  const bySkills = (a: RiderRaw, b: RiderRaw) =>
    skillsMean(b) - skillsMean(a) || a.id.localeCompare(b.id);

  const withAverage = pool
    .filter(ranked)
    .sort((a, b) => stats.get(b.id)!.avgHeat - stats.get(a.id)!.avgHeat || bySkills(a, b));
  const rest = pool.filter((rider) => !ranked(rider)).sort(bySkills);

  return [...withAverage, ...rest].slice(0, count).map((rider) => rider.id);
}
