import type { ReactNode } from "react";

import { getFixture, getMatchdayFixtures, getMatchdayInfo } from "@/lib/api/fixtures";
import { getLeagueTeam, getLeagueTeams } from "@/lib/api/league";
import { MatchPanel } from "./fixtures/match-panel";
import { buildLeagueHref, type LeagueParams } from "./search-params";
import { TeamPanel } from "./team-panel/team-panel";

export type LeaguePanel = {
  /** Always rendered on lg+ (fallback when nothing is selected). */
  detail: ReactNode | null;
  /** Mobile drawer: open only when the user picked something (URL param). */
  open: boolean;
  closeHref: string;
};

export async function getLeaguePanel(params: LeagueParams): Promise<LeaguePanel> {
  return params.tab === "fixtures" ? getFixturePanel(params) : getTeamPanel(params);
}

async function getFixturePanel(params: LeagueParams): Promise<LeaguePanel> {
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

async function getTeamPanel(params: LeagueParams): Promise<LeaguePanel> {
  const selected = params.team ? await getLeagueTeam(params.team) : null;
  const team = selected ?? (await getLeagueTeams()).sort((a, b) => a.pos - b.pos)[0] ?? null;

  return {
    detail: team ? <TeamPanel team={team} params={params} /> : null,
    open: selected !== null,
    closeHref: buildLeagueHref(params, { team: undefined, panel: "stats" }),
  };
}