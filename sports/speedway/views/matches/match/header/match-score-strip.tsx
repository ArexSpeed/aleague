import Link from "next/link";

import { TeamLogo } from "@/components/data/team-logo";
import { teamPath } from "@/lib/paths";
import type { Match, MatchTeam } from "@/sports/speedway/types/match";
import type { SportId } from "@/sports/types";
import { formatDayMonth } from "../format";
import { isFinished, scoreOf } from "../match-stats";
import { scoreTone } from "./match-hero";

function Team({ team, sport, align }: { team: MatchTeam; sport: SportId; align: "left" | "right" }) {
  const logo = <TeamLogo color={team.color} icon={team.icon} className="size-10 text-lg sm:size-12 sm:text-2xl" />;
  return (
    <Link
      href={teamPath(sport, team.id)}
      className="group flex min-w-0 items-center gap-2 sm:gap-3"
    >
      {align === "left" ? logo : null}
      <span className={`flex min-w-0 flex-col leading-tight ${align === "right" ? "items-end text-right" : ""}`}>
        <span className="max-w-full truncate text-sm font-black text-fg uppercase transition-colors group-hover:text-brand sm:text-base">
          {team.name}
        </span>
        <span className="max-w-full truncate text-[10px] font-bold text-fg-faint uppercase">
          {team.subName}
        </span>
      </span>
      {align === "right" ? logo : null}
    </Link>
  );
}

/** Light one-line header (Heats tab): teams and score without the big card. */
export function MatchScoreStrip({ match, sport }: { match: Match; sport: SportId }) {
  const finished = isFinished(match);
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
      <Team team={match.home} sport={sport} align="left" />
      <div className="flex flex-col items-center">
        {finished ? (
          <span className="flex items-center gap-1.5 font-mono text-2xl font-black sm:text-4xl">
            <span className={scoreTone(match, "home")}>{scoreOf(match, "home")}</span>
            <span className="text-fg-faint">:</span>
            <span className={scoreTone(match, "away")}>{scoreOf(match, "away")}</span>
          </span>
        ) : (
          <span className="font-mono text-xl font-black text-fg-faint sm:text-3xl">VS</span>
        )}
        <span className="text-[10px] font-semibold text-fg-faint">
          {finished ? "Finished" : `${formatDayMonth(match.date)} · ${match.time}`}
        </span>
      </div>
      <Team team={match.away} sport={sport} align="right" />
    </div>
  );
}
