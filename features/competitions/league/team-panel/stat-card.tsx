import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string | number;
  tone?: "default" | "positive" | "negative" | "brand";
  /** Smaller value text for long numbers (Points+, Points-, Bilans). */
  compact?: boolean;
};

const valueTone = {
  default: "text-shell",
  positive: "text-emerald-500",
  negative: "text-rose-500",
  brand: "text-white",
} as const;

export function StatCard({ label, value, tone = "default", compact = false }: StatCardProps) {
  const brand = tone === "brand";
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl px-1 py-2 text-center",
        brand ? "bg-brand text-white shadow-md ring-1 ring-white/20" : "bg-white shadow-xs",
      )}
    >
      <span
        className={cn(
          "text-[10px] leading-tight font-bold whitespace-nowrap",
          brand ? "text-white/90" : "text-slate-800",
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
