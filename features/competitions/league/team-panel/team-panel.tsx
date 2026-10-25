import Link from "next/link";

import { getTeamRiders } from "@/lib/api/league";
import { cn } from "@/lib/utils";
import type { LeagueTeam } from "@/types/league";
import { buildLeagueHref, PANEL_TABS, type LeagueParams } from "../search-params";
import { TeamDetails } from "./team-details";
import { TeamGames } from "./team-games";
import { TeamRiders } from "./team-riders";
import { TeamStats } from "./team-stats";

/**
 * Detail part for a selected team (?team=...). The close button is rendered by
 * MasterDetail, so the header leaves room for it on the right.
 */
export async function TeamPanel({ team, params }: { team: LeagueTeam; params: LeagueParams }) {
  const riders = params.panel === "riders" ? await getTeamRiders(team.id) : [];

  return (
    <div className="flex flex-col select-none">
      <header className="flex shrink-0 items-center gap-2.5 pr-9 pb-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-linear-to-tr from-indigo-600 via-purple-600 to-pink-500 text-sm shadow-md ring-1 ring-white/20">
          <span className="drop-shadow">{team.badgeIcon}</span>
        </span>
        <div className="flex min-w-0 flex-col">
          <h2 className="truncate text-base font-black tracking-wide text-white uppercase sm:text-lg">
            {team.name}
          </h2>
          <span className="truncate text-[10px] font-bold text-slate-400 uppercase">
            {team.subName}
          </span>
        </div>
      </header>

      <nav
        aria-label="Szczegóły drużyny"
        className="mb-3 flex shrink-0 items-center justify-between border-b border-white/10 pt-1 text-xs font-bold"
      >
        {PANEL_TABS.map((tab) => {
          const active = params.panel === tab;
          return (
            <Link
              key={tab}
              href={buildLeagueHref(params, { panel: tab })}
              replace
              scroll={false}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative pb-2 capitalize transition-colors",
                active ? "text-white" : "text-slate-400 hover:text-slate-200",
              )}
            >
              {tab}
              {active ? (
                <span className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-brand" />
              ) : null}
            </Link>
          );
        })}
      </nav>

      {params.panel === "stats" ? <TeamStats team={team} /> : null}
      {params.panel === "games" ? <TeamGames team={team} /> : null}
      {params.panel === "riders" ? (
        <TeamRiders team={team} riders={riders} venue={params.venue} />
      ) : null}
      {params.panel === "details" ? <TeamDetails team={team} /> : null}
    </div>
  );
}
