import { Suspense, type ReactNode } from "react";

import type { CompetitionViewProps } from "@/sports/types";
import { CompetitionSkeleton } from "../competition-skeleton";
import { parseIndividualParams } from "./search-params";

/**
 * Speedway > Competitions > Individual. Country is the only competition defined so far.
 * Table, Fixtures, Stats and the rider aside come in the next steps; until then every tab shows
 * the skeleton's "No data yet".
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

  const page = (content?: ReactNode) => (
    <CompetitionSkeleton sport={sport} kind="individual" searchParams={Promise.resolve(raw)}>
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

  return page();
}