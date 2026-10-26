import { LEAGUE_TABS, type LeagueParams } from "./search-params";
import { LeagueFilters } from "./league-filters";
import { LeagueTabs } from "./league-tabs";
import { StandingsTab } from "./standings-tab";
import { FixturesTab } from "./fixtures/fixtures-tab";

/** Master part of /rozgrywki: tabs, shared filters, and the active tab's content. */
export function LeagueView({ params }: { params: LeagueParams }) {
  const tabLabel = LEAGUE_TABS.find((tab) => tab.id === params.tab)?.label ?? "";

  return (
    <>
      <LeagueTabs params={params} />
      <LeagueFilters params={params} />

      {params.tab === "table" ? (
        <StandingsTab params={params} />
      ) : params.tab === "fixtures" ? (
        <FixturesTab params={params} />
      ) : (
        <div className="flex flex-1 items-center justify-center text-sm font-semibold text-slate-500">
          {tabLabel}: w kolejnym kroku
        </div>
      )}
    </>
  );
}
