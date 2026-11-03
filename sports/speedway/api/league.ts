import { z } from "zod";

import type { Club } from "@/sports/speedway/data/schema";
import { CLUB_BY_REF, CLUBS, RIDERS } from "@/sports/speedway/data/season";
import { readMatches } from "@/sports/speedway/sim/results-store";
import {
  computeRiderStats,
  computeTeamStats,
  emptyTeamStats,
  emptyTelemetry,
  type RiderStats,
  type TeamStats,
} from "@/sports/speedway/sim/stats";
import {
  leagueRiderSchema,
  leagueTeamSchema,
  type LeagueRider,
  type LeagueRiderWithSkills,
  type LeagueTeam,
  type RiderSkills,
} from "@/sports/speedway/types/league";

type RawRider = (typeof RIDERS)[number];

const LEAGUE_IDS = ["west-gold", "east-gold", "west-silver", "east-silver"];
const LEAGUE_IDS_BY_GROUP: Record<string, string | undefined> = {
  "gold-west": "west-gold",
  "gold-east": "east-gold",
  "silver-west": "west-silver",
  "silver-east": "east-silver",
};

function mapClubToLeagueTeam(club: Club, pos: number, stats: TeamStats): LeagueTeam {
  return {
    id: club.id,
    name: club.name,
    subName: club.subName,
    short: club.short,
    color: club.color,
    colorGradient: "from-slate-500 to-slate-700",
    badgeIcon: club.icon,
    pos,
    ...stats,
  };
}

/** League sub-filter id -> league id; "all-league" and anything unknown -> undefined (all leagues). */
export function resolveLeagueGroupId(group: string | undefined): string | undefined {
  if (!group) return undefined;
  return LEAGUE_IDS.includes(group) ? group : LEAGUE_IDS_BY_GROUP[group];
}

/** The leagues a sub-filter stands for: one league, or all four. */
export function resolveLeagueIds(group: string | undefined): string[] {
  const leagueId = resolveLeagueGroupId(group);
  return leagueId ? [leagueId] : LEAGUE_IDS;
}

/**
 * API layer. The table is calculated from the season's results (2 points for a win, 1 for a draw,
 * 1 bonus point for the better result over the two legs), then ordered by points, small-points
 * difference and small points scored. `pos` counts inside the returned group.
 */
export async function getLeagueTeams(group?: string): Promise<LeagueTeam[]> {
  const leagueIds = resolveLeagueIds(group);
  const stats = computeTeamStats(await readMatches());

  const teams = CLUBS.filter((club) => leagueIds.includes(club.leagueId))
    .map((club) => ({ club, stats: stats.get(club.id) ?? emptyTeamStats() }))
    .sort(
      (a, b) =>
        b.stats.points - a.stats.points ||
        b.stats.bilans - a.stats.bilans ||
        b.stats.pointsPlus - a.stats.pointsPlus,
    );

  return z.array(leagueTeamSchema).parse(teams.map((t, index) => mapClubToLeagueTeam(t.club, index + 1, t.stats)));
}

/** `pos` is the place inside the club's own league, not inside all 48 clubs. */
export async function getLeagueTeam(id: string): Promise<LeagueTeam | null> {
  const club = CLUB_BY_REF.get(id);
  if (!club) return null;
  const teams = await getLeagueTeams(club.leagueId);
  return teams.find((team) => team.id === club.id) ?? null;
}

function mapRawRiderToLeagueRider(raw: RawRider, stats?: RiderStats): LeagueRider {
  // season.ts guarantees the club exists.
  const club = CLUB_BY_REF.get(raw.clubId)!;
  const total = stats ?? { ...emptyTelemetry(), home: emptyTelemetry(), away: emptyTelemetry() };

  return {
    id: raw.id,
    pos: 0,
    name: `${raw.firstName} ${raw.lastName}`,
    firstName: raw.firstName,
    lastName: raw.lastName,
    role: "Rider",
    teamId: club.id,
    teamName: club.name,
    teamSubName: club.subName,
    teamColor: club.color,
    teamIcon: club.icon,
    ...total,
  };
}

function skillsOf(raw: RawRider): RiderSkills {
  return {
    strength: raw.strength,
    technique: raw.technique,
    fighting: raw.fighting,
    reflex: raw.reflex,
    condition: raw.condition,
  };
}

export async function getTeamRiders(teamId: string): Promise<LeagueRider[]> {
  const clubId = CLUB_BY_REF.get(teamId)?.id;
  const stats = computeRiderStats(await readMatches());
  const riders = RIDERS.filter((rider) => CLUB_BY_REF.get(rider.clubId)?.id === clubId).map((rider) =>
    mapRawRiderToLeagueRider(rider, stats.get(rider.id)),
  );
  return z.array(leagueRiderSchema).parse(riders);
}

export async function getLeagueRiders(group?: string): Promise<LeagueRiderWithSkills[]> {
  const leagueIds = resolveLeagueIds(group);
  const stats = computeRiderStats(await readMatches());
  const raws = RIDERS.filter((rider) => leagueIds.includes(CLUB_BY_REF.get(rider.clubId)!.leagueId));
  const riders = z.array(leagueRiderSchema).parse(raws.map((rider) => mapRawRiderToLeagueRider(rider, stats.get(rider.id))));
  return riders.map((rider, index) => ({ ...rider, skills: skillsOf(raws[index]!) }));
}
