"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { saveLineupAction } from "@/sports/speedway/sim/actions";
import { draftSquadsForMatch, isDraftDirty, useLineupStore } from "@/sports/speedway/stores/match-lineup";
import type { Match } from "@/sports/speedway/types/match";
import type { SportId } from "@/sports/types";
import { MatchHero } from "../../header/match-hero";
import { LineupEditor } from "../../lineup/lineup-editor";
import type { MatchParams } from "../../match-params";
import { isFinished, SIDES } from "../../match-stats";
import { SquadTable } from "./squad-table";

const SKILLS_LEGEND = "S Strength · T Technique · F Fighting · R Reflex · C Condition · FRM Form · AVG Heat average";

/**
 * Squads tab. Played: points table per team. Not played: skills table where the player
 * sets the squad (tap a rider -> bottom sheet).
 */
export function SquadsTab({ match, params, sport }: { match: Match; params: MatchParams; sport: SportId }) {
  const finished = isFinished(match);
  const [pending, startTransition] = useTransition();
  const dirty = useLineupStore((s) => isDraftDirty(s, match.id, match.squads));

  function save() {
    const draft = draftSquadsForMatch(useLineupStore.getState(), match.id, match.squads);
    startTransition(async () => {
      const result = await saveLineupAction(match.id, draft);
      if (result.ok) {
        useLineupStore.getState().clearMatchDraft(match.id);
        return;
      }
      toast.error(result.error);
    });
  }

  function reset() {
    useLineupStore.getState().clearMatchDraft(match.id);
  }

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
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button type="button" variant="secondary" onClick={reset} disabled={!dirty || pending}>
            Reset
          </Button>
          <Button type="button" onClick={save} disabled={!dirty || pending}>
            {pending ? "Saving…" : "Save lineup"}
          </Button>
        </div>
      ) : null}

      {!finished ? (
        <p className="rounded-2xl border border-line bg-surface px-3 py-2.5 text-[11px] font-semibold text-fg-muted">
          <span className="font-black text-fg uppercase">Skills legend: </span>
          {SKILLS_LEGEND}
        </p>
      ) : null}
    </div>
  );
}
