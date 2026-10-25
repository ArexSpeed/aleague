import type { ReactNode } from "react";

import { BottomNav } from "./bottom-nav";
import { SideNav } from "./side-nav";
import { TopBar } from "./top-bar";

/**
 * Frame of the whole app:
 *   TopBar
 *   SideNav (md+) | main arena (children)
 *   BottomNav (below md)
 * Pages render a MasterDetail (or anything else) inside the arena.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-shell-deep text-shell-foreground antialiased">
      <TopBar />
      <div className="flex min-h-0 flex-1">
        <SideNav />
        <div className="min-w-0 flex-1 px-2 pb-2 md:pl-0">
          <main className="h-full overflow-hidden rounded-2xl border border-white/5 bg-main text-main-foreground shadow-2xl">
            {children}
          </main>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
