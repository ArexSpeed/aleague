import { z } from "zod";

/** Schemas are the source of truth; TS types are derived from them. */

export const sideSchema = z.enum(["home", "away"]);
export const helmetSchema = z.enum(["red", "blue", "white", "yellow"]);

export const matchTeamSchema = z.object({
  id: z.string(),
  name: z.string(),
  subName: z.string(),
  short: z.string(),
  color: z.string(),
  icon: z.string(),
});

export const matchRiderSchema = z.object({
  id: z.string(),
  /** Shirt / squad number (home 9-18, away 1-10). Slots 1-8 of the squad are home 9-16, away 1-8. */
  number: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.string(),
  /** Season heat average, shown when choosing a substitute. */
  avgHeat: z.number(),
  /** S T F R C in the UI. */
  skills: z.object({
    strength: z.number(),
    technique: z.number(),
    fighting: z.number(),
    reflex: z.number(),
    condition: z.number(),
  }),
  /** Current form in percent. */
  form: z.number(),
});

export const heatRiderSchema = z.object({
  riderId: z.string(),
  /** Squad number of the slot this rider rides in. */
  number: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  side: sideSchema,
  /** 1-4. Home rides on 1-2 (red, blue), away on 3-4 (white, yellow). */
  gate: z.number().int().min(1).max(4),
  helmet: helmetSchema,
  /** null until the heat is run, and for a heat whose result was set by hand */
  time: z.number().nullable(),
  /** null until the heat is run */
  points: z.number().nullable(),
  /** Bonus point ("2+"), on top of `points`. */
  bonus: z.boolean(),
});

export const heatSchema = z.object({
  number: z.number(),
  /** Winner's time. null until the heat is run, and for a heat set by hand (use homePoints to tell). */
  time: z.number().nullable(),
  homePoints: z.number().nullable(),
  awayPoints: z.number().nullable(),
  /** Running match score after this heat. */
  homeTotal: z.number().nullable(),
  awayTotal: z.number().nullable(),
  riders: z.array(heatRiderSchema),
});

export const matchSchema = z.object({
  id: z.string(),
  matchday: z.number(),
  /** YYYY-MM-DD */
  date: z.string(),
  time: z.string(),
  /** live = some heats are run, the match is not over. */
  status: z.enum(["scheduled", "live", "finished"]),
  stadium: z.object({
    name: z.string(),
    city: z.string(),
    /** metres */
    trackLength: z.number(),
    surface: z.string(),
    weather: z.object({ condition: z.enum(["Sunny", "Cloudy", "Rain"]), temp: z.number() }),
  }),
  home: matchTeamSchema,
  away: matchTeamSchema,
  homeScore: z.number().nullable(),
  awayScore: z.number().nullable(),
  /** The 8 riders announced for the match (slots 1-8). */
  squads: z.object({ home: z.array(matchRiderSchema), away: z.array(matchRiderSchema) }),
  /** The whole club roster: who can be picked as a substitute. */
  roster: z.object({ home: z.array(matchRiderSchema), away: z.array(matchRiderSchema) }),
  heats: z.array(heatSchema),
});

export type Side = z.infer<typeof sideSchema>;
export type Helmet = z.infer<typeof helmetSchema>;
export type MatchTeam = z.infer<typeof matchTeamSchema>;
export type MatchRider = z.infer<typeof matchRiderSchema>;
export type HeatRider = z.infer<typeof heatRiderSchema>;
export type Heat = z.infer<typeof heatSchema>;
export type Match = z.infer<typeof matchSchema>;
