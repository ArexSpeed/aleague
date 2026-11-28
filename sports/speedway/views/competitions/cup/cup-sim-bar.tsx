import { simulateCupRoundAction } from "@/sports/speedway/sim/actions";
import { isSimEnabled } from "@/sports/speedway/sim/sim-config";
import { SimButton } from "@/sports/speedway/views/sim/sim-button";

/** Test tool above the cup fixtures: simulate every drawn match of the selected round. */
export function CupSimBar({ roundId, label }: { roundId: string; label: string }) {
  if (!isSimEnabled()) return null;
  return (
    <div className="flex flex-wrap items-center gap-2 py-1.5">
      <span className="text-[10px] font-black tracking-wider text-fg-faint uppercase">Test tools</span>
      <SimButton tone="primary" action={simulateCupRoundAction.bind(null, roundId)}>
        Simulate {label}
      </SimButton>
    </div>
  );
}