import { House, Plane } from "lucide-react";
import Link from "next/link";

import { ResultBadge, type MatchResult } from "@/components/data/result-badge";
import { sportPath } from "@/lib/paths";
import { getTeamFixtures } from "@/sports/speedway/api/fixtures";
import type { FixtureWithTeams } from "@/sports/speedway/types/fixtures";
import type { LeagueTeam } from "@/sports/speedway/types/league";
import type { LeagueParams } from "../../search-params";

function resultOf(own: number | null, opp: number | null): MatchResult {
  if (own === null || opp === null) return "?";
  return own > opp ? "W" : own < opp ? "L" : "D";
}

/** One match from the team's point of view: round, home/away, result, opponent, score. */
function GameRow({ fixture, teamId, params }: { fixture: FixtureWithTeams; teamId: string; params: LeagueParams }) {
  const home = fixture.homeId === teamId;
  const own = home ? fixture.homeScore : fixture.awayScore;
  const opp = home ? fixture.awayScore : fixture.homeScore;
  const opponent = home ? fixture.away : fixture.home;
  const result = resultOf(own, opp);
  const VenueIcon = home ? House : Plane;

  const ownTone = result === "W" ? "text-win" : result === "?" ? "text-fg-faint" : "text-fg";
  const oppTone = result === "L" ? "text-loss" : result === "D" ? "text-fg" : "text-fg-faint";

  return (
    <li>
      <Link
        href={sportPath(params.sport, `matches/${fixture.id}`)}
        className="flex items-center justify-between rounded-xl border border-line bg-surface p-2 text-xs text-fg transition-colors hover:bg-surface-hover"
      >
        <div className="flex min-w-0 items-center gap-2">
          <span className="w-7 text-[10px] font-black text-fg-faint">R{fixture.matchday}</span>
          <VenueIcon className="size-3.5 shrink-0 text-fg-faint" aria-label={home ? "Home" : "Away"} />
          <ResultBadge result={result} />
          <span className="truncate font-extrabold uppercase">{opponent.name}</span>
        </div>
        <div className="flex items-center gap-1 text-xs font-black">
          <span className={ownTone}>{own ?? 0}</span>
          <span className="text-fg-faint">:</span>
          <span className={oppTone}>{opp ?? 0}</span>
        </div>
      </Link>
    </li>
  );
}

/** Panel tab "Games": every match of the selected team, round by round. */
export async function TeamGames({ team, params }: { team: LeagueTeam; params: LeagueParams }) {
  const fixtures = await getTeamFixtures(team.id);

  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xs font-bold tracking-wider text-fg uppercase">Games: {team.name}</h3>
        <span className="text-[10px] font-bold text-brand">{fixtures.length} rounds</span>
      </div>

      <ul className="space-y-1.5 py-1">
        {fixtures.map((fixture) => (
          <GameRow key={fixture.id} fixture={fixture} teamId={team.id} params={params} />
        ))}
      </ul>
    </section>
  );
}
