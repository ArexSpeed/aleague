import { sportPath } from "@/lib/paths";
import { CLUB_BY_REF, CLUBS, CUP_DEFINITION, CUP_PLAN } from "@/sports/speedway/data/season";
import { matchScore } from "@/sports/speedway/engine/v1";
import { cupFixtureId, parseCupFixtureId } from "@/sports/speedway/sim/cup/fixtures";
import type { CupGroupPlan } from "@/sports/speedway/sim/cup/plan";
import type { CupPair } from "@/sports/speedway/sim/cup/resolve";
import { getCupRuntime } from "@/sports/speedway/sim/cup/resolve-fixture";
import { clubRanges } from "@/sports/speedway/sim/cup/table-state";
import { rankCupTable, type CupTableRow } from "@/sports/speedway/sim/cup/table";
import { computeTeamStats, emptyTeamStats, isFinished } from "@/sports/speedway/sim/stats";
import type { CupPairState } from "@/sports/speedway/types/cup";
import type { FixtureWithTeams } from "@/sports/speedway/types/fixtures";

const DRAW_PENDING = "Draw pending";

export type CupLegView = {
  id: string;
  leg: number;
  home: string;
  away: string;
  /** "55:35" once the match is finished. */
  score: string | null;
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
export type CupRoundView = {
  rounds: { id: string; label: string }[];
  round: { id: string; label: string };
  /** Why part of the round has no draw yet; null when everything is drawn. */
  blocked: string | null;
  groups: CupGroupView[];
};

const clubName = (id: string) => CLUB_BY_REF.get(id)!.name;
const clubShort = (id: string) => CLUB_BY_REF.get(id)!.short;
const matchHref = (id: string) => sportPath("speedway", `matches/${id}`);

function subtitleOf(group: CupGroupPlan): string {
  if (!group.source) {
    const seeded = CUP_DEFINITION.seeding.seeded.reduce((sum, entry) => sum + entry.count, 0);
    return `Clubs outside the seeded ${seeded}`;
  }
  const from = group.source.groupId === "qual" ? "Round 1" : `places ${group.source.groupId}`;
  if (group.source.side === "losers") return `Losers of ${from}`;
  return group.source.groupId === "qual" ? "Seeded clubs and winners of Round 1" : `Winners of ${from}`;
}

export async function getCupRoundView(roundId: string | undefined): Promise<CupRoundView> {
  const index = Math.max(0, CUP_PLAN.findIndex((r) => r.round.id === roundId));
  const plan = CUP_PLAN[index]!;
  const { state, matches } = await getCupRuntime();
  const roundState = state.rounds[index]!;

  const scoreOf = (id: string) => {
    const match = matches[id];
    if (!match || !isFinished(match)) return null;
    const score = matchScore(match.heats);
    return `${score.home}:${score.away}`;
  };

  const pairView = (pair: CupPair): CupPairView => ({
    number: pair.number,
    state: pair.result.state,
    aggregate:
      pair.result.state === "pending"
        ? null
        : `${clubShort(pair.first)} ${pair.result.totals.first} : ${pair.result.totals.second} ${clubShort(pair.second)}`,
    legs: pair.fixtureIds.map((id, i) => {
      const [home, away] = i % 2 === 0 ? [pair.first, pair.second] : [pair.second, pair.first];
      return { id, leg: i + 1, home: clubName(home), away: clubName(away), score: scoreOf(id), href: matchHref(id) };
    }),
  });

  const placeholderPair = (groupId: string, number: number): CupPairView => ({
    number,
    state: "pending",
    aggregate: null,
    legs: Array.from({ length: CUP_DEFINITION.legs }, (_, i) => ({
      id: cupFixtureId(plan.round.id, groupId, number, i + 1),
      leg: i + 1,
      home: DRAW_PENDING,
      away: DRAW_PENDING,
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
    rounds: CUP_DEFINITION.rounds.map((r) => ({ id: r.id, label: r.label })),
    round: { id: plan.round.id, label: plan.round.label },
    blocked: waiting && waiting.status === "pending" ? waiting.missing : null,
    groups,
  };
}

export type CupTableViewRow = CupTableRow & { name: string; icon: string; color: string };
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
    return { ...row, name: club.name, icon: club.icon, color: club.color };
  });
  return {
    blocked: seeded.status === "pending" ? `Seeding after ${seeded.missing.join(" and ")}` : null,
    rows,
  };
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