import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { connection } from "next/server";

import type { PlayedHeat, Weather } from "@/sports/speedway/engine/v1";

/**
 * Match results of the test version, kept on the server: in memory while the app runs and in
 * .sim/season-1.json (git-ignored) so they survive a restart and can be moved to Supabase later.
 * `StoredMatch` is the row shape the database table will have.
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
};

type Db = { version: 1; attempts: Record<string, number>; matches: Record<string, StoredMatch> };

const FILE = path.join(process.cwd(), ".sim", "season-1.json");
const globalForDb = globalThis as unknown as { __aleagueSim?: Db };

function load(): Db {
  try {
    return JSON.parse(readFileSync(FILE, "utf8")) as Db;
  } catch {
    return { version: 1, attempts: {}, matches: {} };
  }
}

/** Synchronous access for the server actions that change results. */
export const db = (): Db => (globalForDb.__aleagueSim ??= load());

/** Writes the file. Call once after a batch of `putMatch`. */
export function persist() {
  mkdirSync(path.dirname(FILE), { recursive: true });
  writeFileSync(FILE, JSON.stringify(db()));
}

/** For pages: waits for the request first, so results are never frozen into a prerendered page. */
export async function readMatches(): Promise<Record<string, StoredMatch>> {
  await connection();
  return db().matches;
}

export const attemptOf = (fixtureId: string) => db().attempts[fixtureId] ?? 0;

/** Keeps the match in memory only; `persist()` writes the file. */
export function putMatch(match: StoredMatch) {
  db().matches[match.fixtureId] = match;
}

export function saveMatch(match: StoredMatch) {
  putMatch(match);
  persist();
}

/** Removes a match; `reroll` makes the next run of it a different match. */
export function removeMatch(fixtureId: string, reroll: boolean) {
  delete db().matches[fixtureId];
  if (reroll) db().attempts[fixtureId] = attemptOf(fixtureId) + 1;
  persist();
}

export function clearMatches() {
  for (const id of Object.keys(db().matches)) db().attempts[id] = attemptOf(id) + 1;
  db().matches = {};
  persist();
}
