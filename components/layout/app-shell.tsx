import { Suspense, type ReactNode } from "react";

import { BottomNav } from "./bottom-nav";
import { SideNav } from "./side-nav";
import { TopBar } from "./top-bar";

/**
 * Frame of the whole app:
 *   TopBar
 *   SideNav (md+) | main arena (children)
 *   BottomNav (below md)
 * Regions (data-region) decide which colours semantic classes resolve to:
 * the frame is "shell", the arena is "main", the detail aside inside it is "shell" again.
 *
 * SideNav/BottomNav read the pathname (runtime data), so they stream in behind Suspense.
 */
export function AppShell({
  sport,
  sportName,
  children,
}: {
  sport: string;
  sportName: string;
  children: ReactNode;
}) {
  return (
    <div
      data-region="shell"
      className="flex h-dvh flex-col overflow-hidden bg-shell-deep text-fg antialiased"
    >
      <TopBar sportName={sportName} />
      <div className="flex min-h-0 flex-1">
        <Suspense fallback={<div className="hidden w-16 shrink-0 bg-shell md:block lg:w-20" />}>
          <SideNav sport={sport} />
        </Suspense>
        <div className="min-w-0 flex-1 px-0 pb-2 md:px-2 md:pl-0">
          <main
            data-region="main"
            className="h-full overflow-hidden rounded-lg border border-line bg-main text-fg shadow-2xl md:rounded-xl"
          >
            <Suspense
              fallback={<div className="p-4 text-sm font-semibold opacity-60">Ładowanie…</div>}
            >
              {children}
            </Suspense>
          </main>
        </div>
      </div>
      <Suspense fallback={<div className="h-12 shrink-0 bg-shell md:hidden" />}>
        <BottomNav sport={sport} />
      </Suspense>
    </div>
  );
}