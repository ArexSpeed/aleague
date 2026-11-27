import { getLeagueRiders } from "@/sports/speedway/api/league";
import { RidersTable } from "@/sports/speedway/views/competitions/shared/stats/riders-table";
import { StatsToolbar } from "@/sports/speedway/views/competitions/shared/stats/stats-toolbar";
import { buildLeagueHref, type LeagueParams } from "../../search-params";

/** Stats tab: toolbar, then the riders table (Stats or Skills columns) of the selected leagues. */
export async function StatsTab({ params }: { params: LeagueParams }) {
  const riders = await getLeagueRiders(params.group);

  return (
    <div className="mt-1 flex min-h-0 min-w-0 flex-1 flex-col">
      <StatsToolbar
        venue={params.venue}
        metrics={params.metrics}
        view={params.view}
        hrefFor={(patch) => buildLeagueHref(params, patch)}
      />
      <RidersTable
        riders={riders}
        metrics={params.metrics}
        venue={params.venue}
        view={params.view}
        // A click opens the rider's team in the aside, straight on the Riders tab.
        hrefFor={(rider) => buildLeagueHref(params, { team: rider.teamId, panel: "riders" })}
      />
    </div>
  );
}