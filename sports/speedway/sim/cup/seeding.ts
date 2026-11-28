import type { Fixture } from "@/sports/speedway/data/schema";
import type { CupDefinition } from "@/sports/speedway/types/cup";

export type SnapshotPoint = { leagueId: string; matchday: number };

/**
 * The matchday of each seeding league after which the table decides the seeded clubs
 * (half of the stage: West Gold 11 of 22, East Gold 15 of 30). Taken from the fixtures, not typed.
 */
/** The matchday after which the league's table counts for the cup (half of the stage). */
export function snapshotMatchday(def: CupDefinition, fixtures: readonly Fixture[], leagueId: string): number {
  const { stage, share } = def.seeding.snapshot;
  const matchdays = fixtures
    .filter((f) => f.competitionId === leagueId && f.stage === stage)
    .map((f) => f.matchday);
  if (matchdays.length === 0) throw new Error(`No "${stage}" fixtures for league ${leagueId}`);
  return Math.floor(Math.max(...matchdays) * share);
}

export function snapshotMatchdays(def: CupDefinition, fixtures: readonly Fixture[]): SnapshotPoint[] {
  return def.seeding.seeded.map(({ leagueId }) => ({
    leagueId,
    matchday: snapshotMatchday(def, fixtures, leagueId),
  }));
}

/** "east-gold" -> "East Gold" */
export const leagueLabel = (leagueId: string) =>
  leagueId
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");