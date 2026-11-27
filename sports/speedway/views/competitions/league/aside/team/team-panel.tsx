import { TabNav } from "@/components/tabs/tab-nav";
import { getClubPanelData } from "@/sports/speedway/api/club-panel";
import { speedwayConfig } from "@/sports/speedway/config";
import type { LeagueTeam } from "@/sports/speedway/types/league";
import { PANEL_TABS, type PanelTab } from "@/sports/speedway/views/competitions/shared/aside/panel-tabs";
import { TeamDetails } from "@/sports/speedway/views/competitions/shared/aside/team/team-details";
import { TeamGames } from "@/sports/speedway/views/competitions/shared/aside/team/team-games";
import { TeamRiders } from "@/sports/speedway/views/competitions/shared/aside/team/team-riders";
import { TeamStats } from "@/sports/speedway/views/competitions/shared/aside/team/team-stats";
import { buildLeagueHref, type LeagueParams } from "../../search-params";

/** Tab labels. "Riders" comes from the sport vocabulary, the rest is the same for every sport. */
const PANEL_LABELS: Record<PanelTab, string> = {
  stats: "Stats",
  games: "Games",
  riders: speedwayConfig.labels.participants,
  details: "Details",
};

/**
 * Detail part for a selected team (?team=...). The close button is rendered by
 * MasterDetail, so the header leaves room for it on the right.
 */
export async function TeamPanel({ team, params }: { team: LeagueTeam; params: LeagueParams }) {
  const data = await getClubPanelData(
    team.id,
    "league",
    params.panel === "riders" || params.panel === "games" ? [params.panel] : [],
  );
  if (!data) return null;

  return (
    <div className="flex flex-col select-none">
      <header className="flex shrink-0 items-center gap-2.5 pr-9 pb-3">
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-sm shadow-md ring-1 ring-white/20"
          style={{ backgroundColor: team.color }}
        >
          <span className="drop-shadow">{team.badgeIcon}</span>
        </span>
        <div className="flex min-w-0 flex-col">
          <h2 className="truncate text-base font-black tracking-wide text-fg uppercase sm:text-lg">
            {team.name}
          </h2>
          <span className="truncate text-[10px] font-bold text-fg-faint uppercase">
            {team.short}
          </span>
        </div>
      </header>

      <TabNav
        variant="aside"
        label="Szczegóły drużyny"
        active={params.panel}
        tabs={PANEL_TABS.map((id) => ({
          id,
          label: PANEL_LABELS[id],
          href: buildLeagueHref(params, { panel: id }),
        }))}
      />

      {params.panel === "stats" ? (
        <TeamStats place={data.place} stats={data.stats} showLeaguePoints />
      ) : null}
      {params.panel === "games" ? (
        <TeamGames
          title={`Games: ${data.team.name}`}
          countLabel={`${data.games.length} rounds`}
          games={data.games}
        />
      ) : null}
      {params.panel === "riders" ? <TeamRiders riders={data.riders} venue={params.venue} /> : null}
      {params.panel === "details" ? <TeamDetails team={data.team} place={data.place} /> : null}
    </div>
  );
}