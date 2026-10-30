import {
  defineFilters,
  filterEntries,
  firstParam,
  parseFilters,
  pickOne,
  type FilterValues,
  type RawSearchParams,
} from "@/lib/url-state";

/**
 * League page URL state, every click is a plain <Link>: shareable, refresh-safe,
 * and the browser back button closes the team panel.
 *   /speedway/competitions/league?tab=fixtures&round=Regio&group=rot-regio&schedule=upcoming
 * Only values that differ from the defaults end up in the URL.
 */

export const LEAGUE_TAB_IDS = ["table", "fixtures", "stats", "history"] as const;

export const LEAGUE_TABS: readonly { id: (typeof LEAGUE_TAB_IDS)[number]; label: string }[] = [
  { id: "table", label: "Table" },
  { id: "fixtures", label: "Fixtures" },
  { id: "stats", label: "Stats" },
  { id: "history", label: "History" },
];

export const ROUND_TYPES = ["League", "Regio", "Nation"] as const;
export const PANEL_TABS = ["stats", "games", "riders", "details"] as const;

/**
 * Every enumerated filter, described once.
 *   no `tabs`    -> global, kept on every tab (round, view)
 *   tabs: [...]  -> only on those tabs, dropped when you switch away (venue, schedule)
 * A new filter = one entry here + a toggle in the tab's toolbar.
 */
export const FILTERS = defineFilters({
  round: { values: ROUND_TYPES, default: "League" },
  view: { values: ["detailed", "compact"], default: "detailed" },
  venue: { values: ["all", "home", "away"], default: "all", tabs: ["table"] },
  schedule: { values: ["all", "upcoming", "recent"], default: "all", tabs: ["fixtures"] },
});

type FilterState = FilterValues<typeof FILTERS>;

export type RoundType = FilterState["round"];
export type ViewMode = FilterState["view"];
export type Venue = FilterState["venue"];
export type Schedule = FilterState["schedule"];
export type LeagueTab = (typeof LEAGUE_TAB_IDS)[number];
export type PanelTab = (typeof PANEL_TABS)[number];

// Option lists derived from FILTERS (kept for components that iterate over them).
export const VENUES = FILTERS.venue.values;
export const SCHEDULE_MODES = FILTERS.schedule.values;
export const VIEW_MODES = FILTERS.view.values;

export type SubFilter = { id: string; label: string; dot?: string };

/** Ids are unique on purpose: "West" exists twice in League (gold and silver). */
export const SUB_FILTERS: Record<RoundType, SubFilter[]> = {
  League: [
    { id: "all-league", label: "All" },
    { id: "gold-west", label: "West", dot: "bg-rank-gold" },
    { id: "gold-east", label: "East", dot: "bg-rank-gold" },
    { id: "silver-west", label: "West", dot: "bg-rank-silver" },
    { id: "silver-east", label: "East", dot: "bg-rank-silver" },
  ],
  Regio: [
    { id: "all-regio", label: "All" },
    { id: "rot-regio", label: "ROT" },
    { id: "cel-regio", label: "CEL" },
    { id: "mon-regio", label: "MON" },
    { id: "ark-regio", label: "ARK" },
    { id: "cos-regio", label: "COS" },
    { id: "arv-regio", label: "ARV" },
    { id: "riv-regio", label: "RIV" },
    { id: "got-regio", label: "GOT" },
  ],
  Nation: [
    { id: "all-nation", label: "All" },
    { id: "rot-nation", label: "ROT" },
    { id: "cel-nation", label: "CEL" },
    { id: "mon-nation", label: "MON" },
    { id: "ark-nation", label: "ARK" },
    { id: "cos-nation", label: "COS" },
    { id: "arv-nation", label: "ARV" },
    { id: "riv-nation", label: "RIV" },
    { id: "got-nation", label: "GOT" },
  ],
};

/** The default group of a round is its first entry ("All"). It never appears in the URL. */
export function defaultGroup(round: RoundType): string {
  return SUB_FILTERS[round][0].id;
}

export type LeagueParams = FilterState & {
  tab: LeagueTab;
  /** Sub-filter of the round (division / region). Global, depends on `round`. */
  group: string;
  /** Selected team in the aside. */
  team?: string;
  panel: PanelTab;
  /** Page URL without query: /<sport>/competitions/league */
  base: string;
  sport: string;
};

export function parseLeagueParams(raw: RawSearchParams, base: string, sport: string): LeagueParams {
  const filters = parseFilters(FILTERS, raw);
  const rawGroup = firstParam(raw.group);
  const groupExists = SUB_FILTERS[filters.round].some((f) => f.id === rawGroup);

  return {
    ...filters,
    tab: pickOne(LEAGUE_TAB_IDS, firstParam(raw.tab), "table"),
    panel: pickOne(PANEL_TABS, firstParam(raw.panel), "stats"),
    group: groupExists && rawGroup ? rawGroup : defaultGroup(filters.round),
    team: firstParam(raw.team),
    base,
    sport,
  };
}

export type LeaguePatch = Partial<Omit<LeagueParams, "base" | "sport">>;

/**
 * Builds a page URL from the current params plus a patch. `team: undefined` closes the aside.
 * Filters that do not belong to the target tab are dropped automatically.
 */
export function buildLeagueHref(params: LeagueParams, patch: LeaguePatch = {}): string {
  const next = { ...params, ...patch };
  const qs = new URLSearchParams();

  if (next.tab !== "table") qs.set("tab", next.tab);
  for (const [key, value] of filterEntries(FILTERS, next, next.tab)) qs.set(key, value);
  if (next.group !== defaultGroup(next.round)) qs.set("group", next.group);
  if (next.panel !== "stats") qs.set("panel", next.panel);
  if (next.team) qs.set("team", next.team);

  const query = qs.toString();
  return query ? `${next.base}?${query}` : next.base;
}
