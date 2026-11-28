import assert from "node:assert/strict";

import { INDIVIDUAL_DEFINITION as def } from "../sports/speedway/data/season";
import { cycleTable } from "../sports/speedway/sim/individual/cycle";
import {
  assignStartNumbers,
  finalists,
  qualify,
  rankRegular,
  startNumberSeed,
  tournamentPoints,
} from "../sports/speedway/sim/individual/tournament";
import type { IndividualHeatResult } from "../sports/speedway/types/individual";

// The classic 20-heat table of the individual-16 format: start numbers on gates A-D.
const REGULAR_TABLE: number[][] = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 16],
  [2, 5, 9, 13],
  [6, 1, 10, 14],
  [15, 7, 3, 11],
  [4, 8, 12, 16],
  [16, 11, 2, 6],
  [12, 15, 1, 5],
  [14, 9, 8, 3],
  [10, 13, 4, 7],
  [7, 12, 14, 2],
  [8, 1, 11, 13],
  [3, 16, 5, 10],
  [15, 4, 6, 9],
  [2, 8, 10, 15],
  [9, 7, 16, 1],
  [12, 3, 13, 6],
  [11, 5, 14, 4],
];

// Table invariants: 80 starts, 5 per rider, every pair of riders meets exactly once.
const starts = new Map<number, number>();
const meetings = new Map<string, number>();
for (const heat of REGULAR_TABLE) {
  assert.equal(new Set(heat).size, 4);
  for (const n of heat) starts.set(n, (starts.get(n) ?? 0) + 1);
  for (const a of heat)
    for (const b of heat)
      if (a < b) meetings.set(`${a}-${b}`, (meetings.get(`${a}-${b}`) ?? 0) + 1);
}
assert.equal(REGULAR_TABLE.length, 20);
assert.equal(starts.size, 16);
assert.ok([...starts.values()].every((count) => count === 5));
assert.equal(meetings.size, 120);
assert.ok([...meetings.values()].every((count) => count === 1));

// Start numbers: a permutation, deterministic, independent of the input order, own order per seed.
const ids = Array.from({ length: 16 }, (_, i) => `r${String(i + 1).padStart(2, "0")}`);
const seed = startNumberSeed(def, "ARK", "open", 1);
assert.equal(seed, `${def.seed}-ark-open-t1`);
const order = assignStartNumbers(ids, seed);
assert.deepEqual([...order].sort(), ids);
assert.deepEqual(order, assignStartNumbers([...ids].reverse(), seed));
assert.notDeepEqual(order, assignStartNumbers(ids, startNumberSeed(def, "ark", "open", 2)));
assert.notDeepEqual(order, assignStartNumbers(ids, startNumberSeed(def, "ark", "junior", 1)));

// A played regular round: the stronger rider (lower index in `ids`) always finishes ahead.
const power = (id: string) => 100 - ids.indexOf(id);
const heatOf = (
  number: number,
  stage: IndividualHeatResult["stage"],
  riders: string[],
): IndividualHeatResult => ({
  number,
  stage,
  riders: [...riders]
    .sort((a, b) => power(b) - power(a))
    .map((riderId, i) => ({ riderId, position: i + 1 })),
});
const regular = REGULAR_TABLE.map((heat, i) =>
  heatOf(
    i + 1,
    "regular",
    heat.map((n) => order[n - 1]!),
  ),
);

const ranking = rankRegular(regular, order, def.scoring.heatPoints);
assert.equal(ranking.length, 16);
assert.deepEqual(
  ranking.map((row) => row.rank),
  Array.from({ length: 16 }, (_, i) => i + 1),
);
assert.ok(ranking.every((row) => row.heats === 5));
assert.equal(
  ranking.reduce((sum, row) => sum + row.points, 0),
  20 * 6,
); // 3+2+1+0 per heat
assert.equal(ranking[0]!.riderId, "r01");
assert.equal(ranking[0]!.points, 15);
assert.equal(ranking[15]!.riderId, "r16");
assert.equal(ranking[15]!.points, 0);

// Ties: equal points -> more 1st places; still equal -> lower start number.
const a = "r01",
  b = "r02",
  c = "r03",
  d = "r04";
const place = (number: number, riders: string[]): IndividualHeatResult => ({
  number,
  stage: "regular",
  riders: riders.map((riderId, i) => ({ riderId, position: i + 1 })),
});
const rest = ids.filter((id) => ![a, b, c, d].includes(id));
const byFirsts = rankRegular(
  [place(1, [a, b, c, d]), place(2, [c, d, b, a])],
  [b, a, c, d, ...rest],
  def.scoring.heatPoints,
);
// a and b both have 3 points, a has a 1st place (and the higher number): a stays ahead of b.
assert.deepEqual(
  byFirsts.slice(0, 4).map((row) => [row.riderId, row.points]),
  [
    [c, 4],
    [a, 3],
    [b, 3],
    [d, 2],
  ],
);
const byNumber = rankRegular(
  [place(1, [a, b, c, d]), place(2, [b, a, c, d])],
  [b, a, c, d, ...rest],
  def.scoring.heatPoints,
);
assert.deepEqual(
  byNumber.slice(0, 2).map((row) => row.riderId),
  [b, a],
); // 5:5, 1:1 firsts, b has number 1
assert.throws(() => rankRegular([place(1, [a, b, c, "x"])], order, def.scoring.heatPoints));

// Advance: 2 straight to the final, 4 to the semi-final, no overlap.
const { direct, semifinal } = qualify(ranking, def.stages);
assert.deepEqual(
  direct,
  ranking.slice(0, 2).map((row) => row.riderId),
);
assert.deepEqual(
  semifinal,
  ranking.slice(2, 6).map((row) => row.riderId),
);
assert.equal(new Set([...direct, ...semifinal]).size, 6);

// Final: the direct riders, then the best 2 of the semi-final (once it is ridden).
assert.deepEqual(finalists(direct, undefined, def.stages), direct);
const semifinalHeat = heatOf(21, "semifinal", semifinal);
const inFinal = finalists(direct, semifinalHeat, def.stages);
assert.equal(inFinal.length, 4);
assert.deepEqual(inFinal.slice(2), [semifinal[0], semifinal[1]]); // power order = ranking order here
const finalHeat = heatOf(22, "final", inFinal);

// Tournament points: regular + final; the semi-final is shown but does not count.
const points = tournamentPoints([...regular, semifinalHeat, finalHeat], ids, def.scoring);
for (const id of ids) {
  const row = points.get(id)!;
  assert.equal(row.total, row.regular + row.final);
}
const winner = points.get(inFinal[0]!)!;
assert.equal(winner.final, 3);
assert.equal(points.get(semifinal[0]!)!.semifinal, 3);
assert.equal(points.get(semifinal[3]!)!.total, points.get(semifinal[3]!)!.regular); // dropped out
assert.equal(points.get(ranking[15]!.riderId)!.total, 0);

// Cycle table: the sum of the tournaments, ties by tournament wins, not ridden = null.
const t = (entries: Record<string, number>) => new Map(Object.entries(entries));
const cycle = cycleTable(
  ["a", "b", "c"],
  [t({ a: 8, b: 10, c: 4 }), t({ a: 8, b: 10, c: 4 }), t({ a: 8, b: 4, c: 2 })],
);
assert.deepEqual(
  cycle.map((row) => [row.riderId, row.total, row.wins, row.rank]),
  [
    ["b", 24, 2, 1],
    ["a", 24, 1, 2],
    ["c", 10, 0, 3],
  ],
);
const partial = cycleTable(["a", "b"], [t({ a: 5, b: 9 }), null, undefined]);
assert.deepEqual(
  partial.map((row) => row.perTournament),
  [
    [9, null, null],
    [5, null, null],
  ],
);
assert.equal(partial[0]!.riderId, "b");

console.log("individual rules ok");
