import { ViewModeToggle } from "@/components/toggle/view-mode-toggle";
import { VenueToggle } from "@/components/toggle/venue-toggle";
import { buildLeagueHref, type LeagueParams } from "@/sports/speedway/views/competitions/league/search-params";

/** All / Home / Away on the left, Detailed / Compact on the right. */
export function StandingsToolbar({ params }: { params: LeagueParams }) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-2 py-1.5">
      <VenueToggle value={params.venue} hrefFor={(venue) => buildLeagueHref(params, { venue })} />
      {/* In the AI Studio original this only changes the Stats tab; the Table ignores it. */}
      <ViewModeToggle value={params.view} hrefFor={(view) => buildLeagueHref(params, { view })} />
    </div>
  );
}
