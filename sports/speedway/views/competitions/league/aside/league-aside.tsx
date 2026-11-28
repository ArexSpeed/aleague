import type { ReactNode } from "react";

import { getLeagueTeam, getLeagueTeams } from "@/sports/speedway/api/league";
import { getNationTeam } from "@/sports/speedway/api/nations";
import { NationTeamPanel } from "@/sports/speedway/views/competitions/nations/nation-team-panel";
import { TeamPanel } from "@/sports/speedway/views/competitions/shared/aside/team-panel";
import { buildLeagueHref, type LeagueParams } from "../search-params";

export type LeagueAside = {
  /** Always rendered on lg+ (fallback when nothing is selected). */
  detail: ReactNode | null;
  /** Mobile drawer: open only when the user picked something (URL param). */
  open: boolean;
  closeHref: string;
};

export async function getLeagueAside(params: LeagueParams): Promise<LeagueAside> {
  if (params.kind === "nation") {
    const competitionValue = params.competition ?? "league";
    if (competitionValue === "4teams" || competitionValue === "pairs") {
      return { detail: null, open: false, closeHref: buildLeagueHref(params, { team: undefined }) };
    }
    const competition: "league" | "junior" | "games" = competitionValue;

    const nationTeam = params.team
      ? await getNationTeam(params.team, competition)
      : await getNationTeam("ARK", competition);

    return {
      detail: nationTeam ? <NationTeamPanel team={nationTeam} params={params} /> : null,
      open: Boolean(params.team),
      closeHref: buildLeagueHref(params, { team: undefined, panel: "stats" }),
    };
  }

  const selected = params.team ? await getLeagueTeam(params.team) : null;
  const team = selected ?? (await getLeagueTeams()).sort((a, b) => a.pos - b.pos)[0] ?? null;

  return {
    detail: team ? (
      <TeamPanel
        clubId={team.id}
        source={params.source}
        panel={params.panel}
        venue={params.venue}
        hrefFor={(patch) => buildLeagueHref(params, patch)}
      />
    ) : null,
    open: selected !== null,
    closeHref: buildLeagueHref(params, { team: undefined, panel: "stats" }),
  };
}