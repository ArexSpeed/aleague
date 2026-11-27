import { POINTS_COLUMN_WIDTH, type Column } from "@/components/table/columns";
import { ColorDot, PositionBadge, podiumBadgeClass, RowName } from "@/components/table/row-lead";
import { TableHeader } from "@/components/table/table-header";
import { TableRow } from "@/components/table/table-row";
import type { CupTableView as CupTableData, CupTableViewRow } from "@/sports/speedway/api/cup";
import { formatBilans } from "@/sports/speedway/views/competitions/shared/stats/format";
import { buildCupHref, type CupParams } from "./search-params";

/** Three-digit point sums fit here; the league's default width is for two digits. */
const POINTS_WIDTH = "w-7 text-center sm:w-9";

const COLUMNS: Column<CupTableViewRow>[] = [
  { id: "games", header: "M", title: "Matches", cell: (r) => r.games },
  { id: "won", header: "W", title: "Wins", cell: (r) => r.won, className: "font-bold text-win" },
  { id: "draw", header: "D", title: "Draws", cell: (r) => r.draw },
  { id: "lost", header: "L", title: "Losses", cell: (r) => r.lost, className: "font-bold text-loss" },
  { id: "plus", header: "Pts+", title: "Points scored", cell: (r) => r.pointsPlus, width: POINTS_WIDTH },
  { id: "minus", header: "Pts-", title: "Points conceded", cell: (r) => r.pointsMinus, width: POINTS_WIDTH },
  {
    id: "bilans",
    header: "+/-",
    title: "Small points balance",
    cell: (r) => formatBilans(r.bilans),
    width: POINTS_COLUMN_WIDTH,
    emphasis: true,
  },
];

/** Settled places look like the league's badges; provisional ones are dimmed. */
function placeBadgeClass(row: CupTableViewRow): string {
  if (row.decided && row.place !== null) return podiumBadgeClass(row.place);
  return "bg-chip text-chip-foreground font-semibold opacity-50";
}

export function CupTableView({ view, params }: { view: CupTableData; params: CupParams }) {
  return (
    <div>
      {view.blocked ? (
        <p className="mb-1 rounded-xl border border-line bg-control px-3 py-2 text-xs font-semibold text-fg-muted">
          {view.blocked}
        </p>
      ) : null}

      <div className="sticky top-0 z-10 bg-main">
        <TableHeader
          columns={COLUMNS}
          lead={
            <>
              <span className="w-6 text-center font-bold sm:w-7">#</span>
              <span>Team</span>
            </>
          }
        />
      </div>

      <ol className="px-1 pb-1">
        {view.rows.map((row) => (
          <TableRow
            key={row.clubId}
            item={row}
            columns={COLUMNS}
            href={buildCupHref(params, { team: row.clubId })}
            selected={params.team === row.clubId}
            density={params.view}
            lead={
              <>
                <PositionBadge value={row.place ?? "–"} className={placeBadgeClass(row)} />
                <ColorDot color={row.color} />
                <RowName primary={row.name.split(" ")[0] ?? row.name} secondary={row.subName} />
                {row.rangeLabel ? (
                  <span className="shrink-0 rounded-md bg-fg/5 px-1.5 py-0.5 text-[10px] font-bold text-fg-faint">
                    {row.rangeLabel}
                  </span>
                ) : null}
              </>
            }
          />
        ))}
      </ol>
    </div>
  );
}