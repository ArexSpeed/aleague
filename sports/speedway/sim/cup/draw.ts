import type { Club } from "@/sports/speedway/data/schema";
import { createRng } from "@/sports/speedway/engine/v1";
import type { CupDefinition } from "@/sports/speedway/types/cup";

import { QUAL_GROUP } from "./plan";
import type { SeededResult } from "./seeded";

type Rng = ReturnType<typeof createRng>;

/** `first` hosts leg 1, `second` hosts leg 2. */
export type DrawnPair = { first: string; second: string };

export type DrawResult =
  | { status: "pending"; missing: string }
  | { status: "ready"; pairs: DrawnPair[] };

/** Seed of one draw: `<definition seed>-<round>-<group>`, e.g. "cup-s1-r3-1-16". */
export const drawSeed = (base: string, round: string, group: string) => `${base}-${round}-${group}`;

/** Fisher-Yates on the seeded generator. Does not touch the input. */
export function shuffle<T>(items: readonly T[], rng: Rng): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}

const sorted = (ids: readonly string[]) => [...ids].sort();

function pairUp(ids: readonly string[]): DrawnPair[] {
  if (ids.length % 2 !== 0) throw new Error(`Cannot pair ${ids.length} clubs`);
  return Array.from({ length: ids.length / 2 }, (_, i) => ({
    first: ids[2 * i]!,
    second: ids[2 * i + 1]!,
  }));
}

/**
 * Round 1: every club of the first basket draws an opponent from the second basket,
 * the clubs of the second basket left over are paired among themselves.
 * (Gold 12 + Silver 20 -> 12 mixed pairs + 4 Silver pairs.) The drawing club is `first`.
 */
export function drawQual(first: readonly string[], second: readonly string[], seed: string): DrawnPair[] {
  const extra = second.length - first.length;
  if (extra < 0 || extra % 2 !== 0) {
    throw new Error(`Round 1 baskets of ${first.length} and ${second.length} clubs cannot be paired`);
  }
  const rng = createRng(seed);
  const drawing = shuffle(sorted(first), rng);
  const opponents = shuffle(sorted(second), rng);

  return [
    ...drawing.map((club, i) => ({ first: club, second: opponents[i]! })),
    ...pairUp(opponents.slice(drawing.length)),
  ];
}

/** Round 1 from the definition: the 32 clubs outside the seeded ones, split into the two baskets. */
export function drawRound1(def: CupDefinition, clubs: readonly Club[], seeded: SeededResult): DrawResult {
  if (seeded.status === "pending") {
    return { status: "pending", missing: `Available after ${seeded.missing.join(" and ")}` };
  }
  const seededIds = new Set(seeded.clubs.map((club) => club.clubId));
  const basketClubs = (basket: (typeof def.qualDraw.baskets)[number]) =>
    clubs
      .filter((club) => basket.leagues.includes(club.leagueId) && !seededIds.has(club.id))
      .map((club) => club.id);

  const pairs = drawQual(
    basketClubs(def.qualDraw.baskets[0]),
    basketClubs(def.qualDraw.baskets[1]),
    drawSeed(def.seed, "r1", QUAL_GROUP),
  );
  return { status: "ready", pairs };
}

/**
 * Round 2, top group: each seeded club draws one winner of Round 1.
 * Pair numbers follow the seed rank (the order of `seeded`).
 */
export function drawRound2Main(
  seeded: readonly string[],
  qualWinners: readonly string[],
  seed: string,
): DrawResult {
  if (qualWinners.length < seeded.length) {
    return { status: "pending", missing: "Available after the previous round is played" };
  }
  if (qualWinners.length > seeded.length) {
    throw new Error(`${qualWinners.length} winners for ${seeded.length} seeded clubs`);
  }
  const opponents = shuffle(sorted(qualWinners), createRng(seed));
  return {
    status: "ready",
    pairs: seeded.map((club, i) => ({ first: club, second: opponents[i]! })),
  };
}

/** Every other group: the clubs of the group are drawn against each other (no baskets, to be confirmed). */
export function drawGroupPairs(clubs: readonly string[], expected: number, seed: string): DrawResult {
  if (clubs.length < expected) {
    return { status: "pending", missing: "Available after the previous round is played" };
  }
  if (clubs.length > expected) throw new Error(`${clubs.length} clubs in a group of ${expected}`);
  return { status: "ready", pairs: pairUp(shuffle(sorted(clubs), createRng(seed))) };
}