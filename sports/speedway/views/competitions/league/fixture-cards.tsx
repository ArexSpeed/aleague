import type { FixtureCardData } from "@/components/fixtures/fixture-card";
import type { FixtureGroupData } from "@/components/fixtures/fixture-list";
import { getFixtureStatus } from "@/components/fixtures/fixture-status";
import { formatDate } from "@/lib/format";
import { sportPath } from "@/lib/paths";
import type { FixtureWithTeams } from "@/sports/speedway/types/fixtures";
import { buildLeagueHref, type LeagueParams } from "./search-params";

/** Fixtures -> card data. Shared by the Fixtures tab and the team's Games tab in the aside. */

export const isPlayed = (f: FixtureWithTeams) => f.homeScore !== null && f.awayScore !== null;

export function toCard(f: FixtureWithTeams, params: LeagueParams, today: string): FixtureCardData {
  const score =
    f.homeScore !== null && f.awayScore !== null ? { home: f.homeScore, away: f.awayScore } : null;

  return {
    id: f.id,
    home: {
      name: f.home.name,
      subName: f.home.subName,
      color: f.home.color,
      icon: f.home.badgeIcon,
      href: buildLeagueHref(params, { team: f.home.id, panel: "stats" }),
    },
    away: {
      name: f.away.name,
      subName: f.away.subName,
      color: f.away.color,
      icon: f.away.badgeIcon,
      href: buildLeagueHref(params, { team: f.away.id, panel: "stats" }),
    },
    score,
    status: getFixtureStatus(
      { date: f.date, time: f.time, played: score !== null, draw: score !== null && score.home === score.away },
      today,
    ),
    matchHref: sportPath(params.sport, `matches/${f.id}`),
  };
}

/** One group per round, in the order of the given fixtures. */
export function toGroups(fixtures: FixtureWithTeams[], params: LeagueParams, today: string): FixtureGroupData[] {
  const byRound = new Map<number, FixtureWithTeams[]>();
  for (const f of fixtures) byRound.set(f.matchday, [...(byRound.get(f.matchday) ?? []), f]);

  return [...byRound.entries()].map(([round, items]) => ({
    id: String(round),
    title: `Round ${round}`,
    // Round with no results yet: show when it is played.
    meta: items.every((f) => !isPlayed(f)) ? formatDate(items[0].date) : undefined,
    fixtures: items.map((f) => toCard(f, params, today)),
  }));
}
