import { z } from "zod";

import { CLUBS } from "@/sports/speedway/data/season";
import regionsJson from "@/sports/speedway/data/season-1/regions.json";
import nationsJson from "@/sports/speedway/data/season-1/nations.json";
import { getClubsByLeague } from "@/sports/speedway/data/clubs";
import { TEAM_ENTRIES } from "@/sports/speedway/mocks/teams";
import {
  clubCardDataSchema,
  teamEntrySchema,
  nationCardDataSchema,
  type ClubCardData,
  type ClubLeague,
  type NationCardData,
  type TeamEntry,
} from "@/sports/speedway/types/teams";

const LEAGUE_LABELS: Record<ClubLeague, string> = {
  "west-gold": "West Gold",
  "east-gold": "East Gold",
  "west-silver": "West Silver",
  "east-silver": "East Silver",
};

const REGION_BY_ID = new Map(regionsJson.map((region) => [region.id, region.name]));

/** Real club cards derived from season clubs. Missing optional data is intentionally not invented. */
export async function getClubCards(league: ClubLeague | "all" = "all"): Promise<ClubCardData[]> {
  const cards = CLUBS.map((club): ClubCardData => {
    const leagueId = club.leagueId as ClubLeague;

    return clubCardDataSchema.parse({
      id: club.id,
      name: club.name,
      subName: club.subName,
      short: club.short,
      fullName: club.fullName,
      color: club.color,
      icon: club.icon,
      region: REGION_BY_ID.get(club.regionId) ?? club.regionId,
      city: club.city,
      leagueId,
      leagueLabel: LEAGUE_LABELS[leagueId],
      stadium: { name: club.stadium.name, capacity: club.stadium.capacity },
      trackLength: club.stadium.trackLength,
      surface: club.stadium.surface,
      href: `/teams/${club.id}`,
    });
  });

  return getClubsByLeague(cards, league);
}

/** Mock for now; parsed at the boundary like the other api files. */
export async function getTeamEntries(kind: TeamEntry["kind"]): Promise<TeamEntry[]> {
  return z
    .array(teamEntrySchema)
    .parse(TEAM_ENTRIES)
    .filter((entry) => entry.kind === kind);
}

export async function getTeamEntry(id: string): Promise<TeamEntry | null> {
  const entries = z.array(teamEntrySchema).parse(TEAM_ENTRIES);
  return entries.find((entry) => entry.id === id) ?? null;
}

/** Real nation cards derived from season nations. Missing optional data is intentionally not invented. */
export async function getNations(): Promise<NationCardData[]> {
  const nations = z.array(nationCardDataSchema).parse(nationsJson);
  return nations.sort((a, b) => a.name.localeCompare(b.name));
}
