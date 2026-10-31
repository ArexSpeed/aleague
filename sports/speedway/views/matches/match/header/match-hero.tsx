import Link from "next/link";
import { MapPin } from "lucide-react";

import { TeamLogo } from "@/components/data/team-logo";
import { teamPath } from "@/lib/paths";
import { cn } from "@/lib/utils";
import type { Match, MatchTeam, Side } from "@/sports/speedway/types/match";
import type { SportId } from "@/sports/types";
import { formatDayMonth } from "../format";
import { isFinished, scoreOf, winnerSide } from "../match-stats";

export function scoreTone(match: Match, side: Side) {
  const winner = winnerSide(match);
  if (!isFinished(match) || winner === null) return "text-fg";
  return winner === side ? "text-positive" : "text-negative";
}

export function StatusChip({ match }: { match: Match }) {
  const finished = isFinished(match);
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-[10px] font-black tracking-wider uppercase",
        finished ? "bg-positive/15 text-positive" : "bg-brand/15 text-brand",
      )}
    >
      {finished ? "Finished" : "Upcoming"}
    </span>
  );
}

function HeroTeam({ team, side, sport }: { team: MatchTeam; side: Side; sport: SportId }) {
  return (
    <Link
      href={teamPath(sport, team.id)}
      className="group flex min-w-0 flex-col items-center gap-1 text-center"
    >
      <TeamLogo
        color={team.color}
        icon={team.icon}
        className="size-14 text-2xl sm:size-20 sm:text-4xl"
      />
      <span className="mt-1 max-w-full truncate text-sm font-black text-fg uppercase transition-colors group-hover:text-brand sm:text-lg">
        {team.name}
      </span>
      <span className="max-w-full truncate text-[11px] font-bold text-fg-faint uppercase">
        {team.subName}
      </span>
      <span className="mt-1 rounded-md bg-fg/10 px-2 py-0.5 text-[10px] font-bold text-fg-muted uppercase">
        {side === "home" ? "Home" : "Away"}
      </span>
    </Link>
  );
}

/** Big dark card with venue, status, both teams and the score (Info and Squads tabs). */
export function MatchHero({ match, sport }: { match: Match; sport: SportId }) {
  const finished = isFinished(match);

  return (
    <section data-region="shell" className="rounded-3xl bg-shell-surface p-4 text-fg shadow-md sm:p-5">
      <div className="flex items-center justify-between gap-2 border-b border-line pb-3">
        <span className="flex min-w-0 items-center gap-1.5 text-xs font-semibold text-fg-muted">
          <MapPin className="size-3.5 shrink-0" aria-hidden />
          <span className="truncate">
            {match.stadium.name}, {match.stadium.city}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          <span className="hidden text-[10px] font-bold tracking-wider text-fg-faint uppercase sm:inline">
            Matchday {match.matchday}
          </span>
          <StatusChip match={match} />
        </span>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 pt-4 sm:gap-4">
        <HeroTeam team={match.home} side="home" sport={sport} />

        <div className="flex flex-col items-center gap-1">
          {finished ? (
            <div className="flex items-center gap-2 font-mono text-4xl font-black sm:gap-3 sm:text-6xl">
              <span className={scoreTone(match, "home")}>{scoreOf(match, "home")}</span>
              <span className="text-fg-faint">:</span>
              <span className={scoreTone(match, "away")}>{scoreOf(match, "away")}</span>
            </div>
          ) : (
            <span className="font-mono text-3xl font-black text-fg-faint sm:text-5xl">VS</span>
          )}
          <span className="text-[11px] font-semibold text-fg-muted">
            {finished
              ? `Finished · ${formatDayMonth(match.date)}`
              : `${formatDayMonth(match.date)} · ${match.time}`}
          </span>
        </div>

        <HeroTeam team={match.away} side="away" sport={sport} />
      </div>
    </section>
  );
}
