import { MetricsToggle } from "@/components/toggle/metrics-toggle";
import { VenueToggle } from "@/components/toggle/venue-toggle";
import { ViewModeToggle } from "@/components/toggle/view-mode-toggle";
import { buildLeagueHref, type LeagueParams } from "../../search-params";

/** All / Home / Away + Stats / Skills on the left, Detailed / Compact on the right. */
export function StatsToolbar({ params }: { params: LeagueParams }) {
  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 py-1.5">
      <div className="flex flex-wrap items-center gap-2">
        <VenueToggle value={params.venue} hrefFor={(venue) => buildLeagueHref(params, { venue })} />
        <MetricsToggle
          value={params.metrics}
          hrefFor={(metrics) => buildLeagueHref(params, { metrics })}
        />
      </div>
      <ViewModeToggle value={params.view} hrefFor={(view) => buildLeagueHref(params, { view })} />
    </div>
  );
}