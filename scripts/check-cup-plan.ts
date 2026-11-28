import assert from "node:assert/strict";

import { CUP_FIXTURES, CUP_PLAN } from "../sports/speedway/data/season";
import { rangeSize, splitGroup } from "../sports/speedway/sim/cup/plan";

const pairs = CUP_PLAN.map((r) => r.groups.reduce((sum, g) => sum + g.pairs, 0));
console.table(
  CUP_PLAN.map((r, i) => ({ round: r.round.id, groups: r.groups.map((g) => g.id).join(" "), pairs: pairs[i] })),
);

// Rounds, pairs, fixtures (acceptance criteria).
assert.deepEqual(pairs, [16, 24, 24, 24, 24, 16]);
assert.equal(CUP_FIXTURES.length, 256);
assert.equal(new Set(CUP_FIXTURES.map((f) => f.id)).size, CUP_FIXTURES.length);
assert.equal(CUP_FIXTURES.filter((f) => f.leg === 1).length, CUP_FIXTURES.filter((f) => f.leg === 2).length);
for (const f of CUP_FIXTURES) {
  assert.equal(f.competitionId, "cup-cup");
  assert.match(f.id, /^cup-r[1-6]-(qual|\d+-\d+)-\d+-[12]$/);
}

// Every club has exactly one pair per round until its places are decided.
const sizes = CUP_PLAN.slice(1).map((r) => r.groups.reduce((sum, g) => sum + rangeSize(g.range!), 0));
assert.deepEqual(sizes.slice(0, 4), Array(4).fill(sizes[0]));
console.log("clubs per round (r2..r6):", sizes);

// Groups of a round never overlap.
for (const r of CUP_PLAN.slice(1)) {
  const ranges = r.groups.map((g) => g.range!).sort((a, b) => a.from - b.from);
  ranges.forEach((range, i) => i > 0 && assert.ok(range.from > ranges[i - 1]!.to, `overlap in ${r.round.id}`));
}

// splitGroup.
assert.deepEqual(splitGroup({ from: 1, to: 16 }), {
  winners: { from: 1, to: 8 },
  losers: { from: 9, to: 16 },
});
assert.deepEqual(splitGroup({ from: 47, to: 48 }), {
  winners: { from: 47, to: 47 },
  losers: { from: 48, to: 48 },
});
assert.throws(() => splitGroup({ from: 1, to: 3 }));

console.log("cup plan OK");