import { resetMatchAction, undoHeatAction } from "@/sports/speedway/sim/actions";
import { isSimEnabled } from "@/sports/speedway/sim/sim-config";
import type { Heat, Match } from "@/sports/speedway/types/match";
import { SimButton } from "@/sports/speedway/views/sim/sim-button";
import { SetHeatForm } from "./set-heat-form";
import { StartHeatButton } from "./start-heat-button";

/**
 * Aside > Heat, test tools: Set (choose the result) and Start (simulate) for the next heat.
 * Heats are played in order, so the buttons only exist on the next unplayed heat.
 */
export function HeatSimControls({ match, heat }: { match: Match; heat: Heat }) {
  if (!isSimEnabled()) return null;

  const played = match.heats.filter((h) => h.homePoints !== null).length;
  const isNext = heat.number === played + 1;

  return (
    <section className="rounded-2xl border border-dashed border-line p-3">
      <h3 className="text-[11px] font-black tracking-wider text-fg-faint uppercase">Test tools</h3>

      {isNext ? (
        <div className="mt-2 flex flex-wrap items-start gap-2">
          <StartHeatButton fixtureId={match.id} />
          <SetHeatForm
            fixtureId={match.id}
            starts={[...heat.riders]
              .sort((a, b) => a.gate - b.gate)
              .map((r) => ({ gate: r.gate, helmet: r.helmet, side: r.side, name: `${r.firstName} ${r.lastName}` }))}
          />
        </div>
      ) : (
        <p className="mt-2 text-xs font-semibold text-fg-faint">
          {heat.homePoints !== null
            ? "This heat has been run."
            : played === match.heats.length
              ? "The match is over."
              : `Run heat ${played + 1} first.`}
        </p>
      )}

      {played > 0 ? (
        <div className="mt-2 flex flex-wrap gap-2">
          <SimButton action={undoHeatAction.bind(null, match.id)}>Undo last heat</SimButton>
          <SimButton tone="danger" action={resetMatchAction.bind(null, match.id)}>
            Reset match
          </SimButton>
        </div>
      ) : null}
    </section>
  );
}