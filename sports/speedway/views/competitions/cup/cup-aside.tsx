import type { ReactNode } from "react";

import { getCupTeamDetail } from "@/sports/speedway/api/cup";
import { CupTeamPanel } from "./cup-team-panel";
import { buildCupHref, type CupParams } from "./search-params";

export type CupAside = { detail: ReactNode | null; open: boolean; closeHref: string };

/** Always has a club on lg+ (the top one when nothing is selected); the mobile drawer opens only for ?team=. */
export async function getCupAside(params: CupParams): Promise<CupAside> {
  const found = await getCupTeamDetail(params.team);
  return {
    detail: found ? <CupTeamPanel detail={found.detail} /> : null,
    open: found?.selected ?? false,
    closeHref: buildCupHref(params, { team: undefined }),
  };
}