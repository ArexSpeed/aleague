import type { ReactNode } from "react";

import { TeamLogo } from "@/components/data/team-logo";
import { TabNav } from "@/components/tabs/tab-nav";
import { getTeamEntries, getTeamEntry } from "@/sports/speedway/api/teams";
import type { TeamEntry } from "@/sports/speedway/types/teams";
import { buildTeamsHref, PANEL_TABS, type TeamsParams } from "../teams-params";
import { HistoryPanel, InfoPanel, RidersPanel, StatsPanel } from "./team-panels";

export type TeamsAside = { detail: ReactNode | null; open: boolean; closeHref: string };

/** Aside for Clubs and Nations. Riders and Competition get their own aside later (none for now). */
export async function getTeamsAside(params: TeamsParams): Promise<TeamsAside> {
  const closeHref = buildTeamsHref(params, { team: undefined, panel: undefined });
  if (params.tab !== "clubs" && params.tab !== "nations") return { detail: null, open: false, closeHref };

  const selected = params.team ? await getTeamEntry(params.team) : null;
  const team =
    selected ?? (await getTeamEntries(params.tab === "clubs" ? "club" : "nation"))[0] ?? null;

  return {
    detail: team ? <TeamPanel team={team} params={params} /> : null,
    open: selected !== null,
    closeHref,
  };
}

/** The close button comes from MasterDetail, so the header leaves room for it. */
async function TeamPanel({ team, params }: { team: TeamEntry; params: TeamsParams }) {
  return (
    <div className="flex flex-col select-none">
      <header className="flex shrink-0 items-center gap-3 pr-9 pb-3">
        <TeamLogo color={team.color} icon={team.icon} className="size-10 rounded-xl text-xl sm:size-10 sm:text-xl" />
        <div className="flex min-w-0 flex-col leading-tight">
          <h2 className="truncate text-base font-black tracking-wide text-fg uppercase">{team.name}</h2>
          <span className="truncate text-[10px] font-bold text-fg-faint uppercase">
            {team.region} ({team.city})
          </span>
        </div>
      </header>

      <TabNav
        variant="aside"
        label="Team details"
        active={params.panel}
        tabs={PANEL_TABS.map((tab) => ({
          id: tab.id,
          label: tab.label,
          href: buildTeamsHref(params, { panel: tab.id }),
        }))}
      />

      {params.panel === "info" ? <InfoPanel team={team} /> : null}
      {params.panel === "riders" ? <RidersPanel team={team} /> : null}
      {params.panel === "stats" ? <StatsPanel team={team} /> : null}
      {params.panel === "history" ? <HistoryPanel team={team} /> : null}
    </div>
  );
}
