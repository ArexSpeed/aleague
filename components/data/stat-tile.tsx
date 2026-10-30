import { cn } from "@/lib/utils";

type StatTileProps = {
  label: string;
  value: string | number;
  /** Tooltip with the full name when the label is an abbreviation. */
  title?: string;
  tone?: "default" | "negative";
};

/** Small label + number tile for detailed rows (subtle background, works on any row). */
export function StatTile({ label, value, title, tone = "default" }: StatTileProps) {
  return (
    <div
      title={title}
      className="flex min-w-0 flex-col items-center justify-center rounded-lg bg-fg/5 px-1 py-1.5 text-center"
    >
      <span className="max-w-full truncate text-[9px] font-bold tracking-wide text-fg-faint uppercase sm:text-[10px]">
        {label}
      </span>
      <span
        className={cn(
          "mt-0.5 text-sm leading-none font-black",
          tone === "negative" ? "text-loss" : "text-fg",
        )}
      >
        {value}
      </span>
    </div>
  );
}