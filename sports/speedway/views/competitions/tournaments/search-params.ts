import { firstParam, pickOne, type RawSearchParams } from "@/lib/url-state";
import { competitionsHref } from "@/lib/paths";

export const TOURNAMENT_COMPETITIONS = ["pairs", "fours", "regio"] as const;
export type TournamentCompetition = (typeof TOURNAMENT_COMPETITIONS)[number];

export const TOURNAMENT_ROUNDS = ["r1", "r2", "sf", "final"] as const;
export type TournamentRound = (typeof TOURNAMENT_ROUNDS)[number];

export type TournamentParams = {
  sport: string;
  kind: "tournaments";
  competition: TournamentCompetition;
  tab: "rounds";
  round: TournamentRound;
  preview?: boolean;
  base: string;
};

export function parseTournamentParams(
  raw: RawSearchParams,
  base: string,
  sport: string,
): TournamentParams {
  const competition = pickOne(
    TOURNAMENT_COMPETITIONS,
    firstParam(raw.competition)?.toLowerCase() as TournamentCompetition | undefined,
    "pairs",
  );

  const round = pickOne(
    TOURNAMENT_ROUNDS,
    firstParam(raw.round)?.toLowerCase() as TournamentRound | undefined,
    "r1",
  );

  const preview = firstParam(raw.preview) === "1" || firstParam(raw.preview) === "drawn";

  return {
    sport,
    kind: "tournaments",
    competition,
    tab: "rounds",
    round,
    preview,
    base,
  };
}

export type TournamentPatch = Partial<Omit<TournamentParams, "sport" | "kind" | "base">>;

export function buildTournamentHref(
  params: TournamentParams,
  patch: TournamentPatch = {},
): string {
  const next = { ...params, ...patch };

  return competitionsHref({
    sport: next.sport,
    kind: "tournaments",
    competition: next.competition,
    tab: next.tab,
    round: next.round,
    preview: next.preview ? "drawn" : undefined,
  });
}
