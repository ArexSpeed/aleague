"use client";

import { ArrowLeftRight } from "lucide-react";

import { PersonName } from "@/components/table/row-lead";
import { heatKey, squadKey, useLineupStore } from "@/sports/speedway/stores/match-lineup";
import type { HeatRider } from "@/sports/speedway/types/match";
import { HelmetBadge } from "../shared/helmet";
import { useLineup } from "./lineup-provider";

function PlannedRow({ heat, start }: { heat: number; start: HeatRider }) {
  const { matchId, openSlot } = useLineup();
  const heatOverride = useLineupStore((s) => s.heat[heatKey(matchId, heat, start.gate)]);
  const squadOverride = useLineupStore((s) => s.squad[squadKey(matchId, start.side, start.number)]);

  // Order of priority: this heat only > the squad slot > the announced rider.
  const rider = heatOverride?.rider ?? squadOverride;
  const first = rider?.firstName ?? start.firstName;
  const last = rider?.lastName ?? start.lastName;
  const currentId = rider?.id ?? start.riderId;

  return (
    <li className="group flex items-center gap-2 rounded-lg px-1 py-1">
      <HelmetBadge helmet={start.helmet} number={start.number} />
      <PersonName first={first} last={last} />
      {heatOverride?.kind === "tactic" ? (
        <span className="rounded bg-fg/10 px-1.5 py-0.5 text-[10px] font-black text-fg-muted uppercase">
          Tactic
        </span>
      ) : null}
      <button
        type="button"
        aria-label={`Change rider, heat ${heat}, gate ${start.gate}`}
        onClick={() =>
          openSlot({
            type: "heat",
            side: start.side,
            number: start.number,
            heat,
            gate: start.gate,
            helmet: start.helmet,
            currentId,
          })
        }
        className="ml-auto inline-flex items-center gap-1 rounded-lg bg-brand/10 px-2 py-1 text-xs font-bold text-brand transition-colors hover:bg-brand/20"
      >
        <ArrowLeftRight className="size-3.5" aria-hidden />
        <span className="hidden sm:inline">Change</span>
      </button>
    </li>
  );
}

/** Heat that has not been run: the planned riders, each with a Change button. */
export function PlannedHeatRows({ heat, riders }: { heat: number; riders: HeatRider[] }) {
  return (
    <ul className="space-y-0.5">
      {riders.map((start) => (
        <PlannedRow key={start.gate} heat={heat} start={start} />
      ))}
    </ul>
  );
}
