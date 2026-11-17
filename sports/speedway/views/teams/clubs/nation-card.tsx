import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { TrophyCase, type TrophyItem } from "@/components/data/trophy-case";
import { TeamLogo } from "@/components/data/team-logo";
import { cn } from "@/lib/utils";
import type { NationCardData } from "@/sports/speedway/types/teams";
import { StatTile } from "@/components/data/stat-tile";

type Props = {
  nation: NationCardData;
  href: string;
  selected: boolean;
  detailed: boolean;
};

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

export function NationCard({ nation, href, selected, detailed }: Props) {
  if (!detailed) {
    return (
      <Shell href={href} selected={selected}>
        <div className="flex h-full min-h-24 flex-col items-center justify-center gap-2 text-center">
          <TeamLogo color={nation.color} icon={nation.code} className="size-14 rounded-2xl text-xl" />
          <span className="line-clamp-2 text-sm font-black text-fg uppercase">{nation.name}</span>
        </div>
      </Shell>
    );
  }

  const trophies: TrophyItem[] = nation.trophies
    ? (["league", "cup", "junior", "pair", "fourTeam"] as const).map((id) => ({
        id,
        label:
          id === "fourTeam" ? "4Team" : id === "pair" ? "Pair" : id.charAt(0).toUpperCase() + id.slice(1),
        medals: nation.trophies?.[id],
      }))
    : ["League", "Cup", "Junior", "Pair", "4Team"].map((label) => ({ id: label.toLowerCase(), label }));

  return (
    <Shell href={href} selected={selected}>
      <div className="flex items-center gap-3">
        <TeamLogo color={nation.color} icon={nation.code} className="size-16 rounded-2xl text-xl" />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="flex items-center gap-2">
            <span className="truncate text-xl font-black text-fg uppercase">{nation.name}</span>
            <span className="shrink-0 rounded-md bg-brand/10 px-1.5 py-0.5 text-[10px] font-black text-brand">
              {nation.code || "—"}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-3 space-y-3">
        <div
          className="relative flex h-32 flex-col justify-end overflow-hidden rounded-xl p-3 text-shell-foreground"
          style={{ backgroundImage: `linear-gradient(135deg, ${nation.color}, var(--shell-deep))` }}
        >
          <p className="truncate text-base font-black">{nation.stadiumName || "—"}</p>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          <StatTile
            label="Length"
            value={nation.trackLength !== null && nation.trackLength !== undefined ? `${nation.trackLength} m` : "—"}
          />
          <StatTile label="Surface" value={nation.surface || "—"} />
          <StatTile
            label="Track record"
            title={
              nation.trackRecord?.rider && nation.trackRecord.year
                ? `${nation.trackRecord.rider}, ${nation.trackRecord.year}`
                : undefined
            }
            value={
              nation.trackRecord?.time !== null && nation.trackRecord?.time !== undefined
                ? `${nation.trackRecord.time.toFixed(2)} s`
                : "—"
            }
          />
        </div>

        <TrophyCase trophies={trophies} />

        <div className="flex items-center justify-end gap-2">
          <span className="flex items-center text-xs font-bold text-brand">
            Details
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </span>
        </div>
      </div>
    </Shell>
  );
}
