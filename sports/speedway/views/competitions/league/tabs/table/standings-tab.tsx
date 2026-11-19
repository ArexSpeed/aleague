import { getLeagueTeams } from "@/sports/speedway/api/league";
import { getNationJuniorTeams, getNationLeagueTeams } from "@/sports/speedway/api/nations";
import type { LeagueParams } from "@/sports/speedway/views/competitions/league/search-params";
import { StandingsLegend } from "./standings-legend";
import { StandingsTable } from "./standings-table";
import { StandingsToolbar } from "./standings-toolbar";

/** Table tab: venue/view toolbar, standings, legend. */
export async function StandingsTab({ params }: { params: LeagueParams }) {
  const teams =
    params.kind === "nation" && params.competition === "league"
      ? await getNationLeagueTeams()
      : params.kind === "nation" && params.competition === "junior"
        ? await getNationJuniorTeams()
        : await getLeagueTeams(params.group);

  return (
    <div className="mt-1 min-w-0">
      <StandingsToolbar params={params} />
      <StandingsTable teams={teams} params={params} />
      <StandingsLegend />
    </div>
  );
}
