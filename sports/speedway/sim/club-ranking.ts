import { CLUBS, SEASON_FIXTURES } from "../data/season";
import type { Club } from "../data/schema";
import {
  computeTeamStats,
  emptyTeamStats,
  isFinished,
} from "./stats";
import type { StoredMatch } from "./results-store";

// TODO: club ranking (Elo)
// This is a temporary module calculating club ranking based on league standings.
// It will be replaced by the Elo rating system in a future task.

export type ClubRankingResult =
  | { status: "resolved"; clubs: string[] }
  | { status: "pending"; reason: string };

const LEAGUE_COMPETITIONS = [
  "east-gold",
  "west-gold",
  "east-silver",
  "west-silver",
] as const;

/**
 * Returns the default deterministic order of clubs:
 * Gold before Silver, within each league East before West at equal position.
 */
export function getDeterministicDefaultClubOrder(clubs: Club[] = CLUBS): string[] {
  const eastGold = clubs.filter((c) => c.leagueId === "east-gold");
  const westGold = clubs.filter((c) => c.leagueId === "west-gold");
  const eastSilver = clubs.filter((c) => c.leagueId === "east-silver");
  const westSilver = clubs.filter((c) => c.leagueId === "west-silver");

  const ordered: string[] = [];

  // Gold: 16 ranks
  for (let rank = 0; rank < 16; rank++) {
    if (eastGold[rank]) ordered.push(eastGold[rank].id);
    if (westGold[rank]) ordered.push(westGold[rank].id);
  }

  // Silver: 12 ranks
  for (let rank = 0; rank < 12; rank++) {
    if (eastSilver[rank]) ordered.push(eastSilver[rank].id);
    if (westSilver[rank]) ordered.push(westSilver[rank].id);
  }

  return ordered;
}

/**
 * Temporary club ranking (wspólny moduł).
 * Returns an ordered list of 48 clubs:
 * Gold before Silver, within league by final standing, at equal position East before West.
 * Returns { status: "pending" } if leagues are not finished, or accepts manual list.
 */
export function getTemporaryClubRanking(options?: {
  matches?: Record<string, StoredMatch>;
  manualClubOrder?: string[];
  clubs?: Club[];
}): ClubRankingResult {
  const manual = options?.manualClubOrder;
  if (manual && manual.length === 48) {
    return { status: "resolved", clubs: manual };
  }

  const matches = options?.matches;
  if (!matches) {
    return {
      status: "pending",
      reason: "Ligi nie zostały jeszcze zakończone.",
    };
  }

  const leagueFixtures = SEASON_FIXTURES.filter((f) =>
    (LEAGUE_COMPETITIONS as readonly string[]).includes(f.competitionId),
  );

  // Check if every league fixture is finished
  for (const fixture of leagueFixtures) {
    const match = matches[fixture.id];
    if (!match || !isFinished(match)) {
      return {
        status: "pending",
        reason: "Ligi nie zostały jeszcze zakończone.",
      };
    }
  }

  const clubs = options?.clubs ?? CLUBS;
  const stats = computeTeamStats(matches);

  const sortLeague = (leagueId: string) =>
    clubs
      .filter((c) => c.leagueId === leagueId)
      .map((club) => ({ club, stats: stats.get(club.id) ?? emptyTeamStats() }))
      .sort(
        (a, b) =>
          b.stats.points - a.stats.points ||
          b.stats.bilans - a.stats.bilans ||
          b.stats.pointsPlus - a.stats.pointsPlus,
      )
      .map((item) => item.club.id);

  const eastGold = sortLeague("east-gold");
  const westGold = sortLeague("west-gold");
  const eastSilver = sortLeague("east-silver");
  const westSilver = sortLeague("west-silver");

  const ordered: string[] = [];

  // Gold: ranks 1-16 (East 16, West 12)
  for (let rank = 0; rank < 16; rank++) {
    if (eastGold[rank]) ordered.push(eastGold[rank]);
    if (westGold[rank]) ordered.push(westGold[rank]);
  }

  // Silver: ranks 1-12 (East 8, West 12)
  for (let rank = 0; rank < 12; rank++) {
    if (eastSilver[rank]) ordered.push(eastSilver[rank]);
    if (westSilver[rank]) ordered.push(westSilver[rank]);
  }

  return {
    status: "resolved",
    clubs: ordered,
  };
}
