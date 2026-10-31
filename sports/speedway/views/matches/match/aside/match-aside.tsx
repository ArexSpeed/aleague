import { TabNav } from "@/components/tabs/tab-nav";
import type { Match } from "@/sports/speedway/types/match";
import { buildMatchHref, PANEL_TABS, type MatchParams } from "../match-params";
import { AsideHeader } from "./aside-header";
import { HeatPanel } from "./heat-panel";
import { PointsPanel } from "./points-panel";
import { RiderPanel } from "./rider-panel";

/**
 * Detail part of the match page. The same panel for the whole page: what it shows follows
 * what the user clicked (a rider -> Rider, a heat -> Heat). The close button comes from MasterDetail.
 */
export function MatchAside({ match, params }: { match: Match; params: MatchParams }) {
  const active = params.panel ?? "points";

  return (
    <div className="flex flex-col select-none">
      <AsideHeader match={match} />

      <TabNav
        variant="aside"
        label="Match report"
        active={active}
        tabs={PANEL_TABS.map((tab) => ({
          id: tab.id,
          label: tab.label,
          href: buildMatchHref(params, { panel: tab.id }),
        }))}
      />

      {active === "points" ? <PointsPanel match={match} params={params} /> : null}
      {active === "rider" ? <RiderPanel match={match} params={params} /> : null}
      {active === "heat" ? <HeatPanel match={match} params={params} /> : null}
      {active === "stats" ? (
        <p className="mt-6 text-center text-sm font-semibold text-fg-faint">Stats: coming soon</p>
      ) : null}
    </div>
  );
}
