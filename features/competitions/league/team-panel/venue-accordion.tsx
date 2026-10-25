import { ChevronRight, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import type { VenueStats } from "@/types/league";
import { formatBilans, winRate } from "../standings";

type VenueAccordionProps = {
  title: string;
  icon: LucideIcon;
  stats: VenueStats;
};

function Metric({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <span className="block text-[9px] font-semibold text-slate-400">{label}</span>
      {children}
    </div>
  );
}

/** Home / Away block. Native <details>, so open/close needs no JS. */
export function VenueAccordion({ title, icon: Icon, stats }: VenueAccordionProps) {
  return (
    <details open className="group shrink-0 border-t border-white/10 pt-2.5 pb-2">
      <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-bold text-white transition-colors hover:text-brand [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-1.5">
          <Icon className="size-3.5" aria-hidden />
          <span>{title}</span>
        </span>
        <ChevronRight
          className="size-4 text-slate-400 transition-transform group-open:rotate-90"
          aria-hidden
        />
      </summary>

      <div className="mt-2 flex flex-col gap-2 rounded-xl border border-white/5 bg-white/5 p-2.5">
        <div className="grid grid-cols-4 gap-1.5 border-b border-white/10 pb-2 text-center">
          <Metric label="Mecze">
            <span className="text-xs font-black text-white">{stats.games}</span>
          </Metric>
          <Metric label="W / D / L">
            <span className="text-xs font-black text-white">
              <span className="text-emerald-400">{stats.won}</span> / {stats.draw} /{" "}
              <span className="text-rose-400">{stats.lose}</span>
            </span>
          </Metric>
          <Metric label="Skuteczność">
            <span className="text-xs font-black text-positive">
              {winRate(stats.won, stats.games)}%
            </span>
          </Metric>
          <Metric label="Pkt">
            <span className="text-xs font-black text-brand">{stats.pts}</span>
          </Metric>
        </div>

        <div className="grid grid-cols-3 gap-1.5 pt-0.5 text-center">
          <Metric label="Pkt+ (zdobyte)">
            <span className="text-xs font-extrabold text-white">{stats.ptsPlus}</span>
          </Metric>
          <Metric label="Pkt- (stracone)">
            <span className="text-xs font-extrabold text-white">{stats.ptsMinus}</span>
          </Metric>
          <Metric label="Bilans (+/-)">
            <span className="text-xs font-black text-positive">{formatBilans(stats.bilans)}</span>
          </Metric>
        </div>
      </div>
    </details>
  );
}
