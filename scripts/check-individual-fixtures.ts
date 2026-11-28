import assert from "node:assert/strict";

import {
  INDIVIDUAL_DEFINITION,
  INDIVIDUAL_FIXTURES,
  NATIONS,
} from "../sports/speedway/data/season";
import { parseIndividualFixtureId } from "../sports/speedway/sim/individual/fixtures";

// 8 nations x 2 divisions x 3 tournaments (acceptance criteria).
assert.equal(INDIVIDUAL_FIXTURES.length, 48);
assert.equal(new Set(INDIVIDUAL_FIXTURES.map((f) => f.id)).size, 48);

for (const f of INDIVIDUAL_FIXTURES) {
  assert.equal(f.competitionId, "individual-country");
  assert.match(f.id, /^individual-country-[a-z]{3}-(junior|open)-t[1-3]$/);
  assert.deepEqual(parseIndividualFixtureId(f.id), {
    competitionId: f.competitionId,
    country: f.country,
    division: f.division,
    tournament: f.tournament,
  });
}

// Every cycle has exactly `tournaments` tournaments numbered 1..n.
for (const nation of NATIONS) {
  for (const division of INDIVIDUAL_DEFINITION.divisions) {
    const cycle = INDIVIDUAL_FIXTURES.filter(
      (f) => f.country === nation.code.toLowerCase() && f.division === division,
    );
    assert.deepEqual(
      cycle.map((f) => f.tournament),
      Array.from({ length: INDIVIDUAL_DEFINITION.tournaments }, (_, i) => i + 1),
    );
  }
}

assert.equal(parseIndividualFixtureId("cup-r1-qual-1-1"), null);
assert.equal(parseIndividualFixtureId("individual-country-ark-senior-t1"), null);

console.log("individual fixtures ok:", INDIVIDUAL_FIXTURES.length);
