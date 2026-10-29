"use client";

import { usePathname } from "next/navigation";

import { getNavItems, isNavItemActive } from "@/lib/navigation";
import { NavButton } from "./nav-button";

/** Mobile navigation (below md). Desktop uses SideNav. */
export function BottomNav({ sport }: { sport: string }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile navigation"
      data-region="shell"
      className="flex h-12 shrink-0 items-stretch bg-shell text-fg md:hidden"
    >
      {getNavItems(sport).map((item) => (
        <NavButton
          key={item.id}
          item={item}
          active={isNavItemActive(pathname, item)}
          variant="bottom"
        />
      ))}
    </nav>
  );
}
