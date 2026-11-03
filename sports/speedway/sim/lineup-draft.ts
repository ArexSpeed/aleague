import type { Side } from "@/sports/speedway/engine/v1";

export type LineupDraft = {
  /** slot (1-8) -> riderId, only before the first heat */
  squads?: Partial<Record<Side, Record<number, string>>>;
  /** heat -> gate (1-4) -> substitute */
  substitutions?: Record<number, Record<number, { riderId: string; kind: "normal" | "tactic" }>>;
};
