import { FixturesToggle } from "@/components/toggle/fixtures-toggle";
import { ViewModeToggle } from "@/components/toggle/view-mode-toggle";
import { buildCupHref, type CupParams } from "./search-params";

/** All / Upcoming / Recent on the left (fixtures only), Detailed / Compact on the right. */
export function CupToolbar({ params, withSchedule }: { params: CupParams; withSchedule: boolean }) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-2 py-1.5">
      {withSchedule ? (
        <FixturesToggle value={params.schedule} hrefFor={(schedule) => buildCupHref(params, { schedule })} />
      ) : (
        <span />
      )}
      <ViewModeToggle value={params.view} hrefFor={(view) => buildCupHref(params, { view })} />
    </div>
  );
}