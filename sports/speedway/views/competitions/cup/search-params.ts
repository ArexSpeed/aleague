import { competitionsHref } from "@/lib/paths";
import {
  defineFilters,
  filterEntries,
  firstParam,
  parseFilters,
  type FilterValues,
} from "@/lib/url-state";
import { getCompetitionKind } from "@/sports/speedway/competitions-config";
import type { RawSearchParams } from "@/sports/types";

/** Same description style as the league: values, default and the tabs a filter belongs to. */
export const CUP_FILTERS = defineFilters({
  schedule: { values: ["all", "upcoming", "recent"], default: "all", tabs: ["fixtures"] },
  view: { values: ["detailed", "compact"], default: "detailed", tabs: ["table", "fixtures"] },
});

export type CupParams = FilterValues<typeof CUP_FILTERS> & {
  competition: "cup" | "supercup";
  tab: string;
  team?: string | undefined;
};

export function parseCupParams(raw: RawSearchParams): CupParams {
  const kind = getCompetitionKind("cup");
  const tab = firstParam(raw.tab);

  return {
    ...parseFilters(CUP_FILTERS, raw),
    competition: firstParam(raw.competition) === "supercup" ? "supercup" : "cup",
    tab: kind.tabs.some((item) => item.id === tab) ? tab! : kind.defaultParams.tab!,
    team: firstParam(raw.team),
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
    view: filters.get("view"),
    schedule: filters.get("schedule"),
  });
}