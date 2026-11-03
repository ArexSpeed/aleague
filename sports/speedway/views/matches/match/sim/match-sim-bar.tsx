import { resetMatchAction, simulateMatchAction } from "@/sports/speedway/sim/actions";
import { isSimEnabled } from "@/sports/speedway/sim/sim-config";
import type { Match } from "@/sports/speedway/types/match";
import { SimButton } from "@/sports/speedway/views/sim/sim-button";

/** Test tools under the match hero: play the rest of the match, or throw it away. */
export function MatchSimBar({ match }: { match: Match }) {
  if (!isSimEnabled()) return null;

  const started = match.heats.some((heat) => heat.homePoints !== null);

  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-2 border-t border-line pt-3">
      <span className="text-[10px] font-black tracking-wider text-fg-faint uppercase">Test tools</span>
      {match.status !== "finished" ? (
        <SimButton tone="primary" action={simulateMatchAction.bind(null, match.id)}>
          Simulate match
        </SimButton>
      ) : null}
      {started ? (
        <SimButton tone="danger" action={resetMatchAction.bind(null, match.id)}>
          Reset match
        </SimButton>
      ) : null}
    </div>
  );
}
