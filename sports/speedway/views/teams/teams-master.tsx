import { ScrollArea } from "@/components/layout/scroll-area";
import { TabNav } from "@/components/tabs/tab-nav";
import { TeamsTab } from "./clubs/teams-tab";
import { buildTeamsHref, TEAMS_TABS, type TeamsParams } from "./teams-params";

function ComingSoon({ label }: { label: string }) {
  return (
    <div className="flex flex-1 items-center justify-center text-sm font-semibold text-fg-faint">
      {label}: coming soon
    </div>
  );
}

/** Master part: tabs stay fixed, the filters and the grid scroll together. */
export function TeamsMaster({ params }: { params: TeamsParams }) {
  return (
    <>
      <TabNav
        label="Teams sections"
        active={params.tab}
        tabs={TEAMS_TABS.map((tab) => ({
          ...tab,
          href: buildTeamsHref(params, { tab: tab.id, team: undefined, panel: undefined }),
        }))}
      />

      <ScrollArea key={params.tab}>
        {params.tab === "clubs" || params.tab === "nations" ? <TeamsTab params={params} /> : null}
        {params.tab === "riders" ? <ComingSoon label="Riders" /> : null}
        {params.tab === "competition" ? <ComingSoon label="Competition" /> : null}
      </ScrollArea>
    </>
  );
}
