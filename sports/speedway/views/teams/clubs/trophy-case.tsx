import { Trophy } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Trophies } from "@/sports/speedway/types/teams";

const TROPHIES: { id: keyof Trophies; label: string }[] = [
  { id: "league", label: "League" },
  { id: "cup", label: "Cup" },
  { id: "supercup", label: "Supercup" },
  { id: "pairs", label: "Pairs" },
  { id: "fours", label: "Fours" },
];

const MEDALS = [
  { id: "gold", dot: "bg-rank-gold" },
  { id: "silver", dot: "bg-rank-silver" },
  { id: "bronze", dot: "bg-rank-bronze" },
] as const;

/** 5 trophies, each with gold / silver / bronze counts under it. */
export function TrophyCase({ trophies, large = false }: { trophies: Trophies; large?: boolean }) {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {TROPHIES.map(({ id, label }) => (
        <div key={id} className="flex min-w-0 flex-col items-center gap-1 rounded-lg bg-fg/5 px-1 py-2">
          <Trophy className={cn("text-brand", large ? "size-6" : "size-5")} aria-hidden />
          <span className="max-w-full truncate text-[9px] font-bold tracking-wide text-fg-faint uppercase sm:text-[10px]">
            {label}
          </span>
          <div className="flex items-center gap-1.5">
            {MEDALS.map((medal) => (
              <span key={medal.id} className="flex flex-col items-center gap-0.5">
                <span className={cn("size-2 rounded-full", medal.dot)} aria-hidden />
                <span className="text-[11px] leading-none font-black text-fg">
                  {trophies[id][medal.id]}
                </span>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
