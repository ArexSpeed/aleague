import Link from "next/link";
import { Flame } from "lucide-react";

import { Widget } from "@/components/data/widget";
import { PositionBadge } from "@/components/table/row-lead";
import type { HeatRider, Match } from "@/sports/speedway/types/match";
import { heatHref, riderHref, type MatchParams } from "../../match-params";
import { riderOrder } from "../../match-stats";
import { HelmetDot } from "../../shared/helmet";

function RiderChip({ start, params }: { start: HeatRider; params: MatchParams }) {
  return (
    <Link
      href={riderHref(params, start.riderId)}
      scroll={false}
      className="inline-flex min-w-0 items-center gap-1.5 rounded-md px-1 py-0.5 text-xs font-bold text-fg transition-colors hover:bg-surface-hover"
    >
      <HelmetDot helmet={start.helmet} />
      <span className="truncate">
        <span className="hidden sm:inline">{start.firstName} </span>
        <span className="sm:hidden">{start.firstName.charAt(0)}. </span>
        {start.lastName} ({start.points})
      </span>
    </Link>
  );
}

/**
 * Every heat in one line: number, result, running score, riders by finishing place.
 * Wide screens: one row. Phones: result on the left, riders 2x2 on the right.
 */
export function HeatSummary({ match, params }: { match: Match; params: MatchParams }) {
  return (
    <Widget icon={Flame} title="Heat summary" hint={`${match.heats.length} heats · tap a heat for details`}>
      <ol className="space-y-1.5">
        {match.heats.map((heat) => (
          <li key={heat.number} className="flex items-center gap-2 rounded-xl border border-line p-1.5 sm:gap-3">
            <Link
              href={heatHref(params, heat.number)}
              scroll={false}
              className="flex shrink-0 items-center gap-2 rounded-lg p-1 transition-colors hover:bg-surface-hover sm:w-44"
            >
              <PositionBadge value={heat.number} className="bg-fg/5 font-black text-fg" />
              <span className="flex flex-col leading-tight sm:flex-row sm:items-baseline sm:gap-2">
                <span className="text-sm font-black text-fg">
                  {heat.homePoints}:{heat.awayPoints}
                </span>
                <span className="text-xs font-semibold text-brand">
                  ({heat.homeTotal}:{heat.awayTotal})
                </span>
              </span>
            </Link>

            <div className="grid min-w-0 flex-1 grid-cols-2 gap-x-2 gap-y-0.5 sm:flex sm:flex-wrap sm:justify-end sm:gap-x-3">
              {riderOrder(heat.riders).map((start) => (
                <RiderChip key={start.gate} start={start} params={params} />
              ))}
            </div>
          </li>
        ))}
      </ol>
    </Widget>
  );
}
