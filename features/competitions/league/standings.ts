import type { LeagueRider, LeagueTeam, RiderTelemetry } from "@/types/league";
import type { Venue } from "./search-params";

/** Numbers shown in one table row for the selected venue filter (All / Home / Away). */
export function getRowStats(team: LeagueTeam, venue: Venue) {
  const v = venue === "home" ? team.home : venue === "away" ? team.away : null;
  const games = v ? v.games : team.games;
  return {
    rounds: games,
    won: v ? v.won : team.won,
    draw: v ? v.draw : team.draw,
    lose: v ? v.lose : team.lose,
    bonus: team.bonus,
    matches: games,
    points: v ? v.pts : team.points,
  };
}

export function getRiderStats(rider: LeagueRider, venue: Venue): RiderTelemetry {
  return venue === "home" ? rider.home : venue === "away" ? rider.away : rider;
}

/** Position badge: gold, silver, bronze, relegation (last), neutral otherwise. */
export function positionBadgeClass(pos: number, totalTeams: number): string {
  if (pos === 1) return "bg-rank-gold text-slate-950 font-black";
  if (pos === 2) return "bg-rank-silver text-slate-950 font-black";
  if (pos === 3) return "bg-rank-bronze text-white font-black";
  if (pos === totalTeams) return "bg-rank-relegation text-white font-black";
  return "bg-main text-main-foreground font-bold";
}

export function formatBilans(value: number): string {
  return value > 0 ? `+${value}` : String(value);
}

export function winRate(won: number, games: number): number {
  return games > 0 ? Math.round((won / games) * 100) : 0;
}
