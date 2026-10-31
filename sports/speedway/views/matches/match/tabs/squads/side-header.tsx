import type { ReactNode } from "react";

import { TeamLogo } from "@/components/data/team-logo";
import type { MatchTeam, Side } from "@/sports/speedway/types/match";

const HELMETS_LABEL: Record<Side, string> = { home: "Home · red / blue helmets", away: "Away · white / yellow helmets" };

/** Team line above a squad table: logo, name, side + helmets, and a badge on the right. */
export function SideHeader({ team, side, badge }: { team: MatchTeam; side: Side; badge?: ReactNode }) {
  return (
    <header className="flex items-center gap-2.5 px-1 pb-2">
      <TeamLogo color={team.color} icon={team.icon} className="size-9 text-base" />
      <div className="flex min-w-0 flex-1 flex-col leading-tight">
        <span className="truncate text-sm font-black text-fg uppercase">
          {team.name} {team.subName}
        </span>
        <span className="truncate text-[10px] font-bold text-fg-faint uppercase">{HELMETS_LABEL[side]}</span>
      </div>
      {badge}
    </header>
  );
}
