import { z } from "zod";

/**
 * Shape of the season input files in data/season-N/. Paste your own JSON in this shape
 * and run `pnpm dlx tsx scripts/build-fixtures.ts`: it validates everything and builds the calendar.
 */

export const surfaceSchema = z.string();

/** A region = a national team in later stages (8 of them). Riders are called up from its clubs. */
export const regionSchema = z.object({
  id: z.string(),
  name: z.string(),
  short: z.string().length(3),
});

export const clubSchema = z.object({
  id: z.string(),
  name: z.string(),
  subName: z.string(),
  short: z.string().length(3),
  fullName: z.string(),
  city: z.string(),
  color: z.string(),
  icon: z.string(),
  /** Id of a league in competitions.json: east-gold, west-gold, east-silver, west-silver. */
  leagueId: z.string(),
  /** Only when the league has groups in the regular stage (West Silver: "A" / "B"). */
  group: z.string().optional(),
  /** Region the club plays its regional league in. */
  regionId: z.string(),
  stadium: z.object({
    name: z.string(),
    capacity: z.number(),
    trackLength: z.number(),
    surface: surfaceSchema,
  }),
});

/** The riders file as it is delivered (riders.json). */
export const riderSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  age: z.number(),
  strength: z.number(),
  technique: z.number(),
  fighting: z.number(),
  reflex: z.number(),
  condition: z.number(),
  form: z.number(),
  club: z.string(),
  /** Id or short code of a club in clubs.json. */
  clubId: z.string(),
});

export type RiderRaw = z.infer<typeof riderSchema>;

const mean = (r: RiderRaw) => (r.strength + r.technique + r.fighting + r.reflex + r.condition) / 5;

/**
 * Raw riders -> app riders. Numbers 1..N are given inside each club by skill (best = 1);
 * role comes from age; `clubId` may be the club id or its 3-letter short code.
 */
export function adaptRiders(
  raw: RiderRaw[],
  clubs: { id: string; short: string }[],
): { riders: Rider[]; errors: string[] } {
  const clubByRef = new Map<string, string>();
  for (const club of clubs) {
    clubByRef.set(club.id, club.id);
    clubByRef.set(club.short, club.id);
  }

  const errors: string[] = [];
  const byClub = new Map<string, RiderRaw[]>();
  for (const r of raw) {
    const clubId = clubByRef.get(r.clubId);
    if (!clubId) {
      errors.push(`rider ${r.id} (${r.firstName} ${r.lastName}): unknown clubId "${r.clubId}"`);
      continue;
    }
    byClub.set(clubId, [...(byClub.get(clubId) ?? []), r]);
  }

  const riders: Rider[] = [];
  for (const [clubId, list] of byClub) {
    [...list].forEach((r, i) => {
      riders.push({
        id: String(r.id),
        club: r.club,
        clubId,
        firstName: r.firstName,
        lastName: r.lastName,
        age: r.age,
        strength: r.strength,
        technique: r.technique,
        fighting: r.fighting,
        reflex: r.reflex,
        condition: r.condition,
        form: r.form,
      });
    });
  }
  return { riders, errors };
}

export const fixtureSchema = z.object({
  id: z.string(),
  competitionId: z.string(),
  stage: z.string(),
  group: z.string(),
  /** Matchday inside the competition (continues through stages: West Gold regular 1-22, final 23-32). */
  matchday: z.number(),
  /** Calendar week of the season (1-based). */
  week: z.number(),
  homeId: z.string(),
  awayId: z.string(),
});

export type Region = z.infer<typeof regionSchema>;
export type Club = z.infer<typeof clubSchema>;
export type Rider = z.infer<typeof riderSchema>;
export type Fixture = z.infer<typeof fixtureSchema>;
