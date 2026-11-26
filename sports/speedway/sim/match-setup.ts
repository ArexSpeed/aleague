import { CLUB_BY_REF, MATCH_FIXTURES, RIDERS } from "@/sports/speedway/data/season";
import {
  createRng,
  ENGINE_VERSION,
  pickSquad,
  rollWeather,
  surfaceOf,
  type EngineRider,
  type MatchSetup,
} from "@/sports/speedway/engine/v1";
import { simLuck } from "./sim-config";
import type { StoredMatch } from "./results-store";

export type SeasonRider = (typeof RIDERS)[number];

export const RIDER_BY_ID = new Map(RIDERS.map((r) => [r.id, r]));
export const FIXTURE_BY_ID = new Map(MATCH_FIXTURES.map((f) => [f.id, f]));

export const toEngineRider = (r: SeasonRider): EngineRider => ({
  id: r.id,
  strength: r.strength,
  technique: r.technique,
  fighting: r.fighting,
  reflex: r.reflex,
  condition: r.condition,
  form: r.form,
});

export const clubRiders = (clubId: string) =>
  RIDERS.filter((r) => CLUB_BY_REF.get(r.clubId)?.id === clubId);

/** Default squad of 8 for a club: rider ids by slot. */
export const defaultSquadIds = (clubId: string) =>
  pickSquad(clubRiders(clubId).map((r) => ({ ...toEngineRider(r), age: r.age }))).map((r) => r.id);

export type MatchClubs = { homeId: string; awayId: string };

/** The clubs of a stored match: the ones fixed at its start (cup), otherwise the fixture's own. */
export function clubsOfMatch(stored: Pick<StoredMatch, "fixtureId" | "homeId" | "awayId">): MatchClubs {
  if (stored.homeId && stored.awayId) return { homeId: stored.homeId, awayId: stored.awayId };
  const fixture = FIXTURE_BY_ID.get(stored.fixtureId);
  if (!fixture) throw new Error(`Unknown fixture ${stored.fixtureId}`);
  return { homeId: fixture.homeId, awayId: fixture.awayId };
}

/** A match that has not been started: seed, weather and squads are fixed here. Not saved. */
/** A match that has not been started: seed, weather and squads are fixed here. Not saved. */
export function newStoredMatch(fixtureId: string, attempt: number, drawn?: MatchClubs): StoredMatch {
  const fixture = FIXTURE_BY_ID.get(fixtureId);
  if (!fixture) throw new Error(`Unknown fixture ${fixtureId}`);

  // Cup fixtures have no clubs of their own: the draw gives them, and the match keeps them.
  const fromDraw = !fixture.homeId || !fixture.awayId;
  const { homeId, awayId } = drawn ?? { homeId: fixture.homeId, awayId: fixture.awayId };
  if (!homeId || !awayId) throw new Error(`Fixture ${fixtureId} has no participants yet (waiting for the draw)`);

  const seed = attempt === 0 ? fixtureId : `${fixtureId}:${attempt}`;
  return {
    fixtureId,
    engine: ENGINE_VERSION,
    seed,
    luck: simLuck(),
    weather: rollWeather(createRng(`${seed}:weather`)),
    ...(fromDraw ? { homeId, awayId } : {}),
    squads: { home: defaultSquadIds(homeId), away: defaultSquadIds(awayId) },
    heats: [],
  };
}

/** Engine input for a stored match: riders by id, stadium conditions of the home club. */
export function setupOf(stored: StoredMatch): MatchSetup {
  const stadium = CLUB_BY_REF.get(clubsOfMatch(stored).homeId)!.stadium;
  const riders = (ids: string[]) => ids.map((id) => toEngineRider(RIDER_BY_ID.get(id)!));

  return {
    seed: stored.seed,
    luck: stored.luck,
    conditions: {
      trackLength: stadium.trackLength,
      surface: surfaceOf(stadium.surface),
      weather: stored.weather,
    },
    home: riders(stored.squads.home),
    away: riders(stored.squads.away),
    substitutions: Object.fromEntries(
      Object.entries(stored.substitutions ?? {}).map(([heat, byGate]) => [
        heat,
        Object.fromEntries(
          Object.entries(byGate).map(([gate, s]) => [
            gate,
            { kind: s.kind, rider: toEngineRider(RIDER_BY_ID.get(s.riderId)!) },
          ]),
        ),
      ]),
    ),
  };
}
