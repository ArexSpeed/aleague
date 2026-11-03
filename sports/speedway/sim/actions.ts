"use server";

import { revalidatePath } from "next/cache";

import { SEASON_FIXTURES } from "@/sports/speedway/data/season";
import { finishMatch, MATCH_HEATS, playNextHeat, setNextHeat } from "@/sports/speedway/engine/v1";
import { resolveLeagueIds } from "@/sports/speedway/api/league";
import type { LineupDraft } from "./lineup-draft";
import { clubRiders, FIXTURE_BY_ID, newStoredMatch, setupOf } from "./match-setup";
import {
  clearMatches,
  getRow,
  getRows,
  removeMatch,
  saveMatch,
  saveMatches,
  type StoredMatch,
} from "./results-store";
import { isSimEnabled } from "./sim-config";
import { isFinished } from "./stats";

/** Server actions behind the Start / Set / Simulate / Reset buttons. Test version only (SIM_TOOLS). */

function guard() {
  if (!isSimEnabled()) throw new Error("Simulation tools are off. Set SIM_TOOLS=true to use them.");
}

const refresh = () => revalidatePath("/", "layout");

/** The stored match, or a fresh one that has not been started (and not saved) yet. */
async function matchOf(fixtureId: string): Promise<StoredMatch> {
  const row = await getRow(fixtureId);
  return row.data ?? newStoredMatch(fixtureId, row.attempt);
}

/** Saves the lineup changes made in the UI into the match, so the engine rides who the player picked. */
function applyLineup(match: StoredMatch, draft?: LineupDraft) {
  if (!draft) return;
  const fixture = FIXTURE_BY_ID.get(match.fixtureId)!;
  const clubId = { home: fixture.homeId, away: fixture.awayId };
  const inClub = (side: "home" | "away", id: string) =>
    clubRiders(clubId[side]).some((r) => r.id === id);

  // Squad changes: replace the rider id in the squad array (only before the first heat).
  for (const side of ["home", "away"] as const) {
    const ids = [...match.squads[side]];
    let changed = false;
    for (const [slot, riderId] of Object.entries(draft.squads?.[side] ?? {})) {
      if (ids[Number(slot) - 1] === riderId) continue;
      if (!inClub(side, riderId)) throw new Error("Rider is not in this club");
      ids[Number(slot) - 1] = riderId;
      changed = true;
    }
    if (!changed) continue;
    if (match.heats.length > 0) throw new Error("The squad can only change before the first heat");
    if (new Set(ids).size !== ids.length) throw new Error("A rider can be in the squad only once");
    match.squads[side] = ids;
  }

  // Substitutions for a single heat (normal / tactic): only for heats not run yet.
  match.substitutions ??= {};
  for (const [heat, byGate] of Object.entries(draft.substitutions ?? {})) {
    if (Number(heat) <= match.heats.length) continue;
    match.substitutions[Number(heat)] = byGate;
  }
}

/** Start: run the next heat of the match. */
export async function startHeatAction(fixtureId: string, lineup?: LineupDraft) {
  guard();
  const match = await matchOf(fixtureId);
  if (isFinished(match)) return;
  applyLineup(match, lineup);
  match.heats.push(playNextHeat(setupOf(match), match.heats));
  await saveMatch(match);
  refresh();
}

/** Set: the next heat with a result chosen by hand. `positions[gate - 1]` = finishing position 1-4. */
export async function setHeatAction(fixtureId: string, positions: number[], lineup?: LineupDraft) {
  guard();
  const match = await matchOf(fixtureId);
  if (isFinished(match)) return;
  applyLineup(match, lineup);
  match.heats.push(setNextHeat(setupOf(match), match.heats, positions));
  await saveMatch(match);
  refresh();
}

/** Takes back the last heat (test tool). */
export async function undoHeatAction(fixtureId: string) {
  guard();
  const { data: match } = await getRow(fixtureId);
  if (!match) return;
  match.heats.pop();
  if (match.heats.length === 0) await removeMatch(fixtureId, false);
  else await saveMatch(match);
  refresh();
}

/** Simulate match: run every heat that is left. */
export async function simulateMatchAction(fixtureId: string, lineup?: LineupDraft) {
  guard();
  const match = await matchOf(fixtureId);
  applyLineup(match, lineup);
  match.heats = finishMatch(setupOf(match), match.heats);
  await saveMatch(match);
  refresh();
}

/** Throws the match away; the next run of it is a different match. */
export async function resetMatchAction(fixtureId: string) {
  guard();
  await removeMatch(fixtureId, true);
  refresh();
}

/** Simulate round: every unfinished match of this matchday in the leagues of the group ("" = all). */
export async function simulateRoundAction(group: string, matchday: number) {
  guard();
  const leagues = resolveLeagueIds(group || undefined);
  const fixtures = SEASON_FIXTURES.filter(
    (f) => f.matchday === matchday && leagues.includes(f.competitionId),
  );

  // One read for the whole round, one write for everything that changed.
  const rows = await getRows(fixtures.map((f) => f.id));
  const changed: StoredMatch[] = [];
  for (const fixture of fixtures) {
    const row = rows.get(fixture.id);
    const match = row?.data ?? newStoredMatch(fixture.id, row?.attempt ?? 0);
    if (match.heats.length >= MATCH_HEATS) continue;
    match.heats = finishMatch(setupOf(match), match.heats);
    changed.push(match);
  }
  await saveMatches(changed);
  refresh();
}

/** Removes every result of the season. */
export async function resetSeasonAction() {
  guard();
  await clearMatches();
  refresh();
}
