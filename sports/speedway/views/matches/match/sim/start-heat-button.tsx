"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { startHeatAction } from "@/sports/speedway/sim/actions";
import { isDraftDirty, lineupDraft, useLineupStore } from "@/sports/speedway/stores/match-lineup";
import type { MatchRider, Side } from "@/sports/speedway/types/match";

/** Start: runs on the saved lineup; unsaved changes must be saved first. */
export function StartHeatButton({
  fixtureId,
  savedSquads,
}: {
  fixtureId: string;
  savedSquads: Record<Side, MatchRider[]>;
}) {
  const [pending, startTransition] = useTransition();
  const dirty = useLineupStore((s) => isDraftDirty(s, fixtureId, savedSquads));

  function start() {
    const draft = useLineupStore.getState();
    const lineup = lineupDraft(draft, fixtureId);
    startTransition(async () => {
      try {
        await startHeatAction(fixtureId, lineup);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not start the heat");
      }
    });
  }

  return (
    <Button
      type="button"
      onClick={start}
      disabled={pending || dirty}
      title={dirty ? "Save or reset your lineup first" : undefined}
    >
      {pending ? "Running…" : "Start"}
    </Button>
  );
}