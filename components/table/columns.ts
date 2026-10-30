import type { ReactNode } from "react";

export const DEFAULT_COLUMN_WIDTH = "w-4 text-center sm:w-6";
export const POINTS_COLUMN_WIDTH = "w-6 text-center sm:w-8";

export type Column<T> = {
  id: string;
  /** Header label; the same width class is used by the header and every row. */
  header: ReactNode;
  title?: string;
  cell: (item: T) => ReactNode;
  /** Width + alignment (default: DEFAULT_COLUMN_WIDTH). */
  width?: string;
  /** Text style of the cell (default: semibold, main colour). */
  className?: string;
  /** Filled badge, used for PTS. */
  emphasis?: boolean;
  /** Extra classes for the header cell only (e.g. highlight a column in brand colour). */
  headerClassName?: string;
};
