import { cn } from "@/lib/utils";
import { SegmentedControl } from "../components/segmented-control";
import {
  buildLeagueHref,
  ROUND_TYPES,
  SUB_FILTERS,
  type LeagueParams,
} from "./search-params";

/** Shared by every tab: Round (League / Regio / Nation) and its sub-filter pills. */
export function LeagueFilters({ params }: { params: LeagueParams }) {
  return (
    <div className="mt-1 mb-0.5 flex shrink-0 flex-col gap-1">
      <div className="py-0.5">
        <SegmentedControl
          label="Type of competition"
          variant="brand"
          options={ROUND_TYPES.map((round) => ({
            key: round,
            label: round,
            active: params.round === round,
            href: buildLeagueHref(params, { round, group: "all" }),
          }))}
        />
      </div>

      <div className="min-w-0 py-0.5">
        <SegmentedControl
          label="Grupa"
          variant="brand"
          options={SUB_FILTERS[params.round].map((filter) => ({
            key: filter.id,
            active: params.group === filter.id,
            href: buildLeagueHref(params, { group: filter.id }),
            label: (
              <>
                {filter.dot ? (
                  <span className={cn("size-2.5 rounded-full border border-black/10", filter.dot)} />
                ) : null}
                <span>{filter.label}</span>
              </>
            ),
          }))}
        />
      </div>
    </div>
  );
}
