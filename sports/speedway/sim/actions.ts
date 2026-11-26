"use server";

import { revalidatePath } from "next/cache";

import { SEASON_FIXTURES, CUP_FIXTURES } from "@/sports/speedway/data/season";
import { finishMatch, MATCH_HEATS, playNextHeat, setNextHeat } from "@/sports/speedway/engine/v1";
import { resolveLeagueIds } from "@/sports/speedway/api/league";
import type { Side } from "@/sports/speedway/types/match";
import type { LineupDraft } from "./lineup-draft";
import { clubRiders, clubsOfMatch, newStoredMatch, setupOf } from "./match-setup";
import { canRewind, resolveFixture, getCupRuntime } from "./cup/resolve-fixture";
import { validateSquad } from "./lineup-draft";
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

type ActionResult = { ok: true } | { ok: false; error: string };

/** The stored match, or a fresh one that has not been started (and not saved) yet. A cup match takes its clubs from the draw. */
async function openMatch(
  fixtureId: string,
): Promise<{ ok: true; match: StoredMatch } | { ok: false; error: string }> {
  const row = await getRow(fixtureId);
  if (row.data) return { ok: true, match: row.data };
  const clubs = await resolveFixture(fixtureId);
  if (!clubs.ok) return clubs;
  return { ok: true, match: newStoredMatch(fixtureId, row.attempt, clubs) };
}

/** Saves the lineup changes made in the UI into the match, so the engine rides who the player picked. */
function applyLineup(match: StoredMatch, squads: Record<Side, string[]>) {
  const clubs = clubsOfMatch(match);
  const clubId = { home: clubs.homeId, away: clubs.awayId };

  for (const side of ["home", "away"] as const) {
    const ids = [...squads[side]];
    if (ids.length !== 8) {
      throw new Error(`Invalid squad for ${side}: expected 8 riders, got ${ids.length}`);
    }
    const club = clubRiders(clubId[side]);
    const inClub = new Set(club.map((r) => r.id));
    for (const id of ids) {
      if (!inClub.has(id)) throw new Error("Rider is not in this club");
    }
    const validation = validateSquad(ids, new Map(club.map((r) => [r.id, { age: r.age }])));
    if (!validation.ok) throw new Error(validation.reason);
    match.squads[side] = ids;
  }

  if (match.heats.length > 0) throw new Error("The squad can only change before the first heat");
}

function applyDraft(match: StoredMatch, draft?: LineupDraft) {
  if (!draft) return;
const clubs = clubsOfMatch(match);
  for (const side of ["home", "away"] as const) {
    const sideDraft = draft.squads?.[side];

    if (!sideDraft) continue;
    const club = clubRiders(side === "home" ? clubs.homeId : clubs.awayId);
    const riders = new Map(club.map((r) => [r.id, { age: r.age }]));
    const ids = [...match.squads[side]];
    for (const [slot, riderId] of Object.entries(sideDraft)) {
      const slotIndex = Number(slot) - 1;
      if (Number.isNaN(slotIndex) || slotIndex < 0 || slotIndex >= ids.length) {
        throw new Error(`Invalid squad slot ${slot}`);
      }
      const next = [...ids];
      const current = next[slotIndex];
      if (current === riderId) continue;
      const otherIndex = next.indexOf(riderId);
      if (otherIndex >= 0 && otherIndex !== slotIndex) {
        [next[slotIndex], next[otherIndex]] = [next[otherIndex], next[slotIndex]];
      } else {
        next[slotIndex] = riderId;
      }
      const validation = validateSquad(next, riders);
      if (!validation.ok) throw new Error(validation.reason);
      ids.splice(0, ids.length, ...next);
    }
    match.squads[side] = ids;
  }

  match.substitutions ??= {};
  for (const [heat, byGate] of Object.entries(draft.substitutions ?? {})) {
    const heatNumber = Number(heat);
    match.substitutions[heatNumber] ??= {};
    for (const [gate, sub] of Object.entries(byGate)) {
      const gateNumber = Number(gate);
      match.substitutions[heatNumber][gateNumber] = { riderId: sub.riderId, kind: sub.kind };
    }
  }
}

export async function saveLineupAction(
  fixtureId: string,
  squads: Record<Side, string[]>,
): Promise<ActionResult> {
  try {
    const opened = await openMatch(fixtureId);
    if (!opened.ok) return opened;
    const match = opened.match;
    if (match.heats.length > 0) {
      return { ok: false, error: "The squad can only change before the first heat" };
    }
    applyLineup(match, squads);
    await saveMatch(match);
    refresh();
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Could not save the lineup",
    };
  }
}

/** Start: run the next heat of the match. */
export async function startHeatAction(fixtureId: string, lineup?: LineupDraft): Promise<ActionResult> {
  guard();
  const opened = await openMatch(fixtureId);
  if (!opened.ok) return opened;
  const { match } = opened;
  if (isFinished(match)) return { ok: true };
  applyDraft(match, lineup);
  match.heats.push(playNextHeat(setupOf(match), match.heats));
  await saveMatch(match);
  refresh();
  return { ok: true };
}

/** Set: the next heat with a result chosen by hand. `positions[gate - 1]` = finishing position 1-4. */
export async function setHeatAction(
  fixtureId: string,
  positions: number[],
  lineup?: LineupDraft,
): Promise<ActionResult> {
  guard();
  const opened = await openMatch(fixtureId);
  if (!opened.ok) return opened;
  const { match } = opened;
  if (isFinished(match)) return { ok: true };
  applyDraft(match, lineup);
  match.heats.push(setNextHeat(setupOf(match), match.heats, positions));
  await saveMatch(match);
  refresh();
  return { ok: true };
}

/** Takes back the last heat (test tool). */
export async function undoHeatAction(fixtureId: string): Promise<ActionResult> {
  guard();
  const rewind = await canRewind(fixtureId);
  if (!rewind.ok) return rewind;
  const { data: match } = await getRow(fixtureId);
  if (!match) return { ok: true };
  match.heats.pop();
  if (match.heats.length === 0) await removeMatch(fixtureId, false);
  else await saveMatch(match);
  refresh();
  return { ok: true };
}

/** Simulate match: run every heat that is left. */
export async function simulateMatchAction(fixtureId: string, lineup?: LineupDraft): Promise<ActionResult> {
  guard();
  const opened = await openMatch(fixtureId);
  if (!opened.ok) return opened;
  const { match } = opened;
  applyDraft(match, lineup);
  match.heats = finishMatch(setupOf(match), match.heats);
  await saveMatch(match);
  refresh();
  return { ok: true };
}

/** Throws the match away; the next run of it is a different match. */
export async function resetMatchAction(fixtureId: string): Promise<ActionResult> {
  guard();
  const rewind = await canRewind(fixtureId);
  if (!rewind.ok) return rewind;
  await removeMatch(fixtureId, true);
  refresh();
  return { ok: true };
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

/** Simulate cup round: every match of the round whose pair is already drawn (both legs). */
export async function simulateCupRoundAction(roundId: string): Promise<ActionResult> {
  guard();
  const { participants } = await getCupRuntime();
  const fixtures = CUP_FIXTURES.filter((f) => f.stage === roundId && participants.has(f.id));
  if (fixtures.length === 0) return { ok: false, error: "Nothing to simulate: the draw is pending" };

  const rows = await getRows(fixtures.map((f) => f.id));
  const changed: StoredMatch[] = [];
  for (const fixture of fixtures) {
    const row = rows.get(fixture.id);
    const match = row?.data ?? newStoredMatch(fixture.id, row?.attempt ?? 0, participants.get(fixture.id)!);
    if (match.heats.length >= MATCH_HEATS) continue;
    match.heats = finishMatch(setupOf(match), match.heats);
    changed.push(match);
  }
  await saveMatches(changed);
  refresh();
  return { ok: true };
}