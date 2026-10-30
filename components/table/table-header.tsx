import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { DEFAULT_COLUMN_WIDTH, POINTS_COLUMN_WIDTH, type Column } from "./columns";

type TableHeaderProps<T> = {
  columns: readonly Column<T>[];
  /** Left labels, e.g. "# Team". */
  lead?: ReactNode;
};

/** Shares column widths with TableRow, so header and rows always line up. */
export function TableHeader<T>({ columns, lead }: TableHeaderProps<T>) {
  return (
    <div className="flex shrink-0 items-center justify-between px-2.5 py-1 text-xs font-extrabold tracking-wider text-fg-muted uppercase">
      <div className="flex items-center gap-1 sm:gap-2">{lead}</div>
      <div className="flex items-center gap-0.5 text-center font-bold sm:gap-2">
        {columns.map((c) => (
          <span
            key={c.id}
            title={c.title}
            className={cn(
              c.width ?? (c.emphasis ? POINTS_COLUMN_WIDTH : DEFAULT_COLUMN_WIDTH),
              c.emphasis && "font-extrabold text-fg",
              c.headerClassName,
            )}
          >
            {c.header}
          </span>
        ))}
      </div>
    </div>
  );
}