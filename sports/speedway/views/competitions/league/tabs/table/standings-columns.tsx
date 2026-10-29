import { POINTS_COLUMN_WIDTH, type Column } from "@/components/table/columns";
import type { LeagueTeam } from "@/sports/speedway/types/league";
import type { Venue } from "@/sports/speedway/views/competitions/league/search-params";
import { getRowStats } from "@/sports/speedway/views/competitions/league/standings";

export function getStandingsColumns(venue: Venue): Column<LeagueTeam>[] {
  const stats = (t: LeagueTeam) => getRowStats(t, venue);

  return [
    { id: "rounds", header: "R", title: "Rounds", cell: (t) => stats(t).rounds },
    { id: "won", header: "W", title: "Wins", cell: (t) => stats(t).won, className: "font-bold text-win" },
    { id: "draw", header: "D", title: "Draws", cell: (t) => stats(t).draw },
    { id: "lose", header: "L", title: "Losses", cell: (t) => stats(t).lose, className: "font-bold text-loss" },
    { id: "bonus", header: "B", title: "Bonus", cell: (t) => stats(t).bonus },
    { id: "matches", header: "M", title: "Matches", cell: (t) => stats(t).matches },
    { id: "points", header: "Pts", title: "Points", cell: (t) => stats(t).points, width: POINTS_COLUMN_WIDTH, emphasis: true },
  ];
}