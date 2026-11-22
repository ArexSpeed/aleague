import { z } from "zod";

export const fixtureSchema = z.object({
  id: z.string(),
  /** east-gold, west-silver, ... */
  competitionId: z.string(),
  matchday: z.number(),
  /** YYYY-MM-DD */
  date: z.string(),
  /** HH:MM, local time */
  time: z.string(),
  homeId: z.string(),
  awayId: z.string(),
  stadium: z.string(),
  /** null until the match is played */
  homeScore: z.number().nullable(),
  awayScore: z.number().nullable(),
});

export type Fixture = z.infer<typeof fixtureSchema>;

export const teamRefSchema = z.object({
  id: z.string(),
  name: z.string(),
  subName: z.string().optional(),
  short: z.string(),
  color: z.string(),
  badgeIcon: z.string().optional(),
});

export const fixtureWithTeamsSchema = fixtureSchema.extend({
  home: teamRefSchema,
  away: teamRefSchema,
});

export type TeamRef = z.infer<typeof teamRefSchema>;
export type FixtureWithTeams = z.infer<typeof fixtureWithTeamsSchema>;
