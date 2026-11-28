import type { Club, Fixture } from "@/sports/speedway/data/schema";
import type { CupDefinition } from "@/sports/speedway/types/cup";

import type { StoredMatch } from "../results-store";
import { standingsAsOfRound } from "../standings";
import type { SeedRank } from "./resolve";
import { snapshotMatchday } from "./seeding";

/**
 * Seed rank of every cup club: basket first (Gold before Silver), then the position in the league
 * table at the snapshot matchday, then the order of leagues in the definition.
 * Known limit: a Silver table that is not yet at its snapshot matchday can still move the rank.
 * Only a tie uses it, and the run-off heat (separate task) removes it.
 */
export function buildSeedRank(
  def: CupDefinition,
  fixtures: readonly Fixture[],
  matches: Record<string, StoredMatch>,
  clubs: readonly Club[],
): SeedRank {
  const stage = def.seeding.snapshot.stage;
  const leagues = def.qualDraw.baskets.flatMap((basket, basketIndex) =>
    basket.leagues.map((leagueId) => ({ leagueId, basketIndex })),
  );

  const entries = leagues.flatMap(({ leagueId, basketIndex }, order) => {
    const matchday = snapshotMatchday(def, fixtures, leagueId);
    return standingsAsOfRound(leagueId, stage, matchday, fixtures, matches, clubs).rows.map((row) => ({
      clubId: row.clubId,
      basketIndex,
      pos: row.pos,
      order,
    }));
  });

  entries.sort(
    (a, b) =>
      a.basketIndex - b.basketIndex ||
      a.pos - b.pos ||
      a.order - b.order ||
      a.clubId.localeCompare(b.clubId),
  );
  const rank = new Map(entries.map((entry, index) => [entry.clubId, index]));
  return (clubId) => rank.get(clubId) ?? Number.MAX_SAFE_INTEGER;
}