import { ScrollArea } from "@/components/layout/scroll-area";
import { TabNav } from "@/components/tabs/tab-nav";
import type { Match } from "@/sports/speedway/types/match";
import type { SportId } from "@/sports/types";
import { BackLink } from "./header/back-link";
import { buildMatchHref, MATCH_TABS, type MatchParams } from "./match-params";
import { HeatsTab } from "./tabs/heats/heats-tab";
import { InfoTab } from "./tabs/info/info-tab";
import { SquadsTab } from "./tabs/squads/squads-tab";

/** Master part of the match page: tabs stay fixed, the active tab scrolls in one ScrollArea. */
export function MatchView({ match, params, sport }: { match: Match; params: MatchParams; sport: SportId }) {
  return (
    <>
      <div className="flex shrink-0 items-start gap-3">
        <div className="min-w-0 flex-1">
          <TabNav
            label="Match sections"
            active={params.tab}
            tabs={MATCH_TABS.map((tab) => ({
              ...tab,
              href: buildMatchHref(params, { tab: tab.id }),
            }))}
          />
        </div>
        <BackLink sport={sport} matchday={match.matchday} />
      </div>

      {/* key: a new tab starts at the top */}
      <ScrollArea key={params.tab}>
        {params.tab === "info" ? <InfoTab match={match} params={params} sport={sport} /> : null}
        {params.tab === "squads" ? <SquadsTab match={match} params={params} sport={sport} /> : null}
        {params.tab === "heats" ? <HeatsTab match={match} params={params} sport={sport} /> : null}
        {params.tab === "stats" ? (
          <div className="flex flex-1 items-center justify-center text-sm font-semibold text-fg-faint">
            Stats: coming soon
          </div>
        ) : null}
      </ScrollArea>
    </>
  );
}
