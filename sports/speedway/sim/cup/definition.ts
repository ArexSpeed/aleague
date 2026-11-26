import type { CupDefinition } from "@/sports/speedway/types/cup";

const isPowerOfTwo = (n: number) => n > 0 && (n & (n - 1)) === 0;

/**
 * Numbers that follow from the club count, so none of them is typed by hand.
 * 48 clubs -> top group 32, 32 clubs play round 1, 16 seeded, 6 rounds.
 */
export function cupStructure(clubCount: number) {
  let top = 1;
  while (top * 2 < clubCount) top *= 2;
  const qualClubs = 2 * (clubCount - top);
  return {
    top,
    qualClubs,
    seeded: clubCount - qualClubs,
    rounds: 1 + Math.round(Math.log2(top)),
  };
}

/** Checks the definition against the real clubs. Throws on start, like the schema does. */
export function assertCupDefinition(def: CupDefinition, clubs: { leagueId: string }[]) {
  const clubsIn = new Map(
    def.leagues.map((league) => [league, clubs.filter((c) => c.leagueId === league).length] as const),
  );
  const errors: string[] = [];

  for (const [league, count] of clubsIn) {
    if (count === 0) errors.push(`league "${league}" has no clubs`);
  }

  const total = [...clubsIn.values()].reduce((sum, n) => sum + n, 0);
  const structure = cupStructure(total);

  if (!isPowerOfTwo(total - structure.top)) {
    errors.push(`${total} clubs cannot be split into halving groups`);
  }

  const seededSum = def.seeding.seeded.reduce((sum, entry) => sum + entry.count, 0);
  if (seededSum !== structure.seeded) {
    errors.push(`seeded clubs: expected ${structure.seeded}, got ${seededSum}`);
  }
  for (const entry of def.seeding.seeded) {
    if (entry.count > (clubsIn.get(entry.leagueId) ?? 0)) {
      errors.push(`league "${entry.leagueId}" has fewer clubs than ${entry.count} seeded`);
    }
  }

  if (def.rounds.length !== structure.rounds) {
    errors.push(`rounds: expected ${structure.rounds}, got ${def.rounds.length}`);
  }

  if (errors.length > 0) throw new Error(`cup.json: ${errors.join("; ")}`);
}