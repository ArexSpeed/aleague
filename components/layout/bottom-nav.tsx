"use client";

import { usePathname } from "next/navigation";

import { isNavItemActive, NAV_ITEMS } from "@/lib/navigation";
import { NavButton } from "./nav-button";

/** Mobile navigation (below md). Desktop uses SideNav. */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile navigation"
      className="flex h-12 shrink-0 items-stretch bg-shell text-shell-foreground md:hidden"
    >
      {NAV_ITEMS.map((item) => (
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
