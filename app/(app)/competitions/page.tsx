import { Suspense } from "react";

import { MasterDetail } from "@/components/layout/master-detail";
import { LeagueView } from "@/features/competitions/league/league-view";
import { buildLeagueHref, parseLeagueParams } from "@/features/competitions/league/search-params";
import { TeamPanel } from "@/features/competitions/league/team-panel/team-panel";
import { getLeagueTeam } from "@/lib/api/league";

type CompetitionsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function CompetitionsPage({ searchParams }: CompetitionsPageProps) {
  return (
    <Suspense fallback={<div className="p-4 text-sm font-semibold opacity-60">Ładowanie…</div>}>
      <CompetitionsContent searchParams={searchParams} />
    </Suspense>
  );
}

async function CompetitionsContent({ searchParams }: CompetitionsPageProps) {
  const params = parseLeagueParams(await searchParams);
  const team = params.team ? await getLeagueTeam(params.team) : null;

  return (
    <MasterDetail
      scrollMaster={false}
      closeHref={buildLeagueHref(params, { team: undefined, panel: "stats" })}
      master={<LeagueView params={params} />}
      detail={team ? <TeamPanel team={team} params={params} /> : null}
    />
  );
}