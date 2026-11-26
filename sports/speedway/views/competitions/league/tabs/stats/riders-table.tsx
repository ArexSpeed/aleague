import { TeamLogo } from "@/components/data/team-logo";
import { DataTable } from "@/components/table/data-table";
import {
  PersonName,
  PositionBadge,
  RowName,
  podiumBadgeClass,
} from "@/components/table/row-lead";
import type { Metrics } from "@/components/toggle/metrics-toggle";
import type { Venue } from "@/components/toggle/venue-toggle";
import type { ViewMode } from "@/components/toggle/view-mode-toggle";
import { speedwayConfig } from "@/sports/speedway/config";
import type { LeagueRiderWithSkills } from "@/sports/speedway/types/league";
import { getRiderStats } from "../../standings";
import { RiderDetail } from "./rider-detail";
import {
  getRiderDetailedColumns,
  getRiderSkillsColumns,
  getRiderStatsColumns,
  getSkillAverage,
} from "./riders-columns";

type RidersTableProps = {
  riders: LeagueRiderWithSkills[];
  metrics: Metrics;
  venue: Venue;
  view: ViewMode;
  /** Where a click on a row goes (league: the rider's team in the aside). */
  hrefFor: (rider: LeagueRiderWithSkills) => string;
};

/**
 * Riders ranked by points (Stats) or by average skill (Skills).
 * Compact = one line with columns. Detailed (Stats only for now) = AH on the first line,
 * tiles below. Skills has no detailed view yet and stays compact.
 */
export function RidersTable({ riders, metrics, venue, view, hrefFor }: RidersTableProps) {
  const skills = metrics === "skills";
  const detailed = !skills && view === "detailed";

  const sorted = [...riders].sort((a, b) =>
    skills
      ? getSkillAverage(b.skills) - getSkillAverage(a.skills)
      : getRiderStats(b, venue).points - getRiderStats(a, venue).points,
  );

  const columns = skills
    ? getRiderSkillsColumns()
    : detailed
      ? getRiderDetailedColumns(venue)
      : getRiderStatsColumns(venue);

  return (
    <DataTable
      items={sorted}
      columns={columns}
      getKey={(rider) => rider.id}
      density={detailed ? "detailed" : "compact"}
      showHeader={!detailed}
      getHref={hrefFor}
      headerLead={
        <>
          <span className="w-6 text-center font-bold sm:w-7">#</span>
          <span>{speedwayConfig.labels.participant}</span>
        </>
      }
      renderLead={(rider, index) => (
        <>
          <PositionBadge value={index + 1} className={podiumBadgeClass(index + 1)} />
          <TeamLogo
            color={rider.teamColor}
            icon={rider.teamIcon}
            className="size-6 text-xs sm:size-7 sm:text-sm"
          />
          {detailed ? (
            <RowName
              primary={`${rider.firstName} ${rider.lastName}`}
              secondary={rider.teamName}
            />
          ) : (
            <PersonName first={rider.firstName} last={rider.lastName} />
          )}
        </>
      )}
      renderDetail={detailed ? (rider) => <RiderDetail rider={rider} venue={venue} /> : undefined}
    />
  );
}