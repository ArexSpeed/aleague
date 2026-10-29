import { getLeagueTeams } from "@/sports/speedway/api/league";
import type { LeagueParams } from "@/sports/speedway/views/competitions/league/search-params";
import { StandingsLegend } from "./standings-legend";
import { StandingsTable } from "./standings-table";
import { StandingsToolbar } from "./standings-toolbar";

/** Table tab: venue/view toolbar, standings, legend. */
export async function StandingsTab({ params }: { params: LeagueParams }) {
  const teams = await getLeagueTeams();

  return (
    <div className="mt-1 flex min-h-0 min-w-0 flex-1 flex-col">
      <StandingsToolbar params={params} />
      <StandingsTable teams={teams} params={params} />
      <StandingsLegend />
    </div>
  );
}
