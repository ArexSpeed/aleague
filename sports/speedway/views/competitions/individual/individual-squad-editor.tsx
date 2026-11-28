"use client";

import { useState, useTransition } from "react";

import { cn } from "@/lib/utils";
import type { IndividualPoolRider } from "@/sports/speedway/api/individual";
import {
  resetIndividualSquadAction,
  saveIndividualSquadAction,
} from "@/sports/speedway/sim/individual/actions";

type Props = {
  country: string;
  division: string;
  /** Everybody who may ride this cycle, best season average first. */
  pool: IndividualPoolRider[];
  /** Riders of the cycle now. */
  selected: string[];
  /** How many riders a cycle needs. */
  count: number;
  /** true = hand-picked, so "Auto pick" makes sense. */
  manual: boolean;
};

const BUTTON =
  "rounded-lg px-3 py-1.5 text-xs font-black transition-colors disabled:cursor-not-allowed disabled:opacity-40";

/** Edit the cycle's riders before the first heat. The server rejects the change once the cycle has started. */
export function IndividualSquadEditor({ country, division, pool, selected, count, manual }: Props) {
  const [chosen, setChosen] = useState(() => new Set(selected));
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const toggle = (id: string) => {
    setError(null);
    setChosen((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const run = (action: () => Promise<{ ok: true } | { ok: false; error: string }>) =>
    startTransition(async () => {
      const result = await action();
      setError(result.ok ? null : result.error);
    });

  const ready = chosen.size === count;

  return (
    <details className="mb-1 rounded-xl border border-line bg-surface px-3 py-2">
      <summary className="cursor-pointer text-xs font-bold text-fg-muted">
        Edit riders ({chosen.size} / {count})
      </summary>

      <ul className="mt-2 grid gap-1 sm:grid-cols-2">
        {pool.map((rider) => (
          <li key={rider.id}>
            <label
              className={cn(
                "flex cursor-pointer items-center justify-between gap-2 rounded-lg px-2 py-1 text-xs",
                chosen.has(rider.id) ? "bg-brand/10 font-bold" : "hover:bg-fg/5",
              )}
            >
              <span className="flex min-w-0 items-center gap-2">
                <input type="checkbox" checked={chosen.has(rider.id)} onChange={() => toggle(rider.id)} />
                <span className="truncate">{rider.name}</span>
              </span>
              <span className="shrink-0 text-fg-faint">
                {rider.age} y/o · {rider.heats > 0 ? rider.avgHeat.toFixed(2) : "–"}
              </span>
            </label>
          </li>
        ))}
      </ul>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={!ready || pending}
          className={cn(BUTTON, "bg-brand text-brand-foreground hover:bg-brand/90")}
          onClick={() => run(() => saveIndividualSquadAction(country, division, [...chosen]))}
        >
          Save riders
        </button>
        {manual ? (
          <button
            type="button"
            disabled={pending}
            className={cn(BUTTON, "bg-fg/5 text-fg-muted hover:text-fg")}
            onClick={() => run(() => resetIndividualSquadAction(country, division))}
          >
            Auto pick
          </button>
        ) : null}
        {error ? (
          <span role="alert" className="text-[11px] font-semibold text-loss">
            {error}
          </span>
        ) : null}
      </div>
    </details>
  );
}