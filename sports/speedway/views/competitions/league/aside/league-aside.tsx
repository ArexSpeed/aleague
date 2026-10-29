import type { ReactNode } from "react";

import { getLeagueTeam, getLeagueTeams } from "@/sports/speedway/api/league";
import { buildLeagueHref, type LeagueParams } from "../search-params";
import { TeamPanel } from "./team/team-panel";

export type LeagueAside = {
  /** Always rendered on lg+ (fallback when nothing is selected). */
  detail: ReactNode | null;
  /** Mobile drawer: open only when the user picked something (URL param). */
  open: boolean;
  closeHref: string;
};

export async function getLeagueAside(params: LeagueParams): Promise<LeagueAside> {
  const selected = params.team ? await getLeagueTeam(params.team) : null;
  const team = selected ?? (await getLeagueTeams()).sort((a, b) => a.pos - b.pos)[0] ?? null;

  return {
    detail: team ? <TeamPanel team={team} params={params} /> : null,
    open: selected !== null,
    closeHref: buildLeagueHref(params, { team: undefined, panel: "stats" }),
  };
}
