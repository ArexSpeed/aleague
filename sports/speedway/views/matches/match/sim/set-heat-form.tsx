"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { setHeatAction } from "@/sports/speedway/sim/actions";
import { lineupDraft, useLineupStore } from "@/sports/speedway/stores/match-lineup";
import { HelmetDot } from "../shared/helmet";
import type { Helmet, Side } from "@/sports/speedway/types/match";

const POINTS = [3, 2, 1, 0];

type Start = { gate: number; helmet: Helmet; side: Side; name: string };

/** Set: choose the finishing position of every gate by hand, then save. Points follow (3-2-1-0). */
export function SetHeatForm({ fixtureId, starts }: { fixtureId: string; starts: Start[] }) {
  const [open, setOpen] = useState(false);
  const [positions, setPositions] = useState([1, 2, 3, 4]);
  const [pending, startTransition] = useTransition();

  const valid = [1, 2, 3, 4].every((p) => positions.includes(p));
  const points = (side: Side) =>
    starts.reduce((sum, s) => sum + (s.side === side ? POINTS[positions[s.gate - 1]! - 1]! : 0), 0);

  function save() {
    // Read the store at click time, so the latest lineup changes go along with the result.
    const draft = lineupDraft(useLineupStore.getState(), fixtureId);
    startTransition(async () => {
      try {
        await setHeatAction(fixtureId, positions, draft);
        setOpen(false);
        setPositions([1, 2, 3, 4]);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not save the result");
      }
    });
  }

  return (
    <div className="basis-full">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "rounded-lg px-3 py-1.5 text-xs font-black transition-colors",
          open ? "bg-fg/10 text-fg" : "bg-fg/5 text-fg-muted hover:text-fg",
        )}
      >
        Set
      </button>

      {open ? (
        <div className="mt-2 space-y-1.5 rounded-xl border border-line p-2.5">
          {starts.map((start) => (
            <label key={start.gate} className="flex items-center gap-2 text-xs">
              <HelmetDot helmet={start.helmet} className="size-3.5" />
              <span className="min-w-0 flex-1 truncate font-bold text-fg">{start.name}</span>
              <select
                value={positions[start.gate - 1]}
                onChange={(event) =>
                  setPositions((current) => current.map((p, i) => (i === start.gate - 1 ? Number(event.target.value) : p)))
                }
                className="rounded-md border border-line bg-surface px-1.5 py-1 font-black text-fg"
              >
                {[1, 2, 3, 4].map((place) => (
                  <option key={place} value={place}>
                    {place}.
                  </option>
                ))}
              </select>
            </label>
          ))}

          <div className="flex items-center justify-between pt-1">
            <span className={cn("text-xs font-black", valid ? "text-fg" : "text-loss")}>
              {valid ? `Heat score ${points("home")}:${points("away")}` : "Each position once"}
            </span>
            <button
              type="button"
              disabled={!valid || pending}
              onClick={save}
              className="rounded-lg bg-brand px-3 py-1.5 text-xs font-black text-brand-foreground disabled:opacity-40"
            >
              Save result
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}