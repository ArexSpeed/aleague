import { competitionsHref } from "@/lib/paths";
import {
  defineFilters,
  filterEntries,
  firstParam,
  parseFilters,
  pickOne,
  type FilterValues,
} from "@/lib/url-state";
import {
  CLUB_STATS_SOURCES,
  getCompetitionKind,
  type ClubStatsSource,
} from "@/sports/speedway/competitions-config";
import { PANEL_TABS, type PanelTab } from "@/sports/speedway/views/competitions/shared/aside/panel-tabs";
import type { RawSearchParams } from "@/sports/types";

/** Same description style as the league: values, default and the tabs a filter belongs to. */
export const CUP_FILTERS = defineFilters({
  schedule: { values: ["all", "upcoming", "recent"], default: "all", tabs: ["fixtures"] },
  view: { values: ["detailed", "compact"], default: "detailed", tabs: ["table", "fixtures", "stats"] },
  venue: { values: ["all", "home", "away"], default: "all", tabs: ["stats"] },
  metrics: { values: ["stats", "skills"], default: "stats", tabs: ["stats"] },
});

export type CupParams = FilterValues<typeof CUP_FILTERS> & {
  competition: "cup" | "supercup";
  tab: string;
  team?: string | undefined;
  /** Tab of the club aside, like in the league. */
  panel: PanelTab;
  source: ClubStatsSource;
};

export function parseCupParams(raw: RawSearchParams): CupParams {
  const kind = getCompetitionKind("cup");
  const tab = firstParam(raw.tab);

  return {
    ...parseFilters(CUP_FILTERS, raw),
    competition: firstParam(raw.competition) === "supercup" ? "supercup" : "cup",
    tab: kind.tabs.some((item) => item.id === tab) ? tab! : kind.defaultParams.tab!,
    team: firstParam(raw.team),
    panel: pickOne(PANEL_TABS, firstParam(raw.panel), "stats"),
    source: pickOne(CLUB_STATS_SOURCES, firstParam(raw.source), "cup"),
  };
}

/** Link to the cup page with `patch` applied; default filter values are left out of the URL. */
export function buildCupHref(params: CupParams, patch: Partial<CupParams> = {}): string {
  const next = { ...params, ...patch };
  const filters = new Map(filterEntries(CUP_FILTERS, next, next.tab));
  return competitionsHref({
    sport: "speedway",
    kind: "cup",
    competition: next.competition,
    tab: next.tab,
    team: next.team,
    panel: next.panel !== "stats" ? next.panel : undefined,
    source: next.source !== "cup" ? next.source : undefined,
    view: filters.get("view"),
    schedule: filters.get("schedule"),
    venue: filters.get("venue"),
    metrics: filters.get("metrics"),
  });
}