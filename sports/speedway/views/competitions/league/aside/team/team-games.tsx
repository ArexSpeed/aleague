import { ResultBadge } from "@/components/data/result-badge";
import type { LeagueTeam } from "@/sports/speedway/types/league";

/** Panel tab "Games": the team's results round by round. */
export function TeamGames({ team }: { team: LeagueTeam }) {
  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xs font-bold tracking-wider text-fg uppercase">Mecze: {team.name}</h3>
        <span className="text-[10px] font-bold text-brand">{team.matches.length} kolejek</span>
      </div>

      <ul className="space-y-1.5 py-1">
        {team.matches.map((match) => {
          const win = match.res === "W";
          return (
            <li
              key={match.round}
              className="flex items-center justify-between rounded-xl border border-line bg-surface p-2 text-xs text-fg transition-colors hover:bg-surface-hover"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span className="w-7 text-[10px] font-black text-fg-faint">{match.round}</span>
                <ResultBadge result={match.res} />
                <span className="truncate font-extrabold uppercase">{match.oppName}</span>
              </div>
              <div className="flex items-center gap-1 text-xs font-black">
                <span className={win ? "text-win" : "text-fg"}>{match.pts}</span>
                <span className="text-fg-faint">:</span>
                <span className={win ? "text-fg-faint" : "text-loss"}>{match.oppPts}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
