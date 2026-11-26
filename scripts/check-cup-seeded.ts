import assert from "node:assert/strict";

import { CLUBS, CUP_DEFINITION, SEASON_FIXTURES } from "../sports/speedway/data/season";
import { finishMatch } from "../sports/speedway/engine/v1";
import { newStoredMatch, setupOf } from "../sports/speedway/sim/match-setup";
import type { StoredMatch } from "../sports/speedway/sim/results-store";
import { resolveSeeded } from "../sports/speedway/sim/cup/seeded";
import { snapshotMatchdays } from "../sports/speedway/sim/cup/seeding";
import { standingsAsOfRound } from "../sports/speedway/sim/standings";

const snapshots = snapshotMatchdays(CUP_DEFINITION, SEASON_FIXTURES);
console.log(snapshots);

function play(limit: (leagueId: string, matchday: number) => boolean) {
  const matches: Record<string, StoredMatch> = {};
  for (const fixture of SEASON_FIXTURES) {
    if (fixture.stage !== "regular" || !limit(fixture.competitionId, fixture.matchday)) continue;
    const match = newStoredMatch(fixture.id, 0);
    match.heats = finishMatch(setupOf(match), match.heats);
    matches[fixture.id] = match;
  }
  return matches;
}

const matchdayOf = (leagueId: string) => snapshots.find((s) => s.leagueId === leagueId)!.matchday;

// One round short in East Gold: still pending, and it says what is missing.
const early = play((league, day) =>
  league === "east-gold" ? day < matchdayOf(league) : league === "west-gold" && day <= matchdayOf(league),
);
const pending = resolveSeeded(CUP_DEFINITION, SEASON_FIXTURES, early, CLUBS);
assert.equal(pending.status, "pending");
console.log(pending);

// Both leagues at the snapshot: 16 different clubs, the top of each table.
const ready = play((league, day) => snapshots.some((s) => s.leagueId === league && day <= s.matchday));
const result = resolveSeeded(CUP_DEFINITION, SEASON_FIXTURES, ready, CLUBS);
assert.equal(result.status, "ready");
if (result.status === "ready") {
  assert.equal(result.clubs.length, 16);
  assert.equal(new Set(result.clubs.map((c) => c.clubId)).size, 16);
  for (const { leagueId, count } of CUP_DEFINITION.seeding.seeded) {
    const table = standingsAsOfRound(leagueId, "regular", matchdayOf(leagueId), SEASON_FIXTURES, ready, CLUBS);
    const expected = table.rows.slice(0, count).map((r) => r.clubId).sort();
    const got = result.clubs.filter((c) => c.leagueId === leagueId).map((c) => c.clubId).sort();
    assert.deepEqual(got, expected);
  }
  console.table(result.clubs);
}

console.log("cup seeded OK");