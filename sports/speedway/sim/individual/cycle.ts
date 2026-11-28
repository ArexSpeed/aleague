export type CycleRow = {
  riderId: string;
  /** Tournament points of T1..Tn, null = not ridden (yet). */
  perTournament: (number | null)[];
  total: number;
  /** Tournaments the rider won (most points of that tournament, a tie shares the win). */
  wins: number;
  rank: number;
};

/**
 * Cycle table: the sum of the tournament points. Tie: more tournament wins, then the id so that
 * the order is stable. TODO: confirm the tie-break.
 * `tournaments[n]` = tournament points by rider id of tournament n + 1, or null if not ridden.
 */
export function cycleTable(
  riderIds: readonly string[],
  tournaments: readonly (ReadonlyMap<string, number> | null | undefined)[],
): CycleRow[] {
  const best = tournaments.map((points) =>
    points && points.size > 0 ? Math.max(...points.values()) : null,
  );

  const rows: CycleRow[] = riderIds.map((riderId) => {
    const perTournament = tournaments.map((points) => points?.get(riderId) ?? null);
    return {
      riderId,
      perTournament,
      total: perTournament.reduce<number>((sum, value) => sum + (value ?? 0), 0),
      wins: perTournament.filter((value, i) => value !== null && value === best[i]).length,
      rank: 0,
    };
  });

  rows.sort((a, b) => b.total - a.total || b.wins - a.wins || a.riderId.localeCompare(b.riderId));
  rows.forEach((row, i) => {
    row.rank = i + 1;
  });
  return rows;
}
