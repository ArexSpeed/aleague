import assert from "node:assert/strict";

import { CLUBS, CUP_DEFINITION, CUP_FIXTURES, SEASON_FIXTURES } from "../sports/speedway/data/season";
import { finishMatch } from "../sports/speedway/engine/v1";
import { clubRiders, newStoredMatch, setupOf } from "../sports/speedway/sim/match-setup";
import type { StoredMatch } from "../sports/speedway/sim/results-store";
import { computeRiderStats, isLeagueFixture, type FixtureFilter } from "../sports/speedway/sim/stats";

const isCup: FixtureFilter = (fixture) => fixture.competitionId === CUP_DEFINITION.id;

function finished(match: StoredMatch): StoredMatch {
  return { ...match, heats: finishMatch(setupOf(match), match.heats) };
}

// One cup match between two drawn clubs and one league match (its clubs may overlap on purpose).
const cupFixture = CUP_FIXTURES[0]!;
assert.equal(cupFixture.competitionId, CUP_DEFINITION.id);
const [home, away] = CLUBS.filter((club) => CUP_DEFINITION.leagues.includes(club.leagueId));
const cupMatch = finished(newStoredMatch(cupFixture.id, 0, { homeId: home!.id, awayId: away!.id }));

const leagueFixture = SEASON_FIXTURES.find((f) => f.stage === "regular" && f.competitionId === "east-gold")!;
const leagueMatch = finished(newStoredMatch(leagueFixture.id, 0));

const cupOnly = { [cupMatch.fixtureId]: cupMatch };
const leagueOnly = { [leagueMatch.fixtureId]: leagueMatch };
const both = { ...cupOnly, ...leagueOnly };

// 1. Before any match: nothing counted (the API fills the zeros in).
assert.equal(computeRiderStats({}, isCup).size, 0);

// 2. Cup match: only riders of the two clubs, and the numbers match the stored heats.
const cup = computeRiderStats(cupOnly, isCup);
const clubIds = new Set([...clubRiders(home!.id), ...clubRiders(away!.id)].map((r) => r.id));
assert.ok(cup.size > 0);
for (const id of cup.keys()) assert.ok(clubIds.has(id), `rider ${id} is not from the cup match clubs`);

const expectedPoints = new Map<string, number>();
for (const heat of cupMatch.heats) {
  for (const r of heat.riders) expectedPoints.set(r.riderId, (expectedPoints.get(r.riderId) ?? 0) + r.points);
}
for (const [id, stats] of cup) {
  assert.equal(stats.points, expectedPoints.get(id), `points of ${id}`);
  assert.equal(stats.matches, 1);
}

// 3. Home and away columns: a rider rides on one side only in one match.
for (const id of clubRiders(home!.id).map((r) => r.id)) {
  const stats = cup.get(id);
  if (stats) assert.equal(stats.away.heats, 0);
}
for (const id of clubRiders(away!.id).map((r) => r.id)) {
  const stats = cup.get(id);
  if (stats) assert.equal(stats.home.heats, 0);
}

// 4. A league match does not change the cup, and a cup match does not change the league.
assert.equal(computeRiderStats(leagueOnly, isCup).size, 0);
assert.deepEqual(computeRiderStats(both, isCup), computeRiderStats(cupOnly, isCup));
assert.equal(computeRiderStats(cupOnly, isLeagueFixture).size, 0);
assert.deepEqual(computeRiderStats(both, isLeagueFixture), computeRiderStats(leagueOnly, isLeagueFixture));
assert.deepEqual(computeRiderStats(both), computeRiderStats(leagueOnly)); // default filter = league

console.log("cup stats OK");