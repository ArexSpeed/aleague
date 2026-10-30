import { CalendarClock, Globe, History } from "lucide-react";

import { SegmentedControl } from "./segmented-control";

export type Schedule = "all" | "upcoming" | "recent";

type FixturesToggleProps = {
  value: Schedule;
  hrefFor: (schedule: Schedule) => string;
};

const ICON = "size-3.5";

/** All / Upcoming / Recent filter for fixture lists. */
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
              <CalendarClock className={ICON} aria-hidden />
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
              <History className={ICON} aria-hidden />
              <span>Recent</span>
            </>
          ),
        },
      ]}
    />
  );
}