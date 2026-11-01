import { z } from "zod";

import { CLUB_BY_REF, CLUBS, RIDERS } from "@/sports/speedway/data/season";
import type { Club } from "@/sports/speedway/data/schema";
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

function emptyVenueStats() {
  return { games: 0, won: 0, draw: 0, lose: 0, pts: 0, ptsPlus: 0, ptsMinus: 0, bilans: 0 };
}

function mapClubToLeagueTeam(club: Club, pos: number): LeagueTeam {
  return {
    id: club.id,
    name: club.name,
    subName: club.subName,
    short: club.short,
    color: club.color,
    colorGradient: "from-slate-500 to-slate-700",
    badgeIcon: club.icon,
    pos,
    games: 0,
    pointsPlus: 0,
    pointsMinus: 0,
    bilans: 0,
    won: 0,
    draw: 0,
    lose: 0,
    bonus: 0,
    points: 0,
    home: emptyVenueStats(),
    away: emptyVenueStats(),
    matches: [],
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
 * API layer. The league table is backed by the season club definitions, filtered by
 * the selected competition group. Missing stats are intentionally zeroed until the
 * full season stats source is wired in. `pos` counts inside the returned group.
 */
export async function getLeagueTeams(group?: string): Promise<LeagueTeam[]> {
  const leagueIds = resolveLeagueIds(group);
  const clubs = CLUBS.filter((club) => leagueIds.includes(club.leagueId));

  return z
    .array(leagueTeamSchema)
    .parse(clubs.map((club, index) => mapClubToLeagueTeam(club, index + 1)));
}

/** `pos` is the place inside the club's own league, not inside all 48 clubs. */
export async function getLeagueTeam(id: string): Promise<LeagueTeam | null> {
  const club = CLUB_BY_REF.get(id);
  if (!club) return null;
  const teams = await getLeagueTeams(club.leagueId);
  return teams.find((team) => team.id === club.id) ?? null;
}

function emptyTelemetry() {
  return {
    matches: 0,
    heats: 0,
    avgMatch: 0,
    avgHeat: 0,
    bonus: 0,
    points: 0,
    firsts: 0,
    seconds: 0,
    thirds: 0,
    fourths: 0,
    w: 0,
    d: 0,
    t: 0,
  };
}

function mapRawRiderToLeagueRider(raw: RawRider): LeagueRider {
  // season.ts guarantees the club exists.
  const club = CLUB_BY_REF.get(raw.clubId)!;

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
    ...emptyTelemetry(),
    home: emptyTelemetry(),
    away: emptyTelemetry(),
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
  const riders = RIDERS.filter((rider) => CLUB_BY_REF.get(rider.clubId)?.id === clubId).map(
    mapRawRiderToLeagueRider,
  );
  return z.array(leagueRiderSchema).parse(riders);
}

export async function getLeagueRiders(group?: string): Promise<LeagueRiderWithSkills[]> {
  const leagueIds = resolveLeagueIds(group);
  const raws = RIDERS.filter((rider) =>
    leagueIds.includes(CLUB_BY_REF.get(rider.clubId)!.leagueId),
  );
  const riders = z.array(leagueRiderSchema).parse(raws.map(mapRawRiderToLeagueRider));
  return riders.map((rider, index) => ({ ...rider, skills: skillsOf(raws[index]!) }));
}
