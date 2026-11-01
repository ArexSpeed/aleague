import { cn } from "@/lib/utils";

/** W / D / L for a played match, ? for a match that has not been played yet. */
export type MatchResult = "W" | "D" | "L" | "?";

const tone: Record<MatchResult, string> = {
  W: "border-win/30 bg-win/20 text-win",
  L: "border-loss/30 bg-loss/20 text-loss",
  D: "border-warning/30 bg-warning/20 text-warning",
  "?": "border-line bg-surface text-fg-faint",
};

export function ResultBadge({ result, className }: { result: MatchResult; className?: string }) {
  return (
    <span
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-md border text-[10px] font-black",
        tone[result],
        className,
      )}
    >
      {result}
    </span>
  );
}
