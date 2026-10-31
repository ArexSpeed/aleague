import { cn } from "@/lib/utils";
import type { Division } from "@/sports/speedway/types/teams";
import { DIVISION_LABELS } from "../teams-params";

/** Gold / Silver dot for a division. */
export function DivisionDot({ division, className }: { division: Division; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("size-2.5 rounded-full", division.endsWith("gold") ? "bg-rank-gold" : "bg-rank-silver", className)}
    />
  );
}

export function DivisionPill({ division }: { division: Division }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-line bg-fg/5 px-2 py-1 text-[10px] font-black tracking-wide text-fg uppercase">
      <DivisionDot division={division} className="size-2" />
      {DIVISION_LABELS[division]}
    </span>
  );
}
