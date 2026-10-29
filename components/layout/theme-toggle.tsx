"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { DEFAULT_THEME, THEMES } from "@/lib/themes";

const subscribe = () => () => {};
/** false on the server and during hydration, true afterwards. */
const useMounted = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

/** Cycles through THEMES. Works for any number of themes. */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  // Until mounted, behave exactly like the server did (default theme), so HTML matches.
  const current = mounted ? (theme ?? DEFAULT_THEME) : DEFAULT_THEME;
  const index = Math.max(
    0,
    THEMES.findIndex((t) => t.id === current),
  );
  const next = THEMES[(index + 1) % THEMES.length];
  const Icon = current === "dark" ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={() => setTheme(next.id)}
      className="rounded-xl bg-surface p-1.5 text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg"
      title={`Theme: ${next.label}`}
      aria-label={`Switch theme to ${next.label}`}
    >
      <Icon className="size-4" aria-hidden />
    </button>
  );
}