import type { ReactNode } from "react";

import { getCupTeamDetail } from "@/sports/speedway/api/cup";
import { TeamPanel } from "@/sports/speedway/views/competitions/shared/aside/team-panel";
import { buildCupHref, type CupParams } from "./search-params";

export type CupAside = { detail: ReactNode | null; open: boolean; closeHref: string };

/** Always has a club on lg+ (the top one when nothing is selected); the mobile drawer opens only for ?team=. */
export async function getCupAside(params: CupParams): Promise<CupAside> {
  const found = await getCupTeamDetail(params.team);
  return {
    detail: found ? (
      <TeamPanel
        clubId={found.detail.team.clubId}
        source={params.source}
        panel={params.panel}
        venue={params.venue}
        hrefFor={(patch) => buildCupHref(params, patch)}
      />
    ) : null,
    open: found?.selected ?? false,
    closeHref: buildCupHref(params, { team: undefined, panel: "stats" }),
  };
}