import { Suspense } from "react";

import { MasterDetail } from "@/components/layout/master-detail";
import type { TeamsViewProps } from "@/sports/types";
import { getTeamsAside } from "./aside/team-aside";
import { parseTeamsParams } from "./teams-params";
import { TeamsMaster } from "./teams-master";

/** Speedway > Teams. Master = Clubs / Nations / Riders / Competition, detail = team aside. */
export function TeamsView(props: TeamsViewProps) {
  return (
    <Suspense fallback={<div className="p-4 text-sm font-semibold opacity-60">Loading…</div>}>
      <TeamsContent {...props} />
    </Suspense>
  );
}

async function TeamsContent({ sport, basePath, searchParams }: TeamsViewProps) {
  const params = parseTeamsParams(await searchParams, basePath, sport);
  const aside = await getTeamsAside(params);

  return (
    <MasterDetail
      scrollMaster={false}
      detailOpen={aside.open}
      closeHref={aside.closeHref}
      master={<TeamsMaster params={params} />}
      detail={aside.detail}
    />
  );
}
