import Form from "next/form";
import { Layers, Search } from "lucide-react";

import { SegmentedControl } from "@/components/toggle/segmented-control";
import { ViewModeToggle } from "@/components/toggle/view-mode-toggle";
import {
  buildTeamsHref,
  DIVISION_LABELS,
  DIVISIONS,
  type TeamsParams,
} from "../teams-params";
import { DivisionDot } from "./division-pill";

/** Division pills (clubs only), view toggle and a text search. State lives in the URL. */
export function TeamsToolbar({ params, count }: { params: TeamsParams; count: number }) {
  const clubs = params.tab === "clubs";

  return (
    <div className="space-y-2 pt-3">
      <div className="flex flex-wrap items-center gap-2">
        {clubs ? (
          <SegmentedControl
            label="Division"
            variant="brand"
            options={DIVISIONS.map((division) => ({
              key: division,
              active: params.division === division,
              href: buildTeamsHref(params, { division, team: undefined }),
              label:
                division === "all" ? (
                  <>
                    <Layers className="size-3.5" aria-hidden />
                    <span>All</span>
                  </>
                ) : (
                  <>
                    <DivisionDot division={division} />
                    <span>{DIVISION_LABELS[division]}</span>
                  </>
                ),
            }))}
          />
        ) : null}
        <ViewModeToggle value={params.view} hrefFor={(view) => buildTeamsHref(params, { view })} />
      </div>

      <div className="flex items-center gap-3">
        {/* A plain GET form: works without JS, keeps the other filters in hidden fields. */}
        <Form action={params.basePath} className="relative min-w-0 flex-1">
          <input type="hidden" name="tab" value={params.tab} />
          <input type="hidden" name="division" value={params.division} />
          <input type="hidden" name="view" value={params.view} />
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-fg-faint" aria-hidden />
          <input
            type="search"
            name="q"
            defaultValue={params.q}
            placeholder={clubs ? "Search clubs, leagues, regions…" : "Search nations, regions…"}
            aria-label="Search"
            className="h-10 w-full rounded-xl border border-line bg-control pr-3 pl-9 text-sm font-semibold text-fg shadow-xs outline-none placeholder:text-fg-faint focus:border-brand"
          />
        </Form>
        <span className="shrink-0 text-sm font-bold text-fg-faint">
          {count} {clubs ? "clubs" : "nations"}
        </span>
      </div>
    </div>
  );
}
