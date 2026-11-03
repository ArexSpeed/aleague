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
};

/**
 * Lineup changes the player makes before a match.
 * This is only a draft: it is sent to the server with Start / Set / Simulate (see `lineupDraft`).
 */
export const useLineupStore = create<LineupState>()((set) => ({
  squad: {},
  heat: {},
  setSquad: (key, rider) => set((s) => ({ squad: { ...s.squad, [key]: rider } })),
  setHeat: (key, rider, kind) => set((s) => ({ heat: { ...s.heat, [key]: { rider, kind } } })),
}));

export const squadKey = (matchId: string, side: Side, number: number) =>
  `${matchId}:${side}:${number}`;

export const heatKey = (matchId: string, heat: number, gate: number) =>
  `${matchId}:${heat}:${gate}`;

/** Keys look like `matchId:a:b`, and matchId itself may contain ":". */
const parseKey = (key: string) => {
  const parts = key.split(":");
  return { matchId: parts.slice(0, -2).join(":"), a: parts.at(-2)!, b: Number(parts.at(-1)) };
};

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
