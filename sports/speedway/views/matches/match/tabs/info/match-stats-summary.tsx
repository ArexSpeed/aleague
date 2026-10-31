import Link from "next/link";
import { BarChart3, Timer, Zap } from "lucide-react";

import { Widget } from "@/components/data/widget";
import { ColorDot } from "@/components/table/row-lead";
import { cn } from "@/lib/utils";
import type { Match } from "@/sports/speedway/types/match";
import { riderHref, type MatchParams } from "../../match-params";
import { fastestHeat, scoreOf, shortName, SIDES, squadLines, winnerSide } from "../../match-stats";

/** "General stats": fastest heat and a points line for every rider who started. */
export function MatchStatsSummary({ match, params }: { match: Match; params: MatchParams }) {
  const fastest = fastestHeat(match);
  const winner = winnerSide(match);

  return (
    <Widget icon={BarChart3} title="General stats" hint="Match report">
      {fastest ? (
        <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-brand/30 bg-brand/10 p-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand text-brand-foreground">
              <Zap className="size-5" aria-hidden />
            </span>
            <div className="min-w-0 leading-tight">
              <p className="text-[10px] font-bold tracking-wider text-fg-faint uppercase">Fastest heat</p>
              <p className="truncate text-sm font-extrabold text-fg">
                Heat {fastest.heat} · <span className="text-brand">{shortName(fastest.winner)}</span>
              </p>
            </div>
          </div>
          <span className="flex shrink-0 items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-sm font-black text-fg">
            <Timer className="size-4 text-fg-faint" aria-hidden />
            {fastest.time.toFixed(2)} s
          </span>
        </div>
      ) : null}

      <div className="grid gap-3 lg:grid-cols-2">
        {SIDES.map((side) => {
          const team = match[side];
          const lines = squadLines(match, side).filter((line) => line.starts.length > 0);
          return (
            <section key={side} className="rounded-xl border border-line p-3">
              <header className="flex items-center justify-between gap-2 border-b border-line pb-2">
                <span className="flex min-w-0 items-center gap-2 text-sm font-black text-fg uppercase">
                  <ColorDot color={team.color} />
                  <span className="truncate">
                    {team.name} {team.subName}
                  </span>
                </span>
                <span
                  className={cn(
                    "shrink-0 rounded-lg px-2.5 py-1 text-xs font-black",
                    winner === side ? "bg-brand text-brand-foreground" : "bg-fg/10 text-fg",
                  )}
                >
                  {scoreOf(match, side)} pts
                </span>
              </header>
              <ul className="pt-1">
                {lines.map((line) => (
                  <li key={line.rider.id}>
                    <Link
                      href={riderHref(params, line.rider.id)}
                      scroll={false}
                      className="flex items-center gap-2 rounded-lg px-1 py-1.5 transition-colors hover:bg-surface-hover"
                    >
                      <span className="w-6 shrink-0 text-xs font-bold text-fg-faint">{line.rider.number}.</span>
                      <span className="truncate text-sm font-black text-fg">{shortName(line.rider)}</span>
                      <span className="truncate text-xs text-fg-faint">
                        ({line.starts.map((s) => s.start.points).join(",")})
                      </span>
                      <span className="ml-auto text-sm font-black text-fg">{line.points}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </Widget>
  );
}
