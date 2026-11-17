import { Trophy } from "lucide-react";

import { cn } from "@/lib/utils";

export type TrophyMedal = "gold" | "silver" | "bronze";
export type TrophyItem = {
  id: string;
  label: string;
  medals?: Partial<Record<TrophyMedal, number>>;
};

const MEDALS: { id: TrophyMedal; dot: string }[] = [
  { id: "gold", dot: "bg-rank-gold" },
  { id: "silver", dot: "bg-rank-silver" },
  { id: "bronze", dot: "bg-rank-bronze" },
];

/** Shared trophy grid used by clubs and nations. Missing medal data renders as a dash. */
export function TrophyCase({ trophies, large = false }: { trophies: TrophyItem[]; large?: boolean }) {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {trophies.map((item) => (
        <div key={item.id} className="flex min-w-0 flex-col items-center gap-1 rounded-lg bg-fg/5 px-1 py-2">
          <Trophy className={cn("text-brand", large ? "size-6" : "size-5")} aria-hidden />
          <span className="max-w-full truncate text-[9px] font-bold tracking-wide text-fg-faint uppercase sm:text-[10px]">
            {item.label}
          </span>
          <div className="flex items-center gap-1.5">
            {MEDALS.map((medal) => (
              <span key={medal.id} className="flex flex-col items-center gap-0.5">
                <span className={cn("size-2 rounded-full", medal.dot)} aria-hidden />
                <span className="text-[11px] leading-none font-black text-fg">
                  {item.medals?.[medal.id] ?? "—"}
                </span>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
