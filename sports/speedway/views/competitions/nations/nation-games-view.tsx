import { FixtureCard } from "@/components/fixtures/fixture-card";
import { getNationGames } from "@/sports/speedway/api/nations";
import { todayIso } from "@/lib/format";
import { getFixtureStatus } from "@/components/fixtures/fixture-status";
import { buildLeagueHref, type LeagueParams } from "@/sports/speedway/views/competitions/league/search-params";
import type { FixtureWithTeams } from "@/sports/speedway/types/fixtures";

function card(fixture: FixtureWithTeams, today: string, params: LeagueParams) {
  const score = fixture.homeScore !== null && fixture.awayScore !== null
    ? { home: fixture.homeScore, away: fixture.awayScore }
    : null;
  return {
    id: fixture.id,
    home: { name: fixture.home.name, subName: fixture.home.subName, color: fixture.home.color, icon: fixture.home.badgeIcon, href: buildLeagueHref(params, { team: fixture.homeId, panel: "stats" }) },
    away: { name: fixture.away.name, subName: fixture.away.subName, color: fixture.away.color, icon: fixture.away.badgeIcon, href: buildLeagueHref(params, { team: fixture.awayId, panel: "stats" }) },
    score,
    status: getFixtureStatus({ date: fixture.date, time: fixture.time, played: score !== null, draw: score !== null && score.home === score.away }, today),
    matchHref: `/speedway/matches/${fixture.id}`,
  };
}

export async function NationGamesView({ activeTab, params }: { activeTab: string; params: LeagueParams }) {
  const data = await getNationGames();
  const today = todayIso();

  if (activeTab === "final") {
    return (
      <div className="mt-3 grid gap-2">
        {data.final.map((fixture) => <FixtureCard key={fixture.id} fixture={card(fixture, today, params)} />)}
      </div>
    );
  }

  return (
    <div className="mt-3 grid gap-4 xl:grid-cols-2">
      {(["A", "B"] as const).map((group) => (
        <section key={group} className="min-w-0">
          <h2 className="mb-2 text-sm font-black text-fg">Group {group}</h2>
          <div className="grid gap-2">
            {data.groups[group].map((fixture) => <FixtureCard key={fixture.id} fixture={card(fixture, today, params)} />)}
          </div>
        </section>
      ))}
    </div>
  );
}
