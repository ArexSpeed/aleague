import { createRng } from "../engine/v1/rng";
import type {
  TournamentDef,
  TournamentFixture,
  TournamentRoundDef,
} from "../types/tournaments";

export type TournamentGroupDraw = {
  groupNumber: number;
  clubIds: string[];
};

export type GroupMatchResult = {
  groupNumber: number;
  results: { clubId: string; points: number }[];
};

export type ThirdPlacedRankedClub = {
  rank: number;
  clubId: string;
  groupNumber: number;
  points: number;
  wildcard: boolean;
};

export type RoundAdvancementResult =
  | {
      status: "resolved";
      directAdvancing: string[];
      wildcardAdvancing: string[];
      allAdvancing: string[];
      thirdPlacedRanking?: ThirdPlacedRankedClub[];
    }
  | {
      status: "pending";
      reason: string;
    };

/**
 * 4. Generator. Fixtures for every group of every round.
 * Fours: 25 fixtures (12, 8, 4, 1), Pairs: 15 fixtures (8, 4, 2, 1).
 * Id: tournaments-<comp>-<round>-<group> (r1, r2, sf) and tournaments-<comp>-final.
 */
export function generateTournamentFixtures(def: TournamentDef): TournamentFixture[] {
  const fixtures: TournamentFixture[] = [];

  for (const round of def.rounds) {
    for (let g = 1; g <= round.groupCount; g++) {
      const isFinal = round.groupCount === 1 && round.id === "final";
      const id = isFinal
        ? `${def.competition}-final`
        : `${def.competition}-${round.id}-${g}`;
      const groupLabel = isFinal ? "Final" : `Group ${g}`;

      const slots = Array.from({ length: round.groupSize }, (_, s) => ({
        slot: s + 1,
        pot: s + 1,
        clubId: null,
        name: `Pot ${s + 1}`,
        points: null,
        rank: null,
      }));

      fixtures.push({
        id,
        competition: def.competition,
        round: round.id,
        group: g,
        groupLabel,
        slots,
        status: "pending",
      });
    }
  }

  return fixtures;
}

/**
 * Creates pots from ranked clubs.
 * Number of pots = groupSize, size of each pot = groupCount.
 */
export function createPots(
  clubs: readonly string[],
  groupCount: number,
  groupSize: number,
): string[][] {
  if (clubs.length !== groupCount * groupSize) {
    throw new Error(
      `Clubs count (${clubs.length}) must match groupCount * groupSize (${groupCount * groupSize})`,
    );
  }

  const pots: string[][] = [];
  for (let p = 0; p < groupSize; p++) {
    pots.push(clubs.slice(p * groupCount, (p + 1) * groupCount));
  }
  return pots;
}

/**
 * 8. Podział na grupy.
 * Pure function: creates pots from ranked clubs, deterministic Fisher-Yates draw
 * with seed per pot. Each group receives exactly 1 club from each pot.
 * Every club is used exactly once.
 */
export function drawGroups(
  rankedClubs: readonly string[],
  roundDef: TournamentRoundDef,
  seed: string,
): TournamentGroupDraw[] {
  const { groupCount, groupSize } = roundDef;
  const pots = createPots(rankedClubs, groupCount, groupSize);

  // Deterministically shuffle each pot
  const shuffledPots = pots.map((pot, p) => {
    const rng = createRng(`${seed}-pot-${p}`);
    const shuffled = [...pot];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const temp = shuffled[i]!;
      shuffled[i] = shuffled[j]!;
      shuffled[j] = temp;
    }
    return shuffled;
  });

  // Distribute one club from each pot to each group
  const groups: TournamentGroupDraw[] = Array.from({ length: groupCount }, (_, g) => ({
    groupNumber: g + 1,
    clubIds: [],
  }));

  for (let p = 0; p < groupSize; p++) {
    for (let g = 0; g < groupCount; g++) {
      groups[g]!.clubIds.push(shuffledPots[p]![g]!);
    }
  }

  return groups;
}

/**
 * 9. Awans z grup.
 * Pure function: calculates advancing clubs from round results.
 * Sorted by points descending, tie-breaker: base club ranking index.
 * Returns pending if any group lacks results.
 */
export function resolveRoundAdvancement(
  groupResults: GroupMatchResult[],
  roundDef: TournamentRoundDef,
  baseClubRanking: readonly string[],
): RoundAdvancementResult {
  if (groupResults.length !== roundDef.groupCount) {
    return { status: "pending", reason: "Wszystkie grupy muszą posiadać wyniki." };
  }

  const rankIndex = new Map(baseClubRanking.map((id, index) => [id, index]));

  const sortClubs = (a: { clubId: string; points: number }, b: { clubId: string; points: number }) => {
    if (b.points !== a.points) return b.points - a.points;
    const posA = rankIndex.get(a.clubId) ?? Number.POSITIVE_INFINITY;
    const posB = rankIndex.get(b.clubId) ?? Number.POSITIVE_INFINITY;
    return posA - posB;
  };

  const directAdvancing: string[] = [];
  const thirdPlacedPool: { clubId: string; groupNumber: number; points: number }[] = [];

  for (const gr of groupResults) {
    if (gr.results.length !== roundDef.groupSize) {
      return { status: "pending", reason: "Wszystkie grupy muszą posiadać pełne wyniki." };
    }

    const sorted = [...gr.results].sort(sortClubs);

    // Direct advancing
    const directCount = Math.min(roundDef.advancePerGroup, sorted.length);
    for (let i = 0; i < directCount; i++) {
      directAdvancing.push(sorted[i]!.clubId);
    }

    // Wildcard candidate (e.g. 3rd place in Fours R1)
    if (roundDef.wildcard && sorted[roundDef.wildcard.groupRank - 1]) {
      const third = sorted[roundDef.wildcard.groupRank - 1]!;
      thirdPlacedPool.push({
        clubId: third.clubId,
        groupNumber: gr.groupNumber,
        points: third.points,
      });
    }
  }

  let wildcardAdvancing: string[] = [];
  let thirdPlacedRanking: ThirdPlacedRankedClub[] | undefined;

  if (roundDef.wildcard && thirdPlacedPool.length > 0) {
    const sortedThirds = [...thirdPlacedPool].sort((a, b) => sortClubs(a, b));
    const wildcardCount = roundDef.wildcard.count;

    thirdPlacedRanking = sortedThirds.map((t, idx) => ({
      rank: idx + 1,
      clubId: t.clubId,
      groupNumber: t.groupNumber,
      points: t.points,
      wildcard: idx < wildcardCount,
    }));

    wildcardAdvancing = thirdPlacedRanking
      .filter((t) => t.wildcard)
      .map((t) => t.clubId);
  }

  return {
    status: "resolved",
    directAdvancing,
    wildcardAdvancing,
    allAdvancing: [...directAdvancing, ...wildcardAdvancing],
    thirdPlacedRanking,
  };
}

/**
 * 10. Rozwiązywanie rund.
 * Groups of round N+1 are created from advancing clubs of round N,
 * ordered by base club ranking (not by tournament points), then drawn into groups.
 */
export function resolveNextRound(
  advancingClubIds: readonly string[],
  nextRoundDef: TournamentRoundDef,
  baseClubRanking: readonly string[],
  seed: string,
): TournamentGroupDraw[] {
  const rankIndex = new Map(baseClubRanking.map((id, index) => [id, index]));
  const orderedAdvancing = [...advancingClubIds].sort((a, b) => {
    const posA = rankIndex.get(a) ?? Number.POSITIVE_INFINITY;
    const posB = rankIndex.get(b) ?? Number.POSITIVE_INFINITY;
    return posA - posB;
  });

  return drawGroups(orderedAdvancing, nextRoundDef, seed);
}
