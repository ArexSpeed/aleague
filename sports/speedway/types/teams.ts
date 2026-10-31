import { z } from "zod";

/** Clubs and national teams share one shape: the Teams page and its aside treat them alike. */

export const divisionSchema = z.enum(["west-gold", "east-gold", "west-silver", "east-silver"]);

const medalsSchema = z.object({ gold: z.number(), silver: z.number(), bronze: z.number() });

export const trophiesSchema = z.object({
  league: medalsSchema,
  cup: medalsSchema,
  supercup: medalsSchema,
  pairs: medalsSchema,
  fours: medalsSchema,
});

export const teamEntrySchema = z.object({
  id: z.string(),
  kind: z.enum(["club", "nation"]),
  name: z.string(),
  subName: z.string(),
  short: z.string(),
  /** "Chelsea London" */
  fullName: z.string(),
  color: z.string(),
  icon: z.string(),
  region: z.string(),
  city: z.string(),
  /** Clubs only. */
  division: divisionSchema.optional(),
  stadium: z.object({
    name: z.string(),
    capacity: z.number(),
    /** metres */
    trackLength: z.number(),
    surface: z.string(),
    record: z.object({ time: z.number(), rider: z.string(), year: z.number() }),
  }),
  coach: z.string(),
  president: z.string(),
  founded: z.number(),
  description: z.string(),
  /** % of matches won */
  winRate: z.number(),
  stats: z.object({
    /** % of heats ended 3:3 or better */
    heatWins33: z.number(),
    avgMatch: z.number(),
    /** 5:1 heats */
    cleanHeats: z.number(),
    falls: z.number(),
  }),
  trophies: trophiesSchema,
  history: z.array(z.object({ year: z.number(), title: z.string(), result: z.string() })),
});

export type Division = z.infer<typeof divisionSchema>;
export type Trophies = z.infer<typeof trophiesSchema>;
export type TeamEntry = z.infer<typeof teamEntrySchema>;
