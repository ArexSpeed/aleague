import Link from "next/link";

import { cn } from "@/lib/utils";
import type { Match } from "@/sports/speedway/types/match";
import { PlannedHeatRows } from "../lineup/planned-heat-rows";
import { heatHref, riderHref, type MatchParams } from "../match-params";
import { byGate } from "../match-stats";
import { HELMETS, HelmetDot } from "../shared/helmet";
import { RunChip } from "../shared/run-chip";

/** Aside > Heat: pick a heat (1-15) and see its result and who started from which gate. */
export function HeatPanel({ match, params }: { match: Match; params: MatchParams }) {
  const number = Math.min(params.heat ?? 1, match.heats.length);
  const heat = match.heats.find((h) => h.number === number) ?? match.heats[0]!;
  const finished = heat.time !== null;
  const riders = byGate(heat.riders);

  return (
    <div className="mt-3 space-y-3">
      <section>
        <h3 className="text-[11px] font-black tracking-wider text-fg-faint uppercase">
          Select heat (1 – {match.heats.length})
        </h3>
        <div className="mt-2 grid grid-cols-5 gap-1.5">
          {match.heats.map((h) => (
            <Link
              key={h.number}
              href={heatHref(params, h.number)}
              replace
              scroll={false}
              aria-current={h.number === heat.number ? "true" : undefined}
              className={cn(
                "grid h-9 place-items-center rounded-lg text-sm font-black transition-colors",
                h.number === heat.number
                  ? "bg-brand text-brand-foreground shadow-xs"
                  : "bg-fg/5 text-fg-muted hover:text-fg",
              )}
            >
              {h.number}
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-surface p-3">
        <header className="flex items-center gap-3 border-b border-line pb-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand text-base font-black text-brand-foreground">
            {heat.number}
          </span>
          <div className="flex min-w-0 flex-1 flex-col leading-tight">
            <span className="text-sm font-black text-fg uppercase">Heat {heat.number}</span>
            <span className="text-xs text-fg-faint">
              {finished ? `Time: ${heat.time!.toFixed(2)} s` : "Not run yet"}
            </span>
          </div>
          {finished ? (
            <div className="flex flex-col items-end leading-tight">
              <span className="text-lg font-black text-fg">
                {heat.homePoints}:{heat.awayPoints}
              </span>
              <span className="text-[11px] font-semibold text-brand">
                Score: {heat.homeTotal}:{heat.awayTotal}
              </span>
            </div>
          ) : null}
        </header>

        <h3 className="pt-3 text-[11px] font-black tracking-wider text-brand uppercase">
          Starting gate lineup
        </h3>
        {finished ? (
          <ul className="space-y-1.5 pt-2">
            {riders.map((start) => (
              <li key={start.gate}>
                <Link
                  href={riderHref(params, start.riderId)}
                  scroll={false}
                  className="flex items-center gap-2.5 rounded-xl border border-line px-2.5 py-2 transition-colors hover:bg-surface-hover"
                >
                  <HelmetDot helmet={start.helmet} className="size-3.5" />
                  <span className="flex min-w-0 flex-1 flex-col leading-tight">
                    <span className="truncate text-sm font-black text-fg">
                      {start.firstName} {start.lastName}
                    </span>
                    <span className="truncate text-[11px] font-semibold text-fg-faint uppercase">
                      Gate {start.gate} ({HELMETS[start.helmet].label}) · {match[start.side].name}
                    </span>
                  </span>
                  <span className="w-9 shrink-0">
                    <RunChip run={start} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="pt-2">
            <PlannedHeatRows heat={heat.number} riders={riders} />
          </div>
        )}
      </section>
    </div>
  );
}
