import type { ReactNode } from "react";
import { ScrollArea } from "@/components/layout/scroll-area";
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
import { NationGamesView } from "../nations/nation-games-view";

function ComingSoon({ label }: { label: string }) {
  return (
    <div className="flex flex-1 items-center justify-center text-sm font-semibold text-fg-faint">
      {label}: w kolejnym kroku
    </div>
  );
}

/** What each master tab renders. A new tab = one entry here + one id in LEAGUE_TABS. */
const TAB_CONTENT: Record<LeagueTab, (params: LeagueParams) => ReactNode> = {
  table: (params) =>
    params.kind === "nation" && !["league", "junior"].includes(params.competition ?? "") ? (
      <ComingSoon label="Table" />
    ) : (
      <StandingsTab params={params} />
    ),
  fixtures: (params) =>
    params.kind === "nation" && !["league", "junior"].includes(params.competition ?? "") ? (
      <ComingSoon label="Fixtures" />
    ) : (
      <FixturesTab params={params} />
    ),
  stats: (params) =>
    params.kind === "nation" && !["league", "junior"].includes(params.competition ?? "") ? (
      <ComingSoon label="Stats" />
    ) : (
      <StatsTab params={params} />
    ),
  history: () => <ComingSoon label="History" />,
  groups: (params) => <NationGamesView activeTab="groups" params={params} />,
  final: (params) => <NationGamesView activeTab="final" params={params} />,
};

/** Master part of the league page: tabs, shared filters, and the active tab's content. */
export function LeagueView({ params }: { params: LeagueParams }) {
  const isGames = params.kind === "nation" && params.competition === "games";
  const tabs = isGames
    ? [
        { id: "groups", label: "Groups", href: buildLeagueHref(params, { tab: "groups", team: undefined }) },
        { id: "final", label: "Final", href: buildLeagueHref(params, { tab: "final", team: undefined }) },
      ]
    : LEAGUE_TABS
        .filter((tab) => !["groups", "final"].includes(tab.id))
        .map((tab) => ({
          ...tab,
          href: buildLeagueHref(params, { tab: tab.id, team: undefined }),
        }));

  return (
    <>
      <TabNav label="Competition sections" active={params.tab} tabs={tabs} />
      <ScrollArea key={params.tab}>
        <LeagueFilters params={params} />
        {isGames ? (
          <NationGamesView activeTab={params.tab} params={params} />
        ) : (
          TAB_CONTENT[params.tab](params)
        )}
      </ScrollArea>
    </>
  );
}
