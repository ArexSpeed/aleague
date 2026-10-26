import { Columns3, Grid2x2 } from "lucide-react";

import { SegmentedControl } from "../components/segmented-control";
import { buildLeagueHref, type LeagueParams } from "./search-params";

export function ViewModeToggle({ params }: { params: LeagueParams }) {
  return (
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
  );
}