import { ChartColumn, Zap } from "lucide-react";

import { SegmentedControl } from "./segmented-control";

export type Metrics = "stats" | "skills";

type MetricsToggleProps = {
  value: Metrics;
  hrefFor: (metrics: Metrics) => string;
};

const ICON = "size-3.5";

/** Stats / Skills switch for player tables. */
export function MetricsToggle({ value, hrefFor }: MetricsToggleProps) {
  return (
    <SegmentedControl
      label="Data"
      variant="brand"
      options={[
        {
          key: "stats",
          active: value === "stats",
          href: hrefFor("stats"),
          label: (
            <>
              <ChartColumn className={ICON} aria-hidden />
              <span>Stats</span>
            </>
          ),
        },
        {
          key: "skills",
          active: value === "skills",
          href: hrefFor("skills"),
          label: (
            <>
              <Zap className={ICON} aria-hidden />
              <span>Skills</span>
            </>
          ),
        },
      ]}
    />
  );
}