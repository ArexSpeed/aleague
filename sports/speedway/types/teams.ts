import { z } from "zod";

/** Clubs and national teams share one shape: the Teams page and its aside treat them alike. */

export const divisionSchema = z.enum([
  "west-gold",
  "east-gold",
  "west-silver",
  "east-silver",
]);

export const clubLeagueSchema = z.enum([
  "west-gold",
  "east-gold",
  "west-silver",
  "east-silver",
]);

const medalsSchema = z.object({ gold: z.number(), silver: z.number(), bronze: z.number() });

export const trophiesSchema = z.object({
  league: medalsSchema,
  cup: medalsSchema,
  supercup: medalsSchema,
  pairs: medalsSchema,
  fours: medalsSchema,
});

export const clubCardDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  subName: z.string(),
  short: z.string(),
  fullName: z.string().optional(),
  color: z.string(),
  icon: z.string().optional(),
  region: z.string().optional(),
  city: z.string().optional(),
  leagueId: clubLeagueSchema,
  leagueLabel: z.string(),
  stadium: z
    .object({
      name: z.string().optional(),
      capacity: z.number().optional(),
    })
    .optional(),
  coach: z.string().optional(),
  trackLength: z.number().optional(),
  surface: z.string().optional(),
  trackRecord: z
    .object({ time: z.number(), rider: z.string().optional(), year: z.number().optional() })
    .optional(),
  winRate: z.number().optional(),
  trophies: trophiesSchema.optional(),
  href: z.string(),
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

const nationMedalsSchema = z.object({
  gold: z.number().optional(),
  silver: z.number().optional(),
  bronze: z.number().optional(),
});

export const nationCardDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
  color: z.string(),
  stadiumName: z.string().optional(),
  trackLength: z.number().nullable().optional(),
  surface: z.string().nullable().optional(),
  trackRecord: z
    .object({
      time: z.number().nullable().optional(),
      rider: z.string().nullable().optional(),
      year: z.number().nullable().optional(),
    })
    .nullable()
    .optional(),
  trophies: z
    .object({
      league: nationMedalsSchema,
      cup: nationMedalsSchema,
      junior: nationMedalsSchema,
      pair: nationMedalsSchema,
      fourTeam: nationMedalsSchema,
    })
    .optional(),
  href: z.string().optional(),
});

export type Division = z.infer<typeof divisionSchema>;
export type ClubLeague = z.infer<typeof clubLeagueSchema>;
export type ClubLeagueFilter = ClubLeague;
export type ClubCardData = z.infer<typeof clubCardDataSchema>;
export type Trophies = z.infer<typeof trophiesSchema>;
export type TeamEntry = z.infer<typeof teamEntrySchema>;
export type NationCardData = z.infer<typeof nationCardDataSchema>;
