import { cn } from "@/lib/utils";
import type { Helmet } from "@/sports/speedway/types/match";

/**
 * Helmet colours are domain data (like a club colour), not theme colours,
 * so they are fixed hex values and look the same in every theme.
 */
export const HELMETS: Record<Helmet, { label: string; color: string; text: string }> = {
  red: { label: "red", color: "#e11d48", text: "#ffffff" },
  blue: { label: "blue", color: "#2563eb", text: "#ffffff" },
  white: { label: "white", color: "#ffffff", text: "#0f172a" },
  yellow: { label: "yellow", color: "#facc15", text: "#0f172a" },
};

export function HelmetDot({ helmet, className }: { helmet: Helmet; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("size-2.5 shrink-0 rounded-full ring-1 ring-line", className)}
      style={{ backgroundColor: HELMETS[helmet].color }}
    />
  );
}

/** Rider number on a square in the helmet colour. */
export function HelmetBadge({ helmet, number }: { helmet: Helmet; number: number }) {
  const { color, text } = HELMETS[helmet];
  return (
    <span
      className="flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-black shadow-xs ring-1 ring-line sm:size-8 sm:text-sm"
      style={{ backgroundColor: color, color: text }}
    >
      {number}
    </span>
  );
}
