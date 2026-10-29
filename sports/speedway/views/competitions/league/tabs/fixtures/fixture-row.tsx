import { MapPin } from "lucide-react";

import type { Column } from "@/components/table/columns";
import { ColorDot } from "@/components/table/row-lead";
import { TableRow, type TableDensity } from "@/components/table/table-row";
import type { FixtureWithTeams, TeamRef } from "@/sports/speedway/types/fixtures";

const COLUMNS: Column<FixtureWithTeams>[] = [
  {
    id: "score",
    header: "Wynik",
    width: "w-14 text-center",
    className: "font-black text-fg",
    cell: (f) => (f.homeScore !== null ? `${f.homeScore}:${f.awayScore}` : "–"),
  },
];

function TeamChip({ team }: { team: TeamRef }) {
  return (
    <span className="flex min-w-0 items-center gap-1">
      <ColorDot color={team.color} />
      <span className="truncate text-xs font-extrabold text-fg uppercase transition-colors group-hover:text-brand">
        <span className="sm:hidden">{team.short}</span>
        <span className="hidden sm:inline">{team.name}</span>
      </span>
    </span>
  );
}

type FixtureRowProps = {
  fixture: FixtureWithTeams;
  selected: boolean;
  href: string;
  density: TableDensity;
};

export function FixtureRow({ fixture, selected, href, density }: FixtureRowProps) {
  return (
    <TableRow
      item={fixture}
      columns={COLUMNS}
      href={href}
      selected={selected}
      density={density}
      lead={
        <>
          <span className="w-11 shrink-0 text-center font-mono text-xs font-black text-brand">
            {fixture.time}
          </span>
          <TeamChip team={fixture.home} />
          <span className="shrink-0 text-[10px] font-black text-fg-faint">VS</span>
          <TeamChip team={fixture.away} />
        </>
      }
      detail={
        <span className="flex items-center gap-1">
          <MapPin className="size-3" aria-hidden />
          {fixture.stadium}
        </span>
      }
    />
  );
}