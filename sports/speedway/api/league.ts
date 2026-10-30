import { z } from "zod";

import { LEAGUE_RIDERS } from "@/sports/speedway/mocks/league-riders";
import { LEAGUE_TEAMS } from "@/sports/speedway/mocks/league-teams";
import {
  leagueRiderSchema,
  leagueTeamSchema,
  type LeagueRider,
  type LeagueTeam,
  type RiderSkills,
  type LeagueRiderWithSkills,
} from "@/sports/speedway/types/league";

/**
 * API layer. Today it returns mocks; later the bodies change to fetch/DB calls
 * and the components stay as they are. Data is parsed at this boundary so a
 * bad payload fails here, not deep inside a component.
 */

export async function getLeagueTeams(): Promise<LeagueTeam[]> {
  return z.array(leagueTeamSchema).parse(LEAGUE_TEAMS);
}

export async function getLeagueTeam(id: string): Promise<LeagueTeam | null> {
  const teams = await getLeagueTeams();
  return teams.find((team) => team.id === id) ?? null;
}

export async function getTeamRiders(teamId: string): Promise<LeagueRider[]> {
  const riders = z.array(leagueRiderSchema).parse(LEAGUE_RIDERS);
  return riders.filter((rider) => rider.teamId === teamId);
}

/** TODO: skills are generated from avgHeat until real skill data exists. */
function mockSkills(rider: LeagueRider): RiderSkills {
  const seed = [...rider.id].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const base = 60 + rider.avgHeat * 12;
  const value = (i: number) =>
    Math.max(40, Math.min(99, Math.round(base + ((seed * (i + 3)) % 9) - 4)));

  return {
    strength: value(0),
    technique: value(1),
    fighting: value(2),
    reflex: value(3),
    condition: value(4),
  };
}

export async function getLeagueRiders(): Promise<LeagueRiderWithSkills[]> {
  const riders = z.array(leagueRiderSchema).parse(LEAGUE_RIDERS);
  return riders.map((rider) => ({ ...rider, skills: mockSkills(rider) }));
}
