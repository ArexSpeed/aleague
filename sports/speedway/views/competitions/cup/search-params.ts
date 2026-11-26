import { CUP_DEFINITION } from "@/sports/speedway/data/season";
import { getCompetitionKind } from "@/sports/speedway/competitions-config";
import type { RawSearchParams } from "@/sports/types";

export type CupParams = { competition: "cup" | "supercup"; tab: string; round: string };

export function parseCupParams(raw: RawSearchParams): CupParams {
  const kind = getCompetitionKind("cup");
  const round = typeof raw.round === "string" ? raw.round : undefined;
  const tab = typeof raw.tab === "string" ? raw.tab : undefined;

  return {
    competition: raw.competition === "supercup" ? "supercup" : "cup",
    tab: kind.tabs.some((item) => item.id === tab) ? tab! : kind.defaultParams.tab!,
    round: CUP_DEFINITION.rounds.some((r) => r.id === round) ? round! : CUP_DEFINITION.rounds[0]!.id,
  };
}