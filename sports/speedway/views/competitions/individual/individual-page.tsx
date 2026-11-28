import { Suspense, type ReactNode } from "react";

import { INDIVIDUAL_DEFINITION } from "@/sports/speedway/data/season";
import type { CompetitionViewProps } from "@/sports/types";
import { CompetitionSkeleton } from "../competition-skeleton";
import {
  getIndividualFixtures,
  getIndividualPool,
  getIndividualTable,
} from "@/sports/speedway/api/individual";
import { getIndividualAside } from "./individual-aside";
import { IndividualFixturesView } from "./individual-fixtures-view";
import { IndividualSquadEditor } from "./individual-squad-editor";
import { IndividualTableView } from "./individual-table-view";
import { IndividualToolbar } from "./individual-toolbar";
import { parseIndividualParams } from "./search-params";

/**
 * Speedway > Competitions > Individual. Country is the only competition defined so far.
 * Table and Fixtures with the rider aside; Stats and History show "No data yet" until the simulation.
 */
export function IndividualPage(props: CompetitionViewProps) {
  return (
    <Suspense fallback={<div className="p-4 text-sm font-semibold opacity-60">Loading…</div>}>
      <IndividualContent {...props} />
    </Suspense>
  );
}

async function IndividualContent({ searchParams, sport }: CompetitionViewProps) {
  const raw = await searchParams;
  const params = parseIndividualParams(raw);

  const country = params.competition === "country";
  const showAside = country && (params.tab === "table" || params.tab === "fixtures");
  const table = country ? await getIndividualTable(params.country, params.division) : undefined;
  const aside = showAside && table ? getIndividualAside(params, table) : undefined;

  const page = (content?: ReactNode) => (
    <CompetitionSkeleton sport={sport} kind="individual" searchParams={Promise.resolve(raw)} aside={aside}>
      {content}
    </CompetitionSkeleton>
  );

  if (params.competition !== "country") {
    return page(
      <div className="flex flex-1 items-center justify-center text-sm font-semibold text-fg-faint">
        Not defined yet
      </div>,
    );
  }

  if (params.tab === "table") {
    const view = table!;
    const pool = view.cycle.locked ? [] : await getIndividualPool(params.country, params.division);
    return page(
      <div className="mt-1 min-w-0">
        <IndividualToolbar params={params} withSchedule={false} />
        {view.cycle.locked ? null : (
          <IndividualSquadEditor
            // A new key after a save or a switch of nation / division resets the checkboxes.
            key={`${params.country}-${params.division}-${view.cycle.riders.map((rider) => rider.id).join(",")}`}
            country={params.country}
            division={params.division}
            pool={pool}
            selected={view.cycle.riders.map((rider) => rider.id)}
            count={INDIVIDUAL_DEFINITION.ridersPerTournament}
            manual={view.cycle.manual}
          />
        )}
        <IndividualTableView view={view} params={params} />
      </div>,
    );
  }

  if (params.tab === "fixtures") {
    return page(
      <div className="mt-1 min-w-0">
        <IndividualToolbar params={params} withSchedule />
        <IndividualFixturesView tournaments={await getIndividualFixtures(params.country, params.division)} params={params} />
      </div>,
    );
  }

  // Stats and History: the skeleton's "No data yet".
  return page();
}