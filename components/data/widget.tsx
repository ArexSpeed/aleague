import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/** Titled card of a page: icon + title on the left, a small hint on the right. */
export function Widget({
  icon: Icon,
  title,
  hint,
  children,
}: {
  icon: LucideIcon;
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-3 sm:p-4">
      <header className="mb-3 flex items-center justify-between gap-3 border-b border-line pb-2.5">
        <h2 className="flex items-center gap-2 text-sm font-black tracking-wide text-fg uppercase">
          <Icon className="size-4 text-brand" aria-hidden />
          {title}
        </h2>
        {hint ? <span className="text-right text-[11px] font-semibold text-fg-faint">{hint}</span> : null}
      </header>
      {children}
    </section>
  );
}
