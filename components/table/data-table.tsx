import type { ReactNode } from "react";

import { TableHeader } from "./table-header";
import type { Column } from "./columns";
import { TableRow, type TableDensity } from "./table-row";

type DataTableProps<T> = {
  items: readonly T[];
  columns: readonly Column<T>[];
  getKey: (item: T) => string;
  /** Left header labels, e.g. "# Rider". */
  headerLead: ReactNode;
  showHeader?: boolean;
  /** Left part of a row: badge, logo, name. */
  renderLead: (item: T, index: number) => ReactNode;
  /** With a href the row is a link (opens an aside or a page). */
  getHref?: (item: T) => string;
  isSelected?: (item: T) => boolean;
  density?: TableDensity;
  /** Extra lines, shown only in the "detailed" density. */
  renderDetail?: (item: T) => ReactNode;
};

/** Header stays put, only the list below it scrolls. Rows come from the column definitions. */
export function DataTable<T>({
  items,
  columns,
  getKey,
  headerLead,
  showHeader = true,
  renderLead,
  getHref,
  isSelected,
  density = "compact",
  renderDetail,
}: DataTableProps<T>) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {showHeader ? <TableHeader columns={columns} lead={headerLead} /> : null}
      <ol className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-1 pb-1">
        {items.map((item, index) => (
          <TableRow
            key={getKey(item)}
            item={item}
            columns={columns}
            lead={renderLead(item, index)}
            href={getHref?.(item)}
            selected={isSelected?.(item) ?? false}
            density={density}
            detail={renderDetail?.(item)}
          />
        ))}
      </ol>
    </div>
  );
}