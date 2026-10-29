import Link from "next/link";

import { InfoCard, InfoRow } from "@/components/data/info-card";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { FixtureWithTeams, TeamRef } from "@/sports/speedway/types/fixtures";
import { buildLeagueHref, type LeagueParams } from "../../search-params";

function Side({ team, params }: { team: TeamRef; params: LeagueParams }) {
  return (
    <Link
      href={buildLeagueHref(params, { tab: "table", team: team.id, match: undefined })}
      scroll={false}
      className="group flex min-w-0 flex-col items-center gap-1.5 text-center"
    >
      <span
        className="size-10 rounded-full shadow-md ring-1 ring-white/20"
        style={{ backgroundColor: team.color }}
        aria-hidden
      />
      <span className="max-w-full truncate text-xs font-black text-fg uppercase transition-colors group-hover:text-brand">
        {team.name}
      </span>
      <span className="max-w-full truncate text-[10px] font-bold text-fg-faint uppercase">
        {team.subName}
      </span>
    </Link>
  );
}

/** Detail part for a selected fixture (?match=...). */
export function MatchPanel({ fixture, params }: { fixture: FixtureWithTeams; params: LeagueParams }) {
  const finished = fixture.homeScore !== null && fixture.awayScore !== null;
  const homeWon = finished && fixture.homeScore! > fixture.awayScore!;
  const awayWon = finished && fixture.awayScore! > fixture.homeScore!;

  return (
    <div className="flex flex-col select-none">
      <header className="shrink-0 pr-9 pb-3">
        <h2 className="text-base font-black tracking-wide text-fg uppercase sm:text-lg">
          Kolejka {fixture.matchday}
        </h2>
        <span className="text-[10px] font-bold text-fg-faint uppercase">
          {formatDate(fixture.date)} · {fixture.time}
        </span>
      </header>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-2xl border border-line bg-surface p-3">
        <Side team={fixture.home} params={params} />
        <div className="flex items-center gap-1.5 font-mono text-2xl font-black">
          {finished ? (
            <>
              <span className={cn(homeWon ? "text-positive" : "text-fg")}>{fixture.homeScore}</span>
              <span className="text-fg-faint">:</span>
              <span className={cn(awayWon ? "text-positive" : "text-fg")}>{fixture.awayScore}</span>
            </>
          ) : (
            <span className="text-fg-faint">VS</span>
          )}
        </div>
        <Side team={fixture.away} params={params} />
      </div>

      <div className="mt-3">
        <InfoCard title="Informacje">
          <InfoRow label="Status">{finished ? "Zakończony" : "Zaplanowany"}</InfoRow>
          <InfoRow label="Data">{formatDate(fixture.date)}</InfoRow>
          <InfoRow label="Godzina">
            <span className="font-mono">{fixture.time}</span>
          </InfoRow>
          <InfoRow label="Stadion">{fixture.stadium}</InfoRow>
        </InfoCard>
      </div>
    </div>
  );
}
