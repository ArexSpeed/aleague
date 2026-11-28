import type { ReactNode } from "react";

import { TabNav } from "@/components/tabs/tab-nav";
import type {
  IndividualRiderView,
  IndividualTableRow,
  IndividualTableView,
} from "@/sports/speedway/api/individual";
import {
  buildIndividualHref,
  RIDER_PANEL_TABS,
  type IndividualParams,
  type RiderPanelTab,
} from "./search-params";

export type IndividualAside = { detail: ReactNode | null; open: boolean; closeHref: string };

const PANEL_LABELS: Record<RiderPanelTab, string> = {
  stats: "Stats",
  tournaments: "Tournaments",
  details: "Details",
};

const SKILLS = [
  ["strength", "Strength"],
  ["technique", "Technique"],
  ["fighting", "Fighting"],
  ["reflex", "Reflex"],
  ["condition", "Condition"],
] as const;

function Line({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <dt className="font-semibold text-fg-muted">{label}</dt>
      <dd className="font-bold">{value}</dd>
    </div>
  );
}

function RiderPanel({
  rider,
  row,
  started,
  panel,
  hrefFor,
}: {
  rider: IndividualRiderView;
  row: IndividualTableRow;
  started: boolean;
  panel: RiderPanelTab;
  hrefFor: (panel: RiderPanelTab) => string;
}) {
  return (
    <div className="flex flex-col select-none">
      <header className="flex shrink-0 flex-col pr-9 pb-3">
        <h2 className="truncate text-base font-black tracking-wide text-fg uppercase sm:text-lg">{rider.name}</h2>
        <span className="text-[10px] font-bold text-fg-faint uppercase">{rider.age} y/o</span>
      </header>

      <TabNav
        variant="aside"
        label="Rider details"
        active={panel}
        tabs={RIDER_PANEL_TABS.map((id) => ({ id, label: PANEL_LABELS[id], href: hrefFor(id) }))}
      />

      <dl className="space-y-1.5 pt-3">
        {panel === "stats" ? (
          <>
            <Line label="Place in the cycle" value={started ? row.rank : "–"} />
            <Line label="Cycle points" value={row.total} />
            <Line label="Tournaments won" value={row.wins} />
          </>
        ) : null}
        {panel === "tournaments"
          ? row.perTournament.map((points, i) => (
              <Line key={i} label={`Tournament ${i + 1}`} value={points ?? "–"} />
            ))
          : null}
        {panel === "details"
          ? SKILLS.map(([key, label]) => <Line key={key} label={label} value={rider.skills[key]} />)
          : null}
      </dl>
    </div>
  );
}

/** On lg+ always a rider (the selected one, else the first); the mobile drawer opens only for ?rider=. */
export function getIndividualAside(params: IndividualParams, table: IndividualTableView): IndividualAside {
  const { riders } = table.cycle;
  const index = Math.max(0, riders.findIndex((rider) => rider.id === params.rider));
  const rider = riders[index];
  const row = rider ? table.rows.find((item) => item.riderId === rider.id) : undefined;

  return {
    detail:
      rider && row ? (
        <RiderPanel
          rider={rider}
          row={row}
          started={table.played.length > 0}
          panel={params.panel}
          hrefFor={(panel) => buildIndividualHref(params, { rider: rider.id, panel })}
        />
      ) : null,
    open: Boolean(params.rider) && riders.some((item) => item.id === params.rider),
    closeHref: buildIndividualHref(params, { rider: undefined, panel: "stats" }),
  };
}