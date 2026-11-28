"use client";

import { useActionState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

const TONES = {
  primary: "bg-brand text-brand-foreground hover:bg-brand/90",
  neutral: "bg-fg/5 text-fg-muted hover:text-fg",
  danger: "bg-loss/10 text-loss hover:bg-loss/20",
} as const;

type ActionOutcome = { ok: true } | { ok: false; error: string };

function toOutcome(value: unknown): ActionOutcome {
  if (
    typeof value === "object" &&
    value !== null &&
    "ok" in value &&
    (value as { ok: unknown }).ok === false &&
    "error" in value &&
    typeof (value as { error: unknown }).error === "string"
  ) {
    return { ok: false, error: (value as { error: string }).error };
  }
  return { ok: true };
}

/**
 * Button that runs a (bound) server action and shows the error the action returns
 * ({ ok: false, error }) next to the button. Actions that return nothing count as success.
 */
export function SimButton({
  action,
  children,
  tone = "neutral",
  className,
  disabled = false,
  title,
}: {
  action: () => Promise<unknown>;
  children: ReactNode;
  tone?: keyof typeof TONES;
  className?: string;
  disabled?: boolean;
  title?: string;
}) {
  const [state, formAction, pending] = useActionState<ActionOutcome | null>(
    async () => toOutcome(await action()),
    null,
  );
  const error = state && !state.ok ? state.error : null;

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-2">
      <button
        type="submit"
        disabled={disabled || pending}
        title={title}
        aria-busy={pending}
        className={cn(
          "rounded-lg px-3 py-1.5 text-xs font-black transition-colors disabled:cursor-not-allowed disabled:opacity-40",
          TONES[tone],
          className,
        )}
      >
        {children}
      </button>
      {error ? (
        <span role="alert" className="text-[11px] font-semibold text-loss">
          {error}
        </span>
      ) : null}
    </form>
  );
}