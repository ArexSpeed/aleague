import { create } from "zustand";

import type { MatchRider, Side } from "@/sports/speedway/types/match";
import type { LineupDraft } from "../sim/lineup-draft";

export type ChangeKind = "normal" | "tactic";

type LineupState = {
  /** Squad slot -> rider picked instead of the announced one. */
  squad: Record<string, MatchRider>;
  /** One heat start -> substitute for that heat only. */
  heat: Record<string, { rider: MatchRider; kind: ChangeKind }>;
  setSquad: (key: string, rider: MatchRider) => void;
  setHeat: (key: string, rider: MatchRider, kind: ChangeKind) => void;
  clearMatchDraft: (matchId: string) => void;
};

/**
 * Lineup changes the player makes before a match.
 * This is only a draft: it is sent to the server with Start / Set / Simulate (see `lineupDraft`).
 */
export const useLineupStore = create<LineupState>()((set) => ({
  squad: {},
  heat: {},
  setSquad: (key, rider) =>
    set((s) => {
      const next = { ...s.squad };
      const existing = Object.entries(next).find(([slotKey, current]) => slotKey !== key && current.id === rider.id);
      if (existing) {
        const [swapKey, currentRider] = existing;
        const displaced = next[key];
        next[swapKey] = displaced ?? rider;
        next[key] = currentRider;
        return { squad: next };
      }
      next[key] = rider;
      return { squad: next };
    }),
  setHeat: (key, rider, kind) => set((s) => ({ heat: { ...s.heat, [key]: { rider, kind } } })),
  clearMatchDraft: (matchId: string) =>
    set((s) => {
      const squad = Object.fromEntries(
        Object.entries(s.squad).filter(([key]) => parseKey(key).matchId !== matchId),
      );
      const heat = Object.fromEntries(
        Object.entries(s.heat).filter(([key]) => parseKey(key).matchId !== matchId),
      );
      return { squad, heat };
    }),
}));

export const squadKey = (matchId: string, side: Side, slot: number) =>
  `${matchId}:${side}:${slot}`;

export const heatKey = (matchId: string, heat: number, gate: number) =>
  `${matchId}:${heat}:${gate}`;

/** Keys look like `matchId:a:b`, and matchId itself may contain ":". */
export const parseKey = (key: string) => {
  const parts = key.split(":");
  return { matchId: parts.slice(0, -2).join(":"), a: parts.at(-2)!, b: Number(parts.at(-1)) };
};

export function matchDraftState(
  state: Pick<LineupState, "squad">,
  matchId: string,
): Partial<Record<Side, Record<number, MatchRider>>> {
  const draft: Partial<Record<Side, Record<number, MatchRider>>> = {};

  for (const [key, rider] of Object.entries(state.squad)) {
    const k = parseKey(key);
    if (k.matchId !== matchId) continue;
    draft[k.a as Side] ??= {};
    draft[k.a as Side]![k.b] = rider;
  }

  return draft;
}

export function isDraftDirty(
  state: Pick<LineupState, "squad">,
  matchId: string,
  saved: Record<Side, MatchRider[]>,
): boolean {
  const draft = matchDraftState(state, matchId);

  for (const side of ["home", "away"] as const) {
    const savedIds = saved[side].map((r) => r.id);
    for (let slot = 1; slot <= 8; slot++) {
      const draftRider = draft[side]?.[slot]?.id ?? savedIds[slot - 1];
      if (draftRider !== savedIds[slot - 1]) return true;
    }
  }

  return false;
}

export function draftSquadsForMatch(
  state: Pick<LineupState, "squad">,
  matchId: string,
  saved: Record<Side, MatchRider[]>,
): Record<Side, string[]> {
  const next: Record<Side, string[]> = {
    home: [...saved.home.map((r) => r.id)],
    away: [...saved.away.map((r) => r.id)],
  };
  const draft = matchDraftState(state, matchId);

  for (const side of ["home", "away"] as const) {
    for (let slot = 1; slot <= 8; slot++) {
      const rider = draft[side]?.[slot];
      if (rider) next[side][slot - 1] = rider.id;
    }
  }

  return next;
}

/** The pending changes of one match in the shape the server actions take. */
export function lineupDraft(
  state: Pick<LineupState, "squad" | "heat">,
  matchId: string,
): LineupDraft {
  const draft: LineupDraft = { squads: {}, substitutions: {} };

  for (const [key, rider] of Object.entries(state.squad)) {
    const k = parseKey(key);
    if (k.matchId !== matchId) continue;
    const side = k.a as Side;
    draft.squads![side] ??= {};
    draft.squads![side]![k.b] = rider.id;
  }

  for (const [key, { rider, kind }] of Object.entries(state.heat)) {
    const k = parseKey(key);
    if (k.matchId !== matchId) continue;
    const heat = Number(k.a);
    draft.substitutions![heat] ??= {};
    draft.substitutions![heat]![k.b] = { riderId: rider.id, kind };
  }

  return draft;
}
