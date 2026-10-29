import { House, Plane } from "lucide-react";

import type { LeagueTeam } from "@/sports/speedway/types/league";
import { formatBilans } from "@/sports/speedway/views/competitions/league/standings";
import { PointsChart } from "./points-chart";
import { StatCard } from "@/components/data/stat-card";
import { VenueAccordion } from "./venue-accordion";

/** Panel tab "Stats": summary cards, Home / Away breakdown, points chart. */
export function TeamStats({ team }: { team: LeagueTeam }) {
  return (
    <>
      <section className="mb-3.5 shrink-0">
        <h3 className="mb-2 block text-xs font-bold tracking-wide text-fg uppercase">Stats</h3>

        <div className="mb-1.5 grid grid-cols-5 gap-1.5">
          <StatCard label="Pos" value={team.pos} />
          <StatCard label="Games" value={team.games} />
          <StatCard label="Points+" value={team.pointsPlus} compact />
          <StatCard label="Points-" value={team.pointsMinus} compact />
          <StatCard label="Bilans" value={formatBilans(team.bilans)} compact />
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          <StatCard label="Won" value={team.won} tone="positive" />
          <StatCard label="Draw" value={team.draw} />
          <StatCard label="Lose" value={team.lose} tone="negative" />
          <StatCard label="Bonus" value={team.bonus} />
          <StatCard label="Points" value={team.points} tone="brand" />
        </div>
      </section>

      <VenueAccordion title="Home" icon={House} stats={team.home} />
      <VenueAccordion title="Away" icon={Plane} stats={team.away} />

      <PointsChart matches={team.matches} />
    </>
  );
}
