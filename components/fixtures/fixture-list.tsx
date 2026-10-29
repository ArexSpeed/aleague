import { FixtureCard, type FixtureCardData } from "./fixture-card";

export type FixtureGroupData = {
  id: string;
  title: string;
  /** Small pill on the right of the header, e.g. a date. */
  meta?: string;
  fixtures: FixtureCardData[];
};

/** Rounds / matchdays with their fixtures. Scrolls on its own, the toolbar above stays put. */
export function FixtureList({ groups, empty }: { groups: FixtureGroupData[]; empty: string }) {
  if (groups.length === 0) {
    return <p className="p-4 text-center text-sm font-semibold text-fg-faint">{empty}</p>;
  }

  return (
    <div className="no-scrollbar min-h-0 flex-1 space-y-5 overflow-y-auto px-1 py-2">
      {groups.map((group) => (
        <section key={group.id} aria-labelledby={`fixtures-${group.id}`}>
          <header className="mb-2 flex items-center justify-between gap-2 px-1">
            <h6
              id={`fixtures-${group.id}`}
              className="flex items-center gap-2 text-xs font-black text-fg uppercase"
            >
              <span className="size-2 rounded-full bg-brand" aria-hidden />
              {group.title}
            </h6>
            {group.meta ? (
              <span className="rounded-full bg-control-active px-3 py-1 text-xs font-bold text-brand">
                {group.meta}
              </span>
            ) : null}
          </header>
          <ul className="space-y-2">
            {group.fixtures.map((fixture) => (
              <FixtureCard key={fixture.id} fixture={fixture} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}