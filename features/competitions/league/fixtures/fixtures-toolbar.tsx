import { ChevronLeft, ChevronRight } from "lucide-react";

import { SegmentedControl } from "../../components/segmented-control";
import { buildLeagueHref, type LeagueParams } from "../search-params";
import { ViewModeToggle } from "../view-mode-toggle";

type FixturesToolbarProps = {
  params: LeagueParams;
  matchday: number;
  current: number;
  total: number;
};

/** Previous / "Kolejka N" (click = back to current) / next, plus the view toggle. */
export function FixturesToolbar({ params, matchday, current, total }: FixturesToolbarProps) {
  // Switching matchday drops the selected match; the current matchday stays out of the URL.
  const hrefFor = (n: number) =>
    buildLeagueHref(params, { matchday: n === current ? undefined : n, match: undefined });

  return (
    <div className="flex shrink-0 items-center justify-between gap-2 py-1.5">
      <SegmentedControl
        label="Kolejka"
        variant="neutral"
        options={[
          {
            key: "prev",
            iconOnly: true,
            title: "Poprzednia kolejka",
            active: false,
            href: hrefFor(Math.max(1, matchday - 1)),
            label: <ChevronLeft className="size-4" aria-hidden />,
          },
          {
            key: "current",
            title: "Wróć do bieżącej kolejki",
            active: true,
            href: hrefFor(current),
            label: (
              <span className="font-mono">
                Kolejka {matchday}/{total}
              </span>
            ),
          },
          {
            key: "next",
            iconOnly: true,
            title: "Następna kolejka",
            active: false,
            href: hrefFor(Math.min(total, matchday + 1)),
            label: <ChevronRight className="size-4" aria-hidden />,
          },
        ]}
      />

      <ViewModeToggle params={params} />
    </div>
  );
}