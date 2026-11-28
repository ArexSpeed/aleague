import assert from "node:assert/strict";

import { INDIVIDUAL_DEFINITION, NATIONS, RIDERS } from "../sports/speedway/data/season";
import { divisionPool } from "../sports/speedway/sim/individual/definition";
import { selectRiders, skillsMean } from "../sports/speedway/sim/individual/select";

const { selection, ridersPerTournament: N } = INDIVIDUAL_DEFINITION;
const riderById = new Map(RIDERS.map((rider) => [rider.id, rider]));

// Selection without stats = skills ranking, right pool, no duplicates (every nation x division).
for (const nation of NATIONS) {
  for (const division of INDIVIDUAL_DEFINITION.divisions) {
    const ids = selectRiders({
      riders: RIDERS,
      country: nation.code,
      division,
      stats: new Map(),
      selection,
      count: N,
    });
    assert.equal(ids.length, N);
    assert.equal(new Set(ids).size, N);
    for (const id of ids) {
      const rider = riderById.get(id)!;
      assert.equal(rider.nation, nation.code);
      if (division === "junior") assert.ok(rider.age <= 21, `${id} is not a junior`);
    }
    const expected = divisionPool(RIDERS, nation.code, division)
      .sort((a, b) => skillsMean(b) - skillsMean(a) || a.id.localeCompare(b.id))
      .slice(0, N)
      .map((rider) => rider.id);
    assert.deepEqual(ids, expected);
  }
}

// Season stats: riders with enough heats rank by avgHeat, the rest follow by skills.
const pool = divisionPool(RIDERS, "ARK", "open").sort((a, b) => skillsMean(b) - skillsMean(a));
const weak = pool[pool.length - 1]!;
const star1 = pool[30]!;
const star2 = pool[31]!;
const lucky = pool[40]!;
const stats = new Map([
  [weak.id, { heats: 30, avgHeat: 2.4 }],
  [star1.id, { heats: 25, avgHeat: 2.0 }],
  [star2.id, { heats: 40, avgHeat: 2.0 }],
  [lucky.id, { heats: 3, avgHeat: 3.0 }],
]);
const pick = (override?: string[]) =>
  selectRiders({
    riders: RIDERS,
    country: "ark",
    division: "open",
    stats,
    selection,
    count: N,
    override,
  });

const ids = pick();
assert.equal(ids[0], weak.id); // best average wins, whatever the skills
assert.deepEqual(new Set([ids[1], ids[2]]), new Set([star1.id, star2.id])); // tie -> skills decide
assert.ok(!ids.includes(lucky.id) || ids.indexOf(lucky.id) > 2); // 3 heats < minHeats
assert.equal(ids[3], pool[0]!.id); // then the skills order
assert.deepEqual(ids, pick()); // deterministic

// Override wins; a pool smaller than the cycle throws.
assert.deepEqual(pick(["a", "b"]), ["a", "b"]);
assert.throws(() =>
  selectRiders({
    riders: RIDERS.slice(0, 5),
    country: "ark",
    division: "open",
    stats,
    selection,
    count: N,
  }),
);

console.log("individual country ok");
