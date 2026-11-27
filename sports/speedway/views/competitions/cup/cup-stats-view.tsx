import { getCupStatsView } from "@/sports/speedway/api/cup";
import { RidersTable } from "../shared/stats/riders-table";
import { StatsToolbar } from "../shared/stats/stats-toolbar";
import { buildCupHref, type CupParams } from "./search-params";

/** Cup Stats: the league's toolbar and riders table, fed with riders of the cup clubs (cup matches only). */
export async function CupStatsView({ params }: { params: CupParams }) {
  const riders = await getCupStatsView();

  return (
    <div className="mt-1 flex min-h-0 min-w-0 flex-1 flex-col">
      <StatsToolbar
        venue={params.venue}
        metrics={params.metrics}
        view={params.view}
        hrefFor={(patch) => buildCupHref(params, patch)}
      />
      <RidersTable
        riders={riders}
        metrics={params.metrics}
        venue={params.venue}
        view={params.view}
        // The cup aside shows the club panel, so a click opens the rider's club.
        hrefFor={(rider) => buildCupHref(params, { team: rider.teamId, panel: "riders" })}
      />
    </div>
  );
}