import { connection } from "next/server";
import { Suspense, type ReactNode } from "react";

import { todayIso } from "@/lib/format";
import { getCupFixturesView, getCupTableView } from "@/sports/speedway/api/cup";
import type { CompetitionViewProps } from "@/sports/types";
import { CompetitionSkeleton } from "../competition-skeleton";
import { getCupAside } from "./cup-aside";
import { CupFixturesView } from "./cup-fixtures-view";
import { CupSimBar } from "./cup-sim-bar";
import { CupTableView } from "./cup-table-view";
import { CupToolbar } from "./cup-toolbar";
import { parseCupParams } from "./search-params";
import { CupStatsView } from "./cup-stats-view";

export function CupPage(props: CompetitionViewProps) {
  return (
    <Suspense fallback={<div className="p-4 text-sm font-semibold opacity-60">Ładowanie…</div>}>
      <CupContent {...props} />
    </Suspense>
  );
}

async function CupContent({ searchParams, sport }: CompetitionViewProps) {
  const raw = await searchParams;
  const params = parseCupParams(raw);

const hasAside =
    params.competition === "cup" &&
    (params.tab === "table" || params.tab === "fixtures" || params.tab === "stats");
  const aside = hasAside ? await getCupAside(params) : undefined;

  const page = (content?: ReactNode) => (
    <CompetitionSkeleton sport={sport} kind="cup" searchParams={Promise.resolve(raw)} aside={aside}>
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

  if (params.tab === "table") {
    return page(
      <div className="mt-1 min-w-0">
        <CupToolbar params={params} withSchedule={false} />
        <CupTableView view={await getCupTableView()} params={params} />
      </div>,
    );
  }

  if (params.tab === "fixtures") {
    await connection();
    const today = todayIso();
    const view = await getCupFixturesView();
    return page(
      <div className="mt-1 min-w-0">
        <CupToolbar params={params} withSchedule />
        {view.nextRound ? <CupSimBar roundId={view.nextRound.id} label={view.nextRound.label} /> : null}
        <CupFixturesView view={view} params={params} today={today} />
      </div>,
    );
  }

if (params.tab === "stats") {
    return page(<CupStatsView params={params} />);
  }

  // History: the skeleton's "No data yet".
  return page();
}