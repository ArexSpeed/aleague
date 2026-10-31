import { z } from "zod";

import { TEAM_ENTRIES } from "@/sports/speedway/mocks/teams";
import { teamEntrySchema, type TeamEntry } from "@/sports/speedway/types/teams";

/** Mock for now; parsed at the boundary like the other api files. */
export async function getTeamEntries(kind: TeamEntry["kind"]): Promise<TeamEntry[]> {
  return z.array(teamEntrySchema).parse(TEAM_ENTRIES).filter((entry) => entry.kind === kind);
}

export async function getTeamEntry(id: string): Promise<TeamEntry | null> {
  const entries = z.array(teamEntrySchema).parse(TEAM_ENTRIES);
  return entries.find((entry) => entry.id === id) ?? null;
}
