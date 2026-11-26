import type { Club, Fixture } from "@/sports/speedway/data/schema";

import { computeTeamStats, emptyTeamStats, isFinished } from "./stats";
import type { StoredMatch } from "./results-store";

/** League table order: points, small-points balance, small points scored. */
export type TableKey = { points: number; bilans: number; pointsPlus: number };

export const compareTable = (a: TableKey, b: TableKey) =>
  b.points - a.points || b.bilans - a.bilans || b.pointsPlus - a.pointsPlus;

export type StandingRow = TableKey & { clubId: string; pos: number; games: number };

export type Standings = {
  rows: StandingRow[];
  /** Matches of the league up to this matchday that are not finished yet. */
  missingMatches: number;
  /** Every match up to this matchday is played, so the table will not change any more. */
  complete: boolean;
};

/**
 * The table of one stage of one league as it was after `matchday`: only fixtures up to that
 * matchday count. Pure, uses the same stats as the league view. Ties beyond the league rules
 * are ordered by club id so the result is always the same.
 */
export function standingsAsOfRound(
  leagueId: string,
  stage: string,
  matchday: number,
  fixtures: readonly Fixture[],
  matches: Record<string, StoredMatch>,
  clubs: readonly Club[],
): Standings {
  const scope = fixtures.filter(
    (f) => f.competitionId === leagueId && f.stage === stage && f.matchday <= matchday,
  );

  const scoped: Record<string, StoredMatch> = {};
  let missingMatches = 0;
  for (const fixture of scope) {
    const match = matches[fixture.id];
    if (match) scoped[fixture.id] = match;
    if (!match || !isFinished(match)) missingMatches++;
  }

  const stats = computeTeamStats(scoped);
  const rows = clubs
    .filter((club) => club.leagueId === leagueId)
    .map((club) => ({ clubId: club.id, ...(stats.get(club.id) ?? emptyTeamStats()) }))
    .sort((a, b) => compareTable(a, b) || a.clubId.localeCompare(b.clubId))
    .map((row, index) => ({
      clubId: row.clubId,
      pos: index + 1,
      games: row.games,
      points: row.points,
      bilans: row.bilans,
      pointsPlus: row.pointsPlus,
    }));

  return { rows, missingMatches, complete: scope.length > 0 && missingMatches === 0 };
}