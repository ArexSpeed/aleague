import type { ReactNode } from "react";

import { TabNav } from "@/components/tabs/tab-nav";
import { LeagueFilters } from "./league-filters";
import {
  buildLeagueHref,
  LEAGUE_TABS,
  type LeagueParams,
  type LeagueTab,
} from "./search-params";
import { FixturesTab } from "./tabs/fixtures/fixtures-tab";
import { StandingsTab } from "./tabs/table/standings-tab";
import { StatsTab } from "./tabs/stats/stats-tab";

function ComingSoon({ label }: { label: string }) {
  return (
    <div className="flex flex-1 items-center justify-center text-sm font-semibold text-fg-faint">
      {label}: w kolejnym kroku
    </div>
  );
}

/** What each master tab renders. A new tab = one entry here + one id in LEAGUE_TABS. */
const TAB_CONTENT: Record<LeagueTab, (params: LeagueParams) => ReactNode> = {
  table: (params) => <StandingsTab params={params} />,
  fixtures: (params) => <FixturesTab params={params} />,
  stats: (params) => <StatsTab params={params} />,
  history: () => <ComingSoon label="History" />,
};

/** Master part of the league page: tabs, shared filters, and the active tab's content. */
export function LeagueView({ params }: { params: LeagueParams }) {
  return (
    <>
      <TabNav
        label="League sections"
        active={params.tab}
        tabs={LEAGUE_TABS.map((tab) => ({
        ...tab,
        href: buildLeagueHref(params, { tab: tab.id, team: undefined }),
        }))}
      />
      <LeagueFilters params={params} />
      {TAB_CONTENT[params.tab](params)}
    </>
  );
}
