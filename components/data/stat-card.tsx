import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string | number;
  tone?: "default" | "positive" | "negative" | "brand";
  /** Smaller value text for long numbers (Points+, Points-, Bilans). */
  compact?: boolean;
};

const valueTone = {
  default: "text-chip-foreground",
  positive: "text-chip-win",
  negative: "text-chip-loss",
  brand: "text-brand-foreground",
} as const;

/** Small label + big number tile. Used in stat grids of detail panels. */
export function StatCard({ label, value, tone = "default", compact = false }: StatCardProps) {
  const brand = tone === "brand";
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl px-1 py-2 text-center",
        brand ? "bg-brand shadow-md ring-1 ring-white/20" : "bg-chip shadow-xs",
      )}
    >
      <span
        className={cn(
          "text-[10px] leading-tight font-bold whitespace-nowrap",
          brand ? "text-brand-foreground/90" : "text-chip-muted",
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "mt-1 leading-none font-black",
          compact ? "text-xs sm:text-sm" : "text-base",
          valueTone[tone],
        )}
      >
        {value}
      </span>
    </div>
  );
}
