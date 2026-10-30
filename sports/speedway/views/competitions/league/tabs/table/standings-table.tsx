import { TableHeader } from "@/components/table/table-header";
import type { LeagueTeam } from "@/sports/speedway/types/league";
import { buildLeagueHref, type LeagueParams } from "@/sports/speedway/views/competitions/league/search-params";
import { getStandingsColumns } from "./standings-columns";
import { StandingsRow } from "./standings-row";

/** The header sticks to the top of the scroll area; rows scroll under it. */
export function StandingsTable({ teams, params }: { teams: LeagueTeam[]; params: LeagueParams }) {
  const sorted = [...teams].sort((a, b) => a.pos - b.pos);
  const columns = getStandingsColumns(params.venue);

  return (
    <div>
      <div className="sticky top-0 z-10 bg-main">
        <TableHeader
          columns={columns}
          lead={
            <>
              <span className="w-6 text-center font-bold sm:w-7">#</span>
              <span>Team</span>
            </>
          }
        />
      </div>

      <ol className="px-1 pb-1">
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