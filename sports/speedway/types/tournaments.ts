import { z } from "zod";

export const competitionFormatTypeSchema = z.enum([
  "double-round-robin",
  "split",
  "multi-team-group-rounds",
]);

export type CompetitionFormatType = z.infer<typeof competitionFormatTypeSchema>;

export const tournamentWildcardSchema = z.object({
  groupRank: z.number(),
  count: z.number(),
  criterion: z.literal("points"),
});

export type TournamentWildcard = z.infer<typeof tournamentWildcardSchema>;

export const tournamentRoundDefSchema = z.object({
  id: z.string(),
  label: z.string(),
  groupCount: z.number(),
  groupSize: z.number(),
  advancePerGroup: z.number(),
  wildcard: tournamentWildcardSchema.optional(),
});

export type TournamentRoundDef = z.infer<typeof tournamentRoundDefSchema>;

export const tournamentDefSchema = z.object({
  id: z.string(),
  competition: z.enum(["tournaments-fours", "tournaments-pairs"]),
  name: z.string(),
  formatType: z.literal("multi-team-group-rounds"),
  groupingMethod: z.literal("seeded-pots"),
  rankingSource: z.literal("league-rank"),
  manualClubOrder: z.array(z.string()).optional(),
  matchOrderCriterion: z.literal("points"),
  lineup: z.record(z.string(), z.unknown()).nullable().optional(), // TODO: lineup rules
  seeds: z.record(z.string(), z.string()),
  rounds: z.array(tournamentRoundDefSchema),
});

export type TournamentDef = z.infer<typeof tournamentDefSchema>;

export const tournamentFixtureSlotSchema = z.object({
  slot: z.number(),
  pot: z.number(),
  clubId: z.string().nullable(),
  name: z.string(),
  subName: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  points: z.number().nullable(),
  rank: z.number().nullable(),
  advancing: z.boolean().optional(),
  wildcard: z.boolean().optional(),
});

export type TournamentFixtureSlot = z.infer<typeof tournamentFixtureSlotSchema>;

export const tournamentFixtureSchema = z.object({
  id: z.string(),
  competition: z.string(),
  round: z.string(),
  group: z.number(),
  groupLabel: z.string(),
  slots: z.array(tournamentFixtureSlotSchema),
  status: z.enum(["pending", "scheduled", "completed"]),
});

export type TournamentFixture = z.infer<typeof tournamentFixtureSchema>;
