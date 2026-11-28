import { createRng } from "@/sports/speedway/engine/v1/rng";
import type {
  IndividualDefinition,
  IndividualDivision,
  IndividualHeatResult,
  IndividualStage,
} from "@/sports/speedway/types/individual";

const pointsOf = (position: number, heatPoints: IndividualDefinition["scoring"]["heatPoints"]) =>
  heatPoints[position - 1] ?? 0;

/** Seed of the start-number draw of one tournament: every cycle and tournament has its own order. */
export const startNumberSeed = (
  def: IndividualDefinition,
  country: string,
  division: IndividualDivision,
  tournament: number,
) => `${def.seed}-${country.toLowerCase()}-${division}-t${tournament}`;

/**
 * Draws the start numbers. The result is in number order: index 0 = number 1. The same riders and
 * seed always give the same order, whatever order the riders come in.
 */
export function assignStartNumbers(riderIds: readonly string[], seed: string): string[] {
  const rng = createRng(seed);
  const order = [...riderIds].sort();
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [order[i], order[j]] = [order[j]!, order[i]!];
  }
  return order;
}

export type RegularRow = {
  riderId: string;
  startNumber: number;
  heats: number;
  points: number;
  firsts: number;
  seconds: number;
  thirds: number;
  rank: number;
};

/**
 * Ranking after the regular round (a projection while heats are still to come). Order: points,
 * then more 1st, 2nd and 3rd places, then the lower start number.
 * TODO: confirm; exclusions are not produced by the engine yet and a run-off is a separate task.
 */
export function rankRegular(
  heats: readonly IndividualHeatResult[],
  startOrder: readonly string[],
  heatPoints: IndividualDefinition["scoring"]["heatPoints"],
): RegularRow[] {
  const rows = new Map<string, RegularRow>(
    startOrder.map((riderId, i) => [
      riderId,
      {
        riderId,
        startNumber: i + 1,
        heats: 0,
        points: 0,
        firsts: 0,
        seconds: 0,
        thirds: 0,
        rank: 0,
      },
    ]),
  );

  for (const heat of heats) {
    if (heat.stage !== "regular") continue;
    for (const { riderId, position } of heat.riders) {
      const row = rows.get(riderId);
      if (!row) throw new Error(`Unknown rider ${riderId} in heat ${heat.number}`);
      row.heats++;
      row.points += pointsOf(position, heatPoints);
      if (position === 1) row.firsts++;
      if (position === 2) row.seconds++;
      if (position === 3) row.thirds++;
    }
  }

  const sorted = [...rows.values()].sort(
    (a, b) =>
      b.points - a.points ||
      b.firsts - a.firsts ||
      b.seconds - a.seconds ||
      b.thirds - a.thirds ||
      a.startNumber - b.startNumber,
  );
  sorted.forEach((row, i) => {
    row.rank = i + 1;
  });
  return sorted;
}

/** After the regular round: who rides the final directly and who rides the semi-final. */
export function qualify(
  ranking: readonly { riderId: string }[],
  stages: IndividualDefinition["stages"],
): { direct: string[]; semifinal: string[] } {
  const ids = ranking.map((row) => row.riderId);
  return {
    direct: ids.slice(0, stages.direct),
    semifinal: ids.slice(stages.direct, stages.direct + stages.semifinal),
  };
}

/**
 * The final: the direct qualifiers, then the best of the semi-final once it is ridden.
 * Before that it is shorter than 4 (the rest is "winner / 2nd of the semi-final").
 */
export function finalists(
  direct: readonly string[],
  semifinalHeat: IndividualHeatResult | undefined,
  stages: IndividualDefinition["stages"],
): string[] {
  const advanced = semifinalHeat
    ? [...semifinalHeat.riders]
        .sort((a, b) => a.position - b.position)
        .slice(0, stages.semifinalAdvance)
        .map((rider) => rider.riderId)
    : [];
  return [...direct, ...advanced];
}

export type TournamentRow = Record<IndividualStage | "total", number> & { riderId: string };

/** Points of every rider per stage and the tournament total (only the stages `counts` allows). */
export function tournamentPoints(
  heats: readonly IndividualHeatResult[],
  riderIds: readonly string[],
  scoring: IndividualDefinition["scoring"],
): Map<string, TournamentRow> {
  const rows = new Map<string, TournamentRow>(
    riderIds.map((riderId) => [riderId, { riderId, regular: 0, semifinal: 0, final: 0, total: 0 }]),
  );

  for (const heat of heats) {
    for (const { riderId, position } of heat.riders) {
      const row = rows.get(riderId);
      if (!row) throw new Error(`Unknown rider ${riderId} in heat ${heat.number}`);
      const points = pointsOf(position, scoring.heatPoints);
      row[heat.stage] += points;
      if (scoring.counts[heat.stage]) row.total += points;
    }
  }
  return rows;
}
