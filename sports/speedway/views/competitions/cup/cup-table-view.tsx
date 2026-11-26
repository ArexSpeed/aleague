import type { CupTableView as CupTableData } from "@/sports/speedway/api/cup";

const HEAD = "px-2 py-1.5 text-right text-xs font-semibold text-fg-faint";
const CELL = "px-2 py-2 text-right tabular-nums";

export function CupTableView({ view }: { view: CupTableData }) {
  return (
    <div className="overflow-x-auto pb-4">
      {view.blocked ? (
        <p className="mb-2 rounded-lg border border-current/10 bg-current/5 px-3 py-2 text-sm font-semibold text-fg-faint">
          {view.blocked}
        </p>
      ) : null}
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className={`${HEAD} text-center`}>#</th>
            <th className={`${HEAD} text-left`}>Team</th>
            <th className={HEAD}>M</th>
            <th className={HEAD}>W</th>
            <th className={HEAD}>D</th>
            <th className={HEAD}>L</th>
            <th className={HEAD}>Pts+</th>
            <th className={HEAD}>Pts-</th>
            <th className={HEAD}>+/-</th>
          </tr>
        </thead>
        <tbody>
          {view.rows.map((row) => (
            <tr key={row.clubId} className="border-t border-current/10">
              <td className={`px-2 py-2 text-center font-bold ${row.decided ? "" : "text-fg-faint"}`}>
                {row.place ?? "–"}
              </td>
              <td className="px-2 py-2 text-left font-semibold">
                <span className="mr-2">{row.icon}</span>
                {row.name}
                {row.rangeLabel ? (
                  <span className="ml-2 rounded bg-current/10 px-1.5 py-0.5 text-xs text-fg-faint">
                    {row.rangeLabel}
                  </span>
                ) : null}
              </td>
              <td className={CELL}>{row.games}</td>
              <td className={CELL}>{row.won}</td>
              <td className={CELL}>{row.draw}</td>
              <td className={CELL}>{row.lost}</td>
              <td className={CELL}>{row.pointsPlus}</td>
              <td className={CELL}>{row.pointsMinus}</td>
              <td className={`${CELL} font-bold`}>
                {row.bilans > 0 ? `+${row.bilans}` : row.bilans}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}