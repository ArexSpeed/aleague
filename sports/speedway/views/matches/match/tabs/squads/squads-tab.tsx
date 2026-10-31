import type { Match } from "@/sports/speedway/types/match";
import type { SportId } from "@/sports/types";
import { MatchHero } from "../../header/match-hero";
import { LineupEditor } from "../../lineup/lineup-editor";
import type { MatchParams } from "../../match-params";
import { isFinished, SIDES } from "../../match-stats";
import { SquadTable } from "./squad-table";

const SKILLS_LEGEND = "S Start · T Technique · F Form · R Judgement · C Character · AVG Heat average";

/**
 * Squads tab. Played: points table per team. Not played: skills table where the player
 * sets the squad (tap a rider -> bottom sheet).
 */
export function SquadsTab({ match, params, sport }: { match: Match; params: MatchParams; sport: SportId }) {
  const finished = isFinished(match);

  return (
    <div className="space-y-3 pt-3 pb-3">
      <MatchHero match={match} sport={sport} />

      <div className="grid gap-3 lg:grid-cols-2">
        {SIDES.map((side) =>
          finished ? (
            <SquadTable key={side} match={match} side={side} params={params} />
          ) : (
            <LineupEditor key={side} side={side} team={match[side]} squad={match.squads[side]} />
          ),
        )}
      </div>

      {!finished ? (
        <p className="rounded-2xl border border-line bg-surface px-3 py-2.5 text-[11px] font-semibold text-fg-muted">
          <span className="font-black text-fg uppercase">Skills legend: </span>
          {SKILLS_LEGEND}
        </p>
      ) : null}
    </div>
  );
}
