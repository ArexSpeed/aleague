import { TabNav } from "@/components/tabs/tab-nav";
import { speedwayConfig } from "@/sports/speedway/config";
import { getTeamRiders } from "@/sports/speedway/api/league";
import type { LeagueTeam } from "@/sports/speedway/types/league";
import {
  buildLeagueHref,
  PANEL_TABS,
  type LeagueParams,
  type PanelTab,
} from "../../search-params";
import { TeamDetails } from "./team-details";
import { TeamGames } from "./team-games";
import { TeamRiders } from "./team-riders";
import { TeamStats } from "./team-stats";

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
  const riders = params.panel === "riders" ? await getTeamRiders(team.id) : [];

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
            {team.subName}
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

      {params.panel === "stats" ? <TeamStats team={team} /> : null}
      {params.panel === "games" ? <TeamGames team={team} /> : null}
      {params.panel === "riders" ? (
        <TeamRiders team={team} riders={riders} venue={params.venue} />
      ) : null}
      {params.panel === "details" ? <TeamDetails team={team} /> : null}
    </div>
  );
}
