import { Columns3, Globe, Grid2x2, House, Plane } from "lucide-react";

import { SegmentedControl } from "../components/segmented-control";
import { buildLeagueHref, type LeagueParams } from "./search-params";

const ICON = "size-3.5";

/** All / Home / Away on the left, Detailed / Compact on the right. */
export function StandingsToolbar({ params }: { params: LeagueParams }) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-2 py-1.5">
      <SegmentedControl
        label="Mecze"
        variant="neutral"
        options={[
          {
            key: "all",
            active: params.venue === "all",
            href: buildLeagueHref(params, { venue: "all" }),
            label: (
              <>
                <Globe className={ICON} aria-hidden />
                <span>All</span>
              </>
            ),
          },
          {
            key: "home",
            active: params.venue === "home",
            href: buildLeagueHref(params, { venue: "home" }),
            label: (
              <>
                <House className={ICON} aria-hidden />
                <span>Home</span>
              </>
            ),
          },
          {
            key: "away",
            active: params.venue === "away",
            href: buildLeagueHref(params, { venue: "away" }),
            label: (
              <>
                <Plane className={ICON} aria-hidden />
                <span>Away</span>
              </>
            ),
          },
        ]}
      />

      {/* In the AI Studio original this only changes the Stats tab; the Table ignores it. */}
      <SegmentedControl
        label="Widok"
        variant="neutral"
        options={[
          {
            key: "detailed",
            iconOnly: true,
            title: "Widok szczegółowy",
            active: params.view === "detailed",
            href: buildLeagueHref(params, { view: "detailed" }),
            label: <Columns3 className="size-4" aria-hidden />,
          },
          {
            key: "compact",
            iconOnly: true,
            title: "Widok kompaktowy",
            active: params.view === "compact",
            href: buildLeagueHref(params, { view: "compact" }),
            label: <Grid2x2 className="size-4" aria-hidden />,
          },
        ]}
      />
    </div>
  );
}
