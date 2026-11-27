import { sportPath } from "@/lib/paths";
import type { ClubStatsSource } from "@/sports/speedway/competitions-config";
import { CLUB_BY_REF } from "@/sports/speedway/data/season";
import { emptyTeamStats, type TeamStats } from "@/sports/speedway/sim/stats";
import type { FixtureWithTeams } from "@/sports/speedway/types/fixtures";
import type { LeagueRider, LeagueRiderWithSkills } from "@/sports/speedway/types/league";
import { getCupStatsView, getCupTeamDetail, getCupTeamStats } from "./cup";
import { getTeamFixtures } from "./fixtures";
import { getLeagueTeam, getTeamRiders } from "./league";

/** One match of the club in the aside Games tab. */
export type ClubPanelGame = {
  id: string;
  href: string;
  /** Short round label: "R3" in the league, "R2 L1" (round, leg) in the cup. */
  label: string;
  home: boolean;
  opponent: string;
  /** From the club's point of view; null until the match is finished. */
  score: { for: number; against: number } | null;
};

export type ClubPanelData = {
  source: ClubStatsSource;
  team: { id: string; name: string; subName?: string | undefined; short: string; color: string; icon: string };
  /** Current place in the source competition: "3" in the league, "9–16" in the cup until decided. */
  place: string;
  stats: TeamStats;
  riders: LeagueRider[];
  games: ClubPanelGame[];
};

/** Heavier parts of the panel, loaded only when the open tab shows them (otherwise empty). */
export type ClubPanelPart = "riders" | "games";

type SourceData = Pick<ClubPanelData, "place" | "stats" | "riders" | "games">;
type Parts = ReadonlySet<ClubPanelPart>;

const matchHref = (id: string) => sportPath("speedway", `matches/${id}`);

async function loadLeague(clubId: string, parts: Parts): Promise<SourceData> {
  const [team, riders, fixtures] = await Promise.all([
    getLeagueTeam(clubId),
    parts.has("riders") ? getTeamRiders(clubId) : Promise.resolve([] as LeagueRider[]),
    parts.has("games") ? getTeamFixtures(clubId) : Promise.resolve([] as FixtureWithTeams[]),
  ]);

  return {
    place: team ? String(team.pos) : "–",
    stats: team ?? emptyTeamStats(),
    riders,
    games: fixtures.map((fixture): ClubPanelGame => {
      const home = fixture.homeId === clubId;
      const own = home ? fixture.homeScore : fixture.awayScore;
      const opp = home ? fixture.awayScore : fixture.homeScore;
      return {
        id: fixture.id,
        href: matchHref(fixture.id),
        label: `R${fixture.matchday}`,
        home,
        opponent: (home ? fixture.away : fixture.home).name,
        score: own === null || opp === null ? null : { for: own, against: opp },
      };
    }),
  };
}

async function loadCup(clubId: string, parts: Parts): Promise<SourceData> {
  const [detail, stats, riders] = await Promise.all([
    getCupTeamDetail(clubId),
    getCupTeamStats(clubId),
    parts.has("riders") ? getCupStatsView() : Promise.resolve([] as LeagueRiderWithSkills[]),
  ]);
  // Without `selected` the detail is the top club of the table, not this one.
  const cup = detail?.selected ? detail.detail : null;
  const row = cup?.row;

  const games: ClubPanelGame[] = parts.has("games")
    ? (cup?.games ?? []).map(
        (game): ClubPanelGame => ({
          id: game.id,
          href: game.href,
          label: `R${game.roundNumber} L${game.leg}`,
          home: game.home,
          opponent: game.opponent.name,
          score: game.score,
        }),
      )
    : [];

  return {
    place: row ? (row.decided && row.place !== null ? String(row.place) : (row.rangeLabel ?? "–")) : "–",
    stats,
    riders: riders.filter((rider) => rider.teamId === clubId),
    games,
  };
}

/** A new source must be added here too: the record is exhaustive over `ClubStatsSource`. */
const LOADERS: Record<ClubStatsSource, (clubId: string, parts: Parts) => Promise<SourceData>> = {
  league: loadLeague,
  cup: loadCup,
};

/** Everything the club aside shows for one club, counted from one competition only. Null for an unknown club. */
export async function getClubPanelData(
  clubRef: string,
  source: ClubStatsSource,
  parts: readonly ClubPanelPart[] = [],
): Promise<ClubPanelData | null> {
  const club = CLUB_BY_REF.get(clubRef);
  if (!club) return null;

  const data = await LOADERS[source](club.id, new Set(parts));
  return {
    source,
    team: {
      id: club.id,
      name: club.name,
      subName: club.subName,
      short: club.short,
      color: club.color,
      icon: club.icon,
    },
    ...data,
  };
}