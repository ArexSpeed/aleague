import { simulateHeat } from "./heat";
import { createRng } from "./rng";
import { overall } from "./squad";
import type {
  Conditions,
  EngineRider,
  Helmet,
  Side,
  Substitution,
  SubstitutionKind,
} from "./types";

export const ENGINE_VERSION = "v1";
export const MATCH_HEATS = 15;
export const POINTS_BY_POSITION = [3, 2, 1, 0];

/** Gates 1-2 = home (red, blue), 3-4 = away (white, yellow). */
const HELMET_BY_GATE: Helmet[] = ["red", "blue", "white", "yellow"];

/**
 * The standard league programme. Numbers are slots inside the squad of 8:
 * the table's home 9-16 is slot 1-8, away 1-8 is slot 1-8. Slots 6-8 are the juniors.
 * [home pair, away pair] per heat. Heats 14 and 15 are nominated, see `nominated`.
 */
export const HEAT_PROGRAM: [[number, number], [number, number]][] = [
  [
    [1, 2],
    [1, 2],
  ],
  [
    [6, 7],
    [6, 7],
  ],
  [
    [3, 4],
    [3, 4],
  ],
  [
    [5, 7],
    [5, 7],
  ],
  [
    [3, 4],
    [1, 2],
  ],
  [
    [5, 6],
    [3, 4],
  ],
  [
    [1, 2],
    [5, 6],
  ],
  [
    [5, 7],
    [1, 2],
  ],
  [
    [1, 2],
    [3, 4],
  ],
  [
    [3, 4],
    [5, 7],
  ],
  [
    [1, 5],
    [2, 4],
  ],
  [
    [3, 6],
    [1, 6],
  ],
  [
    [2, 4],
    [3, 5],
  ],
];

export type MatchSetup = {
  /** Same seed = same match. */
  seed: string;
  conditions: Conditions;
  /** How much luck there is, see DEFAULT_LUCK. */
  luck?: number;
  /** Eight riders each, index 0 = slot 1. */
  home: EngineRider[];
  away: EngineRider[];
  /** heat number -> gate (1-4) -> rider who starts instead of the planned one. */
  substitutions?: Record<number, Record<number, Substitution>>;
};

export type Start = { side: Side; slot: number; substitute?: Substitution };

export type HeatRiderResult = {
  riderId: string;
  side: Side;
  /** Slot 1-8 inside the squad (for a substitute: the slot he replaced). */
  slot: number;
  gate: number;
  helmet: Helmet;
  /** Set when a substitute rode instead of the planned rider. */
  substitution?: SubstitutionKind;
  /** Empty and null for a heat whose result was set by hand. */
  laps: number[];
  time: number | null;
  position: number;
  points: number;
  /** Second place in a 5:1 heat. Shown as "2+", it does not change the match score. */
  bonus: boolean;
};

/** A heat that has been run (or set by hand). Running totals are added by `withTotals`. */
export type PlayedHeat = {
  number: number;
  nominated: boolean;
  source: "sim" | "set";
  /** Winner's time, null when set by hand. */
  time: number | null;
  homePoints: number;
  awayPoints: number;
  riders: HeatRiderResult[];
};

export type HeatResult = PlayedHeat & { homeTotal: number; awayTotal: number };

export function withTotals(heats: PlayedHeat[]): HeatResult[] {
  let homeTotal = 0;
  let awayTotal = 0;
  return heats.map((heat) => {
    homeTotal += heat.homePoints;
    awayTotal += heat.awayPoints;
    return { ...heat, homeTotal, awayTotal };
  });
}

export const matchScore = (heats: PlayedHeat[]) => ({
  home: heats.reduce((sum, h) => sum + h.homePoints, 0),
  away: heats.reduce((sum, h) => sum + h.awayPoints, 0),
});

/** Who actually rides: the substitute if there is one, otherwise the planned slot. */
export const riderOf = (setup: MatchSetup, start: Start): EngineRider =>
  start.substitute?.rider ?? (start.side === "home" ? setup.home : setup.away)[start.slot - 1]!;

/**
 * Slots 1-8 of a side ranked by match points so far, then by overall.
 * Points are counted by rider id, so a substitute's points never go to the rider he replaced.
 */
function ranking(heats: PlayedHeat[], side: Side, squad: EngineRider[]): number[] {
  const points = new Map<string, number>();
  for (const heat of heats) {
    for (const r of heat.riders) {
      if (r.side === side) points.set(r.riderId, (points.get(r.riderId) ?? 0) + r.points);
    }
  }
  return squad
    .map((_, i) => i + 1)
    .sort(
      (a, b) =>
        (points.get(squad[b - 1]!.id) ?? 0) - (points.get(squad[a - 1]!.id) ?? 0) ||
        overall(squad[b - 1]!) - overall(squad[a - 1]!),
    );
}

/**
 * Heat 14 = two best (overall) of the riders ranked 3rd-5th in the team's match classification;
 * heat 15 = the riders ranked 1st-2nd. Change here if the league's rule is different.
 */
function nominated(rank: number[], squad: EngineRider[], heat: 14 | 15): [number, number] {
  if (heat === 15) return [rank[0]!, rank[1]!];
  const middle = rank.slice(2, 5).sort((a, b) => overall(squad[b - 1]!) - overall(squad[a - 1]!));
  return [middle[0]!, middle[1]!];
}

/**
 * Who starts heat `number` (1-15). Heats 14-15 depend on the played heats; before they are played
 * this is a projection from the heats played so far. Substitutions of that heat are applied by gate.
 */
export function heatStarts(setup: MatchSetup, played: PlayedHeat[], number: number): Start[] {
  let home: [number, number];
  let away: [number, number];

  if (number <= HEAT_PROGRAM.length) {
    [home, away] = HEAT_PROGRAM[number - 1]!;
  } else {
    const regular = played.slice(0, HEAT_PROGRAM.length);
    const before = number === 14 ? played.slice(0, 13) : regular;
    home = nominated(ranking(before, "home", setup.home), setup.home, number as 14 | 15);
    away = nominated(ranking(before, "away", setup.away), setup.away, number as 14 | 15);
  }

  const starts: Start[] = [
    { side: "home", slot: home[0] },
    { side: "home", slot: home[1] },
    { side: "away", slot: away[0] },
    { side: "away", slot: away[1] },
  ];

  const subs = setup.substitutions?.[number];
  if (!subs) return starts;
  return starts.map((s, i) => (subs[i + 1] ? { ...s, substitute: subs[i + 1] } : s));
}

type Finish = { gate: number; position: number; time: number | null; laps: number[] };

function buildHeat(
  starts: Start[],
  setup: MatchSetup,
  number: number,
  finishes: Finish[],
  source: "sim" | "set",
): PlayedHeat {
  const riders = finishes
    .map((f): HeatRiderResult => {
      const start = starts[f.gate - 1]!;
      return {
        riderId: riderOf(setup, start).id,
        side: start.side,
        slot: start.slot,
        gate: f.gate,
        helmet: HELMET_BY_GATE[f.gate - 1]!,
        substitution: start.substitute?.kind,
        laps: f.laps,
        time: f.time,
        position: f.position,
        points: POINTS_BY_POSITION[f.position - 1]!,
        bonus: false,
      };
    })
    .sort((a, b) => a.gate - b.gate);

  const sum = (side: Side) =>
    riders.filter((r) => r.side === side).reduce((a, r) => a + r.points, 0);
  const homePoints = sum("home");
  const awayPoints = sum("away");

  // 5:1 = a 1-2 finish: the rider in second place gets the bonus.
  const winner: Side | null = homePoints === 5 ? "home" : awayPoints === 5 ? "away" : null;
  for (const r of riders) if (winner === r.side && r.position === 2) r.bonus = true;

  return {
    number,
    nominated: number > HEAT_PROGRAM.length,
    source,
    time: riders.find((r) => r.position === 1)!.time,
    homePoints,
    awayPoints,
    riders,
  };
}

/** Runs the next heat (`played.length + 1`). Every heat has its own random numbers. */
export function playNextHeat(setup: MatchSetup, played: PlayedHeat[]): PlayedHeat {
  const number = played.length + 1;
  if (number > MATCH_HEATS) throw new Error("The match is over");

  const starts = heatStarts(setup, played, number);
  const rng = createRng(`${ENGINE_VERSION}:${setup.seed}:${number}`);
  const runs = simulateHeat(
    starts.map((s, i) => ({ rider: riderOf(setup, s), gate: i + 1 })),
    setup.conditions,
    rng,
    setup.luck,
  );
  return buildHeat(starts, setup, number, runs, "sim");
}

/** Sets the next heat by hand: `positions[gate - 1]` is the finishing position (1-4) of that gate. */
export function setNextHeat(
  setup: MatchSetup,
  played: PlayedHeat[],
  positions: number[],
): PlayedHeat {
  const number = played.length + 1;
  if (number > MATCH_HEATS) throw new Error("The match is over");
  if (positions.length !== 4 || [1, 2, 3, 4].some((p) => !positions.includes(p))) {
    throw new Error("Positions must be 1, 2, 3 and 4, each once");
  }
  const starts = heatStarts(setup, played, number);
  return buildHeat(
    starts,
    setup,
    number,
    positions.map((position, i) => ({ gate: i + 1, position, time: null, laps: [] })),
    "set",
  );
}

/** Plays all the heats that are left. */
export function finishMatch(setup: MatchSetup, played: PlayedHeat[] = []): PlayedHeat[] {
  const heats = [...played];
  while (heats.length < MATCH_HEATS) heats.push(playNextHeat(setup, heats));
  return heats;
}

export const simulateMatch = (setup: MatchSetup): HeatResult[] => withTotals(finishMatch(setup));
