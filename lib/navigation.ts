import { House, LayoutGrid, RotateCcw, Shield, Trophy, type LucideIcon } from "lucide-react";

import { sportPath } from "./paths";

export type NavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  /** Where the link goes, relative to the sport (/<sport>/<path>). No path = popup trigger (Cofnij, More). */
  path?: string;
  /** Section prefix used to highlight the item on its subpages. Defaults to `path`. */
  section?: string;
};

export type ResolvedNavItem = NavItem & { href?: string; sectionHref?: string };

/** Single source of truth for SideNav (desktop) and BottomNav (mobile). */
export const NAV_ITEMS: NavItem[] = [
  { id: "back", label: "Cofnij", icon: RotateCcw },
  { id: "home", label: "Home", icon: House, path: "home" },
  // Until there is a competitions submenu, the icon opens the league directly.
  {
    id: "competitions",
    label: "Competitions",
    icon: Trophy,
    path: "competitions/league",
    section: "competitions",
  },
  { id: "teams", label: "Teams", icon: Shield, path: "teams" },
  { id: "more", label: "More", icon: LayoutGrid },
];

/** Nav items with real URLs for the given sport. */
export function getNavItems(sport: string): ResolvedNavItem[] {
  return NAV_ITEMS.map((item) => ({
    ...item,
    href: item.path ? sportPath(sport, item.path) : undefined,
    sectionHref: item.path ? sportPath(sport, item.section ?? item.path) : undefined,
  }));
}

export function isNavItemActive(pathname: string, item: ResolvedNavItem): boolean {
  const base = item.sectionHref;
  if (!base) return false;
  return pathname === base || pathname.startsWith(`${base}/`);
}
