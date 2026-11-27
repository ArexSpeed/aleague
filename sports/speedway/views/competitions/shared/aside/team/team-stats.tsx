import { House, Plane } from "lucide-react";

import { StatCard } from "@/components/data/stat-card";
import { cn } from "@/lib/utils";
import type { TeamStats as TeamStatsData } from "@/sports/speedway/sim/stats";
import { formatBilans } from "@/sports/speedway/views/competitions/shared/stats/format";
import { PointsChart } from "./points-chart";
import { VenueAccordion } from "./venue-accordion";

type TeamStatsProps = {
  /** Place in the competition the stats come from: "3", or a range like "9–16" in the cup. */
  place: string;
  stats: TeamStatsData;
  /** League points and bonus only mean something in the league; the cup leaves them out. */
  showLeaguePoints: boolean;
};

/** Panel tab "Stats": summary cards, Home / Away breakdown, points chart. */
export function TeamStats({ place, stats, showLeaguePoints }: TeamStatsProps) {
  return (
    <>
      <section className="mb-3.5 shrink-0">
        <h3 className="mb-2 block text-xs font-bold tracking-wide text-fg uppercase">Stats</h3>

        <div className="mb-1.5 grid grid-cols-5 gap-1.5">
          <StatCard label="Pos" value={place} compact={place.length > 3} />
          <StatCard label="Games" value={stats.games} />
          <StatCard label="Points+" value={stats.pointsPlus} compact />
          <StatCard label="Points-" value={stats.pointsMinus} compact />
          <StatCard label="Bilans" value={formatBilans(stats.bilans)} compact />
        </div>

        <div className={cn("grid gap-1.5", showLeaguePoints ? "grid-cols-5" : "grid-cols-3")}>
          <StatCard label="Won" value={stats.won} tone="positive" />
          <StatCard label="Draw" value={stats.draw} />
          <StatCard label="Lose" value={stats.lose} tone="negative" />
          {showLeaguePoints ? (
            <>
              <StatCard label="Bonus" value={stats.bonus} />
              <StatCard label="Points" value={stats.points} tone="brand" />
            </>
          ) : null}
        </div>
      </section>

      <VenueAccordion title="Home" icon={House} stats={stats.home} />
      <VenueAccordion title="Away" icon={Plane} stats={stats.away} />

      <PointsChart matches={stats.matches} />
    </>
  );
}