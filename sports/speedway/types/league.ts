import { z } from "zod";

/** Schemas are the source of truth; TS types are derived from them. */

export const teamMatchSchema = z.object({
  round: z.string(),
  opp: z.string(),
  oppName: z.string(),
  res: z.enum(["W", "L", "D"]),
  pts: z.number(),
  oppPts: z.number(),
});

export const venueStatsSchema = z.object({
  games: z.number(),
  won: z.number(),
  draw: z.number(),
  lose: z.number(),
  pts: z.number(),
  ptsPlus: z.number(),
  ptsMinus: z.number(),
  bilans: z.number(),
});

export const leagueTeamSchema = z.object({
  id: z.string(),
  name: z.string(),
  subName: z.string(),
  short: z.string(),
  color: z.string(),
  colorGradient: z.string(),
  badgeIcon: z.string(),
  pos: z.number(),
  games: z.number(),
  pointsPlus: z.number(),
  pointsMinus: z.number(),
  bilans: z.number(),
  won: z.number(),
  draw: z.number(),
  lose: z.number(),
  bonus: z.number(),
  points: z.number(),
  home: venueStatsSchema,
  away: venueStatsSchema,
  matches: z.array(teamMatchSchema),
});

export const riderTelemetrySchema = z.object({
  matches: z.number(),
  heats: z.number(),
  avgMatch: z.number(),
  avgHeat: z.number(),
  bonus: z.number(),
  points: z.number(),
  firsts: z.number(),
  seconds: z.number(),
  thirds: z.number(),
  fourths: z.number(),
  w: z.number(), // exclusions
  d: z.number(), // defects
  t: z.number(), // tape
});

export const leagueRiderSchema = riderTelemetrySchema.extend({
  id: z.string(),
  pos: z.number(),
  name: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.string(),
  teamId: z.string(),
  teamName: z.string(),
  teamSubName: z.string(),
  teamColor: z.string(),
  teamIcon: z.string(),
  home: riderTelemetrySchema,
  away: riderTelemetrySchema,
});

export type TeamMatch = z.infer<typeof teamMatchSchema>;
export type VenueStats = z.infer<typeof venueStatsSchema>;
export type LeagueTeam = z.infer<typeof leagueTeamSchema>;
export type RiderTelemetry = z.infer<typeof riderTelemetrySchema>;
export type LeagueRider = z.infer<typeof leagueRiderSchema>;

export const riderSkillsSchema = z.object({
  strength: z.number(),
  technique: z.number(),
  fighting: z.number(),
  reflex: z.number(),
  condition: z.number(),
});

export type RiderSkills = z.infer<typeof riderSkillsSchema>;
export type LeagueRiderWithSkills = LeagueRider & { skills: RiderSkills };
