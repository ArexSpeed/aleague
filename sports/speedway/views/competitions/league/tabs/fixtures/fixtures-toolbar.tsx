import { FixturesToggle } from "@/components/toggle/fixtures-toggle";
import { ViewModeToggle } from "@/components/toggle/view-mode-toggle";
import { buildLeagueHref, type LeagueParams } from "../../search-params";

/** All / Upcoming / Recent on the left, Detailed / Compact on the right. */
export function FixturesToolbar({ params }: { params: LeagueParams }) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-2 py-1.5">
      <FixturesToggle
        value={params.schedule}
        hrefFor={(schedule) => buildLeagueHref(params, { schedule })}
      />
      <ViewModeToggle value={params.view} hrefFor={(view) => buildLeagueHref(params, { view })} />
    </div>
  );
}