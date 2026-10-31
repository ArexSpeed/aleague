"use client";

import { SkillBadge } from "@/components/data/skill-badge";
import type { Column } from "@/components/table/columns";
import { PersonName, PositionBadge } from "@/components/table/row-lead";
import { TableHeader } from "@/components/table/table-header";
import { TableRow } from "@/components/table/table-row";
import type { MatchRider, MatchTeam, Side } from "@/sports/speedway/types/match";
import { SideHeader } from "../tabs/squads/side-header";
import { useLineup, useResolvedSquad } from "./lineup-provider";

const HIGH_SKILL = 92;

const skill = (id: string, header: string, title: string, get: (r: MatchRider) => number): Column<MatchRider> => ({
  id,
  header,
  title,
  width: "w-7 text-center sm:w-9",
  cell: (r) => <SkillBadge value={get(r)} highlight={get(r) >= HIGH_SKILL} />,
});

const COLUMNS: Column<MatchRider>[] = [
  skill("s", "S", "Start", (r) => r.skills.start),
  skill("t", "T", "Technique", (r) => r.skills.technique),
  skill("f", "F", "Form", (r) => r.skills.form),
  skill("r", "R", "Judgement", (r) => r.skills.judgement),
  skill("c", "C", "Character", (r) => r.skills.character),
  {
    id: "avg",
    header: "AVG",
    title: "Average per heat",
    width: "w-10 text-center sm:w-12",
    emphasis: true,
    cell: (r) => r.avgHeat.toFixed(2),
  },
];

/** Squad of a match that has not been played: skills table, tap a row to change the rider. */
export function LineupEditor({
  side,
  team,
  squad,
}: {
  side: Side;
  team: MatchTeam;
  squad: MatchRider[];
}) {
  const { matchId, openSlot } = useLineup();
  const riders = useResolvedSquad(matchId, side, squad);

  return (
    <section className="rounded-2xl border border-line p-2">
      <SideHeader team={team} side={side} badge={<span className="text-[11px] font-bold text-brand">Tap to change</span>} />
      <TableHeader
        columns={COLUMNS}
        lead={
          <>
            <span className="w-6 text-center font-bold sm:w-7">#</span>
            <span>Rider</span>
          </>
        }
      />
      <ol className="px-1 pb-1">
        {riders.map((rider) => (
          <TableRow
            key={rider.number}
            item={rider}
            columns={COLUMNS}
            lead={
              <>
                <PositionBadge value={rider.number} className="bg-fg/5 font-black text-fg-muted" />
                <PersonName first={rider.firstName} last={rider.lastName} />
              </>
            }
            onClick={() =>
              openSlot({ type: "squad", side, number: rider.number, currentId: rider.id })
            }
          />
        ))}
      </ol>
    </section>
  );
}

