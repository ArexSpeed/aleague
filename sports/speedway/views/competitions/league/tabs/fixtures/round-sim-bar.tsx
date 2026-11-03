import { SimButton } from "@/sports/speedway/views/sim/sim-button";
import { resetSeasonAction, simulateRoundAction } from "@/sports/speedway/sim/actions";
import { isSimEnabled } from "@/sports/speedway/sim/sim-config";

/** Test tools above the fixtures: simulate the next round of the selected leagues, or wipe all results. */
export function RoundSimBar({ group, matchday }: { group: string; matchday: number | null }) {
  if (!isSimEnabled()) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 py-1.5">
      <span className="text-[10px] font-black tracking-wider text-fg-faint uppercase">Test tools</span>
      {matchday !== null ? (
        <SimButton tone="primary" action={simulateRoundAction.bind(null, group, matchday)}>
          Simulate round {matchday}
        </SimButton>
      ) : null}
      <SimButton tone="danger" action={resetSeasonAction}>
        Reset season
      </SimButton>
    </div>
  );
}
