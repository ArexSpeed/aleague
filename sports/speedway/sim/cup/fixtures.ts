import type { CupDefinition, CupFixture } from "@/sports/speedway/types/cup";

import type { CupRoundPlan } from "./plan";

export const cupFixtureId = (round: string, group: string, pair: number, leg: number) =>
  `cup-${round}-${group}-${pair}-${leg}`;

/** Every cup match, generated from the plan. No static file. */
export function generateCupFixtures(def: CupDefinition, plan: CupRoundPlan[]): CupFixture[] {
  const fixtures: CupFixture[] = [];

  for (const { round, number, groups } of plan) {
    for (const group of groups) {
      for (let pair = 1; pair <= group.pairs; pair++) {
        for (let leg = 1; leg <= def.legs; leg++) {
          fixtures.push({
            id: cupFixtureId(round.id, group.id, pair, leg),
            competitionId: def.id,
            stage: round.id,
            group: group.id,
            matchday: number,
            // No calendar yet (separate task), 0 = not scheduled.
            week: 0,
            // Filled in by the draw.
            homeId: "",
            awayId: "",
            pair,
            leg: leg as 1 | 2,
          });
        }
      }
    }
  }
  return fixtures;
}

export type ParsedCupFixtureId = {
  round: string;
  roundNumber: number;
  group: string;
  pair: number;
  leg: number;
};

const CUP_ID = /^cup-(r(\d+))-(qual|\d+-\d+)-(\d+)-(\d+)$/;

export function parseCupFixtureId(id: string): ParsedCupFixtureId | null {
  const match = CUP_ID.exec(id);
  if (!match) return null;
  return {
    round: match[1]!,
    roundNumber: Number(match[2]),
    group: match[3]!,
    pair: Number(match[4]),
    leg: Number(match[5]),
  };
}