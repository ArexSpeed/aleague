import { z } from "zod";

/**
 * All League view state lives in the URL, so every click is a plain <Link>:
 * shareable, refresh-safe, and the browser back button closes the team panel.
 *   /competitions?tab=table&round=League&group=gold-west&venue=home&team=lyon&panel=riders
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
export const VENUES = ["all", "home", "away"] as const;
export const VIEW_MODES = ["detailed", "compact"] as const;
export const PANEL_TABS = ["stats", "games", "riders", "details"] as const;

export type RoundType = (typeof ROUND_TYPES)[number];
export type Venue = (typeof VENUES)[number];

export type SubFilter = { id: string; label: string; dot?: string };

/** Ids are unique on purpose: "West" exists twice in League (gold and silver). */
export const SUB_FILTERS: Record<RoundType, SubFilter[]> = {
  League: [
    { id: "all", label: "All" },
    { id: "gold-west", label: "West", dot: "bg-amber-400" },
    { id: "gold-east", label: "East", dot: "bg-amber-400" },
    { id: "silver-west", label: "West", dot: "bg-slate-300" },
    { id: "silver-east", label: "East", dot: "bg-slate-300" },
  ],
  Regio: [
    { id: "all", label: "All" },
    { id: "rot", label: "ROT" },
    { id: "cel", label: "CEL" },
    { id: "mon", label: "MON" },
    { id: "ark", label: "ARK" },
    { id: "cos", label: "COS" },
    { id: "arv", label: "ARV" },
    { id: "arv", label: "RIV" },
    { id: "arv", label: "GOT" },
  ],
  Nation: [
    { id: "all", label: "All" },
    { id: "rot", label: "ROT" },
    { id: "cel", label: "CEL" },
    { id: "mon", label: "MON" },
    { id: "ark", label: "ARK" },
    { id: "cos", label: "COS" },
    { id: "arv", label: "ARV" },
    { id: "arv", label: "RIV" },
    { id: "arv", label: "GOT" },
  ],
};

const paramsSchema = z.object({
  tab: z.enum(LEAGUE_TAB_IDS).catch("table"),
  round: z.enum(ROUND_TYPES).catch("League"),
  group: z.string().catch("all"),
  venue: z.enum(VENUES).catch("all"),
  view: z.enum(VIEW_MODES).catch("detailed"),
  team: z.string().optional().catch(undefined),
  panel: z.enum(PANEL_TABS).catch("stats"),
  /** Fixtures: selected match. */
  match: z.string().optional().catch(undefined),
  /** Fixtures: undefined = current matchday. */
  matchday: z.coerce.number().int().min(1).optional().catch(undefined),
});

export type LeagueParams = z.infer<typeof paramsSchema>;

type RawSearchParams = Record<string, string | string[] | undefined>;

export function parseLeagueParams(raw: RawSearchParams): LeagueParams {
  const parsed = paramsSchema.parse(raw);
  const groupExists = SUB_FILTERS[parsed.round].some((f) => f.id === parsed.group);
  return groupExists ? parsed : { ...parsed, group: "all" };
}

const DEFAULTS = {
  tab: "table",
  round: "League",
  group: "all",
  venue: "all",
  view: "detailed",
  panel: "stats",
} as const;

const KEYS = ["tab", "round", "group", "venue", "view", "panel"] as const;

/** Builds a /rozgrywki URL from current params plus a patch. `team: undefined` removes the panel. */
export function buildLeagueHref(params: LeagueParams, patch: Partial<LeagueParams> = {}): string {
  const next = { ...params, ...patch };
  const qs = new URLSearchParams();
  for (const key of KEYS) {
    if (next[key] !== DEFAULTS[key]) qs.set(key, next[key]);
  }
  if (next.team) qs.set("team", next.team);
  if (next.match) qs.set("match", next.match);
  if (next.matchday !== undefined) qs.set("matchday", String(next.matchday));
  const query = qs.toString();
  return query ? `/competitions?${query}` : "/competitions";
}
