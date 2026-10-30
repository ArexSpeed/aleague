/**
 * Generic URL state helpers (no sport or page knowledge).
 * A filter is described once: allowed values, default, and optionally the tabs it belongs to.
 * Parsing, TS types and link building all come from that one description.
 */

export type RawSearchParams = Record<string, string | string[] | undefined>;

export type FilterDef = {
  values: readonly string[];
  default: string;
  /** Tabs this filter is meaningful on. Omitted = global, kept on every tab. */
  tabs?: readonly string[];
};

/** Identity function; `const` keeps the literal types of values and defaults. */
export function defineFilters<const T extends Record<string, FilterDef>>(defs: T): T {
  return defs;
}

export type FilterValues<T extends Record<string, FilterDef>> = {
  [K in keyof T]: T[K]["values"][number];
};

export function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** The value if it is one of `values`, otherwise the fallback. */
export function pickOne<T extends string>(
  values: readonly T[],
  value: string | undefined,
  fallback: T,
): T {
  return values.find((v) => v === value) ?? fallback;
}

export function parseFilters<T extends Record<string, FilterDef>>(
  defs: T,
  raw: RawSearchParams,
): FilterValues<T> {
  const result: Record<string, string> = {};
  for (const [key, def] of Object.entries(defs)) {
    result[key] = pickOne(def.values, firstParam(raw[key]), def.default);
  }
  return result as FilterValues<T>;
}

/**
 * Query entries for a link to `tab`: only non-default values, and only filters
 * that belong to that tab (so `venue` disappears when you go to Fixtures).
 */
export function filterEntries<T extends Record<string, FilterDef>>(
  defs: T,
  values: Partial<FilterValues<T>>,
  tab: string,
): [string, string][] {
  const entries: [string, string][] = [];
  for (const [key, def] of Object.entries(defs)) {
    const value = (values as Record<string, string | undefined>)[key];
    if (value === undefined || value === def.default) continue;
    if (def.tabs && !def.tabs.includes(tab)) continue;
    entries.push([key, value]);
  }
  return entries;
}
