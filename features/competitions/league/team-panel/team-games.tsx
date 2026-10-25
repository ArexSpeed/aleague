import { cn } from "@/lib/utils";
import type { LeagueTeam } from "@/types/league";

/** Panel tab "Games": the team's results round by round. */
export function TeamGames({ team }: { team: LeagueTeam }) {
  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xs font-bold tracking-wider text-white uppercase">Mecze: {team.name}</h3>
        <span className="text-[10px] font-bold text-brand">{team.matches.length} kolejek</span>
      </div>

      <ul className="space-y-1.5 py-1">
        {team.matches.map((match) => {
          const win = match.res === "W";
          return (
            <li
              key={match.round}
              className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-2 text-xs text-white transition-colors hover:bg-white/10"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span className="w-7 text-[10px] font-black text-slate-400">{match.round}</span>
                <span
                  className={cn(
                    "flex size-5 items-center justify-center rounded-md border text-[10px] font-black",
                    win
                      ? "border-emerald-500/30 bg-emerald-500/20 text-emerald-400"
                      : "border-rose-500/30 bg-rose-500/20 text-rose-400",
                  )}
                >
                  {match.res}
                </span>
                <span className="truncate font-extrabold uppercase">{match.oppName}</span>
              </div>
              <div className="flex items-center gap-1 text-xs font-black">
                <span className={win ? "text-emerald-400" : "text-white"}>{match.pts}</span>
                <span className="text-slate-500">:</span>
                <span className={win ? "text-slate-400" : "text-rose-400"}>{match.oppPts}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
