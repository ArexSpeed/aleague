import { cn } from "@/lib/utils";
import type { TeamMatch } from "@/types/league";

/** Upper bound for the bar length (a heat race match is up to ~75 points). */
const MAX_POINTS = 75;

export function PointsChart({ matches }: { matches: TeamMatch[] }) {
  return (
    <section className="shrink-0 border-t border-white/10 pt-2.5 pb-2">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xs font-bold text-white">Points / chart</h3>
        <div className="flex items-center gap-2 text-[10px] font-bold">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="size-2 rounded-full bg-emerald-500" aria-hidden /> W (Wygrana)
          </span>
          <span className="flex items-center gap-1 text-rose-400">
            <span className="size-2 rounded-full bg-rose-500" aria-hidden /> L (Porażka)
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/5 p-2.5">
        <div className="mb-2 flex items-center justify-between px-1 text-[10px] font-semibold text-slate-400">
          <span>Kolejki i wyniki meczów</span>
          <span className="font-bold text-brand">K1 — K{matches.length}</span>
        </div>

        <ul className="no-scrollbar max-h-52 space-y-1 overflow-y-auto pr-1">
          {matches.map((match) => {
            const win = match.res === "W";
            const width = Math.min(100, Math.round((match.pts / MAX_POINTS) * 100));
            return (
              <li
                key={match.round}
                className="group flex items-center gap-2 rounded-lg px-1.5 py-1 transition-colors hover:bg-white/5"
              >
                <span className="w-7 shrink-0 text-[11px] font-extrabold text-slate-400 group-hover:text-white">
                  {match.round}
                </span>
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-md border text-[10px] font-black",
                    win
                      ? "border-emerald-500/30 bg-emerald-500/20 text-emerald-400"
                      : "border-rose-500/30 bg-rose-500/20 text-rose-400",
                  )}
                >
                  {match.res}
                </span>
                <span
                  className="w-10 shrink-0 truncate text-[11px] font-bold text-slate-300"
                  title={match.oppName}
                >
                  {match.opp}
                </span>

                <div className="relative flex h-3 flex-1 items-center overflow-hidden rounded-full bg-white/10">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      win
                        ? "bg-linear-to-r from-emerald-600 to-emerald-400"
                        : "bg-linear-to-r from-rose-600 to-rose-400",
                    )}
                    style={{ width: `${width}%` }}
                  />
                </div>

                <div className="flex w-16 shrink-0 items-center justify-end gap-1 text-right text-[11px] font-bold">
                  <span className={win ? "font-extrabold text-emerald-400" : "text-white"}>
                    {match.pts}
                  </span>
                  <span className="text-[10px] font-normal text-slate-500">:</span>
                  <span className={win ? "text-slate-400" : "font-extrabold text-rose-400"}>
                    {match.oppPts}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
