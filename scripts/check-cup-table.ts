import assert from "node:assert/strict";

import { rankCupTable, type CupTableInput } from "../sports/speedway/sim/cup/table";

const row = (clubId: string, from: number, to: number, plus: number, minus: number): CupTableInput => ({
  clubId,
  range: { from, to },
  games: 2,
  won: 0,
  draw: 0,
  lost: 0,
  pointsPlus: plus,
  pointsMinus: minus,
});

const table = rankCupTable([
  row("C", 9, 16, 50, 60),
  row("A", 1, 8, 70, 50),
  row("B", 1, 8, 65, 40),
  row("D", 9, 16, 61, 50),
  row("W", 17, 17, 55, 60),
]);

assert.deepEqual(
  table.map((r) => [r.clubId, r.place, r.decided]),
  [
    ["B", 1, false], // balance +25 beats A (+20)
    ["A", 2, false],
    ["D", 9, false],
    ["C", 10, false],
    ["W", 17, true],
  ],
);

const waiting = rankCupTable([{ ...row("X", 1, 1, 0, 0), range: null }]);
assert.equal(waiting[0]!.place, null);

console.log("cup table OK");