import assert from "node:assert/strict";

import { CLUBS, CUP_DEFINITION, CUP_PLAN } from "../sports/speedway/data/season";
import { createRng } from "../sports/speedway/engine/v1";
import {
  drawGroupPairs,
  drawRound1,
  drawRound2Main,
  drawSeed,
  type DrawnPair,
  type DrawResult,
} from "../sports/speedway/sim/cup/draw";
import type { SeededResult } from "../sports/speedway/sim/cup/seeded";

function ready(result: DrawResult): DrawnPair[] {
  assert.ok(result.status === "ready", "draw is not ready");
  return result.pairs;
}

const leagueOf = new Map(CLUBS.map((club) => [club.id, club.leagueId]));
const goldLeagues = new Set(CUP_DEFINITION.qualDraw.baskets[0].leagues);

// A stand-in for the seeding: the first N clubs of each seeding league.
const seededClubs = CUP_DEFINITION.seeding.seeded.flatMap(({ leagueId, count }) =>
  CLUBS.filter((club) => club.leagueId === leagueId)
    .slice(0, count)
    .map((club, index) => ({ clubId: club.id, leagueId, pos: index + 1 })),
);
const seeded: SeededResult = { status: "ready", clubs: seededClubs };
const seededIds = seededClubs.map((club) => club.clubId);

// Round 1.
const r1 = ready(drawRound1(CUP_DEFINITION, CLUBS, seeded));
const r1Clubs = r1.flatMap((pair) => [pair.first, pair.second]);
assert.equal(r1.length, 16);
assert.equal(new Set(r1Clubs).size, 32);
assert.ok(r1Clubs.every((id) => !seededIds.includes(id)));
const mixed = r1.filter((pair) => goldLeagues.has(leagueOf.get(pair.first)!) && !goldLeagues.has(leagueOf.get(pair.second)!));
const silverOnly = r1.filter((pair) => !goldLeagues.has(leagueOf.get(pair.first)!) && !goldLeagues.has(leagueOf.get(pair.second)!));
assert.equal(mixed.length, 12);
assert.equal(silverOnly.length, 4);

// Repeatable for the same seed, different for another.
assert.deepEqual(ready(drawRound1(CUP_DEFINITION, CLUBS, seeded)), r1);
assert.notDeepEqual(ready(drawRound1({ ...CUP_DEFINITION, seed: "other" }, CLUBS, seeded)), r1);

// Pending until the input is complete.
assert.equal(drawRound1(CUP_DEFINITION, CLUBS, { status: "pending", missing: ["round 15 of East Gold"] }).status, "pending");
assert.equal(drawRound2Main(seededIds, seededIds.slice(0, 15), "x").status, "pending");
assert.equal(drawGroupPairs(["a", "b", "c"], 4, "x").status, "pending");

// A whole cup on random results.
const rng = createRng("simulated-results");
type Outcome = { winners: string[]; losers: string[] };
let previous = new Map<string, Outcome>();
const seen = new Set<string>();
const places = new Map<number, string>();
const pairsPerRound: number[] = [];

for (const [index, round] of CUP_PLAN.entries()) {
  const current = new Map<string, Outcome>();
  let roundPairs = 0;

  for (const group of round.groups) {
    const seed = drawSeed(CUP_DEFINITION.seed, round.round.id, group.id);
    let pairs: DrawnPair[];
    if (index === 0) {
      pairs = r1;
    } else {
      const source = group.source!;
      const from = previous.get(source.groupId)![source.side];
      pairs = ready(
        index === 1 && source.side === "winners"
          ? drawRound2Main(seededIds, from, seed)
          : drawGroupPairs(from, group.pairs * 2, seed),
      );
    }
    assert.equal(pairs.length, group.pairs, `${round.round.id} ${group.id}`);

    const outcome: Outcome = { winners: [], losers: [] };
    for (const pair of pairs) {
      const key = [pair.first, pair.second].sort().join("|");
      assert.ok(!seen.has(key), `repeated pair ${key} in ${round.round.id} ${group.id}`);
      seen.add(key);
      const firstWins = rng() < 0.5;
      outcome.winners.push(firstWins ? pair.first : pair.second);
      outcome.losers.push(firstWins ? pair.second : pair.first);
    }
    current.set(group.id, outcome);
    roundPairs += pairs.length;

    // A group of two plays its only pair: both places are decided.
    if (group.range && group.range.to - group.range.from === 1) {
      places.set(group.range.from, outcome.winners[0]!);
      places.set(group.range.to, outcome.losers[0]!);
    }
  }
  pairsPerRound.push(roundPairs);
  previous = current;
}

assert.deepEqual(pairsPerRound, [16, 24, 24, 24, 24, 16]);
assert.equal(seen.size, 128);
assert.equal(places.size, 48);
assert.equal(new Set(places.values()).size, 48);
assert.deepEqual([...places.keys()].sort((a, b) => a - b), Array.from({ length: 48 }, (_, i) => i + 1));

console.log("pairs per round:", pairsPerRound);
console.log("cup draw OK");