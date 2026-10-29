import type { Column } from "@/components/table/columns";
import { ColorDot, PositionBadge, RowName } from "@/components/table/row-lead";
import { TableRow, type TableDensity } from "@/components/table/table-row";
import type { LeagueTeam } from "@/sports/speedway/types/league";
import { positionBadgeClass } from "@/sports/speedway/views/competitions/league/standings";

type StandingsRowProps = {
  team: LeagueTeam;
  totalTeams: number;
  columns: readonly Column<LeagueTeam>[];
  selected: boolean;
  href: string;
  density: TableDensity;
};

export function StandingsRow({ team, totalTeams, columns, selected, href, density }: StandingsRowProps) {
  return (
    <TableRow
      item={team}
      columns={columns}
      href={href}
      selected={selected}
      density={density}
      lead={
        <>
          <PositionBadge value={team.pos} className={positionBadgeClass(team.pos, totalTeams)} />
          <ColorDot color={team.color} />
          <RowName primary={team.name} secondary={team.subName} />
        </>
      }
      // detail={<StandingsDetail team={team} />}  // Detailed variant, next step
    />
  );
}