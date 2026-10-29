import Link from "next/link";

import { cn } from "@/lib/utils";

export type TabItem = {
  id: string;
  label: string;
  href: string;
};

type TabNavProps = {
  tabs: readonly TabItem[];
  active: string;
  label: string;
  /**
   * main: tabs of the master section (Table / Fixtures / Stats / History).
   * aside: tabs inside the detail panel (Stats / Games / Riders / Details).
   * Only size and layout differ; colours come from the region the nav sits in.
   */
  variant?: "main" | "aside";
};

const styles = {
  main: {
    nav: "gap-4 border-b border-line pb-1 lg:gap-6",
    tab: "border-b-2 pb-1.5 text-sm",
  },
  aside: {
    nav: "mb-3 justify-between border-b border-line pt-1",
    tab: "border-b-2 pb-2 text-xs capitalize",
  },
} as const;

/**
 * Link-based tabs: the active tab lives in the URL (shareable, back button works, no client JS).
 * The caller builds every href, so the same component serves any page of any sport.
 */
export function TabNav({ tabs, active, label, variant = "main" }: TabNavProps) {
  const s = styles[variant];
  return (
    <nav
      aria-label={label}
      className={cn("no-scrollbar flex shrink-0 items-center overflow-x-auto", s.nav)}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            replace={variant === "aside"}
            scroll={false}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "font-bold whitespace-nowrap transition-colors",
              s.tab,
              isActive
                ? "border-brand text-fg"
                : "border-transparent text-fg-faint hover:text-fg-muted",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
