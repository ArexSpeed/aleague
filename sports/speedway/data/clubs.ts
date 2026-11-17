import type { ClubCardData, ClubLeagueFilter } from "@/sports/speedway/types/teams";

export const CLUB_LEAGUE_ORDER: readonly ClubLeagueFilter[] = [
  "east-gold",
  "west-gold",
  "east-silver",
  "west-silver",
];

/** Pure selector. League is kept as a stable filter, while name is the final tie-breaker. */
export function getClubsByLeague(
  clubs: ClubCardData[],
  league: ClubLeagueFilter | "all",
): ClubCardData[] {
  const leagueOrder = new Map(CLUB_LEAGUE_ORDER.map((id, index) => [id, index]));
  return clubs
    .filter((club) => league === "all" || club.leagueId === league)
    .slice()
    .sort((a, b) =>
      (leagueOrder.get(a.leagueId) ?? CLUB_LEAGUE_ORDER.length) -
        (leagueOrder.get(b.leagueId) ?? CLUB_LEAGUE_ORDER.length) ||
      a.name.localeCompare(b.name),
    );
}
