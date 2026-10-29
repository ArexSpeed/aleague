import type { ReactNode } from "react";

/** Titled card with label / value rows (club info, match info). */
export function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-2 rounded-2xl border border-line bg-surface p-3 text-xs text-fg">
      <h3 className="text-[10px] font-black tracking-wider text-brand uppercase">{title}</h3>
      <dl className="divide-y divide-line text-[11px]">{children}</dl>
    </section>
  );
}

export function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex justify-between gap-3 py-2">
      <dt className="text-fg-faint">{label}</dt>
      <dd className="text-right font-semibold">{children}</dd>
    </div>
  );
}
