import { VenueToggle } from "@/components/toggle/venue-toggle";
import { ViewModeToggle } from "@/components/toggle/view-mode-toggle";
import { buildLeagueHref, type LeagueParams } from "../../search-params";

/** All / Home / Away on the left, Detailed / Compact on the right. */
export function StandingsToolbar({ params }: { params: LeagueParams }) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-2 py-1.5">
      <VenueToggle value={params.venue} hrefFor={(venue) => buildLeagueHref(params, { venue })} />
      <ViewModeToggle value={params.view} hrefFor={(view) => buildLeagueHref(params, { view })} />
    </div>
  );
}