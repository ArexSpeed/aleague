import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { DEFAULT_COLUMN_WIDTH, POINTS_COLUMN_WIDTH, type Column } from "./columns";

export type TableDensity = "compact" | "detailed";

type TableRowProps<T> = {
  item: T;
  columns: readonly Column<T>[];
  /** Left part: position/number badge, logo, name. Use the RowLead pieces. */
  lead: ReactNode;
  /** With href the row is a Link (e.g. opens a panel); without it a plain row. */
  href?: string;
  selected?: boolean;
  density?: TableDensity;
  /** Extra lines, rendered only in the "detailed" density. */
  detail?: ReactNode;
};

const EMPHASIS =
  "flex h-6 items-center justify-center rounded-md bg-brand font-extrabold text-white shadow-xs sm:h-7 sm:rounded-lg";

export function TableRow<T>({
  item,
  columns,
  lead,
  href,
  selected = false,
  density = "compact",
  detail,
}: TableRowProps<T>) {
  const className = cn(
    "group mb-1 block rounded-lg border-2 bg-white px-1 py-1 transition-all duration-150",
    selected ? "border-brand shadow-md" : "border-transparent shadow-xs",
    href && !selected && "hover:bg-white/90",
  );

  const content = (
    <>
      <div className="flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-1 pr-1 sm:gap-2 sm:pr-2">{lead}</div>

        <div className="flex shrink-0 items-center gap-0.5 text-xs sm:gap-2">
          {columns.map((c) => (
            <span
              key={c.id}
              className={cn(
                c.width ?? (c.emphasis ? POINTS_COLUMN_WIDTH : DEFAULT_COLUMN_WIDTH),
                c.emphasis ? EMPHASIS : (c.className ?? "font-semibold text-main-foreground"),
              )}
            >
              {c.cell(item)}
            </span>
          ))}
        </div>
      </div>

      {density === "detailed" && detail ? (
        <div className="mt-1 border-t border-slate-100 px-1 pt-1 text-[11px] text-slate-600">
          {detail}
        </div>
      ) : null}
    </>
  );

  return (
    <li>
      {href ? (
        <Link
          href={href}
          scroll={false}
          aria-current={selected ? "true" : undefined}
          className={className}
        >
          {content}
        </Link>
      ) : (
        <div className={className}>{content}</div>
      )}
    </li>
  );
}