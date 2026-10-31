import { buildMatch } from "@/sports/speedway/mocks/match";
import { matchSchema, type Match } from "@/sports/speedway/types/match";
import { getFixture } from "./fixtures";
import { getLeagueTeam, getTeamRiders } from "./league";

/** Full match: teams, squads, roster and every heat. Mock for now, parsed at the boundary. */
export async function getMatch(id: string): Promise<Match | null> {
  const fixture = await getFixture(id);
  if (!fixture) return null;

  const [home, away] = await Promise.all([
    getLeagueTeam(fixture.homeId),
    getLeagueTeam(fixture.awayId),
  ]);
  if (!home || !away) return null;

  const [homeRiders, awayRiders] = await Promise.all([
    getTeamRiders(home.id),
    getTeamRiders(away.id),
  ]);

  return matchSchema.parse(buildMatch(fixture, home, away, homeRiders, awayRiders));
}
