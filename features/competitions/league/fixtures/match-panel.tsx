import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { FixtureWithTeams, TeamRef } from "@/types/fixtures";
import { buildLeagueHref, type LeagueParams } from "../search-params";
import { formatDate } from "./format";

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
      <span className="max-w-full truncate text-xs font-black text-white uppercase transition-colors group-hover:text-brand">
        {team.name}
      </span>
      <span className="max-w-full truncate text-[10px] font-bold text-slate-400 uppercase">
        {team.subName}
      </span>
    </Link>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex justify-between gap-3 py-2">
      <dt className="text-slate-400">{label}</dt>
      <dd className="text-right font-semibold">{children}</dd>
    </div>
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
        <h2 className="text-base font-black tracking-wide text-white uppercase sm:text-lg">
          Kolejka {fixture.matchday}
        </h2>
        <span className="text-[10px] font-bold text-slate-400 uppercase">
          {formatDate(fixture.date)} · {fixture.time}
        </span>
      </header>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-2xl border border-white/5 bg-white/5 p-3">
        <Side team={fixture.home} params={params} />
        <div className="flex items-center gap-1.5 font-mono text-2xl font-black">
          {finished ? (
            <>
              <span className={cn(homeWon ? "text-positive" : "text-white")}>{fixture.homeScore}</span>
              <span className="text-slate-500">:</span>
              <span className={cn(awayWon ? "text-positive" : "text-white")}>{fixture.awayScore}</span>
            </>
          ) : (
            <span className="text-slate-500">VS</span>
          )}
        </div>
        <Side team={fixture.away} params={params} />
      </div>

      <section className="mt-3 rounded-2xl border border-white/5 bg-white/5 p-3 text-xs text-white">
        <h3 className="text-[10px] font-black tracking-wider text-brand uppercase">Informacje</h3>
        <dl className="divide-y divide-white/5 text-[11px]">
          <Row label="Status">{finished ? "Zakończony" : "Zaplanowany"}</Row>
          <Row label="Data">{formatDate(fixture.date)}</Row>
          <Row label="Godzina">
            <span className="font-mono">{fixture.time}</span>
          </Row>
          <Row label="Stadion">{fixture.stadium}</Row>
        </dl>
      </section>
    </div>
  );
}