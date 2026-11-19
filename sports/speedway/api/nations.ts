import { z } from "zod";

import { NATION_GAMES_FIXTURES, NATIONS, SEASON_FIXTURES } from "@/sports/speedway/data/season";

import { emptyTeamStats } from "@/sports/speedway/sim/stats";
import { leagueTeamSchema, type LeagueTeam } from "@/sports/speedway/types/league";
import {
  fixtureWithTeamsSchema,
  type FixtureWithTeams,
  type TeamRef,
} from "@/sports/speedway/types/fixtures";

const NATION_IDS = new Set(["ARK", "ARV", "CEL", "COS", "GOT", "MON", "RIV", "ROT"]);
const KICKOFF_TIMES = ["16:30", "17:00", "18:00", "19:30"];
const FIRST_WEEK = Date.UTC(2026, 10, 8);
export const NATION_JUNIOR_MAX_AGE = 21;

function nationTeams(subName: string): LeagueTeam[] {
  const teams = NATIONS.filter((nation) => NATION_IDS.has(nation.code)).map((nation, index) =>
    leagueTeamSchema.parse({
      id: nation.code,
      name: nation.name,
      subName,
      short: nation.code,
      color: nation.color,
      colorGradient: "from-slate-500 to-slate-700",
      badgeIcon: nation.code,
      pos: index + 1,
      ...emptyTeamStats(),
      matches: [],
    }),
  );
  return z.array(leagueTeamSchema).parse(teams);
}

export async function getNationLeagueTeams(): Promise<LeagueTeam[]> {
  return nationTeams("");
}

export async function getNationJuniorTeams(): Promise<LeagueTeam[]> {
  return nationTeams("");
}

const nationRefs = new Map<string, TeamRef>(
  NATIONS.map((nation) => [
    nation.code,
    {
      id: nation.code,
      name: nation.name,
      subName: "",
      short: nation.code,
      color: nation.color,
      badgeIcon: nation.code,
    },
  ]),
);

async function getNationFixtures(
  competitionId: "nation-league" | "nation-junior",
): Promise<FixtureWithTeams[]> {
  const fixtures = SEASON_FIXTURES.filter((fixture) => fixture.competitionId === competitionId);
  return z.array(fixtureWithTeamsSchema).parse(
    fixtures
      .map((fixture) => {
        const home = nationRefs.get(fixture.homeId);
        const away = nationRefs.get(fixture.awayId);
        if (!home || !away) return null;
        return {
          id: fixture.id,
          competitionId: fixture.competitionId,
          matchday: fixture.matchday,
          date: new Date(FIRST_WEEK + (fixture.week - 1) * 7 * 86400000).toISOString().slice(0, 10),
          time: KICKOFF_TIMES[(fixture.matchday - 1) % KICKOFF_TIMES.length]!,
          homeId: fixture.homeId,
          awayId: fixture.awayId,
          stadium: "",
          homeScore: null,
          awayScore: null,
          home,
          away,
        };
      })
      .filter((fixture) => fixture !== null),
  );
}

export async function getNationLeagueFixtures(): Promise<FixtureWithTeams[]> {
  return getNationFixtures("nation-league");
}

export async function getNationJuniorFixtures(): Promise<FixtureWithTeams[]> {
  return getNationFixtures("nation-junior");
}

export type NationGamesView = {
  groups: Record<"A" | "B", FixtureWithTeams[]>;
  final: FixtureWithTeams[];
};

export async function getNationGames(): Promise<NationGamesView> {
  const hydrated = NATION_GAMES_FIXTURES.flatMap((fixture) => {
    const home = nationRefs.get(fixture.homeId);
    const away = nationRefs.get(fixture.awayId);
    if (!home || !away) return [];
    return [
      fixtureWithTeamsSchema.parse({
        id: fixture.id,
        competitionId: fixture.competitionId,
        matchday: fixture.matchday,
        date: new Date(FIRST_WEEK + (fixture.week - 1) * 7 * 86400000).toISOString().slice(0, 10),
        time: KICKOFF_TIMES[(fixture.matchday - 1) % KICKOFF_TIMES.length]!,
        homeId: fixture.homeId,
        awayId: fixture.awayId,
        stadium: "TBD",
        homeScore: null,
        awayScore: null,
        home,
        away,
      }),
    ];
  });

  return {
    groups: {
      A: hydrated.filter(
        (fixture) => NATION_GAMES_FIXTURES.find((item) => item.id === fixture.id)?.group === "A",
      ),
      B: hydrated.filter(
        (fixture) => NATION_GAMES_FIXTURES.find((item) => item.id === fixture.id)?.group === "B",
      ),
    },
    final: hydrated.filter(
      (fixture) =>
        NATION_GAMES_FIXTURES.find((item) => item.id === fixture.id)?.stage !== "regular",
    ),
  };
}
