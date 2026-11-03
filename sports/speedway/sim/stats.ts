import { CLUB_BY_REF } from "@/sports/speedway/data/season";
import { MATCH_HEATS, matchScore } from "@/sports/speedway/engine/v1";
import type { LeagueTeam, RiderTelemetry, TeamMatch, VenueStats } from "@/sports/speedway/types/league";
import { FIXTURE_BY_ID } from "./match-setup";
import type { StoredMatch } from "./results-store";

/** League table and rider statistics, calculated from the stored matches. Pure: no I/O. */

export const isFinished = (match: StoredMatch) => match.heats.length >= MATCH_HEATS;

const WIN_POINTS = 2;
const DRAW_POINTS = 1;
const BONUS_POINTS = 1;

type Matches = Record<string, StoredMatch>;

export type TeamStats = Pick<
  LeagueTeam,
  "games" | "pointsPlus" | "pointsMinus" | "bilans" | "won" | "draw" | "lose" | "bonus" | "points" | "home" | "away" | "matches"
>;

const emptyVenue = (): VenueStats => ({ games: 0, won: 0, draw: 0, lose: 0, pts: 0, ptsPlus: 0, ptsMinus: 0, bilans: 0 });
export const emptyTeamStats = (): TeamStats => ({
  games: 0,
  pointsPlus: 0,
  pointsMinus: 0,
  bilans: 0,
  won: 0,
  draw: 0,
  lose: 0,
  bonus: 0,
  points: 0,
  home: emptyVenue(),
  away: emptyVenue(),
  matches: [],
});

export function computeTeamStats(matches: Matches): Map<string, TeamStats> {
  const stats = new Map<string, TeamStats>();
  const of = (id: string) => {
    if (!stats.has(id)) stats.set(id, emptyTeamStats());
    return stats.get(id)!;
  };

  // Two legs of the same pair (match and return match) decide the bonus point.
  const legs = new Map<string, { clubId: string; scored: number }[][]>();

  for (const match of Object.values(matches)) {
    if (!isFinished(match)) continue;
    const fixture = FIXTURE_BY_ID.get(match.fixtureId)!;
    const score = matchScore(match.heats);

    const apply = (clubId: string, venue: "home" | "away", own: number, opp: number, oppId: string) => {
      const team = of(clubId);
      const v = team[venue];
      const res: TeamMatch["res"] = own > opp ? "W" : own < opp ? "L" : "D";
      const league = res === "W" ? WIN_POINTS : res === "D" ? DRAW_POINTS : 0;

      team.games++;
      team.pointsPlus += own;
      team.pointsMinus += opp;
      team.points += league;
      v.games++;
      v.pts += league;
      v.ptsPlus += own;
      v.ptsMinus += opp;
      if (res === "W") (team.won++, v.won++);
      else if (res === "L") (team.lose++, v.lose++);
      else (team.draw++, v.draw++);

      const opponent = CLUB_BY_REF.get(oppId)!;
      team.matches.push({ round: `R${fixture.matchday}`, opp: opponent.short, oppName: opponent.name, res, pts: own, oppPts: opp });
    };

    apply(fixture.homeId, "home", score.home, score.away, fixture.awayId);
    apply(fixture.awayId, "away", score.away, score.home, fixture.homeId);

    const key = [fixture.competitionId, fixture.stage, ...[fixture.homeId, fixture.awayId].sort()].join("|");
    legs.set(key, [
      ...(legs.get(key) ?? []),
      [
        { clubId: fixture.homeId, scored: score.home },
        { clubId: fixture.awayId, scored: score.away },
      ],
    ]);
  }

  for (const pair of legs.values()) {
    if (pair.length < 2) continue;
    const total = new Map<string, number>();
    for (const leg of pair) for (const side of leg) total.set(side.clubId, (total.get(side.clubId) ?? 0) + side.scored);
    const [a, b] = [...total.entries()];
    if (a && b && a[1] !== b[1]) {
      const winner = of(a[1] > b[1] ? a[0] : b[0]);
      winner.bonus += 1;
      winner.points += BONUS_POINTS;
    }
  }

  for (const team of stats.values()) {
    team.bilans = team.pointsPlus - team.pointsMinus;
    team.home.bilans = team.home.ptsPlus - team.home.ptsMinus;
    team.away.bilans = team.away.ptsPlus - team.away.ptsMinus;
    team.matches.sort((x, y) => Number(x.round.slice(1)) - Number(y.round.slice(1)));
  }
  return stats;
}

type Acc = { matches: Set<string>; heats: number; points: number; bonus: number; places: [number, number, number, number] };
const newAcc = (): Acc => ({ matches: new Set(), heats: 0, points: 0, bonus: 0, places: [0, 0, 0, 0] });
const round2 = (n: number) => Math.round(n * 100) / 100;

function telemetry(acc: Acc): RiderTelemetry {
  const total = acc.points + acc.bonus;
  return {
    matches: acc.matches.size,
    heats: acc.heats,
    avgMatch: acc.matches.size ? round2(total / acc.matches.size) : 0,
    avgHeat: acc.heats ? round2(total / acc.heats) : 0,
    bonus: acc.bonus,
    points: acc.points,
    firsts: acc.places[0],
    seconds: acc.places[1],
    thirds: acc.places[2],
    fourths: acc.places[3],
    // Exclusions, defects and tape: the engine does not produce them yet.
    w: 0,
    d: 0,
    t: 0,
  };
}

export const emptyTelemetry = (): RiderTelemetry => telemetry(newAcc());

export type RiderStats = RiderTelemetry & { home: RiderTelemetry; away: RiderTelemetry };

/** Season statistics per rider from every heat played so far (also in matches not yet finished). */
export function computeRiderStats(matches: Matches): Map<string, RiderStats> {
  const acc = new Map<string, { total: Acc; home: Acc; away: Acc }>();

  for (const match of Object.values(matches)) {
    for (const heat of match.heats) {
      for (const r of heat.riders) {
        if (!acc.has(r.riderId)) acc.set(r.riderId, { total: newAcc(), home: newAcc(), away: newAcc() });
        const rider = acc.get(r.riderId)!;
        for (const a of [rider.total, rider[r.side]]) {
          a.matches.add(match.fixtureId);
          a.heats++;
          a.points += r.points;
          if (r.bonus) a.bonus++;
          a.places[r.position - 1]!++;
        }
      }
    }
  }

  return new Map(
    [...acc.entries()].map(([id, a]) => [id, { ...telemetry(a.total), home: telemetry(a.home), away: telemetry(a.away) }]),
  );
}
