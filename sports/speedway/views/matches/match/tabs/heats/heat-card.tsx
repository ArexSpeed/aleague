import Link from "next/link";

import { PersonName } from "@/components/table/row-lead";
import { cn } from "@/lib/utils";
import type { Heat } from "@/sports/speedway/types/match";
import { heatHref, riderHref, type MatchParams } from "../../match-params";
import { byGate } from "../../match-stats";
import { PlannedHeatRows } from "../../lineup/planned-heat-rows";
import { HelmetBadge } from "../../shared/helmet";
import { RunChip } from "../../shared/run-chip";

/** One heat: result in the header, the four riders by gate below. */
export function HeatCard({ heat, params }: { heat: Heat; params: MatchParams }) {
  const finished = heat.time !== null;
  const selected = params.panel === "heat" && params.heat === heat.number;
  const riders = byGate(heat.riders);

  return (
    <li
      className={cn(
        "rounded-2xl border-2 bg-surface p-3 shadow-xs",
        selected ? "border-brand" : "border-transparent",
      )}
    >
      <Link
        href={heatHref(params, heat.number)}
        scroll={false}
        className="group flex items-center justify-between gap-2 border-b border-line pb-2"
      >
        <span className="flex items-center gap-2 text-sm font-black text-fg uppercase transition-colors group-hover:text-brand">
          <span className="size-2 rounded-full bg-brand" aria-hidden />
          Heat {heat.number}
        </span>
        {finished ? (
          <span className="flex items-center gap-2 text-xs">
            <span className="font-mono text-fg-muted">{heat.time!.toFixed(2)} s</span>
            <span className="rounded-md bg-fg/5 px-2 py-0.5 font-black text-fg">
              {heat.homePoints}:{heat.awayPoints}
            </span>
            <span className="font-semibold text-brand">
              ({heat.homeTotal}:{heat.awayTotal})
            </span>
          </span>
        ) : (
          <span className="text-xs font-semibold text-fg-faint">Not run yet</span>
        )}
      </Link>

      <div className="pt-1.5">
        {finished ? (
          <ul className="space-y-0.5">
            {riders.map((start) => (
              <li key={start.gate}>
                <Link
                  href={riderHref(params, start.riderId)}
                  scroll={false}
                  className="group flex items-center gap-2 rounded-lg px-1 py-1 transition-colors hover:bg-surface-hover"
                >
                  <HelmetBadge helmet={start.helmet} number={start.number} />
                  <PersonName first={start.firstName} last={start.lastName} />
                  <span className="ml-auto font-mono text-xs text-fg-muted">
                    {start.time?.toFixed(2)} s
                  </span>
                  <span className="w-9 shrink-0">
                    <RunChip run={start} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <PlannedHeatRows heat={heat.number} riders={riders} />
        )}
      </div>
    </li>
  );
}
