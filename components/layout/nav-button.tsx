import Link from "next/link";

import { cn } from "@/lib/utils";
import type { ResolvedNavItem } from "@/lib/navigation";

type NavButtonProps = {
  item: ResolvedNavItem;
  active: boolean;
  variant: "side" | "bottom";
};

const base = "flex flex-col items-center justify-center transition-colors duration-200";

const variants = {
  side: {
    box: "size-12 rounded-2xl",
    active: "bg-brand text-brand-foreground shadow-lg shadow-brand/30",
    idle: "text-fg-faint hover:bg-surface-hover hover:text-fg",
    label: "mt-0.5 text-[9px] font-bold tracking-tight",
  },
  bottom: {
    box: "h-full flex-1",
    active: "text-brand",
    idle: "text-fg-faint hover:text-fg",
    label: "mt-0.5 text-[11px] font-bold tracking-tight",
  },
} as const;

export function NavButton({ item, active, variant }: NavButtonProps) {
  const v = variants[variant];
  const className = cn(base, v.box, active ? v.active : v.idle);
  const Icon = item.icon;
  const content = (
    <>
      <Icon className="size-5 stroke-[2.2]" aria-hidden />
      <span className={v.label}>{item.label}</span>
    </>
  );

  if (item.href) {
    return (
      <Link
        href={item.href}
        className={className}
        aria-current={active ? "page" : undefined}
        title={item.label}
      >
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={className} title={item.label} aria-label={item.label}>
      {content}
    </button>
  );
}
