import { POINTS_COLUMN_WIDTH, type Column } from "@/components/table/columns";
import { PositionBadge, podiumBadgeClass, RowName } from "@/components/table/row-lead";
import { TableHeader } from "@/components/table/table-header";
import { TableRow } from "@/components/table/table-row";
import type { IndividualTableRow, IndividualTableView as IndividualTableData } from "@/sports/speedway/api/individual";
import { buildIndividualHref, type IndividualParams } from "./search-params";

const POINTS_WIDTH = "w-7 text-center sm:w-9";

const tournamentColumn = (index: number): Column<IndividualTableRow> => ({
  id: `t${index + 1}`,
  header: `T${index + 1}`,
  title: `Tournament ${index + 1} points`,
  cell: (r) => r.perTournament[index] ?? "–",
  width: POINTS_WIDTH,
});

function columnsFor(tournaments: number): Column<IndividualTableRow>[] {
  return [
    ...Array.from({ length: tournaments }, (_, i) => tournamentColumn(i)),
    { id: "total", header: "Pts", title: "Cycle points", cell: (r) => r.total, width: POINTS_COLUMN_WIDTH, emphasis: true },
  ];
}

export function IndividualTableView({ view, params }: { view: IndividualTableData; params: IndividualParams }) {
  const columns = columnsFor(view.rows[0]?.perTournament.length ?? 3);
  const started = view.played.length > 0;
  const ageOf = new Map(view.cycle.riders.map((rider) => [rider.id, rider.age]));

  const note = !view.cycle.stored
    ? "Preview from the season average. The riders are frozen when the first tournament starts."
    : view.cycle.locked
      ? "The riders are locked for this cycle."
      : view.cycle.manual
        ? "Riders picked by hand. You can still change them before the first heat."
        : "Riders picked by the season average. You can still change them before the first heat.";

  return (
    <div>
      <p className="mb-1 rounded-xl border border-line bg-control px-3 py-2 text-xs font-semibold text-fg-muted">{note}</p>

      <div className="sticky top-0 z-10 bg-main">
        <TableHeader
          columns={columns}
          lead={
            <>
              <span className="w-6 text-center font-bold sm:w-7">#</span>
              <span>Rider</span>
            </>
          }
        />
      </div>

      <ol className="px-1 pb-1">
        {view.rows.map((row) => (
          <TableRow
            key={row.riderId}
            item={row}
            columns={columns}
            href={buildIndividualHref(params, { rider: row.riderId })}
            selected={params.rider === row.riderId}
            density={params.view}
            lead={
              <>
                <PositionBadge
                  value={started ? row.rank : "–"}
                  className={started ? podiumBadgeClass(row.rank) : "bg-chip text-chip-foreground font-semibold opacity-50"}
                />
                <RowName primary={row.name} secondary={`${ageOf.get(row.riderId) ?? ""} y/o`} />
              </>
            }
          />
        ))}
      </ol>
    </div>
  );
}