import { Globe, House, Plane } from "lucide-react";

import { SegmentedControl } from "./segmented-control";

export type Venue = "all" | "home" | "away";

type VenueToggleProps = {
  value: Venue;
  hrefFor: (venue: Venue) => string;
};

const ICON = "size-3.5";

/** All / Home / Away filter. */
export function VenueToggle({ value, hrefFor }: VenueToggleProps) {
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
          key: "home",
          active: value === "home",
          href: hrefFor("home"),
          label: (
            <>
              <House className={ICON} aria-hidden />
              <span>Home</span>
            </>
          ),
        },
        {
          key: "away",
          active: value === "away",
          href: hrefFor("away"),
          label: (
            <>
              <Plane className={ICON} aria-hidden />
              <span>Away</span>
            </>
          ),
        },
      ]}
    />
  );
}
