import { Suspense } from "react";
import { MasterDetail } from "@/components/layout/master-detail";
import { LeagueView } from "@/features/competitions/league/league-view";
import { parseLeagueParams } from "@/features/competitions/league/search-params";
import { getLeaguePanel } from "@/features/competitions/league/league-panel";

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
  const panel = await getLeaguePanel(params);

  return (
    <MasterDetail
      scrollMaster={false}
      detailOpen={panel.open}
      closeHref={panel.closeHref}
      master={<LeagueView params={params} />}
      detail={panel.detail}
    />
  );
}