import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { competitionsHref } from "@/lib/paths";
import type { SportId } from "@/sports/types";

/**
 * Back to the matchday this match belongs to.
 * TODO: when matches are also opened from a rider's calendar, return to where the user came from.
 */
export function BackLink({ sport, matchday }: { sport: SportId; matchday: number }) {
  return (
    <Link
      href={competitionsHref({ sport, kind: "league", tab: "fixtures", matchday })}
      className="flex shrink-0 items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-1.5 text-sm font-bold text-fg shadow-xs transition-colors hover:bg-surface-hover"
    >
      <ArrowLeft className="size-4" aria-hidden />
      Back
    </Link>
  );
}
