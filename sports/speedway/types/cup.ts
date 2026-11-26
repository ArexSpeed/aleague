import { z } from "zod";
import type { Fixture } from "@/sports/speedway/data/schema";

const positiveInt = z.number().int().positive();
const leagueId = z.string().min(1);

export const cupRoundSchema = z.object({
  /** r1, r2, ... in order, used in match ids (cup-<round>-<group>-<pair>-<leg>). */
  id: z.string().regex(/^r[1-9]\d*$/),
  label: z.string().min(1),
});

const basketSchema = z.object({
  id: z.string().min(1),
  leagues: z.array(leagueId).min(1),
});

export const cupDefinitionSchema = z
  .object({
    id: z.literal("cup-cup"),
    format: z.literal("classification-knockout"),
    /** Legs per pair. Ids only know leg 1 and 2. */
    legs: positiveInt.max(2),
    /** Leagues whose clubs all play the cup. */
    leagues: z.array(leagueId).min(2),
    rounds: z.array(cupRoundSchema).min(2),
    seeding: z.object({
      /** Table snapshot: this share of the stage's matchdays must be played (0.5 = half of the regular stage). */
      snapshot: z.object({ stage: z.string().min(1), share: z.number().gt(0).lte(1) }),
      /** How many clubs of each league are seeded (start in round 2). */
      seeded: z.array(z.object({ leagueId, count: positiveInt })).min(1),
    }),
    /** Round 1 draw: every club of the first basket draws an opponent from the second, the rest of the second pair among themselves. */
    qualDraw: z.object({ baskets: z.tuple([basketSchema, basketSchema]) }),
    /** Base seed; each draw uses `<seed>-<round>-<group>`. */
    seed: z.string().min(1),
    pairResult: z.object({ rule: z.literal("sum-of-heat-points") }),
    tie: z.object({ resolution: z.literal("runoff"), fallback: z.literal("seed-rank") }),
    notes: z.array(z.string()).default([]),
  })
  .superRefine((def, ctx) => {
    const issue = (message: string, path: (string | number)[]) =>
      ctx.addIssue({ code: "custom", message, path });

    def.rounds.forEach((round, i) => {
      if (round.id !== `r${i + 1}`) issue(`expected "r${i + 1}"`, ["rounds", i, "id"]);
    });

    const inCup = new Set(def.leagues);
    if (inCup.size !== def.leagues.length) issue("duplicate league", ["leagues"]);

    const seen = new Set<string>();
    def.seeding.seeded.forEach((entry, i) => {
      if (!inCup.has(entry.leagueId)) issue("league is not in the cup", ["seeding", "seeded", i]);
      if (seen.has(entry.leagueId)) issue("league listed twice", ["seeding", "seeded", i]);
      seen.add(entry.leagueId);
    });

    const inBaskets = def.qualDraw.baskets.flatMap((basket) => basket.leagues);
    if (
      inBaskets.length !== inCup.size ||
      new Set(inBaskets).size !== inBaskets.length ||
      inBaskets.some((league) => !inCup.has(league))
    ) {
      issue("baskets must split the cup leagues, each league exactly once", ["qualDraw", "baskets"]);
    }
  });

export type CupRound = z.infer<typeof cupRoundSchema>;
export type CupDefinition = z.infer<typeof cupDefinitionSchema>;
export type CupFixture = Fixture & { pair: number; leg: 1 | 2 };
export type CupPairState = "pending" | "leg1-played" | "decided" | "needs-runoff";