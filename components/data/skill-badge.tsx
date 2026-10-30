import { cn } from "@/lib/utils";

/** Small value box for skill ratings. `highlight` marks high values. */
export function SkillBadge({ value, highlight }: { value: number; highlight?: boolean }) {
  return (
    <span
      className={cn(
        "flex h-6 w-full items-center justify-center rounded-md border text-xs font-bold sm:h-7",
        highlight ? "border-win/30 bg-win/10 text-win" : "border-transparent bg-fg/5 text-fg-muted",
      )}
    >
      {value}
    </span>
  );
}