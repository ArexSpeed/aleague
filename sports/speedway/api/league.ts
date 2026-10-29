import { z } from "zod";

import { LEAGUE_RIDERS } from "@/sports/speedway/mocks/league-riders";
import { LEAGUE_TEAMS } from "@/sports/speedway/mocks/league-teams";
import {
  leagueRiderSchema,
  leagueTeamSchema,
  type LeagueRider,
  type LeagueTeam,
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
