import { Suspense } from "react";
import { MasterDetail } from "@/components/layout/master-detail";
import type { CompetitionViewProps } from "@/sports/types";
import { getTournamentData } from "@/sports/speedway/api/tournaments";
import { parseTournamentParams } from "./search-params";
import { TournamentsView } from "./tournaments-view";

export function TournamentsPage(props: CompetitionViewProps) {
  return (
    <Suspense
      fallback={<div className="p-4 text-sm font-semibold opacity-60">Ładowanie…</div>}
    >
      <TournamentsContent {...props} />
    </Suspense>
  );
}

async function TournamentsContent({
  basePath,
  searchParams,
  sport,
}: CompetitionViewProps) {
  const params = parseTournamentParams(await searchParams, basePath, sport);
  const data = await getTournamentData(
    params.competition,
    params.round,
    params.preview,
  );

  return (
    <MasterDetail
      scrollMaster={false}
      detailOpen={false}
      closeHref={basePath}
      master={<TournamentsView params={params} data={data} />}
      detail={null}
    />
  );
}
