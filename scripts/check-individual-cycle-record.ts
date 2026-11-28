import assert from "node:assert/strict";

import { INDIVIDUAL_DEFINITION, RIDERS } from "../sports/speedway/data/season";
import {
  cyclePrefix,
  cycleRecordId,
  cycleRidersProblems,
  isCycleLocked,
} from "../sports/speedway/sim/individual/cycle-record";
import { divisionPool } from "../sports/speedway/sim/individual/definition";
import { cycleRecordSchema, tournamentRecordSchema } from "../sports/speedway/types/individual";

const N = INDIVIDUAL_DEFINITION.ridersPerTournament;

assert.equal(
  cycleRecordId("individual-country", "ARK", "open"),
  "individual-country-ark-open-cycle",
);
assert.equal(cyclePrefix("individual-country", "ARK", "junior"), "individual-country-ark-junior-");

const pool = divisionPool(RIDERS, "ARK", "junior").map((rider) => rider.id);
assert.deepEqual(cycleRidersProblems(pool.slice(0, N), RIDERS, "ARK", "junior", N), []);
assert.ok(cycleRidersProblems(pool.slice(0, N - 1), RIDERS, "ARK", "junior", N).length > 0);
assert.ok(
  cycleRidersProblems([...pool.slice(0, N - 1), pool[0]!], RIDERS, "ARK", "junior", N).length > 0,
);
assert.ok(
  cycleRidersProblems([...pool.slice(0, N - 1), "nobody"], RIDERS, "ARK", "junior", N).length > 0,
);

assert.equal(isCycleLocked([]), false);
assert.equal(isCycleLocked([{ heats: [] }]), false);
const heat = {
  number: 1,
  stage: "regular" as const,
  riders: pool.slice(0, 4).map((riderId, i) => ({ riderId, position: i + 1 })),
};
assert.equal(isCycleLocked([{ heats: [heat] }]), true);

cycleRecordSchema.parse({
  riderIds: pool.slice(0, N),
  selectedAt: new Date().toISOString(),
  manual: false,
});
tournamentRecordSchema.parse({ heats: [heat] });
console.log("individual cycle record ok");
