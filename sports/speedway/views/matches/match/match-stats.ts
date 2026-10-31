import type { HeatRider, Match, MatchRider, Side } from "@/sports/speedway/types/match";

/** Pure helpers that turn a Match into what the views show. No React in here. */

export const SIDES: readonly Side[] = ["home", "away"];

/** Run columns in the squad tables (a rider normally starts 5 times). */
export const RUN_COLUMNS = 5;

export const isFinished = (match: Match) => match.status === "finished";

export const shortName = (rider: { firstName: string; lastName: string }) =>
  `${rider.firstName.charAt(0)}.${rider.lastName}`;

export const scoreOf = (match: Match, side: Side) =>
  side === "home" ? match.homeScore : match.awayScore;

/** Side that won the match, null for a draw or an unplayed match. */
export function winnerSide(match: Match): Side | null {
  if (match.homeScore === null || match.awayScore === null) return null;
  if (match.homeScore === match.awayScore) return null;
  return match.homeScore > match.awayScore ? "home" : "away";
}

export type RiderStart = { heat: number; start: HeatRider };

export function riderStarts(match: Match, riderId: string): RiderStart[] {
  return match.heats.flatMap((heat) =>
    heat.riders.filter((r) => r.riderId === riderId).map((start) => ({ heat: heat.number, start })),
  );
}

export const sumPoints = (starts: RiderStart[]) =>
  starts.reduce((sum, s) => sum + (s.start.points ?? 0), 0);

export const sumBonus = (starts: RiderStart[]) => starts.filter((s) => s.start.bonus).length;

export type SquadLine = { rider: MatchRider; starts: RiderStart[]; points: number; bonus: number };

export function squadLines(match: Match, side: Side): SquadLine[] {
  return match.squads[side].map((rider) => {
    const starts = riderStarts(match, rider.id);
    return { rider, starts, points: sumPoints(starts), bonus: sumBonus(starts) };
  });
}

export function findRider(match: Match, id: string): { rider: MatchRider; side: Side } | null {
  for (const side of SIDES) {
    const rider = match.roster[side].find((r) => r.id === id);
    if (rider) return { rider, side };
  }
  return null;
}

export function fastestHeat(match: Match): { heat: number; winner: HeatRider; time: number } | null {
  let best: { heat: number; winner: HeatRider; time: number } | null = null;
  for (const heat of match.heats) {
    const winner = heat.riders.find((r) => r.points === 3);
    if (heat.time === null || !winner) continue;
    if (!best || heat.time < best.time) best = { heat: heat.number, winner, time: heat.time };
  }
  return best;
}

/** Riders of a heat from the winner down (finished) or by gate (not run yet). */
export function riderOrder(riders: HeatRider[]): HeatRider[] {
  return [...riders].sort((a, b) => (b.points ?? -1) - (a.points ?? -1) || a.gate - b.gate);
}

export const byGate = (riders: HeatRider[]) => [...riders].sort((a, b) => a.gate - b.gate);
