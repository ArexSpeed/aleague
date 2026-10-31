import { cn } from "@/lib/utils";

type Run = { points: number | null; bonus: boolean } | undefined;

/**
 * One heat result: 3 = green, 0 = red, bonus ("2+") = brand, the rest neutral.
 * Without a result (heat not run, or the rider did not start) it shows a dash.
 */
export function RunChip({
  run,
  compact = false,
  className,
}: {
  run?: Run;
  /** Small, content-sized chip (aside). Default fills its column. */
  compact?: boolean;
  className?: string;
}) {
  const base = compact
    ? "inline-flex h-5 min-w-5 items-center justify-center rounded px-1 text-[10px] font-bold"
    : "flex h-6 w-full items-center justify-center rounded-md border text-xs font-bold sm:h-7";

  if (!run || run.points === null) {
    return <span className={cn(base, "border-transparent text-fg-faint", className)}>–</span>;
  }

  const tone =
    run.points === 0
      ? "border-loss/30 bg-loss/10 text-loss"
      : run.bonus
        ? "border-brand/30 bg-brand/10 text-brand"
        : run.points === 3
          ? "border-win/30 bg-win/10 text-win"
          : "border-transparent bg-fg/5 text-fg-muted";

  return (
    <span className={cn(base, tone, className)}>
      {run.points}
      {run.bonus ? "+" : ""}
    </span>
  );
}
