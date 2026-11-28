import type { Club, Fixture } from "@/sports/speedway/data/schema";
import type { CupDefinition } from "@/sports/speedway/types/cup";

import type { StoredMatch } from "../results-store";
import { standingsAsOfRound } from "../standings";
import { leagueLabel, snapshotMatchdays } from "./seeding";

export type SeededClub = { clubId: string; leagueId: string; pos: number };

export type SeededResult =
  | { status: "pending"; missing: string[] }
  | { status: "ready"; clubs: SeededClub[] };

/**
 * The best N clubs of each seeding league from its table at the snapshot matchday, or "pending"
 * (with what is missing) until every match up to that matchday is played.
 * Order = table position first, then league order of the definition: a stable seed rank.
 */
export function resolveSeeded(
  def: CupDefinition,
  fixtures: readonly Fixture[],
  matches: Record<string, StoredMatch>,
  clubs: readonly Club[],
): SeededResult {
  const snapshots = snapshotMatchdays(def, fixtures);
  const missing: string[] = [];
  const picked: SeededClub[] = [];

  for (const { leagueId, count } of def.seeding.seeded) {
    const { matchday } = snapshots.find((s) => s.leagueId === leagueId)!;
    const table = standingsAsOfRound(leagueId, def.seeding.snapshot.stage, matchday, fixtures, matches, clubs);

    if (!table.complete) {
      missing.push(`round ${matchday} of ${leagueLabel(leagueId)}`);
      continue;
    }
    for (const row of table.rows.slice(0, count)) {
      picked.push({ clubId: row.clubId, leagueId, pos: row.pos });
    }
  }

  if (missing.length > 0) return { status: "pending", missing };

  const leagueOrder = def.seeding.seeded.map((s) => s.leagueId);
  picked.sort((a, b) => a.pos - b.pos || leagueOrder.indexOf(a.leagueId) - leagueOrder.indexOf(b.leagueId));
  return { status: "ready", clubs: picked };
}