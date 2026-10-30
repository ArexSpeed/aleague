import { SkillBadge } from "@/components/data/skill-badge";
import type { Column } from "@/components/table/columns";
import type { LeagueRiderWithSkills, RiderSkills } from "@/sports/speedway/types/league";
import type { Venue } from "../../search-params";
import { getRiderStats } from "../../standings";

/** Skill value from which a rating is highlighted. */
const HIGH_SKILL = 92;

export function getSkillAverage(skills: RiderSkills): number {
  const { strength, technique, fighting, reflex, condition } = skills;
  return (strength + technique + fighting + reflex + condition) / 5;
}

/** M, H, AM, AH, B, PTS (for the selected venue). */
export function getRiderStatsColumns(venue: Venue): Column<LeagueRiderWithSkills>[] {
  const stats = (r: LeagueRiderWithSkills) => getRiderStats(r, venue);

  return [
    { id: "matches", header: "M", title: "Matches", cell: (r) => stats(r).matches },
    { id: "heats", header: "H", title: "Heats", cell: (r) => stats(r).heats },
    {
      id: "avgMatch",
      header: "AM",
      title: "Average per match",
      width: "w-10 text-center sm:w-12",
      cell: (r) => stats(r).avgMatch.toFixed(2),
    },
    {
      id: "avgHeat",
      header: "AH",
      title: "Average per heat",
      width: "w-11 text-center sm:w-14",
      className: "font-bold text-brand",
      headerClassName: "text-brand",
      cell: (r) => stats(r).avgHeat.toFixed(3),
    },
    { id: "bonus", header: "B", title: "Bonus", cell: (r) => stats(r).bonus },
    {
      id: "points",
      header: "PTS",
      title: "Points",
      width: "w-7 text-center sm:w-9",
      emphasis: true,
      cell: (r) => stats(r).points,
    },
  ];
}

const SKILLS = [
  { key: "strength", header: "S", title: "Strength" },
  { key: "technique", header: "T", title: "Technique" },
  { key: "fighting", header: "F", title: "Fighting" },
  { key: "reflex", header: "R", title: "Reflex" },
  { key: "condition", header: "C", title: "Condition" },
] as const;

/** S, T, F, R, C, AVG. */
export function getRiderSkillsColumns(): Column<LeagueRiderWithSkills>[] {
  return [
    ...SKILLS.map(
      (skill): Column<LeagueRiderWithSkills> => ({
        id: skill.key,
        header: skill.header,
        title: skill.title,
        width: "w-7 text-center sm:w-10",
        cell: (r) => <SkillBadge value={r.skills[skill.key]} highlight={r.skills[skill.key] >= HIGH_SKILL} />,
      }),
    ),
    {
      id: "avg",
      header: "AVG",
      title: "Average skill",
      width: "w-11 text-center sm:w-14",
      emphasis: true,
      headerClassName: "text-brand",
      cell: (r) => getSkillAverage(r.skills).toFixed(1),
    },
  ];
}

/** Detailed view: only the AH badge on the first line, everything else is in RiderDetail. */
export function getRiderDetailedColumns(venue: Venue): Column<LeagueRiderWithSkills>[] {
  return [
    {
      id: "avgHeat",
      header: "AH",
      title: "Average per heat",
      width: "w-20 text-center sm:w-24",
      emphasis: true,
      cell: (r) => (
        <>
          <span className="mr-1 text-[10px] font-bold opacity-80">AH</span>
          {getRiderStats(r, venue).avgHeat.toFixed(3)}
        </>
      ),
    },
  ];
}