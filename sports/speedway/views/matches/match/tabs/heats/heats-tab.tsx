import { SegmentedControl } from "@/components/toggle/segmented-control";
import type { Match } from "@/sports/speedway/types/match";
import type { SportId } from "@/sports/types";
import { MatchScoreStrip } from "../../header/match-score-strip";
import { buildMatchHref, type MatchParams } from "../../match-params";
import { HeatCard } from "./heat-card";

/** Heats tab: score strip, All / Unplayed filter, a card per heat (two columns on wide screens). */
export function HeatsTab({ match, params, sport }: { match: Match; params: MatchParams; sport: SportId }) {
  const unplayed = match.heats.filter((heat) => heat.time === null);
  const heats = params.show === "unplayed" ? unplayed : match.heats;

  return (
    <div className="space-y-3 pt-3 pb-3">
      <MatchScoreStrip match={match} sport={sport} />

      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-lg font-black text-fg uppercase">
          <span className="size-3 rounded-full bg-brand" aria-hidden />
          Heats
        </h2>
        <SegmentedControl
          label="Heats filter"
          variant="brand"
          options={[
            {
              key: "all",
              label: `All (${match.heats.length})`,
              active: params.show === "all",
              href: buildMatchHref(params, { show: "all" }),
            },
            {
              key: "unplayed",
              label: `Unplayed (${unplayed.length})`,
              active: params.show === "unplayed",
              href: buildMatchHref(params, { show: "unplayed" }),
            },
          ]}
        />
      </div>

      {heats.length === 0 ? (
        <p className="p-4 text-center text-sm font-semibold text-fg-faint">All heats have been run</p>
      ) : (
        <ul className="grid gap-3 lg:grid-cols-2">
          {heats.map((heat) => (
            <HeatCard key={heat.number} heat={heat} params={params} />
          ))}
        </ul>
      )}
    </div>
  );
}
