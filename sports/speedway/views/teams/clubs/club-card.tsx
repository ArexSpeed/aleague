import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight, MapPin, Trophy } from "lucide-react";

import { StatTile } from "@/components/data/stat-tile";
import { TeamLogo } from "@/components/data/team-logo";
import { cn } from "@/lib/utils";
import type { ClubCardData } from "@/sports/speedway/types/teams";
import { DivisionPill } from "./division-pill";

type Props = {
  club: ClubCardData;
  href: string;
  selected: boolean;
  detailed: boolean;
  showLeague: boolean;
};

const dash = "—";

function Shell({ href, selected, children }: { href: string; selected: boolean; children: ReactNode }) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={selected ? "true" : undefined}
      className={cn(
        "group relative block h-full rounded-2xl border-2 bg-surface p-3 shadow-xs transition-colors hover:bg-surface-hover sm:p-4",
        selected ? "border-brand" : "border-transparent",
      )}
    >
      {selected ? <span className="absolute top-3 right-3 size-2.5 rounded-full bg-brand" aria-hidden /> : null}
      {children}
    </Link>
  );
}

export function ClubCard({ club, href, selected, detailed, showLeague }: Props) {
  const location = club.region && club.city ? `${club.region} (${club.city})` : club.region ?? club.city ?? dash;

  if (!detailed) {
    return (
      <Shell href={href} selected={selected}>
        <div className="flex h-full min-h-24 flex-col items-center justify-center gap-2 text-center">
          {club.icon ? (
            <TeamLogo color={club.color} icon={club.icon} className="size-14 rounded-2xl text-3xl" />
          ) : (
            <span
              className="grid size-14 shrink-0 place-items-center rounded-2xl text-base font-black text-white"
              style={{ backgroundColor: club.color }}
            >
              {club.short || club.name.slice(0, 2).toUpperCase()}
            </span>
          )}
          <span className="line-clamp-2 text-sm font-black text-fg uppercase">{club.name}</span>
        </div>
      </Shell>
    );
  }

  const trophies = club.trophies;

  return (
    <Shell href={href} selected={selected}>
      <div className="flex items-center gap-3">
        {club.icon ? (
          <TeamLogo color={club.color} icon={club.icon} className="size-16 rounded-2xl text-3xl" />
        ) : (
          <span
            className="grid size-16 shrink-0 place-items-center rounded-2xl text-xl font-black text-white"
            style={{ backgroundColor: club.color }}
          >
            {club.short || club.name.slice(0, 2).toUpperCase()}
          </span>
        )}
        <div className="min-w-0 flex-1 leading-tight">
          <p className="flex items-center gap-2">
            <span className="truncate text-xl font-black text-fg uppercase">{club.name}</span>
            <span className="shrink-0 rounded-md bg-brand/10 px-1.5 py-0.5 text-[10px] font-black text-brand">
              {club.short || dash}
            </span>
          </p>
          <p className="truncate text-xs font-semibold text-fg-muted">{club.fullName || dash}</p>
          <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-fg-muted">
            <MapPin className="size-3.5 shrink-0" aria-hidden />
            <span className="truncate">{location}</span>
          </p>
        </div>
      </div>

      <div className="mt-3 space-y-3">
        <div
          className="relative flex h-32 flex-col justify-end overflow-hidden rounded-xl p-3 text-shell-foreground"
          style={{ backgroundImage: `linear-gradient(135deg, ${club.color}, var(--shell-deep))` }}
        >
          <span className="absolute top-2.5 right-2.5 rounded-md bg-shell-deep/60 px-2 py-0.5 text-xs font-black">
            {club.winRate !== undefined ? `${club.winRate.toFixed(1)}% wins` : `${dash} wins`}
          </span>
          <p className="truncate text-base font-black">{club.stadium?.name || dash}</p>
          <p className="truncate text-[11px] font-semibold opacity-90">
            Capacity {club.stadium?.capacity?.toLocaleString("en-US") || dash} · Coach {club.coach || dash}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          <StatTile label="Length" value={club.trackLength !== undefined ? `${club.trackLength} m` : dash} />
          <StatTile label="Surface" value={club.surface || dash} />
          <StatTile
            label="Track record"
            title={club.trackRecord?.rider && club.trackRecord.year ? `${club.trackRecord.rider}, ${club.trackRecord.year}` : undefined}
            value={club.trackRecord ? `${club.trackRecord.time.toFixed(2)} s` : dash}
          />
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {(["league", "cup", "supercup", "pairs", "fours"] as const).map((kind) => (
            <div key={kind} className="flex min-w-0 flex-col items-center gap-1 rounded-lg bg-fg/5 px-1 py-2">
              <Trophy className="size-5 text-brand" aria-hidden />
              <span className="max-w-full truncate text-[9px] font-bold tracking-wide text-fg-faint uppercase sm:text-[10px]">
                {kind}
              </span>
              <div className="flex items-center gap-1.5">
                {(["gold", "silver", "bronze"] as const).map((medal) => (
                  <span key={medal} className="flex flex-col items-center gap-0.5">
                    <span
                      className={cn("size-2 rounded-full", medal === "gold" ? "bg-rank-gold" : medal === "silver" ? "bg-rank-silver" : "bg-rank-bronze")}
                      aria-hidden
                    />
                    <span className="text-[11px] leading-none font-black text-fg">
                      {trophies?.[kind]?.[medal] ?? 0}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-2">
          {showLeague ? <DivisionPill division={club.leagueId as Parameters<typeof DivisionPill>[0]["division"]} /> : <span />}
          <span className="flex items-center text-xs font-bold text-brand">
            Details
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </span>
        </div>
      </div>
    </Shell>
  );
}
