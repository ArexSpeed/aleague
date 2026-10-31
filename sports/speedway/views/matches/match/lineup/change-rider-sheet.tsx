"use client";

import { Check } from "lucide-react";
import { useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  heatKey,
  squadKey,
  useLineupStore,
  type ChangeKind,
} from "@/sports/speedway/stores/match-lineup";
import type { MatchRider, Side } from "@/sports/speedway/types/match";
import { HELMETS } from "../shared/helmet";
import type { Slot } from "./lineup-provider";

const KINDS: { id: ChangeKind; label: string }[] = [
  { id: "normal", label: "Normal" },
  { id: "tactic", label: "Tactic (reserve)" },
];

type Props = {
  matchId: string;
  teams: Record<Side, { name: string; subName: string }>;
  roster: Record<Side, MatchRider[]>;
  slot: Slot | null;
  onClose: () => void;
};

/** Bottom sheet: pick a rider from the club roster for a squad slot or a single heat start. */
export function ChangeRiderSheet({ matchId, teams, roster, slot, onClose }: Props) {
  const setSquad = useLineupStore((s) => s.setSquad);
  const setHeat = useLineupStore((s) => s.setHeat);
  const [kind, setKind] = useState<ChangeKind>("normal");

  const team = slot ? teams[slot.side] : null;

  function pick(rider: MatchRider) {
    if (!slot) return;
    if (slot.type === "squad") {
      setSquad(squadKey(matchId, slot.side, slot.number), rider);
    } else {
      setHeat(heatKey(matchId, slot.heat, slot.gate), rider, kind);
    }
    onClose();
  }

  return (
    <Sheet open={slot !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="bottom"
        className="mx-auto max-h-[85dvh] w-full gap-0 rounded-t-3xl p-0 sm:max-w-lg"
      >
        <SheetHeader className="border-b border-line p-4 pr-14">
          <SheetTitle className="text-base font-black tracking-wide uppercase">
            {slot?.type === "heat"
              ? `Change rider · Heat ${slot.heat}`
              : slot
                ? `Change rider · #${slot.number}`
                : "Change rider"}
          </SheetTitle>
          <SheetDescription className="text-xs font-semibold">
            {slot?.type === "heat"
              ? `Gate ${slot.gate} (${HELMETS[slot.helmet].label} helmet) · ${team?.name}`
              : `${team?.name ?? ""} ${team?.subName ?? ""} squad`}
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
          {slot?.type === "heat" ? (
            <div>
              <p className="mb-1.5 text-[11px] font-black tracking-wider text-fg-faint uppercase">
                Type of change
              </p>
              <div
                role="group"
                aria-label="Type of change"
                className="grid grid-cols-2 gap-1 rounded-xl border border-line bg-control p-1"
              >
                {KINDS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={kind === item.id}
                    onClick={() => setKind(item.id)}
                    className={cn(
                      "rounded-lg px-3 py-2 text-xs font-black tracking-wide uppercase transition-colors",
                      kind === item.id
                        ? "bg-brand text-brand-foreground shadow-xs"
                        : "text-fg-muted hover:text-fg",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div>
            <p className="mb-1.5 text-[11px] font-black tracking-wider text-fg-faint uppercase">
              Pick a rider from the roster
            </p>
            <ul className="space-y-2">
              {(slot ? roster[slot.side] : []).map((rider) => {
                const current = slot?.currentId === rider.id;
                return (
                  <li key={rider.id}>
                    <button
                      type="button"
                      onClick={() => pick(rider)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl border-2 bg-surface px-3 py-2.5 text-left transition-colors hover:bg-surface-hover",
                        current ? "border-brand" : "border-line",
                      )}
                    >
                      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-fg/5 text-xs font-black text-fg-muted">
                        #{rider.number}
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col leading-tight">
                        <span className="truncate text-sm font-black text-fg uppercase">
                          {rider.firstName} {rider.lastName}
                        </span>
                        <span className="truncate text-[11px] font-semibold text-fg-faint">
                          {rider.role}
                        </span>
                      </span>
                      <span className="rounded-md bg-fg/5 px-2 py-1 text-[11px] font-black text-fg-muted">
                        AVG {rider.avgHeat.toFixed(2)}
                      </span>
                      <span
                        className={cn(
                          "grid size-7 shrink-0 place-items-center rounded-full",
                          current ? "bg-brand text-brand-foreground" : "bg-fg/5 text-fg-faint",
                        )}
                      >
                        <Check className="size-4" aria-hidden />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
