import { SegmentedControl } from "@/components/toggle/segmented-control";
import { competitionsHref } from "@/lib/paths";
import { COMPETITION_KINDS } from "@/sports/speedway/competitions-config";
import type { TournamentRoundDef } from "@/sports/speedway/types/tournaments";
import {
  buildTournamentHref,
  type TournamentParams,
  type TournamentRound,
} from "./search-params";

type Props = {
  params: TournamentParams;
  rounds?: readonly TournamentRoundDef[];
};

const TOURNAMENT_OPTIONS = [
  { id: "pairs", label: "Pairs" },
  { id: "fours", label: "Fours" },
  { id: "regio", label: "Regio" },
] as const;

export function TournamentsFilters({ params, rounds = [] }: Props) {
  const isRegio = params.competition === "regio";

  return (
    <div className="mt-1 mb-2 flex shrink-0 flex-col gap-1.5">
      {/* 1st line: Competition kinds */}
      <div className="py-0.5">
        <SegmentedControl
          label="Competition kind"
          variant="brand"
          options={COMPETITION_KINDS.map((kind) => ({
            key: kind.id,
            label: kind.label,
            active: kind.id === "tournaments",
            href: kind.id === "league" || kind.id === "nation"
              ? competitionsHref({ sport: params.sport, kind: kind.id, group: "all" })
              : competitionsHref({ sport: params.sport, kind: kind.id }),
          }))}
        />
      </div>

      {/* 2nd line: Tournament selection */}
      <div className="min-w-0 py-0.5">
        <SegmentedControl
          label="Tournament"
          variant="brand"
          options={TOURNAMENT_OPTIONS.map((opt) => ({
            key: opt.id,
            label: opt.label,
            active: params.competition === opt.id,
            href: buildTournamentHref(params, {
              competition: opt.id,
              round: "r1",
            }),
          }))}
        />
      </div>

      {/* 3rd line: Round selector (Round 1, Round 2, Semifinals, Final) */}
      {!isRegio && rounds.length > 0 ? (
        <div className="min-w-0 py-0.5">
          <SegmentedControl
            label="Round"
            variant="brand"
            options={rounds.map((round) => ({
              key: round.id,
              label: round.label,
              active: params.round === round.id,
              href: buildTournamentHref(params, {
                round: round.id as TournamentRound,
              }),
            }))}
          />
        </div>
      ) : null}
    </div>
  );
}
