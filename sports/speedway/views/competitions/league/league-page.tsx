import { Suspense } from "react";

import { MasterDetail } from "@/components/layout/master-detail";
import type { CompetitionViewProps } from "@/sports/types";
import { getLeagueAside } from "./aside/league-aside";
import { LeagueView } from "./league-view";
import { parseLeagueParams } from "./search-params";

/**
 * Speedway > Competitions > League.
 * Master part = tabs + filters + table/fixtures. Detail part = team or match aside.
 */
export function LeaguePage(props: CompetitionViewProps) {
  return (
    <Suspense fallback={<div className="p-4 text-sm font-semibold opacity-60">Ładowanie…</div>}>
      <LeagueContent {...props} />
    </Suspense>
  );
}

async function LeagueContent({ basePath, searchParams }: CompetitionViewProps) {
  const params = parseLeagueParams(await searchParams, basePath);
  const aside = await getLeagueAside(params);

  return (
    <MasterDetail
      scrollMaster={false}
      detailOpen={aside.open}
      closeHref={aside.closeHref}
      master={<LeagueView params={params} />}
      detail={aside.detail}
    />
  );
}
