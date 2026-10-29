import { ResultBadge } from "@/components/data/result-badge";
import { cn } from "@/lib/utils";
import type { TeamMatch } from "@/sports/speedway/types/league";

/** Upper bound for the bar length (a heat race match is up to ~75 points). */
const MAX_POINTS = 75;

export function PointsChart({ matches }: { matches: TeamMatch[] }) {
  return (
    <section className="shrink-0 border-t border-line pt-2.5 pb-2">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xs font-bold text-fg">Points / chart</h3>
        <div className="flex items-center gap-2 text-[10px] font-bold">
          <span className="flex items-center gap-1 text-win">
            <span className="size-2 rounded-full bg-win" aria-hidden /> W (Wygrana)
          </span>
          <span className="flex items-center gap-1 text-loss">
            <span className="size-2 rounded-full bg-loss" aria-hidden /> L (Porażka)
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-2.5">
        <div className="mb-2 flex items-center justify-between px-1 text-[10px] font-semibold text-fg-faint">
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
                className="group flex items-center gap-2 rounded-lg px-1.5 py-1 transition-colors hover:bg-surface"
              >
                <span className="w-7 shrink-0 text-[11px] font-extrabold text-fg-faint group-hover:text-fg">
                  {match.round}
                </span>
                <ResultBadge result={match.res} />
                <span
                  className="w-10 shrink-0 truncate text-[11px] font-bold text-fg-muted"
                  title={match.oppName}
                >
                  {match.opp}
                </span>

                <div className="relative flex h-3 flex-1 items-center overflow-hidden rounded-full bg-surface-hover">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      win
                        ? "bg-linear-to-r from-win/70 to-win"
                        : "bg-linear-to-r from-loss/70 to-loss",
                    )}
                    style={{ width: `${width}%` }}
                  />
                </div>

                <div className="flex w-16 shrink-0 items-center justify-end gap-1 text-right text-[11px] font-bold">
                  <span className={win ? "font-extrabold text-win" : "text-fg"}>
                    {match.pts}
                  </span>
                  <span className="text-[10px] font-normal text-fg-faint">:</span>
                  <span className={win ? "text-fg-faint" : "font-extrabold text-loss"}>
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
