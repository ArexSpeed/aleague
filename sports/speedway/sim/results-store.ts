import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { connection } from "next/server";

import type { PlayedHeat, Weather } from "@/sports/speedway/engine/v1";

/**
 * Match results of the test version, kept in one Supabase table: `sim_matches`,
 * a row per match with the whole `StoredMatch` in the jsonb column `data`.
 * `attempt` survives a reset: a reset empties `data` and changes `attempt`, so the next run is a different match.
 */

export type StoredMatch = {
  fixtureId: string;
  engine: string;
  /** Re-rolling a match (reset) changes the seed, so the next run is a different match. */
  seed: string;
  luck: number;
  weather: Weather;
  /** Rider ids by slot 1-8. */
  squads: { home: string[]; away: string[] };
  /** Heats played so far, in order. 15 = the match is finished. */
  heats: PlayedHeat[];
  substitutions?: Record<number, Record<number, { riderId: string; kind: "normal" | "tactic" }>>;
};

/** What the table holds for a fixture. No row = `{ attempt: 0, data: null }`. */
export type MatchRow = { attempt: number; data: StoredMatch | null };

const TABLE = "speedway_sim_matches";
/** Supabase returns at most 1000 rows per request. */
const PAGE = 1000;

function createSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, key, {
    db: { schema: "aleague" },
    auth: { persistSession: false },
    // Results change all the time: never let Next cache the requests.
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
  });
}

let client: ReturnType<typeof createSupabase> | undefined;

const supabase = () => (client ??= createSupabase());

function chunks<T>(items: T[], size: number): T[][] {
  const parts: T[][] = [];
  for (let i = 0; i < items.length; i += size) parts.push(items.slice(i, i + size));
  return parts;
}

function fail(error: { message: string }): never {
  throw new Error(`Database error: ${error.message}`);
}

const toRow = (r: { attempt: unknown; data: unknown }): MatchRow => ({
  attempt: Number(r.attempt ?? 0),
  data: (r.data as StoredMatch | null) ?? null,
});

/** One fixture: its stored match (if any) and the attempt number. */
export async function getRow(fixtureId: string): Promise<MatchRow> {
  const db = supabase();
  if (!db) return { attempt: 0, data: null };

  const { data, error } = await db
    .from(TABLE)
    .select("attempt, data")
    .eq("fixture_id", fixtureId)
    .maybeSingle();
  if (error) fail(error);
  return data ? toRow(data) : { attempt: 0, data: null };
}

/** Many fixtures at once (a round). Fixtures without a row are missing from the map. */
export async function getRows(fixtureIds: string[]): Promise<Map<string, MatchRow>> {
  const rows = new Map<string, MatchRow>();
  const db = supabase();
  if (!db) return rows;

  for (const part of chunks(fixtureIds, 100)) {
    const { data, error } = await db
      .from(TABLE)
      .select("fixture_id, attempt, data")
      .in("fixture_id", part);
    if (error) fail(error);
    for (const r of data ?? []) rows.set(r.fixture_id as string, toRow(r));
  }
  return rows;
}

/** Saves matches (insert or update). Does not touch `attempt`. */
export async function saveMatches(matches: StoredMatch[]) {
  const db = supabase();
  if (!db) return;

  for (const part of chunks(matches, 20)) {
    const { error } = await db.from(TABLE).upsert(
      part.map((m) => ({ fixture_id: m.fixtureId, data: m })),
      { onConflict: "fixture_id" },
    );
    if (error) fail(error);
  }
}

export const saveMatch = (match: StoredMatch) => saveMatches([match]);

/** Empties a match; `reroll` makes the next run of it a different match. */
export async function removeMatch(fixtureId: string, reroll: boolean) {
  const db = supabase();
  if (!db) return;

  const row: Record<string, unknown> = { fixture_id: fixtureId, data: null };
  if (reroll) row.attempt = Date.now();
  const { error } = await db.from(TABLE).upsert(row, { onConflict: "fixture_id" });
  if (error) fail(error);
}

/** Empties every match of the season; each of them is a different match next time. */
export async function clearMatches() {
  const db = supabase();
  if (!db) return;

  const { error } = await db
    .from(TABLE)
    .update({ data: null, attempt: Date.now() })
    .not("data", "is", null);
  if (error) fail(error);
}

/** For pages: waits for the request first, so results are never frozen into a prerendered page. */
export async function readMatches(): Promise<Record<string, StoredMatch>> {
  await connection();
  const matches: Record<string, StoredMatch> = {};
  const db = supabase();
  if (!db) return matches;

  for (let from = 0; ; from += PAGE) {
    const { data, error } = await db
      .from(TABLE)
      .select("fixture_id, data")
      .not("data", "is", null)
      .order("fixture_id")
      .range(from, from + PAGE - 1);
    if (error) fail(error);
    for (const row of data ?? []) matches[row.fixture_id as string] = row.data as StoredMatch;
    if ((data?.length ?? 0) < PAGE) break;
  }
  return matches;
}
