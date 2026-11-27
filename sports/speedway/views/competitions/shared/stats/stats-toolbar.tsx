import { MetricsToggle, type Metrics } from "@/components/toggle/metrics-toggle";
import { VenueToggle, type Venue } from "@/components/toggle/venue-toggle";
import { ViewModeToggle, type ViewMode } from "@/components/toggle/view-mode-toggle";

export type StatsToolbarPatch = { venue?: Venue; metrics?: Metrics; view?: ViewMode };

type StatsToolbarProps = {
  venue: Venue;
  metrics: Metrics;
  view: ViewMode;
  /** Page-specific URL builder (league, cup): the current URL with `patch` applied. */
  hrefFor: (patch: StatsToolbarPatch) => string;
};

/** All / Home / Away + Stats / Skills on the left, Detailed / Compact on the right. */
export function StatsToolbar({ venue, metrics, view, hrefFor }: StatsToolbarProps) {
  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 py-1.5">
      <div className="flex flex-wrap items-center gap-2">
        <VenueToggle value={venue} hrefFor={(next) => hrefFor({ venue: next })} />
        <MetricsToggle value={metrics} hrefFor={(next) => hrefFor({ metrics: next })} />
      </div>
      <ViewModeToggle value={view} hrefFor={(next) => hrefFor({ view: next })} />
    </div>
  );
}