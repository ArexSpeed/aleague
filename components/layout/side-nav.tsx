"use client";

import { usePathname } from "next/navigation";

import { isNavItemActive, NAV_ITEMS } from "@/lib/navigation";
import { NavButton } from "./nav-button";

/** Desktop navigation (md and up). Mobile uses BottomNav. */
export function SideNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="hidden w-16 shrink-0 flex-col items-center justify-between bg-shell py-4 text-shell-foreground md:flex lg:w-20"
    >
      <ul className="flex flex-col items-center gap-4 px-2">
        {NAV_ITEMS.map((item) => (
          <li key={item.id}>
            <NavButton item={item} active={isNavItemActive(pathname, item)} variant="side" />
          </li>
        ))}
      </ul>
    </nav>
  );
}
