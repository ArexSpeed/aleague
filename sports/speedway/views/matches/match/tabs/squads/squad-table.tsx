import type { Column } from "@/components/table/columns";
import { PersonName, PositionBadge } from "@/components/table/row-lead";
import { TableHeader } from "@/components/table/table-header";
import { TableRow } from "@/components/table/table-row";
import { cn } from "@/lib/utils";
import type { Match, Side } from "@/sports/speedway/types/match";
import { riderHref, type MatchParams } from "../../match-params";
import { RUN_COLUMNS, scoreOf, squadLines, winnerSide, type SquadLine } from "../../match-stats";
import { RunChip } from "../../shared/run-chip";
import { SideHeader } from "./side-header";

const columnCount = (line: SquadLine[]) =>
  Math.max(RUN_COLUMNS, ...line.map((l) => l.starts.length));

function getColumns(count: number): Column<SquadLine>[] {
  return [
    ...Array.from({ length: count }, (_, i): Column<SquadLine> => ({
      id: `run-${i + 1}`,
      header: i + 1,
      width: "w-6 text-center sm:w-8",
      cell: (line) => <RunChip run={line.starts[i]?.start} />,
    })),
    {
      id: "pts",
      header: "PTS",
      width: "w-10 text-center sm:w-12",
      emphasis: true,
      cell: (line) => (
        <>
          {line.points}
          {line.bonus > 0 ? <sup className="ml-px text-[8px] opacity-80">+{line.bonus}</sup> : null}
        </>
      ),
    },
  ];
}

/** Played match: one table per team, run by run. Row click opens the rider in the aside. */
export function SquadTable({ match, side, params }: { match: Match; side: Side; params: MatchParams }) {
  const lines = squadLines(match, side);
  const columns = getColumns(columnCount(lines));
  const winner = winnerSide(match) === side;

  return (
    <section className="rounded-2xl border border-line p-2">
      <SideHeader
        team={match[side]}
        side={side}
        badge={
          <span
            className={cn(
              "shrink-0 rounded-lg px-2.5 py-1 text-xs font-black",
              winner ? "bg-brand text-brand-foreground" : "bg-fg/10 text-fg",
            )}
          >
            {scoreOf(match, side)} pts
          </span>
        }
      />
      <TableHeader
        columns={columns}
        lead={
          <>
            <span className="w-6 text-center font-bold sm:w-7">#</span>
            <span>Rider</span>
          </>
        }
      />
      <ol className="px-1 pb-1">
        {lines.map((line) => (
          <TableRow
            key={line.rider.id}
            item={line}
            columns={columns}
            href={riderHref(params, line.rider.id)}
            selected={params.rider === line.rider.id}
            lead={
              <>
                <PositionBadge value={line.rider.number} className="bg-fg/5 font-black text-fg-muted" />
                <PersonName first={line.rider.firstName} last={line.rider.lastName} />
              </>
            }
          />
        ))}
      </ol>
    </section>
  );
}
