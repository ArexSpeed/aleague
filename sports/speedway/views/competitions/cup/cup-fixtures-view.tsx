import Link from "next/link";

import { SegmentedControl } from "@/components/toggle/segmented-control";
import type { CupLegView, CupRoundView } from "@/sports/speedway/api/cup";
import type { CupPairState } from "@/sports/speedway/types/cup";

const STATE_LABEL: Record<CupPairState, string> = {
  pending: "Pending",
  "leg1-played": "Leg 1 played",
  decided: "Decided",
  "needs-runoff": "Run-off needed",
};

function Leg({ leg }: { leg: CupLegView }) {
  const content = (
    <>
      <span className="shrink-0 text-fg-faint">Leg {leg.leg}</span>
      <span className="min-w-0 truncate">
        {leg.home} <span className="text-fg-faint">vs</span> {leg.away}
      </span>
      <span className="shrink-0 font-black">{leg.score ?? "– : –"}</span>
    </>
  );
  const row = "flex items-center justify-between gap-2";
  return leg.href ? (
    <Link href={leg.href} className={`${row} transition-colors hover:text-brand`}>
      {content}
    </Link>
  ) : (
    <div className={row}>{content}</div>
  );
}

export function CupFixturesView({
  view,
  hrefFor,
}: {
  view: CupRoundView;
  hrefFor: (roundId: string) => string;
}) {
  return (
    <div className="flex flex-col gap-3 pb-4">
      <SegmentedControl
        label="Round"
        variant="brand"
        options={view.rounds.map((round) => ({
          key: round.id,
          label: round.label,
          active: round.id === view.round.id,
          href: hrefFor(round.id),
        }))}
      />

      {view.blocked ? (
        <p className="rounded-lg border border-current/10 bg-current/5 px-3 py-2 text-sm font-semibold text-fg-faint">
          {view.blocked}
        </p>
      ) : null}

      {view.groups.map((group) => (
        <section key={group.id} className="flex flex-col gap-2">
          <header>
            <h3 className="text-sm font-bold">{group.title}</h3>
            <p className="text-xs font-semibold text-fg-faint">{group.subtitle}</p>
          </header>
          <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {group.pairs.map((pair) => (
              <li key={pair.number} className="rounded-lg border border-current/10 bg-current/5 p-3">
                <div className="mb-2 flex items-center justify-between text-xs font-semibold text-fg-faint">
                  <span>Pair {pair.number}</span>
                  <span>{STATE_LABEL[pair.state]}</span>
                </div>
                <div className="flex flex-col gap-1 text-sm font-semibold">
                  {pair.legs.map((leg) => (
                    <Leg key={leg.id} leg={leg} />
                  ))}
                </div>
                <div className="mt-2 flex justify-between border-t border-current/10 pt-2 text-xs font-semibold text-fg-faint">
                  <span>Aggregate</span>
                  <span>{pair.aggregate ?? "– : –"}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}