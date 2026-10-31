import { TeamLogo } from "@/components/data/team-logo";
import type { Match } from "@/sports/speedway/types/match";
import { isFinished } from "../match-stats";

/** Top of every aside panel: "Match report" label and a compact score line. */
export function AsideHeader({ match }: { match: Match }) {
  return (
    <header className="shrink-0 pr-9 pb-3">
      <p className="flex items-center gap-2 text-[10px] font-black tracking-widest text-brand uppercase">
        <span className="size-2 rounded-full bg-brand" aria-hidden />
        Match report
      </p>
      <div className="mt-2 flex items-center gap-2">
        <TeamLogo color={match.home.color} icon={match.home.icon} className="size-7 text-sm sm:size-7 sm:text-sm" />
        <span className="min-w-0 truncate text-sm font-black text-fg uppercase">{match.home.name}</span>
        <span className="shrink-0 rounded-lg bg-fg/10 px-2 py-0.5 font-mono text-sm font-black text-fg">
          {isFinished(match) ? `${match.homeScore}:${match.awayScore}` : "VS"}
        </span>
        <span className="min-w-0 truncate text-sm font-black text-fg uppercase">{match.away.name}</span>
        <TeamLogo color={match.away.color} icon={match.away.icon} className="size-7 text-sm sm:size-7 sm:text-sm" />
      </div>
    </header>
  );
}
