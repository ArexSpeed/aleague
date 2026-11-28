import type {
  IndividualDefinition,
  IndividualDivision,
  IndividualFixture,
} from "@/sports/speedway/types/individual";

export const individualFixtureId = (
  competitionId: string,
  country: string,
  division: IndividualDivision,
  tournament: number,
) => `${competitionId}-${country}-${division}-t${tournament}`;

/** Every tournament of every cycle (nation x division x tournament), generated. No static file. */
export function generateIndividualFixtures(
  def: IndividualDefinition,
  nationCodes: string[],
): IndividualFixture[] {
  const fixtures: IndividualFixture[] = [];

  for (const code of nationCodes) {
    const country = code.toLowerCase();
    for (const division of def.divisions) {
      for (let tournament = 1; tournament <= def.tournaments; tournament++) {
        fixtures.push({
          id: individualFixtureId(def.id, country, division, tournament),
          competitionId: def.id,
          country,
          division,
          tournament,
          week: 0,
        });
      }
    }
  }
  return fixtures;
}

export type ParsedIndividualFixtureId = {
  competitionId: string;
  country: string;
  division: IndividualDivision;
  tournament: number;
};

const INDIVIDUAL_ID = /^(individual-[a-z]+)-([a-z]{3})-(junior|open)-t(\d+)$/;

export function parseIndividualFixtureId(id: string): ParsedIndividualFixtureId | null {
  const match = INDIVIDUAL_ID.exec(id);
  if (!match) return null;
  return {
    competitionId: match[1]!,
    country: match[2]!,
    division: match[3] as IndividualDivision,
    tournament: Number(match[4]),
  };
}
