import { TabNav } from "@/components/tabs/tab-nav";
import { LinkSelect } from "@/components/toggle/link-select";
import type { Venue } from "@/components/toggle/venue-toggle";
import { getClubPanelData } from "@/sports/speedway/api/club-panel";
import {
  CLUB_STATS_SOURCE_LABELS,
  CLUB_STATS_SOURCES,
  type ClubStatsSource,
} from "@/sports/speedway/competitions-config";
import { speedwayConfig } from "@/sports/speedway/config";
import { PANEL_TABS, type PanelTab } from "./panel-tabs";
import { TeamDetails } from "./team/team-details";
import { TeamGames } from "./team/team-games";
import { TeamRiders } from "./team/team-riders";
import { TeamStats } from "./team/team-stats";

/** Tab labels. "Riders" comes from the sport vocabulary, the rest is the same for every sport. */
const PANEL_LABELS: Record<PanelTab, string> = {
  stats: "Stats",
  games: "Games",
  riders: speedwayConfig.labels.participants,
  details: "Details",
};

type TeamPanelProps = {
  clubId: string;
  /** Competition whose matches are counted in every tab. */
  source: ClubStatsSource;
  panel: PanelTab;
  venue: Venue;
  /** Link to the current page with another tab or source; the page keeps the rest of its params. */
  hrefFor: (patch: { panel?: PanelTab; source?: ClubStatsSource }) => string;
};

/**
 * Detail part for a selected club (?team=...), the same in the league and the cup: header,
 * competition selector, tabs. The close button is rendered by MasterDetail, so the header
 * leaves room for it on the right.
 */
export async function TeamPanel({ clubId, source, panel, venue, hrefFor }: TeamPanelProps) {
  const data = await getClubPanelData(clubId, source, panel === "riders" || panel === "games" ? [panel] : []);
  if (!data) return null;
  const { team } = data;

  return (
    <div className="flex flex-col select-none">
      <header className="flex shrink-0 items-center gap-2.5 pr-9 pb-3">
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-sm shadow-md ring-1 ring-white/20"
          style={{ backgroundColor: team.color }}
        >
          <span className="drop-shadow">{team.icon}</span>
        </span>
        <div className="flex min-w-0 flex-col">
          <h2 className="truncate text-base font-black tracking-wide text-fg uppercase sm:text-lg">
            {team.name}
          </h2>
          <span className="truncate text-[10px] font-bold text-fg-faint uppercase">{team.short}</span>
        </div>
      </header>

      <div className="flex shrink-0 items-center justify-between gap-2 pb-2">
        <span className="text-[10px] font-bold tracking-wider text-fg-faint uppercase">Competition</span>
        <LinkSelect
          label="Competition"
          value={source}
          options={CLUB_STATS_SOURCES.map((id) => ({
            value: id,
            label: CLUB_STATS_SOURCE_LABELS[id],
            href: hrefFor({ source: id }),
          }))}
        />
      </div>

      <TabNav
        variant="aside"
        label="Szczegóły drużyny"
        active={panel}
        tabs={PANEL_TABS.map((id) => ({
          id,
          label: PANEL_LABELS[id],
          href: hrefFor({ panel: id }),
        }))}
      />

      {panel === "stats" ? (
        <TeamStats place={data.place} stats={data.stats} showLeaguePoints={source === "league"} />
      ) : null}
      {panel === "games" ? (
        <TeamGames
          title={`Games: ${team.name}`}
          countLabel={`${data.games.length} ${source === "league" ? "rounds" : "matches"}`}
          games={data.games}
        />
      ) : null}
      {panel === "riders" ? <TeamRiders riders={data.riders} venue={venue} /> : null}
      {panel === "details" ? <TeamDetails team={team} place={data.place} /> : null}
    </div>
  );
}