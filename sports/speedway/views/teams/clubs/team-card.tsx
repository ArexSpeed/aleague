import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight, MapPin } from "lucide-react";

import { StatTile } from "@/components/data/stat-tile";
import { TeamLogo } from "@/components/data/team-logo";
import { cn } from "@/lib/utils";
import type { TeamEntry } from "@/sports/speedway/types/teams";
import { DivisionPill } from "./division-pill";
import { TrophyCase } from "./trophy-case";

type TeamCardProps = { team: TeamEntry; href: string; selected: boolean; detailed: boolean };

function Shell({ href, selected, children }: { href: string; selected: boolean; children: ReactNode }) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={selected ? "true" : undefined}
      className={cn(
        "group relative block rounded-2xl border-2 bg-surface p-3 shadow-xs transition-colors hover:bg-surface-hover sm:p-4",
        selected ? "border-brand" : "border-transparent",
      )}
    >
      {selected ? <span className="absolute top-3 right-3 size-2.5 rounded-full bg-brand" aria-hidden /> : null}
      {children}
    </Link>
  );
}

function Winrate({ value }: { value: number }) {
  return <span className="shrink-0 text-xs font-black text-win">{value.toFixed(1)}%</span>;
}

function DetailsLink() {
  return (
    <span className="flex items-center text-xs font-bold text-brand">
      Details
      <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
    </span>
  );
}

/** Club / nation tile. Compact: one short block. Detailed: stadium, track data and trophies. */
export function TeamCard({ team, href, selected, detailed }: TeamCardProps) {
  const region = team.kind === "club" ? `${team.region} (${team.city})` : team.region;

  return (
    <Shell href={href} selected={selected}>
      <div className="flex items-center gap-3">
        <TeamLogo
          color={team.color}
          icon={team.icon}
          className={cn("rounded-2xl", detailed ? "size-16 text-3xl sm:size-16 sm:text-3xl" : "size-12 text-2xl sm:size-12 sm:text-2xl")}
        />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="flex items-center gap-2">
            <span className={cn("truncate font-black text-fg uppercase", detailed ? "text-xl" : "text-base")}>
              {team.name}
            </span>
            <span className="shrink-0 rounded-md bg-brand/10 px-1.5 py-0.5 text-[10px] font-black text-brand">
              {team.short}
            </span>
          </p>
          {detailed ? (
            <p className="truncate text-xs font-semibold text-fg-muted">{team.fullName}</p>
          ) : (
            <p className="truncate text-xs font-bold text-fg-faint uppercase">{team.subName}</p>
          )}
          <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-fg-muted">
            <MapPin className="size-3.5 shrink-0" aria-hidden />
            <span className="truncate">{region}</span>
          </p>
        </div>
      </div>

      {detailed ? (
        <div className="mt-3 space-y-3">
          {/* TODO: real stadium photo; until then a gradient in the club colour. */}
          <div
            className="relative flex h-32 flex-col justify-end overflow-hidden rounded-xl p-3 text-shell-foreground"
            style={{ backgroundImage: `linear-gradient(135deg, ${team.color}, var(--shell-deep))` }}
          >
            <span className="absolute top-2.5 right-2.5 rounded-md bg-shell-deep/60 px-2 py-0.5 text-xs font-black">
              {team.winRate.toFixed(1)}% wins
            </span>
            <p className="truncate text-base font-black">{team.stadium.name}</p>
            <p className="truncate text-[11px] font-semibold opacity-90">
              Capacity {team.stadium.capacity.toLocaleString("en-US")} · Coach {team.coach}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            <StatTile label="Length" value={`${team.stadium.trackLength} m`} />
            <StatTile label="Surface" value={team.stadium.surface} />
            <StatTile
              label="Track record"
              title={`${team.stadium.record.rider}, ${team.stadium.record.year}`}
              value={`${team.stadium.record.time.toFixed(2)} s`}
            />
          </div>

          <TrophyCase trophies={team.trophies} />

          <div className="flex items-center justify-between gap-2">
            {team.division ? <DivisionPill division={team.division} /> : <span />}
            <DetailsLink />
          </div>
        </div>
      ) : (
        <>
          <div className="mt-3 flex items-center gap-2 border-t border-line pt-2.5">
            {team.division ? <DivisionPill division={team.division} /> : null}
            <span className="min-w-0 flex-1 truncate text-xs text-fg-muted">{team.stadium.name}</span>
            <Winrate value={team.winRate} />
          </div>
          <div className="mt-2 flex items-center justify-between gap-2 text-xs">
            <span className="min-w-0 truncate text-fg-faint">
              Coach: <span className="font-bold text-fg">{team.coach}</span>
            </span>
            <DetailsLink />
          </div>
        </>
      )}
    </Shell>
  );
}
