import { z } from "zod";

import { CLUBS, SEASON_FIXTURES } from "@/sports/speedway/data/season";
import { matchScore } from "@/sports/speedway/engine/v1";
import { readMatches, type StoredMatch } from "@/sports/speedway/sim/results-store";
import { isFinished } from "@/sports/speedway/sim/stats";
import { fixtureSchema, type Fixture, type FixtureWithTeams, type TeamRef } from "@/sports/speedway/types/fixtures";
import { resolveLeagueIds } from "./league";

const KICKOFF_TIMES = ["16:30", "17:00", "18:00", "19:30"];
const DAY_MS = 24 * 60 * 60 * 1000;
/** Week 1 starts on Sunday 8 Nov 2026; one calendar week per week number. TODO: game clock. */
const FIRST_WEEK = Date.UTC(2026, 10, 8);

const CLUB_BY_ID = new Map(CLUBS.map((club) => [club.id, club]));
const TEAM_REFS = new Map<string, TeamRef>(
  CLUBS.map((club) => [
    club.id,
    { id: club.id, name: club.name, subName: club.subName, short: club.short, color: club.color, badgeIcon: club.icon },
  ]),
);

/**
 * Season fixtures -> what the UI needs. Date comes from the calendar week, the stadium from
 * the home club, and the kick-off time from the match's place inside its matchday
 * (stable, so a match has the same time in every filter). Scores are added per request.
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

/** Teams and, for finished matches, the final score. */
function hydrate(fixtures: Fixture[], matches: Record<string, StoredMatch>): FixtureWithTeams[] {
  return fixtures.flatMap((fixture) => {
    const home = TEAM_REFS.get(fixture.homeId);
    const away = TEAM_REFS.get(fixture.awayId);
    if (!home || !away) return [];

    const stored = matches[fixture.id];
    const score = stored && isFinished(stored) ? matchScore(stored.heats) : null;
    return [{ ...fixture, homeScore: score?.home ?? null, awayScore: score?.away ?? null, home, away }];
  });
}

/** `current` = the first matchday that still has a match to play; `total` = the longest league in the group. */
export async function getMatchdayInfo(group?: string): Promise<{ current: number; total: number }> {
  const matches = await readMatches();
  const fixtures = inGroup(group);
  const total = Math.max(1, ...fixtures.map((f) => f.matchday));
  const open = fixtures.filter((f) => !(matches[f.id] && isFinished(matches[f.id]!)));
  return { current: Math.min(...open.map((f) => f.matchday), total), total };
}

export async function getMatchdayFixtures(matchday: number, group?: string): Promise<FixtureWithTeams[]> {
  return hydrate(inGroup(group).filter((f) => f.matchday === matchday), await readMatches());
}

/** All league fixtures of the group, with teams; the tab filters and groups them. */
export async function getFixtures(group?: string): Promise<FixtureWithTeams[]> {
  return hydrate(inGroup(group), await readMatches());
}

export async function getFixture(id: string): Promise<FixtureWithTeams | null> {
  const [fixture] = hydrate(FIXTURES.filter((f) => f.id === id), await readMatches());
  return fixture ?? null;
}

/** Every league match of one club (home and away), by round. Regional matches join later. */
export async function getTeamFixtures(teamId: string): Promise<FixtureWithTeams[]> {
  const own = FIXTURES.filter((f) => f.homeId === teamId || f.awayId === teamId).sort((a, b) => a.matchday - b.matchday);
  return hydrate(own, await readMatches());
}
