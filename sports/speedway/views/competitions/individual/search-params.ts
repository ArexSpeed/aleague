import { competitionsHref } from "@/lib/paths";
import {
  defineFilters,
  filterEntries,
  firstParam,
  parseFilters,
  pickOne,
  type FilterValues,
} from "@/lib/url-state";
import { COUNTRY_OPTIONS, getCompetitionKind } from "@/sports/speedway/competitions-config";
import { INDIVIDUAL_DIVISIONS, type IndividualDivision } from "@/sports/speedway/types/individual";
import type { RawSearchParams } from "@/sports/types";

/** Same description style as the league and the cup: values, default and the tabs a filter belongs to. */
export const INDIVIDUAL_FILTERS = defineFilters({
  schedule: { values: ["all", "upcoming", "recent"], default: "all", tabs: ["fixtures"] },
  view: {
    values: ["detailed", "compact"],
    default: "detailed",
    tabs: ["table", "fixtures", "stats"],
  },
  metrics: { values: ["stats", "skills"], default: "stats", tabs: ["stats"] },
});

export const RIDER_PANEL_TABS = ["stats", "tournaments", "details"] as const;
export type RiderPanelTab = (typeof RIDER_PANEL_TABS)[number];

const COMPETITIONS = ["country", "helmet", "gp"] as const;
const COUNTRIES = COUNTRY_OPTIONS.map((option) => option.id);

export type IndividualParams = FilterValues<typeof INDIVIDUAL_FILTERS> & {
  competition: (typeof COMPETITIONS)[number];
  tab: string;
  country: (typeof COUNTRIES)[number];
  division: IndividualDivision;
  /** Rider shown in the aside. */
  rider?: string | undefined;
  panel: RiderPanelTab;
};

export function parseIndividualParams(raw: RawSearchParams): IndividualParams {
  const kind = getCompetitionKind("individual");
  const tab = firstParam(raw.tab);

  return {
    ...parseFilters(INDIVIDUAL_FILTERS, raw),
    competition: pickOne(COMPETITIONS, firstParam(raw.competition), "country"),
    tab: kind.tabs.some((item) => item.id === tab) ? tab! : kind.defaultParams.tab!,
    country: pickOne(COUNTRIES, firstParam(raw.country), "ark"),
    division: pickOne(INDIVIDUAL_DIVISIONS, firstParam(raw.division), "open"),
    rider: firstParam(raw.rider),
    panel: pickOne(RIDER_PANEL_TABS, firstParam(raw.panel), "stats"),
  };
}

/** Link to the individual page with `patch` applied; default filter values are left out of the URL. */
export function buildIndividualHref(
  params: IndividualParams,
  patch: Partial<IndividualParams> = {},
): string {
  const next = { ...params, ...patch };
  const filters = new Map(filterEntries(INDIVIDUAL_FILTERS, next, next.tab));
  return competitionsHref({
    sport: "speedway",
    kind: "individual",
    competition: next.competition,
    country: next.country,
    division: next.division,
    tab: next.tab,
    rider: next.rider,
    panel: next.panel !== "stats" ? next.panel : undefined,
    view: filters.get("view"),
    schedule: filters.get("schedule"),
    metrics: filters.get("metrics"),
  });
}
