import { create } from "zustand";

import type { MatchRider, Side } from "@/sports/speedway/types/match";

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
 * TODO: local only for now. Persist through the API (and validate on the server) later.
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
