import { House, LayoutGrid, RotateCcw, Shield, Trophy, type LucideIcon } from "lucide-react";

export type NavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  /** Items without href are popup triggers (Cofnij, More), wired up later. */
  href?: string;
};

/** Single source of truth for SideNav (desktop) and BottomNav (mobile). */
export const NAV_ITEMS: NavItem[] = [
  { id: "back", label: "Cofnij", icon: RotateCcw },
  { id: "home", label: "Home", icon: House, href: "/home" },
  { id: "competitions", label: "Competitions", icon: Trophy, href: "/competitions" },
  { id: "teams", label: "Teams", icon: Shield, href: "/teams" },
  { id: "more", label: "More", icon: LayoutGrid },
];

export function isNavItemActive(pathname: string, item: NavItem): boolean {
  if (!item.href) return false;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
