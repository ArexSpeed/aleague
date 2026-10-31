import type { ViewMode } from "@/components/toggle/view-mode-toggle";
import type { Division } from "@/sports/speedway/types/teams";
import type { RawSearchParams, SportId } from "@/sports/types";

export const TEAMS_TABS = [
  { id: "clubs", label: "Clubs" },
  { id: "nations", label: "Nations" },
  { id: "riders", label: "Riders" },
  { id: "competition", label: "Competition" },
] as const;

export const PANEL_TABS = [
  { id: "info", label: "Info" },
  { id: "riders", label: "Riders" },
  { id: "stats", label: "Stats" },
  { id: "history", label: "History" },
] as const;

export const DIVISIONS = ["all", "west-gold", "east-gold", "west-silver", "east-silver"] as const;

export const DIVISION_LABELS: Record<Division, string> = {
  "west-gold": "West Gold",
  "east-gold": "East Gold",
  "west-silver": "West Silver",
  "east-silver": "East Silver",
};

export type TeamsTab = (typeof TEAMS_TABS)[number]["id"];
export type PanelTab = (typeof PANEL_TABS)[number]["id"];
export type DivisionFilter = (typeof DIVISIONS)[number];

export type TeamsParams = {
  sport: SportId;
  /** /<sport>/teams without query */
  basePath: string;
  tab: TeamsTab;
  division: DivisionFilter;
  view: ViewMode;
  /** Search text (name, short, region, city, division). */
  q: string;
  /** Selected club / nation: opens the aside (mobile drawer). */
  team: string | undefined;
  panel: PanelTab;
};

type Patch = Partial<Omit<TeamsParams, "sport" | "basePath">>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const pick = <T extends string>(v: string | undefined, allowed: readonly T[]): T | undefined =>
  allowed.find((item) => item === v);

export function parseTeamsParams(raw: RawSearchParams, basePath: string, sport: SportId): TeamsParams {
  return {
    sport,
    basePath,
    tab: pick(first(raw.tab), TEAMS_TABS.map((t) => t.id)) ?? "clubs",
    division: pick(first(raw.division), DIVISIONS) ?? "all",
    view: pick(first(raw.view), ["compact", "detailed"] as const) ?? "compact",
    q: (first(raw.q) ?? "").trim(),
    team: first(raw.team) || undefined,
    panel: pick(first(raw.panel), PANEL_TABS.map((t) => t.id)) ?? "info",
  };
}

/** Current URL state + changes. A key set to `undefined` is removed (defaults are never written). */
export function buildTeamsHref(params: TeamsParams, patch: Patch = {}): string {
  const next = { ...params, ...patch };
  const query = new URLSearchParams();
  if (next.tab !== "clubs") query.set("tab", next.tab);
  if (next.division !== "all") query.set("division", next.division);
  if (next.view !== "compact") query.set("view", next.view);
  if (next.q) query.set("q", next.q);
  if (next.team) query.set("team", next.team);
  if (next.panel !== "info") query.set("panel", next.panel);
  const qs = query.toString();
  return qs ? `${params.basePath}?${qs}` : params.basePath;
}

export function matchesSearch(entry: { name: string; subName: string; short: string; fullName: string; region: string; city: string; division?: Division }, q: string): boolean {
  if (!q) return true;
  const haystack = [entry.name, entry.subName, entry.short, entry.fullName, entry.region, entry.city, entry.division ? DIVISION_LABELS[entry.division] : ""]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q.toLowerCase());
}
