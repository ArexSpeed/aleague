import { FixtureCard, type FixtureCardData, type FixtureCardTeam } from "@/components/fixtures/fixture-card";
import { FixtureList, type FixtureGroupData } from "@/components/fixtures/fixture-list";
import { getFixtureStatus } from "@/components/fixtures/fixture-status";
import type {
  CupFixturesView as CupFixturesData,
  CupLegView,
  CupPairView,
  CupRoundBlock,
  CupTeamView,
} from "@/sports/speedway/api/cup";
import type { CupPairState } from "@/sports/speedway/types/cup";
import { buildCupHref, type CupParams } from "./search-params";

const STATE_LABEL: Record<CupPairState, string> = {
  pending: "Pending",
  "leg1-played": "Leg 1 played",
  decided: "Decided",
  "needs-runoff": "Run-off needed",
};

const PENDING_TEAM: FixtureCardTeam = { name: "Draw pending", color: "#334155", icon: "?", href: null };

function toTeam(team: CupTeamView | null, params: CupParams): FixtureCardTeam {
  if (!team) return PENDING_TEAM;
  return {
    name: team.name,
    subName: team.subName,
    color: team.color,
    icon: team.icon,
    href: buildCupHref(params, { team: team.clubId }),
  };
}

function toCard(leg: CupLegView, params: CupParams, today: string): FixtureCardData {
  const played = leg.score !== null;
  const draw = leg.score !== null && leg.score.home === leg.score.away;
  return {
    id: leg.id,
    home: toTeam(leg.home, params),
    away: toTeam(leg.away, params),
    score: leg.score,
    status: getFixtureStatus({ date: null, time: null, played, draw }, today),
    matchHref: leg.href,
    label: `Leg ${leg.leg}`,
  };
}

function keepPair(pair: CupPairView, schedule: CupParams["schedule"]): boolean {
  if (schedule === "upcoming") return pair.legs.some((leg) => leg.score === null);
  if (schedule === "recent") return pair.legs.some((leg) => leg.score !== null);
  return true;
}

function Pair({ pair, params, today }: { pair: CupPairView; params: CupParams; today: string }) {
  return (
    <li className="space-y-1.5 rounded-2xl border border-line bg-fg/5 p-1.5">
      <ul className="space-y-1.5">
        {pair.legs.map((leg) => (
          <FixtureCard key={leg.id} fixture={toCard(leg, params, today)} />
        ))}
      </ul>
      <div className="flex items-center justify-between gap-2 px-2 pb-0.5 text-[11px] font-black tracking-wider text-fg-faint uppercase">
        <span>
          Pair {pair.number} • {STATE_LABEL[pair.state]}
        </span>
        <span className="tabular-nums">{pair.aggregate ?? "– : –"}</span>
      </div>
    </li>
  );
}

function RoundContent({ round, params, today }: { round: CupRoundBlock; params: CupParams; today: string }) {
  const compact = params.view === "compact";
  return (
    <div className="space-y-4">
      {round.blocked ? (
        <p className="rounded-xl border border-line bg-control px-3 py-2 text-xs font-semibold text-fg-muted">
          {round.blocked}
        </p>
      ) : null}
      {round.groups.map((group) => (
        <section key={group.id} className="space-y-2">
          <header className="px-1">
            <h3 className="text-xs font-black text-fg-muted uppercase">{group.title}</h3>
            {compact ? null : <p className="text-[11px] font-semibold text-fg-faint">{group.subtitle}</p>}
          </header>
          <ul className="space-y-2">
            {group.pairs.map((pair) => (
              <Pair key={pair.number} pair={pair} params={params} today={today} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

/** Cup fixtures: rounds as FixtureList groups, place groups and pairs inside. */
export function CupFixturesView({
  view,
  params,
  today,
}: {
  view: CupFixturesData;
  params: CupParams;
  today: string;
}) {
  const filtered = view.rounds
    .map((round): CupRoundBlock => ({
      ...round,
      groups: round.groups
        .map((group) => ({ ...group, pairs: group.pairs.filter((pair) => keepPair(pair, params.schedule)) }))
        .filter((group) => group.pairs.length > 0),
    }))
    .filter((round) => round.groups.length > 0);

  // Newest round first for "Recent", like the league does with dates.
  const ordered = params.schedule === "recent" ? [...filtered].reverse() : filtered;

  const groups: FixtureGroupData[] = ordered.map((round) => ({
    id: round.id,
    title: round.label,
    content: <RoundContent round={round} params={params} today={today} />,
  }));

  return <FixtureList groups={groups} empty="No matches" />;
}