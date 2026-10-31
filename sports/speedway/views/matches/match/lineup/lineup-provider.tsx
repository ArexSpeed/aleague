"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import type { Helmet, MatchRider, Side } from "@/sports/speedway/types/match";
import { squadKey, useLineupStore } from "@/sports/speedway/stores/match-lineup";
import { ChangeRiderSheet } from "./change-rider-sheet";

/** The slot the player is changing: a squad number, or one start in one heat. */
export type Slot =
  | { type: "squad"; side: Side; number: number; currentId: string }
  | {
      type: "heat";
      side: Side;
      number: number;
      heat: number;
      gate: number;
      helmet: Helmet;
      currentId: string;
    };

type LineupContext = { matchId: string; openSlot: (slot: Slot) => void };

const Context = createContext<LineupContext | null>(null);

export function useLineup(): LineupContext {
  const value = useContext(Context);
  if (!value) throw new Error("useLineup must be used inside <LineupProvider>");
  return value;
}

/**
 * One change-rider sheet for the whole match page. Squad rows and heat rows (master part
 * and aside) just call `openSlot`, so the sheet exists once and is shared.
 */
export function LineupProvider({
  matchId,
  teams,
  roster,
  children,
}: {
  matchId: string;
  teams: Record<Side, { name: string; subName: string }>;
  roster: Record<Side, MatchRider[]>;
  children: ReactNode;
}) {
  const [slot, setSlot] = useState<Slot | null>(null);
  const value = useMemo(() => ({ matchId, openSlot: setSlot }), [matchId]);

  return (
    <Context.Provider value={value}>
      {children}
      <ChangeRiderSheet
        matchId={matchId}
        teams={teams}
        roster={roster}
        slot={slot}
        onClose={() => setSlot(null)}
      />
    </Context.Provider>
  );
}

/** The announced squad with the player's substitutions applied. Slot number stays. */
export function useResolvedSquad(matchId: string, side: Side, squad: MatchRider[]): MatchRider[] {
  const overrides = useLineupStore((s) => s.squad);
  return squad.map((rider) => {
    const picked = overrides[squadKey(matchId, side, rider.number)];
    return picked ? { ...picked, number: rider.number } : rider;
  });
}
