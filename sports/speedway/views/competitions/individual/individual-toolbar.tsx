import { FixturesToggle } from "@/components/toggle/fixtures-toggle";
import { ViewModeToggle } from "@/components/toggle/view-mode-toggle";
import { buildIndividualHref, type IndividualParams } from "./search-params";

/** All / Upcoming / Recent on the left (fixtures only), Detailed / Compact on the right. */
export function IndividualToolbar({ params, withSchedule }: { params: IndividualParams; withSchedule: boolean }) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-2 py-1.5">
      {withSchedule ? (
        <FixturesToggle value={params.schedule} hrefFor={(schedule) => buildIndividualHref(params, { schedule })} />
      ) : (
        <span />
      )}
      <ViewModeToggle value={params.view} hrefFor={(view) => buildIndividualHref(params, { view })} />
    </div>
  );
}