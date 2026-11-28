import type { RiderRaw } from "@/sports/speedway/data/schema";
import { JUNIOR_MAX_AGE } from "@/sports/speedway/engine/v1/squad";
import type { IndividualDefinition } from "@/sports/speedway/types/individual";

/** Riders of a nation that may ride the given division: juniors only for Junior, everybody for Open. */
export function divisionPool(riders: RiderRaw[], nationCode: string, division: string): RiderRaw[] {
  return riders.filter(
    (rider) =>
      rider.nation?.toLowerCase() === nationCode.toLowerCase() &&
      (division !== "junior" || rider.age <= JUNIOR_MAX_AGE),
  );
}

/** Checks the definition against the real riders and nations. Throws on start, like the schema does. */
export function assertIndividualDefinition(
  def: IndividualDefinition,
  riders: RiderRaw[],
  nationCodes: string[],
) {
  const errors: string[] = [];
  const riderById = new Map(riders.map((rider) => [rider.id, rider]));

  for (const code of nationCodes) {
    for (const division of def.divisions) {
      const pool = divisionPool(riders, code, division).length;
      if (pool < def.ridersPerTournament) {
        errors.push(`${code} ${division}: ${pool} riders, ${def.ridersPerTournament} needed`);
      }
    }
  }

  for (const [key, riderIds] of Object.entries(def.override)) {
    const [code, division] = key.split("-") as [string, string];
    if (!nationCodes.some((nation) => nation.toLowerCase() === code)) {
      errors.push(`override ${key}: unknown nation`);
      continue;
    }
    const pool = new Set(divisionPool(riders, code, division).map((rider) => rider.id));
    for (const id of riderIds) {
      if (!riderById.has(id)) errors.push(`override ${key}: unknown rider ${id}`);
      else if (!pool.has(id)) errors.push(`override ${key}: rider ${id} is not in this pool`);
    }
  }

  if (errors.length > 0) throw new Error(`individual.json: ${errors.join("; ")}`);
}
