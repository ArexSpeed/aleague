import { ChevronRight, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import type { VenueStats } from "@/sports/speedway/types/league";
import { formatBilans, winRate } from "@/sports/speedway/views/competitions/league/standings";

type VenueAccordionProps = {
  title: string;
  icon: LucideIcon;
  stats: VenueStats;
};

function Metric({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <span className="block text-[9px] font-semibold text-fg-faint">{label}</span>
      {children}
    </div>
  );
}

/** Home / Away block. Native <details>, so open/close needs no JS. */
export function VenueAccordion({ title, icon: Icon, stats }: VenueAccordionProps) {
  return (
    <details open className="group shrink-0 border-t border-line pt-2.5 pb-2">
      <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-bold text-fg transition-colors hover:text-brand [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-1.5">
          <Icon className="size-3.5" aria-hidden />
          <span>{title}</span>
        </span>
        <ChevronRight
          className="size-4 text-fg-faint transition-transform group-open:rotate-90"
          aria-hidden
        />
      </summary>

      <div className="mt-2 flex flex-col gap-2 rounded-xl border border-line bg-surface p-2.5">
        <div className="grid grid-cols-4 gap-1.5 border-b border-line pb-2 text-center">
          <Metric label="Mecze">
            <span className="text-xs font-black text-fg">{stats.games}</span>
          </Metric>
          <Metric label="W / D / L">
            <span className="text-xs font-black text-fg">
              <span className="text-win">{stats.won}</span> / {stats.draw} /{" "}
              <span className="text-loss">{stats.lose}</span>
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
            <span className="text-xs font-extrabold text-fg">{stats.ptsPlus}</span>
          </Metric>
          <Metric label="Pkt- (stracone)">
            <span className="text-xs font-extrabold text-fg">{stats.ptsMinus}</span>
          </Metric>
          <Metric label="Bilans (+/-)">
            <span className="text-xs font-black text-positive">{formatBilans(stats.bilans)}</span>
          </Metric>
        </div>
      </div>
    </details>
  );
}
