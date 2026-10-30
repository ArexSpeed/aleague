import { TeamLogo } from "@/components/data/team-logo";
import { DataTable } from "@/components/table/data-table";
import {
  PersonName,
  PositionBadge,
  RowName,
  podiumBadgeClass,
} from "@/components/table/row-lead";
import { speedwayConfig } from "@/sports/speedway/config";
import type { LeagueRiderWithSkills } from "@/sports/speedway/types/league";
import { buildLeagueHref, type LeagueParams } from "../../search-params";
import { getRiderStats } from "../../standings";
import { RiderDetail } from "./rider-detail";
import {
  getRiderDetailedColumns,
  getRiderSkillsColumns,
  getRiderStatsColumns,
  getSkillAverage,
} from "./riders-columns";

/**
 * Riders ranked by points (Stats) or by average skill (Skills).
 * Compact = one line with columns. Detailed (Stats only for now) = AH on the first line,
 * tiles below. Skills has no detailed view yet and stays compact.
 */
export function RidersTable({ riders, params }: { riders: LeagueRiderWithSkills[]; params: LeagueParams }) {
  const skills = params.metrics === "skills";
  const detailed = !skills && params.view === "detailed";

  const sorted = [...riders].sort((a, b) =>
    skills
      ? getSkillAverage(b.skills) - getSkillAverage(a.skills)
      : getRiderStats(b, params.venue).points - getRiderStats(a, params.venue).points,
  );

  const columns = skills
    ? getRiderSkillsColumns()
    : detailed
      ? getRiderDetailedColumns(params.venue)
      : getRiderStatsColumns(params.venue);

  return (
    <DataTable
      items={sorted}
      columns={columns}
      getKey={(rider) => rider.id}
      density={detailed ? "detailed" : "compact"}
      showHeader={!detailed}
      // A click opens the rider's team in the aside, straight on the Riders tab.
      getHref={(rider) => buildLeagueHref(params, { team: rider.teamId, panel: "riders" })}
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
              secondary={`${rider.teamName} ${rider.teamSubName}`}
            />
          ) : (
            <PersonName first={rider.firstName} last={rider.lastName} />
          )}
        </>
      )}
      renderDetail={detailed ? (rider) => <RiderDetail rider={rider} venue={params.venue} /> : undefined}
    />
  );
}