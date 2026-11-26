import assert from "node:assert/strict";

import { CLUBS, CUP_DEFINITION, CUP_PLAN } from "../sports/speedway/data/season";
import { createRng } from "../sports/speedway/engine/v1";
import { fixtureParticipants, resolveCup, resolvePair, type Score } from "../sports/speedway/sim/cup/resolve";
import type { SeededResult } from "../sports/speedway/sim/cup/seeded";

// --- Pair result ------------------------------------------------------------
const rank = (id: string) => (id === "A" ? 1 : 2);
assert.equal(resolvePair("A", "B", [null, null], rank).state, "pending");
assert.equal(resolvePair("A", "B", [null, { home: 40, away: 35 }], rank).state, "pending"); // leg 2 before leg 1 is ignored
assert.equal(resolvePair("A", "B", [{ home: 40, away: 35 }, null], rank).state, "leg1-played");

// A hosts leg 1 (A 40, B 35), B hosts leg 2 (B 30, A 41): A 81, B 65.
const won = resolvePair("A", "B", [{ home: 40, away: 35 }, { home: 30, away: 41 }], rank);
assert.deepEqual([won.state, won.winner, won.loser], ["decided", "A", "B"]);
assert.deepEqual(won.totals, { first: 81, second: 65 });

// B hosts leg 1 (B 40, A 35), A hosts leg 2 (A 40, B 35): 75 : 75, the better seed (A) goes through.
const tie = resolvePair("B", "A", [{ home: 40, away: 35 }, { home: 40, away: 35 }], rank);
assert.deepEqual([tie.state, tie.winner, tie.loser], ["needs-runoff", "A", "B"]);

// --- The whole cup on made-up scores -----------------------------------------
const seeded: SeededResult = {
  status: "ready",
  clubs: CUP_DEFINITION.seeding.seeded.flatMap(({ leagueId, count }) =>
    CLUBS.filter((club) => club.leagueId === leagueId)
      .slice(0, count)
      .map((club, index) => ({ clubId: club.id, leagueId, pos: index + 1 })),
  ),
};
const order = new Map(CLUBS.map((club, index) => [club.id, index]));
const seedRank = (id: string) => order.get(id) ?? 999;

const played = new Map<string, Score>();
const rng = createRng("scores");
const resolve = (s: SeededResult) =>
  resolveCup({
    def: CUP_DEFINITION,
    plan: CUP_PLAN,
    clubs: CLUBS,
    seeded: s,
    scoreOf: (id) => played.get(id) ?? null,
    seedRank,
  });

// Seeding not ready: nothing can be drawn.
const waiting = resolve({ status: "pending", missing: ["round 15 of East Gold"] });
assert.ok(waiting.rounds.every((r) => r.groups.every((g) => g.status === "pending")));
const first = waiting.rounds[0]!.groups[0]!;
assert.ok(first.status === "pending" && first.missing.startsWith("Available after"));

// Seeding ready, nothing played: round 1 is drawn, the rest waits.
const start = resolve(seeded);
const r1 = start.rounds[0]!.groups[0]!;
assert.ok(r1.status === "ready" && r1.pairs.length === 16 && r1.pairs.every((p) => p.result.state === "pending"));
assert.ok(start.rounds.slice(1).every((r) => r.groups.every((g) => g.status === "pending")));

// Play every match of every drawn group until nothing is left.
for (let pass = 0; pass < 10; pass++) {
  let progressed = false;
  for (const { groups } of resolve(seeded).rounds) {
    for (const group of groups) {
      if (group.status !== "ready") continue;
      for (const pair of group.pairs) {
        for (const id of pair.fixtureIds) {
          if (played.has(id)) continue;
          played.set(id, { home: 25 + Math.floor(rng() * 21), away: 25 + Math.floor(rng() * 21) });
          progressed = true;
        }
      }
    }
  }
  if (!progressed) break;
}

const done = resolve(seeded);
assert.equal(played.size, 256);
assert.ok(done.rounds.every((r) => r.groups.every((g) => g.status === "ready" && g.complete)));

const seen = new Set<string>();
const places = new Map<number, string>();
const perRound: number[] = [];

for (const { round, groups } of done.rounds) {
  const clubsInRound = new Set<string>();
  for (const group of groups) {
    if (group.status !== "ready") continue;
    for (const pair of group.pairs) {
      const key = [pair.first, pair.second].sort().join("|");
      assert.ok(!seen.has(key), `repeated pair ${key}`);
      seen.add(key);
      clubsInRound.add(pair.first).add(pair.second);
      assert.equal(pair.fixtureIds.length, CUP_DEFINITION.legs);
    }
    const range = group.plan.range;
    if (range && range.to - range.from === 1 && group.pairs[0]) {
      places.set(range.from, group.pairs[0].result.winner!);
      places.set(range.to, group.pairs[0].result.loser!);
    }
  }
  perRound.push(clubsInRound.size);
  const expected = CUP_PLAN.find((r) => r.round.id === round.id)!.groups.reduce((sum, g) => sum + g.pairs * 2, 0);
  assert.equal(clubsInRound.size, expected, `clubs in ${round.id}`);
}
assert.equal(seen.size, 128);
assert.deepEqual(perRound, [32, 48, 48, 48, 48, 32]);
assert.equal(places.size, 48);
assert.equal(new Set(places.values()).size, 48);

// Hosts: leg 1 by the first club of the pair, leg 2 by the second.
const participants = fixtureParticipants(done);
assert.equal(participants.size, 256);
for (const { groups } of done.rounds) {
  for (const group of groups) {
    if (group.status !== "ready") continue;
    for (const pair of group.pairs) {
      assert.deepEqual(participants.get(pair.fixtureIds[0]!), { homeId: pair.first, awayId: pair.second });
      assert.deepEqual(participants.get(pair.fixtureIds[1]!), { homeId: pair.second, awayId: pair.first });
    }
  }
}

// Repeatable: the same scores always give the same cup.
assert.deepEqual(resolve(seeded), done);

console.log("clubs per round:", perRound);
console.log("cup resolve OK");