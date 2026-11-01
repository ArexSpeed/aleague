/**
 * Fixture scheduler. Pure functions, no I/O, so it runs in a script, in a test
 * and in the app alike. A competition is a list of stages (see data/season-N/competitions.json);
 * this file turns one stage into matchdays.
 */

export type Pairing = { home: string; away: string };
/** One matchday: every team of the group plays exactly once. */
export type Round = Pairing[];

/**
 * Double round robin: n teams -> 2 * (n - 1) rounds, every team plays once per round.
 *
 * First half uses the Berger construction (the last team is fixed, the others rotate)
 * with a home/away rule that keeps every team to at most 2 home or 2 away games in a row.
 * Second half repeats the first with home and away swapped, so everyone hosts every
 * opponent exactly once. Team order = input order.
 */
export function doubleRoundRobin(teams: readonly string[]): Round[] {
  const n = teams.length;
  if (n < 2 || n % 2 !== 0) {
    throw new Error(`Round robin needs an even number of teams (got ${n})`);
  }

  const m = n - 1; // rounds in one half = size of the rotating circle (odd)
  const fixed = n - 1;
  const half = (m + 1) / 2; // inverse of 2 modulo m
  const first: Round[] = [];

  for (let r = 0; r < m; r++) {
    const round: Round = [];
    // The team k with 2k = r (mod m) plays the fixed team.
    const k = (r * half) % m;
    round.push(r % 2 === 0 ? pair(teams, fixed, k) : pair(teams, k, fixed));

    // Every other pair (i, j) has i + j = r (mod m).
    for (let i = 0; i < m; i++) {
      const j = (((r - i) % m) + m) % m;
      if (i >= j) continue;
      const lowHosts = (r % 2 === 0) === (j - i <= m / 2);
      round.push(lowHosts ? pair(teams, i, j) : pair(teams, j, i));
    }
    first.push(round);
  }

  const second = first.map((round) => round.map(({ home, away }) => ({ home: away, away: home })));
  return [...first, ...second];
}

function pair(teams: readonly string[], home: number, away: number): Pairing {
  return { home: teams[home]!, away: teams[away]! };
}

/** Groups play in parallel: matchday k of the stage = round k of every group. */
export function mergeGroups(groups: readonly Round[][]): Round[] {
  const length = Math.max(...groups.map((g) => g.length));
  return Array.from({ length }, (_, k) => groups.flatMap((g) => g[k] ?? []));
}

export type StandingRow = { teamId: string; points: number };

/** Teams of a split group, taken from the standings of the previous stage (ranks are 1-based). */
export function takeRanks(
  standings: Record<string, readonly StandingRow[]>,
  take: readonly { group: string; ranks: readonly [number, number] }[],
): string[] {
  return take.flatMap(({ group, ranks: [from, to] }) =>
    (standings[group] ?? []).slice(from - 1, to).map((row) => row.teamId),
  );
}
