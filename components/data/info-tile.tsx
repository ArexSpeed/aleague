import type { LucideIcon } from "lucide-react";

/** Icon + small label + value (stadium, track length, weather...). */
export function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-line bg-surface p-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand">
        <Icon className="size-4.5" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-bold tracking-wider text-fg-faint uppercase">{label}</p>
        <p className="truncate text-sm font-extrabold text-fg">{value}</p>
      </div>
    </div>
  );
}
