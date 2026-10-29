import { z } from "zod";

import type { LeagueTeam } from "./league";

export const fixtureSchema = z.object({
  id: z.string(),
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

export type TeamRef = Pick<LeagueTeam, "id" | "name" | "subName" | "short" | "color">;
export type FixtureWithTeams = Fixture & { home: TeamRef; away: TeamRef };
