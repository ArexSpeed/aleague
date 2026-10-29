import { TableHeader } from "@/components/table/table-header";
import type { LeagueTeam } from "@/sports/speedway/types/league";
import { buildLeagueHref, type LeagueParams } from "@/sports/speedway/views/competitions/league/search-params";
import { getStandingsColumns } from "./standings-columns";
import { StandingsRow } from "./standings-row";

/** Header stays put; only the list below it scrolls. */
export function StandingsTable({ teams, params }: { teams: LeagueTeam[]; params: LeagueParams }) {
  const sorted = [...teams].sort((a, b) => a.pos - b.pos);
  const columns = getStandingsColumns(params.venue);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <TableHeader
        columns={columns}
        lead={
          <>
            <span className="w-6 text-center font-bold sm:w-7">#</span>
            <span>Team</span>
          </>
        }
      />

      <ol className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-1 pb-1">
        {sorted.map((team) => (
          <StandingsRow
            key={team.id}
            team={team}
            totalTeams={sorted.length}
            columns={columns}
            selected={params.team === team.id}
            href={buildLeagueHref(params, { team: team.id })}
            density={params.view}
          />
        ))}
      </ol>
    </div>
  );
}