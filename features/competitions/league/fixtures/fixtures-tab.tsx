import { getMatchdayFixtures, getMatchdayInfo } from "@/lib/api/fixtures";
import type { FixtureWithTeams } from "@/types/fixtures";
import { buildLeagueHref, type LeagueParams } from "../search-params";
import { FixtureRow } from "./fixture-row";
import { FixturesToolbar } from "./fixtures-toolbar";
import { formatDate } from "./format";

function groupByDate(fixtures: FixtureWithTeams[]) {
  const days = new Map<string, FixtureWithTeams[]>();
  for (const fixture of fixtures) {
    days.set(fixture.date, [...(days.get(fixture.date) ?? []), fixture]);
  }
  return [...days.entries()];
}

/** Fixtures tab: matchday switcher, then matches grouped by day. Filters live in LeagueView. */
export async function FixturesTab({ params }: { params: LeagueParams }) {
  const { current, total } = await getMatchdayInfo();
  const matchday = Math.min(params.matchday ?? current, total);
  const fixtures = await getMatchdayFixtures(matchday);

  return (
    <div className="mt-1 flex min-h-0 min-w-0 flex-1 flex-col">
      <FixturesToolbar params={params} matchday={matchday} current={current} total={total} />

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-1 pb-1">
        {fixtures.length === 0 ? (
          <p className="p-4 text-center text-sm font-semibold text-slate-500">
            Brak meczów w tej kolejce
          </p>
        ) : (
          groupByDate(fixtures).map(([date, dayFixtures]) => (
            <section key={date}>
              <h3 className="px-2.5 pt-2 pb-1 text-[11px] font-extrabold tracking-wider text-slate-500 uppercase">
                {formatDate(date)}
              </h3>
              <ul>
                {dayFixtures.map((fixture) => (
                  <FixtureRow
                    key={fixture.id}
                    fixture={fixture}
                    selected={params.match === fixture.id}
                    href={buildLeagueHref(params, { match: fixture.id })}
                    density={params.view}
                  />
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </div>
  );
}