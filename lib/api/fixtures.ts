import { z } from "zod";

import { CURRENT_MATCHDAY, FIXTURES, TOTAL_MATCHDAYS } from "@/mocks/fixtures";
import { fixtureSchema, type Fixture, type FixtureWithTeams, type TeamRef } from "@/types/fixtures";
import { getLeagueTeams } from "./league";

export async function getMatchdayInfo(): Promise<{ current: number; total: number }> {
  return { current: CURRENT_MATCHDAY, total: TOTAL_MATCHDAYS };
}

async function withTeams(fixtures: Fixture[]): Promise<FixtureWithTeams[]> {
  const teams = await getLeagueTeams();
  const byId = new Map<string, TeamRef>(
    teams.map((t) => [
      t.id,
      { id: t.id, name: t.name, subName: t.subName, short: t.short, color: t.color },
    ]),
  );

  return fixtures.flatMap((fixture) => {
    const home = byId.get(fixture.homeId);
    const away = byId.get(fixture.awayId);
    return home && away ? [{ ...fixture, home, away }] : [];
  });
}

function parseFixtures(): Fixture[] {
  return z.array(fixtureSchema).parse(FIXTURES);
}

export async function getMatchdayFixtures(matchday: number): Promise<FixtureWithTeams[]> {
  return withTeams(parseFixtures().filter((f) => f.matchday === matchday));
}

export async function getFixture(id: string): Promise<FixtureWithTeams | null> {
  const [fixture] = await withTeams(parseFixtures().filter((f) => f.id === id));
  return fixture ?? null;
}
