import { CLUB_BY_REF } from "@/sports/speedway/data/season";
import {
  heatStarts,
  MATCH_HEATS,
  matchScore,
  overall,
  withTotals,
  type Weather,
} from "@/sports/speedway/engine/v1";
import {
  newStoredMatch,
  RIDER_BY_ID,
  setupOf,
  toEngineRider,
  clubRiders,
  type SeasonRider,
} from "@/sports/speedway/sim/match-setup";
import { attemptOf, readMatches, type StoredMatch } from "@/sports/speedway/sim/results-store";
import { computeRiderStats, isFinished, type RiderStats } from "@/sports/speedway/sim/stats";
import {
  matchSchema,
  type Heat,
  type HeatRider,
  type Match,
  type MatchRider,
  type Side,
} from "@/sports/speedway/types/match";
import { getFixture } from "./fixtures";

const WEATHER: Record<Weather, Match["stadium"]["weather"]> = {
  sun: { condition: "Sunny", temp: 21 },
  cloud: { condition: "Cloudy", temp: 16 },
  rain: { condition: "Rain", temp: 11 },
};

const roleOf = (age: number, number: number) =>
  age <= 19 ? "Junior U19" : age <= 21 ? "Junior U21" : number === 1 ? "Senior • Leader" : "Senior";

/** Shirt number of slot 1-8: away 1-8, home 9-16. The two riders left out are 9-10 / 17-18. */
const shirt = (side: Side, index: number) => (side === "home" ? 9 : 1) + index;

function toMatchRider(
  rider: SeasonRider,
  side: Side,
  index: number,
  stats: Map<string, RiderStats>,
): MatchRider {
  return {
    id: rider.id,
    number: shirt(side, index),
    firstName: rider.firstName,
    lastName: rider.lastName,
    role: roleOf(rider.age, index + 1),
    avgHeat: stats.get(rider.id)?.avgHeat ?? 0,
    skills: {
      strength: rider.strength,
      technique: rider.technique,
      fighting: rider.fighting,
      reflex: rider.reflex,
      condition: rider.condition,
    },
    form: rider.form,
  };
}

/** The whole club: the squad of 8 first (slot order), then the rest by overall rating. */
function rosterOf(
  clubId: string,
  squadIds: string[],
  side: Side,
  stats: Map<string, RiderStats>,
): MatchRider[] {
  const rest = clubRiders(clubId)
    .filter((r) => !squadIds.includes(r.id))
    .sort((a, b) => overall(toEngineRider(b)) - overall(toEngineRider(a)));
  return [...squadIds.map((id) => RIDER_BY_ID.get(id)!), ...rest].map((r, i) =>
    toMatchRider(r, side, i, stats),
  );
}

/** Heats 1-15: run ones with their result, the rest as the planned lineup. */
function heatsOf(
  stored: StoredMatch,
  squads: Record<Side, MatchRider[]>,
  roster: Record<Side, MatchRider[]>,
): Heat[] {
  const setup = setupOf(stored);
  const played = withTotals(stored.heats);

  const toStart = (
    side: Side,
    start: { slot: number; substitute?: { rider: { id: string } } },
    gate: number,
    result?: (typeof played)[number]["riders"][number],
  ): HeatRider => {
    const actualRider =
      (result ? roster[side].find((rider) => rider.id === result.riderId) : null) ??
      (start.substitute
        ? roster[side].find((rider) => rider.id === start.substitute!.rider.id)
        : null) ??
      squads[side][start.slot - 1]!;

    return {
      riderId: actualRider.id,
      number: actualRider.number,
      firstName: actualRider.firstName,
      lastName: actualRider.lastName,
      side,
      gate,
      helmet: (["red", "blue", "white", "yellow"] as const)[gate - 1]!,
      time: result?.time ?? null,
      points: result?.points ?? null,
      bonus: result?.bonus ?? false,
    };
  };

  return Array.from({ length: MATCH_HEATS }, (_, index): Heat => {
    const number = index + 1;
    const done = played[index];
    const starts = heatStarts(setup, stored.heats, number);
    const riders = starts.map((s, i) => {
      const result = done?.riders.find((r) => r.gate === i + 1);
      return toStart(s.side, s, i + 1, result);
    });

    return {
      number,
      time: done?.time ?? null,
      homePoints: done?.homePoints ?? null,
      awayPoints: done?.awayPoints ?? null,
      homeTotal: done?.homeTotal ?? null,
      awayTotal: done?.awayTotal ?? null,
      riders,
    };
  });
}

/** Full match: teams, squads, roster and every heat. Built from the stored results, parsed at the boundary. */
export async function getMatch(id: string): Promise<Match | null> {
  const fixture = await getFixture(id);
  if (!fixture) return null;

  const matches = await readMatches();
  const stored = matches[id] ?? newStoredMatch(id, attemptOf(id));
  const stats = computeRiderStats(matches);

  const homeClub = CLUB_BY_REF.get(fixture.homeId)!;
  const awayClub = CLUB_BY_REF.get(fixture.awayId)!;
  const roster = {
    home: rosterOf(fixture.homeId, stored.squads.home, "home", stats),
    away: rosterOf(fixture.awayId, stored.squads.away, "away", stats),
  };
  const squads = { home: roster.home.slice(0, 8), away: roster.away.slice(0, 8) };
  const score = stored.heats.length > 0 ? matchScore(stored.heats) : null;
  const team = (club: typeof homeClub) => ({
    id: club.id,
    name: club.name,
    subName: club.subName,
    short: club.short,
    color: club.color,
    icon: club.icon,
  });

  return matchSchema.parse({
    id: fixture.id,
    matchday: fixture.matchday,
    date: fixture.date,
    time: fixture.time,
    status: isFinished(stored) ? "finished" : stored.heats.length > 0 ? "live" : "scheduled",
    stadium: {
      name: homeClub.stadium.name,
      city: homeClub.city,
      trackLength: homeClub.stadium.trackLength,
      surface: homeClub.stadium.surface,
      weather: WEATHER[stored.weather],
    },
    home: team(homeClub),
    away: team(awayClub),
    homeScore: score?.home ?? null,
    awayScore: score?.away ?? null,
    squads,
    roster,
    heats: heatsOf(stored, squads, roster),
  });
}
