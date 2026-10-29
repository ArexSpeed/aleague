import { Columns3, Grid2x2 } from "lucide-react";

import { SegmentedControl } from "./segmented-control";

export type ViewMode = "detailed" | "compact";

type ViewModeToggleProps = {
  value: ViewMode;
  /** Page-specific URL builder, so the toggle works for any sport or page. */
  hrefFor: (mode: ViewMode) => string;
};

/** Detailed / Compact switch for tables and lists. */
export function ViewModeToggle({ value, hrefFor }: ViewModeToggleProps) {
  return (
    <SegmentedControl
      label="View"
      variant="neutral"
      options={[
        {
          key: "detailed",
          iconOnly: true,
          title: "Detailed View",
          active: value === "detailed",
          href: hrefFor("detailed"),
          label: <Columns3 className="size-4" aria-hidden />,
        },
        {
          key: "compact",
          iconOnly: true,
          title: "Compact View",
          active: value === "compact",
          href: hrefFor("compact"),
          label: <Grid2x2 className="size-4" aria-hidden />,
        },
      ]}
    />
  );
}
