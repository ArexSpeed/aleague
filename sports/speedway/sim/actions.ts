"use server";

import { revalidatePath } from "next/cache";

import { SEASON_FIXTURES } from "@/sports/speedway/data/season";
import { finishMatch, MATCH_HEATS, playNextHeat, setNextHeat } from "@/sports/speedway/engine/v1";
import { resolveLeagueIds } from "@/sports/speedway/api/league";
import { newStoredMatch, setupOf } from "./match-setup";
import { attemptOf, clearMatches, db, persist, putMatch, removeMatch, saveMatch, type StoredMatch } from "./results-store";
import { isSimEnabled } from "./sim-config";
import { isFinished } from "./stats";

/** Server actions behind the Start / Set / Simulate / Reset buttons. Test version only (SIM_TOOLS). */

function guard() {
  if (!isSimEnabled()) throw new Error("Simulation tools are off. Set SIM_TOOLS=true to use them.");
}

const refresh = () => revalidatePath("/", "layout");

const matchOf = (fixtureId: string): StoredMatch =>
  db().matches[fixtureId] ?? newStoredMatch(fixtureId, attemptOf(fixtureId));

/** Start: run the next heat of the match. */
export async function startHeatAction(fixtureId: string) {
  guard();
  const match = matchOf(fixtureId);
  if (isFinished(match)) return;
  match.heats.push(playNextHeat(setupOf(match), match.heats));
  saveMatch(match);
  refresh();
}

/** Set: the next heat with a result chosen by hand. `positions[gate - 1]` = finishing position 1-4. */
export async function setHeatAction(fixtureId: string, positions: number[]) {
  guard();
  const match = matchOf(fixtureId);
  if (isFinished(match)) return;
  match.heats.push(setNextHeat(setupOf(match), match.heats, positions));
  saveMatch(match);
  refresh();
}

/** Takes back the last heat (test tool). */
export async function undoHeatAction(fixtureId: string) {
  guard();
  const match = db().matches[fixtureId];
  if (!match) return;
  match.heats.pop();
  if (match.heats.length === 0) removeMatch(fixtureId, false);
  else saveMatch(match);
  refresh();
}

/** Simulate match: run every heat that is left. */
export async function simulateMatchAction(fixtureId: string) {
  guard();
  const match = matchOf(fixtureId);
  match.heats = finishMatch(setupOf(match), match.heats);
  saveMatch(match);
  refresh();
}

/** Throws the match away; the next run of it is a different match. */
export async function resetMatchAction(fixtureId: string) {
  guard();
  removeMatch(fixtureId, true);
  refresh();
}

/** Simulate round: every unfinished match of this matchday in the leagues of the group ("" = all). */
export async function simulateRoundAction(group: string, matchday: number) {
  guard();
  const leagues = resolveLeagueIds(group || undefined);
  for (const fixture of SEASON_FIXTURES) {
    if (fixture.matchday !== matchday || !leagues.includes(fixture.competitionId)) continue;
    const match = matchOf(fixture.id);
    if (match.heats.length >= MATCH_HEATS) continue;
    match.heats = finishMatch(setupOf(match), match.heats);
    putMatch(match);
  }
  persist();
  refresh();
}

/** Removes every result of the season. */
export async function resetSeasonAction() {
  guard();
  clearMatches();
  refresh();
}
