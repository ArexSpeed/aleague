import { cache } from "react";

import { CLUBS, CUP_DEFINITION, CUP_PLAN, SEASON_FIXTURES } from "@/sports/speedway/data/season";
import { matchScore } from "@/sports/speedway/engine/v1";

import { FIXTURE_BY_ID } from "../match-setup";
import { readMatchesByPrefix, type StoredMatch } from "../results-store";
import { isFinished } from "../stats";
import { cupFixtureId, parseCupFixtureId } from "./fixtures";
import { fixtureParticipants, resolveCup, type CupState } from "./resolve";
import { buildSeedRank } from "./seed-rank";
import { resolveSeeded, type SeededResult } from "./seeded";

/** Only the cup and the leagues it needs for seeding: no full-season read. */
const PREFIXES = ["cup-", ...CUP_DEFINITION.leagues.map((league) => `${league}-`)];

export type CupRuntime = {
  state: CupState;
  matches: Record<string, StoredMatch>;
  participants: Map<string, { homeId: string; awayId: string }>;
  seeded: SeededResult;
};

/** The whole cup from the stored results. Cached per request. */
export const getCupRuntime = cache(async (): Promise<CupRuntime> => {
  const matches = await readMatchesByPrefix(PREFIXES);
  const seeded = resolveSeeded(CUP_DEFINITION, SEASON_FIXTURES, matches, CLUBS);
  const state = resolveCup({
    def: CUP_DEFINITION,
    plan: CUP_PLAN,
    clubs: CLUBS,
    seeded,
    scoreOf: (id) => {
      const match = matches[id];
      return match && isFinished(match) ? matchScore(match.heats) : null;
    },
    seedRank: buildSeedRank(CUP_DEFINITION, SEASON_FIXTURES, matches, CLUBS),
  });

  const participants = fixtureParticipants(state);
  // A started match keeps the clubs it was created with.
  for (const [id, match] of Object.entries(matches)) {
    if (id.startsWith("cup-") && match.homeId && match.awayId) {
      participants.set(id, { homeId: match.homeId, awayId: match.awayId });
    }
  }
  return { state, matches, participants, seeded };
});

export type ResolvedFixture =
  | { ok: true; homeId: string; awayId: string }
  | { ok: false; error: string };

/**
 * The one place that says who plays a fixture and whether it can be played now.
 * League fixtures answer from the fixture itself, cup fixtures from the draw.
 */
export async function resolveFixture(fixtureId: string): Promise<ResolvedFixture> {
  const fixture = FIXTURE_BY_ID.get(fixtureId);
  if (!fixture) return { ok: false, error: `Unknown fixture ${fixtureId}` };
  if (fixture.homeId && fixture.awayId) return { ok: true, homeId: fixture.homeId, awayId: fixture.awayId };

  const id = parseCupFixtureId(fixtureId);
  if (!id) return { ok: false, error: `Fixture ${fixtureId} has no participants` };

  const { state, matches, participants } = await getCupRuntime();
  const clubs = participants.get(fixtureId);
  if (!clubs) {
    const group = state.rounds
      .find((round) => round.round.id === id.round)
      ?.groups.find((g) => g.plan.id === id.group);
    const reason = group?.status === "pending" ? group.missing : "waiting for the draw";
    return { ok: false, error: `Draw pending: ${reason}` };
  }

  const started = matches[fixtureId];
  if (!started && id.leg > 1) {
    const previous = matches[cupFixtureId(id.round, id.group, id.pair, id.leg - 1)];
    if (!previous || !isFinished(previous)) {
      return { ok: false, error: `Play leg ${id.leg - 1} of this pair first` };
    }
  }
  return { ok: true, ...clubs };
}

/** A cup match cannot be taken back once something that depends on it has started. */
export async function canRewind(fixtureId: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const id = parseCupFixtureId(fixtureId);
  if (!id) return { ok: true };

  const { matches } = await getCupRuntime();
  for (const [otherId, match] of Object.entries(matches)) {
    if (match.heats.length === 0) continue;
    const other = parseCupFixtureId(otherId);
    if (!other) continue;
    const laterRound = other.roundNumber > id.roundNumber;
    const laterLeg =
      other.roundNumber === id.roundNumber &&
      other.group === id.group &&
      other.pair === id.pair &&
      other.leg > id.leg;
    if (laterRound || laterLeg) {
      return { ok: false, error: `Cannot take this back: ${otherId} has already started` };
    }
  }
  return { ok: true };
}