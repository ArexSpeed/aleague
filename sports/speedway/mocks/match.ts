import type { Fixture } from "@/sports/speedway/types/fixtures";
import type { LeagueRider, LeagueTeam } from "@/sports/speedway/types/league";
import type {
  Heat,
  HeatRider,
  Helmet,
  Match,
  MatchRider,
  MatchTeam,
  Side,
} from "@/sports/speedway/types/match";

/**
 * Deterministic match generator (same id = same match, on every request).
 * Heats are built so the points add up to the fixture's final score.
 * Replaced by real data from the API later.
 */

const SQUAD_SIZE = 7;
const ROSTER_SIZE = 9;
const POINTS = [3, 2, 1, 0];

/** Invented names that fill the roster when a club has fewer than 9 riders. */
const PAD_NAMES: [string, string][] = [
  ["Adam", "Kowal"], ["Piotr", "Lis"], ["Marek", "Wolny"], ["Tomasz", "Sowa"],
  ["Jakub", "Rudy"], ["Kamil", "Zając"], ["Oskar", "Bielik"], ["Filip", "Orzeł"],
  ["Dawid", "Kruk"], ["Szymon", "Jeleń"], ["Patryk", "Bóbr"], ["Michał", "Żbik"],
  ["Kacper", "Sokół"], ["Bartek", "Lew"], ["Igor", "Wilk"], ["Jan", "Tur"],
];

/** Every pair of the 6 main riders = 15 heats, each rider starts exactly 5 times. */
const PAIRS: [number, number][] = [
  [0, 1], [2, 3], [4, 5], [0, 2], [1, 4], [3, 5], [0, 3], [1, 5],
  [2, 4], [0, 4], [1, 3], [2, 5], [0, 5], [1, 2], [3, 4],
];

/** Finishing places of the home riders for every possible home heat score. */
const HOME_PLACES: Record<number, number[][]> = {
  5: [[1, 2]],
  4: [[1, 3]],
  3: [[1, 4], [2, 3]],
  2: [[2, 4]],
  1: [[3, 4]],
};

const GATES: Record<Side, [number, number]> = { home: [1, 2], away: [3, 4] };
const HELMET_BY_GATE: Record<number, Helmet> = { 1: "red", 2: "blue", 3: "white", 4: "yellow" };

const SURFACES = ["Syenite (hard)", "Granite (medium)", "Shale (soft)"];
const WEATHER: Match["stadium"]["weather"][] = [
  { condition: "Sunny", temp: 21 },
  { condition: "Cloudy", temp: 16 },
  { condition: "Rain", temp: 11 },
];

function seeded(seed: string): () => number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = (h ^ (h >>> 16)) >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round2 = (n: number) => Math.round(n * 100) / 100;
const sumChars = (s: string) => [...s].reduce((sum, c) => sum + c.charCodeAt(0), 0);

function buildRoster(team: LeagueTeam, riders: LeagueRider[], firstNumber: number): MatchRider[] {
  const ranked = [...riders].sort((a, b) => b.avgHeat - a.avgHeat);
  const offset = sumChars(team.id);

  return Array.from({ length: ROSTER_SIZE }, (_, i) => {
    const real = ranked[i];
    const pad = PAD_NAMES[(offset + i) % PAD_NAMES.length]!;
    const id = real?.id ?? `${team.id}-${i + 1}`;
    const rand = seeded(id);
    const avgHeat = real?.avgHeat ?? round2(1.1 + rand() * 0.9);
    const base = 52 + avgHeat * 14;
    const skill = () => Math.max(50, Math.min(99, Math.round(base + (rand() - 0.5) * 12)));

    return {
      id,
      number: firstNumber + i,
      firstName: real?.firstName ?? pad[0],
      lastName: real?.lastName ?? pad[1],
      role: real?.role ?? (i < SQUAD_SIZE ? "Senior" : "Junior U21"),
      avgHeat,
      skills: {
        start: skill(),
        technique: skill(),
        form: skill(),
        judgement: skill(),
        character: skill(),
      },
    };
  });
}

/** Home heat points per heat (1-5 each) that sum to `target`. */
function distribute(target: number, rand: () => number): number[] {
  const goal = Math.min(75, Math.max(15, target));
  const points = Array<number>(PAIRS.length).fill(3);
  let sum = points.length * 3;

  while (sum !== goal) {
    const i = Math.floor(rand() * points.length);
    if (sum < goal && points[i]! < 5) {
      points[i]!++;
      sum++;
    } else if (sum > goal && points[i]! > 1) {
      points[i]!--;
      sum--;
    }
  }
  return points;
}

function buildHeats(
  matchId: string,
  squads: Record<Side, MatchRider[]>,
  homeScore: number | null,
): Heat[] {
  const rand = seeded(`${matchId}:heats`);
  const homePoints = homeScore === null ? null : distribute(homeScore, rand);
  let homeTotal = 0;
  let awayTotal = 0;

  return PAIRS.map((_, index): Heat => {
    const number = index + 1;
    const pairs: Record<Side, [number, number]> = {
      home: PAIRS[index]!,
      away: PAIRS[(index * 4 + 1) % PAIRS.length]!,
    };

    /** The two riders of a side; they swap gates every other heat. */
    const pairOf = (side: Side): [MatchRider, MatchRider] => {
      const [x, y] = pairs[side].map((i) => squads[side][i]!) as [MatchRider, MatchRider];
      return number % 2 === 0 ? [y, x] : [x, y];
    };

    const toStart = (side: Side, rider: MatchRider, slot: 0 | 1): HeatRider => {
      const gate = GATES[side][slot];
      return {
        riderId: rider.id,
        number: rider.number,
        firstName: rider.firstName,
        lastName: rider.lastName,
        side,
        gate,
        helmet: HELMET_BY_GATE[gate]!,
        time: null,
        points: null,
        bonus: false,
      };
    };

    const home = pairOf("home");
    const away = pairOf("away");
    const riders = [
      toStart("home", home[0], 0),
      toStart("home", home[1], 1),
      toStart("away", away[0], 0),
      toStart("away", away[1], 1),
    ];

    if (homePoints === null) {
      return {
        number,
        time: null,
        homePoints: null,
        awayPoints: null,
        homeTotal: null,
        awayTotal: null,
        riders,
      };
    }

    const hp = homePoints[index]!;
    const options = HOME_PLACES[hp]!;
    const homePlaces = options[Math.floor(rand() * options.length)]!;
    const awayPlaces = [1, 2, 3, 4].filter((p) => !homePlaces.includes(p));

    /** The stronger rider usually takes the better place. */
    const places = (pair: [MatchRider, MatchRider], available: number[]): [number, number] => {
      const better = pair[0].avgHeat >= pair[1].avgHeat ? 0 : 1;
      const first = rand() > 0.65 ? 1 - better : better;
      return first === 0 ? [available[0]!, available[1]!] : [available[1]!, available[0]!];
    };
    const placeOf = [...places(home, homePlaces), ...places(away, awayPlaces)];

    const times: number[] = [];
    times[1] = 62.4 + rand() * 3;
    for (let p = 2; p <= 4; p++) times[p] = times[p - 1]! + 0.1 + rand();

    const winningSide: Side | null = hp >= 4 ? "home" : hp <= 2 ? "away" : null;

    const done = riders.map((rider, i): HeatRider => {
      const place = placeOf[i]!;
      return { ...rider, time: round2(times[place]!), points: POINTS[place - 1]!, bonus: false };
    });

    // Bonus point: the second rider of the side that wins the heat 4:2 or 5:1.
    if (winningSide) {
      const second = done
        .filter((r) => r.side === winningSide)
        .sort((a, b) => a.points! - b.points!)[0]!;
      second.bonus = true;
    }

    homeTotal += hp;
    awayTotal += 6 - hp;

    return {
      number,
      time: round2(times[1]!),
      homePoints: hp,
      awayPoints: 6 - hp,
      homeTotal,
      awayTotal,
      riders: done,
    };
  });
}

function toTeam(team: LeagueTeam): MatchTeam {
  return {
    id: team.id,
    name: team.name,
    subName: team.subName,
    short: team.short,
    color: team.color,
    icon: team.badgeIcon,
  };
}

export function buildMatch(
  fixture: Fixture,
  home: LeagueTeam,
  away: LeagueTeam,
  homeRiders: LeagueRider[],
  awayRiders: LeagueRider[],
): Match {
  const roster = {
    home: buildRoster(home, homeRiders, 9),
    away: buildRoster(away, awayRiders, 1),
  };
  const squads = {
    home: roster.home.slice(0, SQUAD_SIZE),
    away: roster.away.slice(0, SQUAD_SIZE),
  };
  const finished = fixture.homeScore !== null && fixture.awayScore !== null;
  const seed = sumChars(fixture.id);

  return {
    id: fixture.id,
    matchday: fixture.matchday,
    date: fixture.date,
    time: fixture.time,
    status: finished ? "finished" : "scheduled",
    stadium: {
      name: fixture.stadium,
      // TODO: real city once the stadium model exists.
      city: home.name.charAt(0) + home.name.slice(1).toLowerCase(),
      trackLength: 300 + (seed % 100),
      surface: SURFACES[seed % SURFACES.length]!,
      weather: WEATHER[seed % WEATHER.length]!,
    },
    home: toTeam(home),
    away: toTeam(away),
    homeScore: fixture.homeScore,
    awayScore: fixture.awayScore,
    squads,
    roster,
    heats: buildHeats(fixture.id, squads, fixture.homeScore),
  };
}
