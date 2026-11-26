import { Suspense, type ReactNode } from "react";

import { getCupRoundView, getCupTableView } from "@/sports/speedway/api/cup";
import type { CompetitionViewProps } from "@/sports/types";
import { CompetitionSkeleton } from "../competition-skeleton";
import { CupFixturesView } from "./cup-fixtures-view";
import { CupTableView } from "./cup-table-view";
import { parseCupParams } from "./search-params";
import { CupSimBar } from "./cup-sim-bar";

export function CupPage(props: CompetitionViewProps) {
  return (
    <Suspense fallback={<div className="p-4 text-sm font-semibold opacity-60">Ładowanie…</div>}>
      <CupContent {...props} />
    </Suspense>
  );
}

async function CupContent({ basePath, searchParams, sport }: CompetitionViewProps) {
  const raw = await searchParams;
  const params = parseCupParams(raw);

  const page = (content?: ReactNode) => (
    <CompetitionSkeleton sport={sport} kind="cup" searchParams={Promise.resolve(raw)}>
      {content}
    </CompetitionSkeleton>
  );

  if (params.competition === "supercup") {
    return page(
      <div className="flex flex-1 items-center justify-center text-sm font-semibold text-fg-faint">
        Not defined yet
      </div>,
    );
  }

  if (params.tab === "table") return page(<CupTableView view={await getCupTableView()} />);

  if (params.tab === "fixtures") {
    const view = await getCupRoundView(params.round);
    const hrefFor = (round: string) =>
      `${basePath}?${new URLSearchParams({ kind: "cup", competition: "cup", tab: "fixtures", round })}`;
    return page(
      <>
        <CupSimBar roundId={view.round.id} label={view.round.label} />
        <CupFixturesView view={view} hrefFor={hrefFor} />
      </>,
    );
  }

  // Stats and History: the skeleton's "No data yet" until the cup tag is wired into statistics.
  return page();
}