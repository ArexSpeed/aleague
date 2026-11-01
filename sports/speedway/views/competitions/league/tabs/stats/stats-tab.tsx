import { getLeagueRiders } from "@/sports/speedway/api/league";
import type { LeagueParams } from "../../search-params";
import { RidersTable } from "./riders-table";
import { StatsToolbar } from "./stats-toolbar";

/** Stats tab: toolbar, then the riders table (Stats or Skills columns). */
export async function StatsTab({ params }: { params: LeagueParams }) {
  const riders = await getLeagueRiders(params.group);

  return (
    <div className="mt-1 min-w-0">
      <StatsToolbar params={params} />
      <RidersTable riders={riders} params={params} />
    </div>
  );
}