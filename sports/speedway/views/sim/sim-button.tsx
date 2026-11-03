import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const TONES = {
  primary: "bg-brand text-brand-foreground hover:bg-brand/90",
  neutral: "bg-fg/5 text-fg-muted hover:text-fg",
  danger: "bg-loss/10 text-loss hover:bg-loss/20",
} as const;

/** Button that runs a (bound) server action. Used by the test tools only. */
export function SimButton({
  action,
  children,
  tone = "neutral",
  className,
}: {
  action: () => Promise<void>;
  children: ReactNode;
  tone?: keyof typeof TONES;
  className?: string;
}) {
  return (
    <form action={action}>
      <button
        type="submit"
        className={cn("rounded-lg px-3 py-1.5 text-xs font-black transition-colors", TONES[tone], className)}
      >
        {children}
      </button>
    </form>
  );
}
