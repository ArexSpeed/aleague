"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

import { DEFAULT_THEME, THEMES } from "@/lib/themes";

/**
 * Puts `data-theme="<id>"` on <html> (and remembers the choice in localStorage).
 * The CSS reacts to that attribute, so no component needs to know the theme.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme={DEFAULT_THEME}
      themes={THEMES.map((theme) => theme.id)}
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
