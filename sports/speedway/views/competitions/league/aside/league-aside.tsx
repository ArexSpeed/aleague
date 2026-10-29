import type { ReactNode } from "react";

import { getFixture, getMatchdayFixtures, getMatchdayInfo } from "@/sports/speedway/api/fixtures";
import { getLeagueTeam, getLeagueTeams } from "@/sports/speedway/api/league";
import { buildLeagueHref, type LeagueParams } from "../search-params";
import { MatchPanel } from "./match/match-panel";
import { TeamPanel } from "./team/team-panel";

export type LeagueAside = {
  /** Always rendered on lg+ (fallback when nothing is selected). */
  detail: ReactNode | null;
  /** Mobile drawer: open only when the user picked something (URL param). */
  open: boolean;
  closeHref: string;
};

/** The detail panel follows the master tab: fixtures -> match, everything else -> team. */
export async function getLeagueAside(params: LeagueParams): Promise<LeagueAside> {
  return params.tab === "fixtures" ? getMatchAside(params) : getTeamAside(params);
}

async function getMatchAside(params: LeagueParams): Promise<LeagueAside> {
  const selected = params.match ? await getFixture(params.match) : null;

  let fixture = selected;
  if (!fixture) {
    const { current, total } = await getMatchdayInfo();
    fixture = (await getMatchdayFixtures(Math.min(params.matchday ?? current, total)))[0] ?? null;
  }

  return {
    detail: fixture ? <MatchPanel fixture={fixture} params={params} /> : null,
    open: selected !== null,
    closeHref: buildLeagueHref(params, { match: undefined }),
  };
}

async function getTeamAside(params: LeagueParams): Promise<LeagueAside> {
  const selected = params.team ? await getLeagueTeam(params.team) : null;
  const team = selected ?? (await getLeagueTeams()).sort((a, b) => a.pos - b.pos)[0] ?? null;

  return {
    detail: team ? <TeamPanel team={team} params={params} /> : null,
    open: selected !== null,
    closeHref: buildLeagueHref(params, { team: undefined, panel: "stats" }),
  };
}
