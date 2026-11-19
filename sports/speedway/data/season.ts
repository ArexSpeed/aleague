import { z } from "zod";

import clubsJson from "./season-1/clubs.json";
import fixturesJson from "./season-1/fixtures.json";
import nationsJson from "./season-1/nations.json";
import ridersJson from "./season-1/riders.json";
import nationGamesJson from "./season-1/nation-games.json";
import { clubSchema, fixtureSchema, nationSchema, riderSchema, type Club } from "./schema";

/**
 * Season 1 data, read and validated once. The only place that knows the data comes from
 * JSON files; when it moves to Supabase, only this file and the api/* layer change.
 */
export const CLUBS = z.array(clubSchema).parse(clubsJson);
export const NATIONS = z.array(nationSchema).parse(nationsJson);
export const RIDERS = z.array(riderSchema).parse(ridersJson);
export const SEASON_FIXTURES = z.array(fixtureSchema).parse(fixturesJson);
export const NATION_GAMES_FIXTURES = z.array(fixtureSchema).parse(nationGamesJson);

/** Club by id or by 3-letter short code (riders.json references clubs by short code). */
export const CLUB_BY_REF = new Map<string, Club>(
  CLUBS.flatMap((club): [string, Club][] => [
    [club.id, club],
    [club.short, club],
  ]),
);

const unknownClub = RIDERS.find((rider) => !CLUB_BY_REF.has(rider.clubId));
if (unknownClub) {
  throw new Error(
    `riders.json: rider ${unknownClub.id} has unknown clubId "${unknownClub.clubId}"`,
  );
}
