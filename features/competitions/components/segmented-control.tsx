import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type SegmentedOption = {
  key: string;
  href: string;
  active: boolean;
  label: ReactNode;
  title?: string;
  /** Icon-only buttons get square padding and need `title` for accessibility. */
  iconOnly?: boolean;
};

type SegmentedControlProps = {
  options: SegmentedOption[];
  /** brand: active pill is blue (Round / group filters). neutral: active pill is white (venue / view). */
  variant: "brand" | "neutral";
  label: string;
};

const styles = {
  brand: {
    box: "rounded-lg",
    item: "rounded-md px-3 py-1",
    active: "bg-brand text-white shadow-xs",
    idle: "font-semibold text-slate-600 hover:text-main-foreground",
  },
  neutral: {
    box: "rounded-xl",
    item: "rounded-lg px-2.5 py-1",
    active: "bg-white text-main-foreground shadow-xs",
    idle: "font-semibold text-slate-500 hover:text-main-foreground",
  },
} as const;

/** A row of <Link>s styled as a segmented control. State is the URL, so no client JS. */
export function SegmentedControl({ options, variant, label }: SegmentedControlProps) {
  const s = styles[variant];
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "no-scrollbar inline-flex max-w-full items-center gap-1 overflow-x-auto border border-black/5 bg-white/70 p-0.5 shadow-xs backdrop-blur-sm",
        s.box,
      )}
    >
      {options.map((option) => (
        <Link
          key={option.key}
          href={option.href}
          replace
          scroll={false}
          title={option.title}
          aria-label={option.iconOnly ? option.title : undefined}
          aria-current={option.active ? "true" : undefined}
          className={cn(
            "flex shrink-0 items-center gap-1.5 text-xs font-bold whitespace-nowrap transition-all",
            s.item,
            option.iconOnly && "p-1.5",
            option.active ? s.active : s.idle,
          )}
        >
          {option.label}
        </Link>
      ))}
    </div>
  );
}
