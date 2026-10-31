import { readFileSync } from "node:fs";
import path from "node:path";
import { z } from "zod";

import { clubSchema, riderSchema, type Club, type RiderRaw } from "@/sports/speedway/data/schema";
import {
  leagueRiderSchema,
  leagueTeamSchema,
  type LeagueRider,
  type LeagueTeam,
  type RiderSkills,
  type LeagueRiderWithSkills,
} from "@/sports/speedway/types/league";

const CLUBS_PATH = path.join(process.cwd(), "sports", "speedway", "data", "season-1", "clubs.json");
const RIDERS_PATH = path.join(
  process.cwd(),
  "sports",
  "speedway",
  "data",
  "season-1",
  "riders.json",
);
const CLUBS = z.array(clubSchema).parse(JSON.parse(readFileSync(CLUBS_PATH, "utf8")));
const RAW_RIDERS = z.array(riderSchema).parse(JSON.parse(readFileSync(RIDERS_PATH, "utf8")));

const LEAGUE_IDS = new Set(["west-gold", "east-gold", "west-silver", "east-silver"]);
const LEAGUE_IDS_BY_GROUP: Record<string, string | undefined> = {
  "all-league": undefined,
  "gold-west": "west-gold",
  "gold-east": "east-gold",
  "silver-west": "west-silver",
  "silver-east": "east-silver",
};

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
    home: {
      games: 0,
      won: 0,
      draw: 0,
      lose: 0,
      pts: 0,
      ptsPlus: 0,
      ptsMinus: 0,
      bilans: 0,
    },
    away: {
      games: 0,
      won: 0,
      draw: 0,
      lose: 0,
      pts: 0,
      ptsPlus: 0,
      ptsMinus: 0,
      bilans: 0,
    },
    matches: [],
  };
}

export function resolveLeagueGroupId(group: string | undefined): string | undefined {
  if (!group) return undefined;
  if (LEAGUE_IDS.has(group)) return group;
  return LEAGUE_IDS_BY_GROUP[group];
}

/**
 * API layer. The league table is backed by the season club definitions, filtered by
 * the selected competition group. Missing stats are intentionally zeroed until the
 * full season stats source is wired in.
 */
export async function getLeagueTeams(group?: string): Promise<LeagueTeam[]> {
  const leagueId = resolveLeagueGroupId(group);
  const teams = CLUBS.filter((club) => !leagueId || club.leagueId === leagueId);

  return z
    .array(leagueTeamSchema)
    .parse(teams.map((club, index) => mapClubToLeagueTeam(club, index + 1)));
}

export async function getLeagueTeam(id: string): Promise<LeagueTeam | null> {
  const teams = await getLeagueTeams();
  return teams.find((team) => team.id === id) ?? null;
}

/** TODO: skills are generated from avgHeat until real skill data exists. */
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

function mapRawRiderToLeagueRider(raw: RiderRaw): LeagueRider {
  const club = CLUBS.find((item) => item.id === raw.clubId || item.short === raw.clubId) ?? null;
  const teamId = club?.id ?? raw.clubId;
  const teamName = club?.name ?? raw.club;
  const teamSubName = club?.subName ?? raw.club;
  const teamColor = club?.color ?? "#64748b";
  const teamIcon = club?.icon ?? "🏁";

  return {
    id: raw.id,
    pos: 0,
    name: `${raw.firstName} ${raw.lastName}`,
    firstName: raw.firstName,
    lastName: raw.lastName,
    role: "Rider",
    teamId,
    teamName,
    teamSubName,
    teamColor,
    teamIcon,
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
    home: emptyTelemetry(),
    away: emptyTelemetry(),
  };
}

function mockSkills(rider: LeagueRider): RiderSkills {
  const base = Number.isFinite(rider.avgHeat) ? rider.avgHeat : 0;
  return {
    strength: Math.round(base * 100),
    technique: Math.round(base * 100),
    fighting: Math.round(base * 100),
    reflex: Math.round(base * 100),
    condition: Math.round(base * 100),
  };
}

export async function getTeamRiders(teamId: string): Promise<LeagueRider[]> {
  const riders = RAW_RIDERS.filter((rider) => rider.clubId === teamId || rider.club === teamId).map(
    mapRawRiderToLeagueRider,
  );
  return z.array(leagueRiderSchema).parse(riders);
}

export async function getLeagueRiders(): Promise<LeagueRiderWithSkills[]> {
  const riders = RAW_RIDERS.map(mapRawRiderToLeagueRider);
  return z
    .array(leagueRiderSchema)
    .parse(riders)
    .map((rider) => ({ ...rider, skills: mockSkills(rider) }));
}
