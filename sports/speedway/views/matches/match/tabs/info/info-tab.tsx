import Link from "next/link";

import type { Match } from "@/sports/speedway/types/match";
import type { SportId } from "@/sports/types";
import { MatchHero } from "../../header/match-hero";
import { buildMatchHref, type MatchParams } from "../../match-params";
import { isFinished } from "../../match-stats";
import { HeatSummary } from "./heat-summary";
import { MatchStatsSummary } from "./match-stats-summary";
import { VenueWidgets } from "./venue-widgets";

/** Info tab: hero, venue tiles, heat summary and general stats. */
export function InfoTab({ match, params, sport }: { match: Match; params: MatchParams; sport: SportId }) {
  return (
    <div className="space-y-3 pt-3 pb-3">
      <MatchHero match={match} sport={sport} />
      <VenueWidgets match={match} />

      {isFinished(match) ? (
        <>
          <HeatSummary match={match} params={params} />
          <MatchStatsSummary match={match} params={params} />
        </>
      ) : (
        <section className="rounded-2xl border border-dashed border-line p-4 text-center text-sm font-semibold text-fg-muted">
          This match has not been played yet. Set the{" "}
          <Link href={buildMatchHref(params, { tab: "squads" })} className="font-bold text-brand hover:underline">
            squad
          </Link>{" "}
          and the{" "}
          <Link href={buildMatchHref(params, { tab: "heats" })} className="font-bold text-brand hover:underline">
            heats
          </Link>
          ; results will show up here.
        </section>
      )}
    </div>
  );
}
