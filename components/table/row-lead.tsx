import { cn } from "@/lib/utils";

/** Position / heat number / shirt number. Colour comes from the caller. */
export function PositionBadge({ value, className }: { value: number | string; className?: string }) {
  return (
    <span
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-md text-xs shadow-xs transition-colors sm:size-7 sm:rounded-lg",
        className,
      )}
    >
      {value}
    </span>
  );
}

/** Team colour dot. Swap for a real logo component later. */
export function ColorDot({ color }: { color: string }) {
  return (
    <span
      aria-hidden
      className="size-4.5 shrink-0 rounded-full shadow-xs sm:size-5"
      style={{ backgroundColor: color }}
    />
  );
}

/** Two-line name. `secondary` also fits a substitute rider ("za: Kowalski"). */
export function RowName({ primary, secondary }: { primary: string; secondary?: string }) {
  return (
    <span className="flex min-w-0 flex-col truncate text-xs leading-tight font-extrabold tracking-tight text-main-foreground uppercase">
      <span className="truncate transition-colors group-hover:text-brand">{primary}</span>
      {secondary ? <span className="truncate font-semibold text-slate-700">{secondary}</span> : null}
    </span>
  );
}

/** First name small above, last name bold below (people). */
export function PersonName({ first, last }: { first: string; last: string }) {
  return (
    <span className="flex min-w-0 flex-col truncate leading-tight uppercase">
      <span className="truncate text-[11px] font-semibold text-fg-muted">{first}</span>
      <span className="truncate text-xs font-extrabold tracking-tight text-fg transition-colors group-hover:text-brand">
        {last}
      </span>
    </span>
  );
}

/** Rank badge colours for lists without relegation: gold, silver, bronze, neutral. */
export function podiumBadgeClass(pos: number): string {
  if (pos === 1) return "bg-rank-gold text-rank-on-light font-black";
  if (pos === 2) return "bg-rank-silver text-rank-on-light font-black";
  if (pos === 3) return "bg-rank-bronze text-rank-on-dark font-black";
  return "bg-chip text-chip-foreground font-bold";
}