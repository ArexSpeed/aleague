import { Globe, House, Plane } from "lucide-react";

import { SegmentedControl } from "./segmented-control";

export type Venue = "all" | "upcoming" | "recent";

type FixturesToggleProps = {
  value: Venue;
  hrefFor: (venue: Venue) => string;
};

const ICON = "size-3.5";

/** All / Upcoming / Recent filter. */
export function FixturesToggle({ value, hrefFor }: FixturesToggleProps) {
  return (
    <SegmentedControl
      label="Games"
      variant="neutral"
      options={[
        {
          key: "all",
          active: value === "all",
          href: hrefFor("all"),
          label: (
            <>
              <Globe className={ICON} aria-hidden />
              <span>All</span>
            </>
          ),
        },
        {
          key: "upcoming",
          active: value === "upcoming",
          href: hrefFor("upcoming"),
          label: (
            <>
              <House className={ICON} aria-hidden />
              <span>Upcoming</span>
            </>
          ),
        },
        {
          key: "recent",
          active: value === "recent",
          href: hrefFor("recent"),
          label: (
            <>
              <Plane className={ICON} aria-hidden />
              <span>Recent</span>
            </>
          ),
        },
      ]}
    />
  );
}
