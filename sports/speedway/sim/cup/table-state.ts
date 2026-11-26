import { QUAL_GROUP, splitGroup, type CupRoundPlan, type PlaceRange } from "./plan";
import type { CupState } from "./resolve";

/** The places each club fights for right now. Null = no group yet (its round 1 pair is not decided). */
export function clubRanges(
  state: CupState,
  plan: CupRoundPlan[],
  seededIds: readonly string[],
): Map<string, PlaceRange | null> {
  const ranges = new Map<string, PlaceRange | null>();

  // The seeded clubs are in the top group from the start (they skip round 1).
  const top = plan[1]?.groups.find((g) => g.source?.groupId === QUAL_GROUP && g.source.side === "winners");
  for (const id of seededIds) ranges.set(id, top?.range ?? null);

  for (const [index, { groups }] of state.rounds.entries()) {
    const next = plan[index + 1]?.groups ?? [];

    for (const group of groups) {
      if (group.status !== "ready") continue;

      const half = (side: "winners" | "losers"): PlaceRange | null =>
        next.find((g) => g.source?.groupId === group.plan.id && g.source.side === side)?.range ??
        (group.plan.range ? splitGroup(group.plan.range)[side] : null);

      for (const pair of group.pairs) {
        ranges.set(pair.first, group.plan.range);
        ranges.set(pair.second, group.plan.range);
        if (pair.result.winner && pair.result.loser) {
          ranges.set(pair.result.winner, half("winners"));
          ranges.set(pair.result.loser, half("losers"));
        }
      }
    }
  }
  return ranges;
}