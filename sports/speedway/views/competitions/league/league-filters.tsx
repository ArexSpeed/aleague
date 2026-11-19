import { cn } from "@/lib/utils";
import { SegmentedControl } from "@/components/toggle/segmented-control";
import {
  buildLeagueHref,
  SUB_FILTERS,
  type LeagueParams,
} from "@/sports/speedway/views/competitions/league/search-params";
import { competitionsHref } from "@/lib/paths";
import { COMPETITION_KINDS as COMPETITION_KIND_CONFIG } from "@/sports/speedway/competitions-config";

/** Shared by every league/regio/nation tab: kind and kind-dependent group. */
export function LeagueFilters({ params }: { params: LeagueParams }) {
  return (
    <div className="mt-1 mb-0.5 flex shrink-0 flex-col gap-1">
      <div className="py-0.5">
        <SegmentedControl
          label="Competition kind"
          variant="brand"
          options={COMPETITION_KIND_CONFIG.map((kind) => ({
            key: kind.id,
            label: kind.label,
            active: params.kind === kind.id,
            href: kind.leagueKind
              ? buildLeagueHref(params, { kind: kind.id, group: "all" })
              : competitionsHref({ sport: params.sport, kind: kind.id }),
          }))}
        />
      </div>

      <div className="min-w-0 py-0.5">
        <SegmentedControl
          label="Group"
          variant="brand"
          options={SUB_FILTERS[params.kind].map((filter) => ({
            key: filter.id,
            active: params.group === filter.id,
            href: buildLeagueHref(params, { group: filter.id }),
            label: (
              <>
                {filter.dot ? (
                  <span className={cn("size-2.5 rounded-full border border-line", filter.dot)} />
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
