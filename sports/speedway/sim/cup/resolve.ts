import type { Club } from "@/sports/speedway/data/schema";
import type { CupDefinition, CupPairState, CupRound } from "@/sports/speedway/types/cup";

import { drawGroupPairs, drawRound1, drawRound2Main, drawSeed, type DrawResult } from "./draw";
import { cupFixtureId } from "./fixtures";
import { QUAL_GROUP, type CupGroupPlan, type CupRoundPlan } from "./plan";
import type { SeededResult } from "./seeded";

export type Score = { home: number; away: number };
/** Final score of a played match, null while it is not finished. */
export type ScoreOf = (fixtureId: string) => Score | null;
/** Lower = better seed. Only used to break a tie until the run-off heat exists. */
export type SeedRank = (clubId: string) => number;

export type PairResult = {
  state: CupPairState;
  /** Heat points over the legs finished so far. */
  totals: { first: number; second: number };
  /** Null until every leg is finished. With `needs-runoff` it is the temporary winner (better seed). */
  winner: string | null;
  loser: string | null;
};

/**
 * `first` hosts leg 1, `second` hosts leg 2. Legs count in order: a later leg is ignored while
 * an earlier one is missing. TODO: run-off heat (separate task) replaces the seed-rank fallback.
 */
export function resolvePair(
  first: string,
  second: string,
  legs: readonly (Score | null)[],
  seedRank: SeedRank,
): PairResult {
  const gap = legs.indexOf(null);
  const played = legs.slice(0, gap === -1 ? legs.length : gap) as Score[];

  const totals = { first: 0, second: 0 };
  played.forEach((score, index) => {
    const firstHosts = index % 2 === 0;
    totals.first += firstHosts ? score.home : score.away;
    totals.second += firstHosts ? score.away : score.home;
  });

  if (played.length === 0) return { state: "pending", totals, winner: null, loser: null };
  if (played.length < legs.length) return { state: "leg1-played", totals, winner: null, loser: null };

  const tie = totals.first === totals.second;
  const firstWins = tie ? seedRank(first) <= seedRank(second) : totals.first > totals.second;
  const [winner, loser] = firstWins ? [first, second] : [second, first];
  return { state: tie ? "needs-runoff" : "decided", totals, winner, loser };
}

export type CupPair = {
  number: number;
  first: string;
  second: string;
  /** In leg order; leg 1 is hosted by `first`, leg 2 by `second`. */
  fixtureIds: string[];
  result: PairResult;
};

export type CupGroupState = { plan: CupGroupPlan } & (
  | { status: "pending"; missing: string }
  | { status: "ready"; pairs: CupPair[]; /** Every pair has a winner (a tie counts, see `resolvePair`). */ complete: boolean }
);

export type CupState = { rounds: { round: CupRound; groups: CupGroupState[] }[] };

export type CupResolveInput = {
  def: CupDefinition;
  plan: CupRoundPlan[];
  clubs: readonly Club[];
  seeded: SeededResult;
  scoreOf: ScoreOf;
  seedRank: SeedRank;
};

type Outcome = { winners: string[]; losers: string[] };

/**
 * The whole cup from the seeding and the scores: draws, pairs, results and what each group
 * waits for. A group is drawn once the group it comes from has a winner in every pair.
 */
export function resolveCup({ def, plan, clubs, seeded, scoreOf, seedRank }: CupResolveInput): CupState {
  const seededIds = seeded.status === "ready" ? seeded.clubs.map((club) => club.clubId) : [];
  let previous = new Map<string, Outcome>();

  const drawGroup = (group: CupGroupPlan, index: number, seed: string): DrawResult => {
    if (!group.source) return drawRound1(def, clubs, seeded);

    const { groupId, side } = group.source;
    const from = previous.get(groupId)?.[side];
    if (!from) {
      const before = plan[index - 1]!.round.label;
      return {
        status: "pending",
        missing:
          groupId === QUAL_GROUP
            ? `Available after ${before} is played`
            : `Available after places ${groupId} are decided`,
      };
    }
    if (groupId === QUAL_GROUP && side === "winners") return drawRound2Main(seededIds, from, seed);
    return drawGroupPairs(from, group.pairs * 2, seed);
  };

  const rounds: CupState["rounds"] = [];
  for (const [index, { round, groups }] of plan.entries()) {
    const current = new Map<string, Outcome>();

    const states = groups.map((group): CupGroupState => {
      const drawn = drawGroup(group, index, drawSeed(def.seed, round.id, group.id));
      if (drawn.status === "pending") return { plan: group, status: "pending", missing: drawn.missing };

      const pairs = drawn.pairs.map((pair, i): CupPair => {
        const number = i + 1;
        const fixtureIds = Array.from({ length: def.legs }, (_, leg) =>
          cupFixtureId(round.id, group.id, number, leg + 1),
        );
        return {
          number,
          first: pair.first,
          second: pair.second,
          fixtureIds,
          result: resolvePair(pair.first, pair.second, fixtureIds.map(scoreOf), seedRank),
        };
      });

      const complete = pairs.every((pair) => pair.result.winner !== null);
      if (complete) {
        current.set(group.id, {
          winners: pairs.map((pair) => pair.result.winner!),
          losers: pairs.map((pair) => pair.result.loser!),
        });
      }
      return { plan: group, status: "ready", pairs, complete };
    });

    rounds.push({ round, groups: states });
    previous = current;
  }
  return { rounds };
}

/** Home and away club of every cup match whose pair is drawn. The one source for match views and actions. */
export function fixtureParticipants(state: CupState): Map<string, { homeId: string; awayId: string }> {
  const participants = new Map<string, { homeId: string; awayId: string }>();
  for (const { groups } of state.rounds) {
    for (const group of groups) {
      if (group.status !== "ready") continue;
      for (const pair of group.pairs) {
        pair.fixtureIds.forEach((id, leg) => {
          participants.set(
            id,
            leg % 2 === 0
              ? { homeId: pair.first, awayId: pair.second }
              : { homeId: pair.second, awayId: pair.first },
          );
        });
      }
    }
  }
  return participants;
}