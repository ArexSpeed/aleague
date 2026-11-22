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
 * League page URL state. Competition kind is stored as `kind`; the league
 * division / region is stored as `group`. Refresh and browser back remain URL-safe.
 */

export const LEAGUE_TAB_IDS = ["table", "fixtures", "stats", "history", "groups", "final"] as const;

export const LEAGUE_TABS: readonly { id: (typeof LEAGUE_TAB_IDS)[number]; label: string }[] = [
  { id: "table", label: "Table" },
  { id: "fixtures", label: "Fixtures" },
  { id: "stats", label: "Stats" },
  { id: "history", label: "History" },
  { id: "groups", label: "Groups" },
  { id: "final", label: "Final" },
];

export const COMPETITION_KINDS = ["league", "nation"] as const;
export const PANEL_TABS = ["stats", "games", "riders", "details"] as const;

export const FILTERS = defineFilters({
  view: { values: ["detailed", "compact"], default: "detailed" },
  venue: { values: ["all", "home", "away"], default: "all", tabs: ["table", "stats"] },
  schedule: { values: ["all", "upcoming", "recent"], default: "all", tabs: ["fixtures"] },
  metrics: { values: ["stats", "skills"], default: "stats", tabs: ["stats"] },
});

type FilterState = FilterValues<typeof FILTERS>;

export type CompetitionKind = (typeof COMPETITION_KINDS)[number];
export type ViewMode = FilterState["view"];
export type Venue = FilterState["venue"];
export type Schedule = FilterState["schedule"];
export type Metrics = FilterState["metrics"];
export type LeagueTab = (typeof LEAGUE_TAB_IDS)[number];
export type PanelTab = (typeof PANEL_TABS)[number];

export const VENUES = FILTERS.venue.values;
export const SCHEDULE_MODES = FILTERS.schedule.values;
export const VIEW_MODES = FILTERS.view.values;

export type SubFilter = { id: string; label: string; dot?: string };

export const SUB_FILTERS: Record<CompetitionKind, SubFilter[]> = {
  league: [
    { id: "gold-west", label: "West", dot: "bg-rank-gold" },
    { id: "gold-east", label: "East", dot: "bg-rank-gold" },
    { id: "silver-west", label: "West", dot: "bg-rank-silver" },
    { id: "silver-east", label: "East", dot: "bg-rank-silver" },
  ],
  nation: [
    { id: "league", label: "League" },
    { id: "junior", label: "Junior" },
    { id: "games", label: "Games" },
    { id: "4teams", label: "4Teams" },
    { id: "pairs", label: "Pairs" },
  ],
};

export function defaultGroup(kind: CompetitionKind): string {
  return SUB_FILTERS[kind][0].id;
}

export type LeagueParams = FilterState & {
  kind: CompetitionKind;
  competition?: "league" | "junior" | "games" | "4teams" | "pairs";
  tab: LeagueTab;
  group: string;
  team?: string;
  match?: string;
  matchday?: number;
  panel: PanelTab;
  base: string;
  sport: string;
};

export function parseLeagueParams(raw: RawSearchParams, base: string, sport: string): LeagueParams {
  const filters = parseFilters(FILTERS, raw);
  const kind = pickOne(
    COMPETITION_KINDS,
    firstParam(raw.kind)?.toLowerCase() as CompetitionKind | undefined,
    "league",
  );
  const rawGroup = firstParam(raw.group);
  const groupExists = SUB_FILTERS[kind].some((filter) => filter.id === rawGroup);
  const rawMatchday = firstParam(raw.matchday);
  const matchday = rawMatchday ? Number.parseInt(rawMatchday, 10) : undefined;
  const competition =
    kind === "nation"
      ? pickOne(
          ["league", "junior", "games", "4teams", "pairs"] as const,
          firstParam(raw.competition),
          "league",
        )
      : undefined;

  const defaultTab = kind === "nation" && competition === "games" ? "groups" : "table";

  return {
    ...filters,
    kind,
    competition,
    tab: pickOne(LEAGUE_TAB_IDS, firstParam(raw.tab), defaultTab),
    panel: pickOne(PANEL_TABS, firstParam(raw.panel), "stats"),
    group: groupExists && rawGroup ? rawGroup : defaultGroup(kind),
    team: firstParam(raw.team),
    match: firstParam(raw.match),
    matchday: Number.isFinite(matchday) && matchday! > 0 ? matchday : undefined,
    base,
    sport,
  };
}

export type LeaguePatch = Partial<Omit<LeagueParams, "base" | "sport">>;

export function buildLeagueHref(params: LeagueParams, patch: LeaguePatch = {}): string {
  const next = { ...params, ...patch };
  if (patch.kind && patch.kind !== params.kind) {
    next.group = defaultGroup(patch.kind);
  }
  const qs = new URLSearchParams();
  qs.set("kind", next.kind);
  if (next.kind === "nation" && next.competition) qs.set("competition", next.competition);
  if (next.tab !== "table") qs.set("tab", next.tab);
  for (const [key, value] of filterEntries(FILTERS, next, next.tab)) qs.set(key, value);
  if (next.kind !== "nation" && next.group !== defaultGroup(next.kind)) qs.set("group", next.group);
  if (next.panel !== "stats") qs.set("panel", next.panel);
  if (next.team) qs.set("team", next.team);
  if (next.match) qs.set("match", next.match);
  if (next.matchday !== undefined && next.matchday > 0) qs.set("matchday", String(next.matchday));

  const query = qs.toString();
  return query ? `${next.base}?${query}` : next.base;
}
