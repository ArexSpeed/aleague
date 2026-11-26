import { rangeId, type PlaceRange } from "./plan";

export type CupTableInput = {
  clubId: string;
  /** Places the club fights for now. Null = not in a places group yet (round 1 not played). */
  range: PlaceRange | null;
  games: number;
  won: number;
  draw: number;
  lost: number;
  /** Small (heat) points in cup matches. */
  pointsPlus: number;
  pointsMinus: number;
};

export type CupTableRow = CupTableInput & {
  bilans: number;
  /** Final place, or the provisional one inside the group (from + index). Null before any group exists. */
  place: number | null;
  /** The group has a single place, so it is final. */
  decided: boolean;
  /** "9-16" for a group still playing, "" otherwise. */
  rangeLabel: string;
};

/**
 * Cup table: groups ordered by their places, inside a group by small-points balance, then small points
 * scored, then club id (stable; a seed-rank tie-break can replace it later).
 */
export function rankCupTable(inputs: CupTableInput[]): CupTableRow[] {
  const withBilans = inputs.map((input) => ({ ...input, bilans: input.pointsPlus - input.pointsMinus }));

  const sorted = withBilans.sort(
    (a, b) =>
      (a.range?.from ?? Infinity) - (b.range?.from ?? Infinity) ||
      (a.range?.to ?? Infinity) - (b.range?.to ?? Infinity) ||
      b.bilans - a.bilans ||
      b.pointsPlus - a.pointsPlus ||
      a.clubId.localeCompare(b.clubId),
  );

  const inGroup = new Map<string, number>();
  return sorted.map((row) => {
    if (!row.range) return { ...row, place: null, decided: false, rangeLabel: "" };

    const key = rangeId(row.range);
    const index = inGroup.get(key) ?? 0;
    inGroup.set(key, index + 1);

    const decided = row.range.from === row.range.to;
    return {
      ...row,
      place: row.range.from + index,
      decided,
      rangeLabel: decided ? "" : key,
    };
  });
}