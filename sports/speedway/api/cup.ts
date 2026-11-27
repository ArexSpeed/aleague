import { z } from "zod";

import { sportPath } from "@/lib/paths";
import { mapRawRiderToLeagueRider, skillsOf } from "@/sports/speedway/api/league";
import { CLUB_BY_REF, CLUBS, CUP_DEFINITION, CUP_PLAN, RIDERS } from "@/sports/speedway/data/season";
import { matchScore } from "@/sports/speedway/engine/v1";
import { cupFixtureId, parseCupFixtureId } from "@/sports/speedway/sim/cup/fixtures";
import type { CupGroupPlan } from "@/sports/speedway/sim/cup/plan";
import type { CupPair } from "@/sports/speedway/sim/cup/resolve";
import { getCupRuntime } from "@/sports/speedway/sim/cup/resolve-fixture";
import { clubRanges } from "@/sports/speedway/sim/cup/table-state";
import { rankCupTable, type CupTableRow } from "@/sports/speedway/sim/cup/table";
import { computeRiderStats, computeTeamStats, emptyTeamStats, isFinished, type TeamStats } from "@/sports/speedway/sim/stats";
import type { CupPairState } from "@/sports/speedway/types/cup";
import type { FixtureWithTeams } from "@/sports/speedway/types/fixtures";
import { leagueRiderSchema, type LeagueRiderWithSkills } from "@/sports/speedway/types/league";

export type CupTeamView = {
  clubId: string;
  name: string;
  subName?: string;
  color: string;
  icon: string;
};

export type CupLegView = {
  id: string;
  leg: number;
  /** Null until the pair is drawn. */
  home: CupTeamView | null;
  away: CupTeamView | null;
  /** Null until the match is finished. */
  score: { home: number; away: number } | null;
  /** Null until the pair is drawn. */
  href: string | null;
};
export type CupPairView = {
  number: number;
  state: CupPairState;
  /** "ARK 81 : 65 TOZ" over the finished legs, null before the first one. */
  aggregate: string | null;
  legs: CupLegView[];
};
export type CupGroupView = { id: string; title: string; subtitle: string; pairs: CupPairView[] };
export type CupRoundBlock = {
  id: string;
  label: string;
  /** Why part of the round has no draw yet; null when everything is drawn. */
  blocked: string | null;
  groups: CupGroupView[];
};
export type CupFixturesView = {
  rounds: CupRoundBlock[];
  /** First round with a drawn, unplayed match (target of the test tool). */
  nextRound: { id: string; label: string } | null;
};

const matchHref = (id: string) => sportPath("speedway", `matches/${id}`);
const clubShort = (id: string) => CLUB_BY_REF.get(id)!.short;

function teamView(clubId: string): CupTeamView {
  const club = CLUB_BY_REF.get(clubId)!;
  return { clubId: club.id, name: club.name, subName: club.subName, color: club.color, icon: club.icon };
}

function subtitleOf(group: CupGroupPlan): string {
  if (!group.source) {
    const seeded = CUP_DEFINITION.seeding.seeded.reduce((sum, entry) => sum + entry.count, 0);
    return `Clubs outside the seeded ${seeded}`;
  }
  const from = group.source.groupId === "qual" ? "Round 1" : `places ${group.source.groupId}`;
  if (group.source.side === "losers") return `Losers of ${from}`;
  return group.source.groupId === "qual" ? "Seeded clubs and winners of Round 1" : `Winners of ${from}`;
}

/** Every round of the cup with its place groups, pairs and legs (real data, drawn or not). */
export async function getCupFixturesView(): Promise<CupFixturesView> {
  const { state, matches } = await getCupRuntime();

  const scoreOf = (id: string) => {
    const match = matches[id];
    if (!match || !isFinished(match)) return null;
    const score = matchScore(match.heats);
    return { home: score.home, away: score.away };
  };

  const rounds = CUP_PLAN.map((plan, index): CupRoundBlock => {
    const roundState = state.rounds[index]!;

    const pairView = (pair: CupPair): CupPairView => ({
      number: pair.number,
      state: pair.result.state,
      aggregate:
        pair.result.state === "pending"
          ? null
          : `${clubShort(pair.first)} ${pair.result.totals.first} : ${pair.result.totals.second} ${clubShort(pair.second)}`,
      legs: pair.fixtureIds.map((id, i) => {
        const [home, away] = i % 2 === 0 ? [pair.first, pair.second] : [pair.second, pair.first];
        return {
          id,
          leg: i + 1,
          home: teamView(home),
          away: teamView(away),
          score: scoreOf(id),
          href: matchHref(id),
        };
      }),
    });

    const placeholderPair = (groupId: string, number: number): CupPairView => ({
      number,
      state: "pending",
      aggregate: null,
      legs: Array.from({ length: CUP_DEFINITION.legs }, (_, i) => ({
        id: cupFixtureId(plan.round.id, groupId, number, i + 1),
        leg: i + 1,
        home: null,
        away: null,
        score: null,
        href: null,
      })),
    });

    const groups = roundState.groups.map((group): CupGroupView => ({
      id: group.plan.id,
      title: group.plan.range ? `Places ${group.plan.id}` : "Qualifying",
      subtitle: subtitleOf(group.plan),
      pairs:
        group.status === "ready"
          ? group.pairs.map(pairView)
          : Array.from({ length: group.plan.pairs }, (_, i) => placeholderPair(group.plan.id, i + 1)),
    }));

    const waiting = roundState.groups.find((group) => group.status === "pending");
    return {
      id: plan.round.id,
      label: plan.round.label,
      blocked: waiting && waiting.status === "pending" ? waiting.missing : null,
      groups,
    };
  });

  const next = rounds.find((round) =>
    round.groups.some((group) =>
      group.pairs.some((pair) => pair.legs.some((leg) => leg.href !== null && leg.score === null)),
    ),
  );

  return { rounds, nextRound: next ? { id: next.id, label: next.label } : null };
}

export type CupTableViewRow = CupTableRow & { name: string; subName?: string; icon: string; color: string };
export type CupTableView = { blocked: string | null; rows: CupTableViewRow[] };

/** All cup clubs: places from the draws and pair results, small points from the cup matches only. */
export async function getCupTableView(): Promise<CupTableView> {
  const { state, matches, seeded } = await getCupRuntime();
  const stats = computeTeamStats(matches, (f) => f.competitionId === CUP_DEFINITION.id);
  const seededIds = seeded.status === "ready" ? seeded.clubs.map((club) => club.clubId) : [];
  const ranges = clubRanges(state, CUP_PLAN, seededIds);

  const inputs = CLUBS.filter((club) => CUP_DEFINITION.leagues.includes(club.leagueId)).map((club) => {
    const s = stats.get(club.id) ?? emptyTeamStats();
    return {
      clubId: club.id,
      range: ranges.get(club.id) ?? null,
      games: s.games,
      won: s.won,
      draw: s.draw,
      lost: s.lose,
      pointsPlus: s.pointsPlus,
      pointsMinus: s.pointsMinus,
    };
  });

  const rows = rankCupTable(inputs).map((row) => {
    const club = CLUB_BY_REF.get(row.clubId)!;
    return { ...row, name: club.name, subName: club.subName, icon: club.icon, color: club.color };
  });
  return {
    blocked: seeded.status === "pending" ? `Seeding after ${seeded.missing.join(" and ")}` : null,
    rows,
  };
}

/**
 * Riders of all cup clubs in the shape the league Stats tab uses. Numbers come from the cup matches
 * only (the runtime also holds league matches, the filter leaves them out). No cup match yet = zeros.
 */
export async function getCupStatsView(): Promise<LeagueRiderWithSkills[]> {
  const { matches } = await getCupRuntime();
  const stats = computeRiderStats(matches, (fixture) => fixture.competitionId === CUP_DEFINITION.id);

  const raws = RIDERS.filter((rider) => CUP_DEFINITION.leagues.includes(CLUB_BY_REF.get(rider.clubId)!.leagueId));
  const riders = z
    .array(leagueRiderSchema)
    .parse(raws.map((raw) => mapRawRiderToLeagueRider(raw, stats.get(raw.id))));
  return riders.map((rider, index) => ({ ...rider, skills: skillsOf(raws[index]!) }));
}

/** Season numbers of one club from the cup matches only (zeros before the first one). */
export async function getCupTeamStats(clubId: string): Promise<TeamStats> {
  const { matches } = await getCupRuntime();
  const stats = computeTeamStats(matches, (fixture) => fixture.competitionId === CUP_DEFINITION.id);
  return stats.get(clubId) ?? emptyTeamStats();
}

const teamRef = (clubId: string) => {
  const club = CLUB_BY_REF.get(clubId)!;
  return { id: club.id, name: club.name, subName: club.subName, short: club.short, color: club.color };
};

/** A cup match as the match page needs it. Null until the pair is drawn. No calendar yet: date and time are empty. */
export async function getCupFixture(id: string): Promise<FixtureWithTeams | null> {
  const parsed = parseCupFixtureId(id);
  if (!parsed) return null;

  const { participants, matches } = await getCupRuntime();
  const clubs = participants.get(id);
  if (!clubs) return null;

  const stored = matches[id];
  const score = stored && isFinished(stored) ? matchScore(stored.heats) : null;
  return {
    id,
    competitionId: CUP_DEFINITION.id,
    matchday: parsed.roundNumber,
    date: "",
    time: "",
    homeId: clubs.homeId,
    awayId: clubs.awayId,
    stadium: CLUB_BY_REF.get(clubs.homeId)!.stadium.name,
    homeScore: score?.home ?? null,
    awayScore: score?.away ?? null,
    home: teamRef(clubs.homeId),
    away: teamRef(clubs.awayId),
  };
}

export type CupTeamGame = {
  id: string;
  round: string;
  /** 1-based number of the round, also the matchday of its fixtures. */
  roundNumber: number;
  leg: number;
  opponent: CupTeamView;
  home: boolean;
  /** From this club's point of view; null until the match is finished. */
  score: { for: number; against: number } | null;
  href: string;
};
export type CupTeamDetail = {
  team: CupTeamView & { short: string };
  row: CupTableViewRow;
  games: CupTeamGame[];
};

/**
 * Data for the club panel. `selected` is false when `clubId` is missing or not in the cup:
 * the panel then shows the top club of the table (like the league), without opening the mobile drawer.
 */
export async function getCupTeamDetail(
  clubId: string | undefined,
): Promise<{ detail: CupTeamDetail; selected: boolean } | null> {
  const table = await getCupTableView();
  const picked = table.rows.find((row) => row.clubId === clubId);
  const row = picked ?? table.rows[0];
  if (!row) return null;

  const { rounds } = await getCupFixturesView();
  const games: CupTeamGame[] = [];
  for (const round of rounds) {
    for (const group of round.groups) {
      for (const pair of group.pairs) {
        for (const leg of pair.legs) {
          if (!leg.home || !leg.away || !leg.href) continue;
          const isHome = leg.home.clubId === row.clubId;
          if (!isHome && leg.away.clubId !== row.clubId) continue;
          games.push({
            id: leg.id,
            round: round.label,
            roundNumber: parseCupFixtureId(leg.id)!.roundNumber,
            leg: leg.leg,
            opponent: isHome ? leg.away : leg.home,
            home: isHome,
            score: leg.score
              ? isHome
                ? { for: leg.score.home, against: leg.score.away }
                : { for: leg.score.away, against: leg.score.home }
              : null,
            href: leg.href,
          });
        }
      }
    }
  }

  return {
    selected: picked !== undefined,
    detail: {
      team: { ...teamView(row.clubId), short: clubShort(row.clubId) },
      row,
      games,
    },
  };
}