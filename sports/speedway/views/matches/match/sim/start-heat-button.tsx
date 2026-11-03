"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { startHeatAction } from "@/sports/speedway/sim/actions";
import { lineupDraft, useLineupStore } from "@/sports/speedway/stores/match-lineup";

/** Start: sends the pending lineup changes together with the request, so the engine rides who is on screen. */
export function StartHeatButton({ fixtureId }: { fixtureId: string }) {
  const [pending, startTransition] = useTransition();

  function start() {
    // Read the store at click time, not at render time, so it is always the latest draft.
    const draft = lineupDraft(useLineupStore.getState(), fixtureId);
    startTransition(async () => {
      try {
        await startHeatAction(fixtureId, draft);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not start the heat");
      }
    });
  }

  return (
    <Button type="button" onClick={start} disabled={pending}>
      {pending ? "Running…" : "Start"}
    </Button>
  );
}