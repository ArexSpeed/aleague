"use server";

import { revalidatePath } from "next/cache";

import { resetCycleRiders, saveCycleRiders } from "@/sports/speedway/api/individual";
import { individualDivisionSchema } from "@/sports/speedway/types/individual";

type ActionResult = { ok: true } | { ok: false; error: string };

const refresh = () => revalidatePath("/", "layout");

/** Saves the hand-picked riders of a cycle. Only until the first heat; the api checks the rules. */
export async function saveIndividualSquadAction(
  country: string,
  division: string,
  riderIds: string[],
): Promise<ActionResult> {
  const parsed = individualDivisionSchema.safeParse(division);
  if (!parsed.success) return { ok: false, error: `Unknown division ${division}` };
  const problems = await saveCycleRiders(country, parsed.data, riderIds);
  if (problems.length) return { ok: false, error: problems.join(". ") };
  refresh();
  return { ok: true };
}

/** Drops the hand-picked riders: the cycle goes back to the automatic pick. */
export async function resetIndividualSquadAction(
  country: string,
  division: string,
): Promise<ActionResult> {
  const parsed = individualDivisionSchema.safeParse(division);
  if (!parsed.success) return { ok: false, error: `Unknown division ${division}` };
  const problems = await resetCycleRiders(country, parsed.data);
  if (problems.length) return { ok: false, error: problems.join(". ") };
  refresh();
  return { ok: true };
}
