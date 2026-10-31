import Link from "next/link";

import { ColorDot } from "@/components/table/row-lead";
import { cn } from "@/lib/utils";
import type { Match } from "@/sports/speedway/types/match";
import { riderHref, type MatchParams } from "../match-params";
import { isFinished, scoreOf, shortName, SIDES, squadLines, winnerSide } from "../match-stats";
import { RunChip } from "../shared/run-chip";

/** Aside > Points: both squads with the points of every start. */
export function PointsPanel({ match, params }: { match: Match; params: MatchParams }) {
  const finished = isFinished(match);
  const winner = winnerSide(match);

  return (
    <div className="mt-3 space-y-3">
      {SIDES.map((side) => {
        const team = match[side];
        return (
          <section key={side} className="rounded-2xl border border-line bg-surface p-3">
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
                {finished ? `${scoreOf(match, side)} pts` : "–"}
              </span>
            </header>

            <ul className="pt-1">
              {squadLines(match, side).map((line) => (
                <li key={line.rider.id}>
                  <Link
                    href={riderHref(params, line.rider.id)}
                    scroll={false}
                    className="flex items-center gap-2 rounded-lg px-1 py-1.5 transition-colors hover:bg-surface-hover"
                  >
                    <span className="grid size-7 shrink-0 place-items-center rounded-md bg-fg/5 text-xs font-black text-fg-muted">
                      {line.rider.number}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="truncate text-xs font-black text-fg uppercase">
                        {shortName(line.rider)}
                      </span>
                      {finished && line.starts.length > 0 ? (
                        <span className="flex flex-wrap gap-1">
                          {line.starts.map((s) => (
                            <RunChip key={s.heat} run={s.start} compact />
                          ))}
                        </span>
                      ) : null}
                    </span>
                    {finished && line.starts.length > 0 ? (
                      <span className="shrink-0 rounded-lg bg-brand px-2.5 py-1 text-xs font-black text-brand-foreground">
                        {line.points}
                        {line.bonus > 0 ? <sup className="ml-px text-[8px]">+{line.bonus}</sup> : null}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
