import type { RawSearchParams, SportId } from "@/sports/types";

export const MATCH_TABS = [
  { id: "info", label: "Info" },
  { id: "squads", label: "Squads" },
  { id: "heats", label: "Heats" },
  { id: "stats", label: "Stats" },
] as const;

export const PANEL_TABS = [
  { id: "points", label: "Points" },
  { id: "rider", label: "Rider" },
  { id: "heat", label: "Heat" },
  { id: "stats", label: "Stats" },
] as const;

export const HEAT_FILTERS = ["all", "unplayed"] as const;

export type MatchTab = (typeof MATCH_TABS)[number]["id"];
export type PanelTab = (typeof PANEL_TABS)[number]["id"];
export type HeatFilter = (typeof HEAT_FILTERS)[number];

export type MatchParams = {
  sport: SportId;
  matchId: string;
  /** /<sport>/matches/<id> without query */
  basePath: string;
  tab: MatchTab;
  /** undefined = the user has not touched the aside yet (mobile drawer stays closed). */
  panel: PanelTab | undefined;
  rider: string | undefined;
  heat: number | undefined;
  show: HeatFilter;
};

type Patch = Partial<Pick<MatchParams, "tab" | "panel" | "rider" | "heat" | "show">>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function pick<T extends string>(value: string | undefined, allowed: readonly T[]): T | undefined {
  return allowed.find((item) => item === value);
}

export function parseMatchParams(
  raw: RawSearchParams,
  basePath: string,
  sport: SportId,
  matchId: string,
): MatchParams {
  const heat = Number(first(raw.heat));
  return {
    sport,
    matchId,
    basePath,
    tab: pick(first(raw.tab), MATCH_TABS.map((t) => t.id)) ?? "info",
    panel: pick(first(raw.panel), PANEL_TABS.map((t) => t.id)),
    rider: first(raw.rider) || undefined,
    heat: Number.isInteger(heat) && heat >= 1 ? heat : undefined,
    show: pick(first(raw.show), HEAT_FILTERS) ?? "all",
  };
}

/** Mobile drawer is open once something was picked (a rider, a heat or an aside tab). */
export const isAsideOpen = (params: MatchParams) =>
  params.panel !== undefined || params.rider !== undefined || params.heat !== undefined;

/** Current URL state + changes. A key set to `undefined` is removed from the URL. */
export function buildMatchHref(params: MatchParams, patch: Patch = {}): string {
  const next = {
    tab: params.tab,
    panel: params.panel,
    rider: params.rider,
    heat: params.heat,
    show: params.show,
    ...patch,
  };

  const query = new URLSearchParams();
  if (next.tab !== "info") query.set("tab", next.tab);
  if (next.panel) query.set("panel", next.panel);
  if (next.rider) query.set("rider", next.rider);
  if (next.heat) query.set("heat", String(next.heat));
  if (next.show !== "all") query.set("show", next.show);

  const qs = query.toString();
  return qs ? `${params.basePath}?${qs}` : params.basePath;
}

export const riderHref = (params: MatchParams, riderId: string) =>
  buildMatchHref(params, { panel: "rider", rider: riderId });

export const heatHref = (params: MatchParams, heat: number) =>
  buildMatchHref(params, { panel: "heat", heat });
