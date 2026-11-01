import { z } from "zod";

import { CLUBS, SEASON_FIXTURES } from "@/sports/speedway/data/season";
import {
  fixtureSchema,
  type Fixture,
  type FixtureWithTeams,
  type TeamRef,
} from "@/sports/speedway/types/fixtures";
import { resolveLeagueIds } from "./league";

/** TODO: comes from the simulation state once matches can be played. */
const CURRENT_MATCHDAY = 1;

const KICKOFF_TIMES = ["16:30", "17:00", "18:00", "19:30"];
const DAY_MS = 24 * 60 * 60 * 1000;
/** Week 1 starts on Sunday 6 Sep 2026; one calendar week per week number. */
const FIRST_WEEK = Date.UTC(2026, 10, 8);

const CLUB_BY_ID = new Map(CLUBS.map((club) => [club.id, club]));
const TEAM_REFS = new Map<string, TeamRef>(
  CLUBS.map((club) => [
    club.id,
    {
      id: club.id,
      name: club.name,
      subName: club.subName,
      short: club.short,
      color: club.color,
      badgeIcon: club.icon,
    },
  ]),
);

/**
 * Season fixtures -> what the UI needs. Date comes from the calendar week, the stadium from
 * the home club, and the kick-off time from the match's place inside its matchday
 * (stable, so a match has the same time in every filter).
 */
const slots = new Map<string, number>();
const FIXTURES: Fixture[] = z.array(fixtureSchema).parse(
  SEASON_FIXTURES.filter((f) => !f.competitionId.startsWith("regional-")).map((f) => {
    const key = `${f.competitionId}:${f.matchday}`;
    const slot = slots.get(key) ?? 0;
    slots.set(key, slot + 1);
    return {
      id: f.id,
      competitionId: f.competitionId,
      matchday: f.matchday,
      date: new Date(FIRST_WEEK + (f.week - 1) * 7 * DAY_MS).toISOString().slice(0, 10),
      time: KICKOFF_TIMES[slot % KICKOFF_TIMES.length]!,
      homeId: f.homeId,
      awayId: f.awayId,
      stadium: CLUB_BY_ID.get(f.homeId)?.stadium.name ?? "",
      homeScore: null,
      awayScore: null,
    };
  }),
);

/** `group` is the League sub-filter (all-league, gold-west, ...); unknown values mean all leagues. */
function inGroup(group?: string): Fixture[] {
  const leagueIds = resolveLeagueIds(group);
  return FIXTURES.filter((f) => leagueIds.includes(f.competitionId));
}

function withTeams(fixtures: Fixture[]): FixtureWithTeams[] {
  return fixtures.flatMap((fixture) => {
    const home = TEAM_REFS.get(fixture.homeId);
    const away = TEAM_REFS.get(fixture.awayId);
    return home && away ? [{ ...fixture, home, away }] : [];
  });
}

/** Number of matchdays is the longest league in the group (East Gold 30, West Gold 22, ...). */
export async function getMatchdayInfo(group?: string): Promise<{ current: number; total: number }> {
  const total = Math.max(1, ...inGroup(group).map((f) => f.matchday));
  return { current: Math.min(CURRENT_MATCHDAY, total), total };
}

export async function getMatchdayFixtures(
  matchday: number,
  group?: string,
): Promise<FixtureWithTeams[]> {
  return withTeams(inGroup(group).filter((f) => f.matchday === matchday));
}

export async function getFixture(id: string): Promise<FixtureWithTeams | null> {
  const [fixture] = withTeams(FIXTURES.filter((f) => f.id === id));
  return fixture ?? null;
}

/** All league fixtures of the group, with teams; the tab filters and groups them. */
export async function getFixtures(group?: string): Promise<FixtureWithTeams[]> {
  return withTeams(inGroup(group));
}

/** Every league match of one club (home and away), by round. Regional matches join later. */
export async function getTeamFixtures(teamId: string): Promise<FixtureWithTeams[]> {
  const own = FIXTURES.filter((f) => f.homeId === teamId || f.awayId === teamId);
  return withTeams(own.sort((a, b) => a.matchday - b.matchday));
}
