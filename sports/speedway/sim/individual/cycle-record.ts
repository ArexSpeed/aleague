import type { RiderRaw } from "@/sports/speedway/data/schema";
import type { IndividualDivision, TournamentRecord } from "@/sports/speedway/types/individual";
import { divisionPool } from "./definition";

/** Id of the stored cycle record: individual-country-<nation>-<division>-cycle. */
export const cycleRecordId = (
  competitionId: string,
  country: string,
  division: IndividualDivision,
) => `${competitionId}-${country.toLowerCase()}-${division}-cycle`;

/** Prefix of every record of one cycle (the cycle record and its tournaments). */
export const cyclePrefix = (competitionId: string, country: string, division: IndividualDivision) =>
  `${competitionId}-${country.toLowerCase()}-${division}-`;

/** The riders can be changed until the first heat of the cycle is ridden. */
export const isCycleLocked = (tournaments: readonly TournamentRecord[]) =>
  tournaments.some((tournament) => tournament.heats.length > 0);

/** Problems with a hand-picked squad of a cycle; empty = fine. */
export function cycleRidersProblems(
  riderIds: readonly string[],
  riders: RiderRaw[],
  country: string,
  division: IndividualDivision,
  count: number,
): string[] {
  const problems: string[] = [];
  if (riderIds.length !== count)
    problems.push(`Pick exactly ${count} riders (got ${riderIds.length})`);
  if (new Set(riderIds).size !== riderIds.length) problems.push("Duplicate rider");
  const pool = new Set(divisionPool(riders, country, division).map((rider) => rider.id));
  for (const id of riderIds) if (!pool.has(id)) problems.push(`${id} cannot ride this cycle`);
  return problems;
}
