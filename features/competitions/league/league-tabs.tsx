import Link from "next/link";

import { cn } from "@/lib/utils";
import { buildLeagueHref, LEAGUE_TABS, type LeagueParams } from "./search-params";

/** Table / Fixtures / Stats / History. */
export function LeagueTabs({ params }: { params: LeagueParams }) {
  return (
    <nav
      aria-label="tabs"
      className="no-scrollbar flex shrink-0 items-center gap-4 overflow-x-auto border-b border-black/5 pb-1 lg:gap-6"
    >
      {LEAGUE_TABS.map((tab) => {
        const active = params.tab === tab.id;
        return (
          <Link
            key={tab.id}
            href={buildLeagueHref(params, { tab: tab.id, team: undefined, match: undefined })}
            scroll={false}
            aria-current={active ? "page" : undefined}
            className={cn(
              "border-b-2 pb-1.5 text-sm font-bold whitespace-nowrap transition-colors",
              active
                ? "border-brand text-main-foreground"
                : "border-transparent text-slate-500 hover:text-main-foreground",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
