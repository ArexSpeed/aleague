import { CLUB_BY_REF, RIDERS, SEASON_FIXTURES } from "@/sports/speedway/data/season";
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
export const FIXTURE_BY_ID = new Map(SEASON_FIXTURES.map((f) => [f.id, f]));

export const toEngineRider = (r: SeasonRider): EngineRider => ({
  id: r.id,
  strength: r.strength,
  technique: r.technique,
  fighting: r.fighting,
  reflex: r.reflex,
  condition: r.condition,
  form: r.form,
});

export const clubRiders = (clubId: string) => RIDERS.filter((r) => CLUB_BY_REF.get(r.clubId)?.id === clubId);

/** Default squad of 8 for a club: rider ids by slot. */
export const defaultSquadIds = (clubId: string) =>
  pickSquad(clubRiders(clubId).map((r) => ({ ...toEngineRider(r), age: r.age }))).map((r) => r.id);

/** A match that has not been started: seed, weather and squads are fixed here. Not saved. */
export function newStoredMatch(fixtureId: string, attempt: number): StoredMatch {
  const fixture = FIXTURE_BY_ID.get(fixtureId);
  if (!fixture) throw new Error(`Unknown fixture ${fixtureId}`);

  const seed = attempt === 0 ? fixtureId : `${fixtureId}:${attempt}`;
  return {
    fixtureId,
    engine: ENGINE_VERSION,
    seed,
    luck: simLuck(),
    weather: rollWeather(createRng(`${seed}:weather`)),
    squads: { home: defaultSquadIds(fixture.homeId), away: defaultSquadIds(fixture.awayId) },
    heats: [],
  };
}

/** Engine input for a stored match: riders by id, stadium conditions of the home club. */
export function setupOf(stored: StoredMatch): MatchSetup {
  const fixture = FIXTURE_BY_ID.get(stored.fixtureId)!;
  const stadium = CLUB_BY_REF.get(fixture.homeId)!.stadium;
  const riders = (ids: string[]) => ids.map((id) => toEngineRider(RIDER_BY_ID.get(id)!));

  return {
    seed: stored.seed,
    luck: stored.luck,
    conditions: { trackLength: stadium.trackLength, surface: surfaceOf(stadium.surface), weather: stored.weather },
    home: riders(stored.squads.home),
    away: riders(stored.squads.away),
  };
}
