import type { CupDefinition, CupRound } from "@/sports/speedway/types/cup";

import { cupStructure } from "./definition";

/** Places a group of clubs fights for, inclusive, e.g. { from: 1, to: 16 }. */
export type PlaceRange = { from: number; to: number };

/** Round 1 has no places yet: all clubs outside the seeded ones play one group. */
export const QUAL_GROUP = "qual";

export const rangeSize = (range: PlaceRange) => range.to - range.from + 1;
export const rangeId = (range: PlaceRange) => `${range.from}-${range.to}`;

/** After a round the winners fight for the upper half of the places, the losers for the lower half. */
export function splitGroup(range: PlaceRange): { winners: PlaceRange; losers: PlaceRange } {
  const size = rangeSize(range);
  if (size < 2 || size % 2 !== 0) {
    throw new Error(`Places ${rangeId(range)} cannot be split in half`);
  }
  const middle = range.from + size / 2;
  return {
    winners: { from: range.from, to: middle - 1 },
    losers: { from: middle, to: range.to },
  };
}

export type CupGroupPlan = {
  /** "qual" in round 1, otherwise the places, e.g. "1-16". Used in fixture ids. */
  id: string;
  /** Null in round 1. */
  range: PlaceRange | null;
  pairs: number;
  /** The group of the previous round this one comes from, and which half of it. */
  source: { groupId: string; side: "winners" | "losers" } | null;
};

export type CupRoundPlan = {
  round: CupRound;
  /** 1-based, also the matchday of the round's fixtures. */
  number: number;
  groups: CupGroupPlan[];
};

const groupOf = (
  range: PlaceRange,
  parentId: string,
  side: "winners" | "losers",
): CupGroupPlan => ({
  id: rangeId(range),
  range,
  pairs: rangeSize(range) / 2,
  source: { groupId: parentId, side },
});

function nextGroups(groups: CupGroupPlan[], clubCount: number, top: number): CupGroupPlan[] {
  const next: CupGroupPlan[] = [];
  for (const group of groups) {
    if (group.range === null) {
      // Round 1: winners join the seeded clubs in the top group, losers play for the bottom places.
      next.push(
        groupOf({ from: 1, to: top }, group.id, "winners"),
        groupOf({ from: top + 1, to: clubCount }, group.id, "losers"),
      );
      continue;
    }
    // A group of two has just played its only pair: the places are decided.
    if (rangeSize(group.range) <= 2) continue;
    const { winners, losers } = splitGroup(group.range);
    next.push(groupOf(winners, group.id, "winners"), groupOf(losers, group.id, "losers"));
  }
  return next;
}

/** Groups and pair counts of every round, from the definition and the number of clubs. */
export function buildCupPlan(def: CupDefinition, clubCount: number): CupRoundPlan[] {
  const { top, qualClubs } = cupStructure(clubCount);
  const plan: CupRoundPlan[] = [];

  let groups: CupGroupPlan[] = [
    { id: QUAL_GROUP, range: null, pairs: qualClubs / 2, source: null },
  ];

  for (const [index, round] of def.rounds.entries()) {
    if (groups.length === 0) throw new Error(`cup.json: round ${round.id} has no groups, too many rounds`);
    plan.push({ round, number: index + 1, groups });
    groups = nextGroups(groups, clubCount, top);
  }
  if (groups.length > 0) throw new Error("cup.json: too few rounds, some places are not decided");

  return plan;
}