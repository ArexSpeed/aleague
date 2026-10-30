import { getLeagueRiders } from "@/sports/speedway/api/league";
import type { LeagueParams } from "../../search-params";
import { RidersTable } from "./riders-table";
import { StatsToolbar } from "./stats-toolbar";

/** Stats tab: toolbar, then the riders table (Stats or Skills columns). */
export async function StatsTab({ params }: { params: LeagueParams }) {
  const riders = await getLeagueRiders();

  return (
    <div className="mt-1 flex min-h-0 min-w-0 flex-1 flex-col">
      <StatsToolbar params={params} />
      <RidersTable riders={riders} params={params} />
    </div>
  );
}