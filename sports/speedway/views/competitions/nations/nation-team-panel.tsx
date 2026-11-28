import { TabNav } from "@/components/tabs/tab-nav";
import { InfoCard, InfoRow } from "@/components/data/info-card";
import { ResultBadge, type MatchResult } from "@/components/data/result-badge";
import { sportPath } from "@/lib/paths";
import type { LeagueTeam } from "@/sports/speedway/types/league";
import type { FixtureWithTeams } from "@/sports/speedway/types/fixtures";
import {
  getNationRiders,
  getNationTeamFixtures,
  type NationRider,
} from "@/sports/speedway/api/nations";
import { buildLeagueHref, type LeagueParams } from "@/sports/speedway/views/competitions/league/search-params";
import { PANEL_TABS, type PanelTab } from "@/sports/speedway/views/competitions/shared/aside/panel-tabs";

const PANEL_LABELS: Record<PanelTab, string> = {
  stats: "Stats",
  games: "Games",
  riders: "Riders",
  details: "Details",
};

function NationStats({ team }: { team: LeagueTeam }) {
  return (
    <InfoCard title="Nation stats">
      <InfoRow label="Position"><span className="text-brand">#{team.pos}</span></InfoRow>
      <InfoRow label="Games"><span>{team.games}</span></InfoRow>
      <InfoRow label="Points"><span>{team.points}</span></InfoRow>
      <InfoRow label="Won"><span className="text-win">{team.won}</span></InfoRow>
      <InfoRow label="Draw"><span>{team.draw}</span></InfoRow>
      <InfoRow label="Lost"><span className="text-loss">{team.lose}</span></InfoRow>
    </InfoCard>
  );
}

function resultOf(teamId: string, fixture: FixtureWithTeams): MatchResult {
  if (fixture.homeScore === null || fixture.awayScore === null) return "?";
  const own = fixture.homeId === teamId ? fixture.homeScore : fixture.awayScore;
  const opp = fixture.homeId === teamId ? fixture.awayScore : fixture.homeScore;
  return own > opp ? "W" : own < opp ? "L" : "D";
}

async function NationGames({ team, params }: { team: LeagueTeam; params: LeagueParams }) {
  const competition = nationCompetition(params.competition);
  const fixtures = await getNationTeamFixtures(team.id, competition);

  return (
    <section>
      <h3 className="mb-2 text-xs font-bold text-fg uppercase">Games: {team.name}</h3>
      <ul className="space-y-1.5">
        {fixtures.map((fixture) => {
          const home = fixture.homeId === team.id;
          const opponent = home ? fixture.away : fixture.home;
          const own = home ? fixture.homeScore : fixture.awayScore;
          const opp = home ? fixture.awayScore : fixture.homeScore;
          return (
            <li key={fixture.id}>
              <a href={sportPath(params.sport, `matches/${fixture.id}`)} className="flex items-center justify-between rounded-xl border border-line bg-surface p-2 text-xs text-fg">
                <div className="flex items-center gap-2"><ResultBadge result={resultOf(team.id, fixture)} /><span className="font-extrabold uppercase">{opponent.name}</span></div>
                <div className="font-black"><span>{own ?? 0}</span><span className="text-fg-faint"> : </span><span>{opp ?? 0}</span></div>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function NationRiders({ riders }: { riders: NationRider[] }) {
  return (
    <section>
      <h3 className="mb-2 text-xs font-bold text-fg uppercase">Riders</h3>
      <ul className="space-y-1.5">
        {riders.map((rider) => (
          <li key={rider.id} className="flex items-center justify-between rounded-xl border border-line bg-surface p-2 text-xs">
            <div><div className="font-black text-fg">{rider.name}</div><div className="text-fg-faint">{rider.role} · {rider.club}</div></div>
            <span className="font-black text-brand">{rider.age}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function NationDetails({ team }: { team: LeagueTeam }) {
  return (
    <InfoCard title="National team">
      <InfoRow label="Nation"><span className="font-bold">{team.name}</span></InfoRow>
      <InfoRow label="Code"><span className="font-mono text-positive">{team.short}</span></InfoRow>
      <InfoRow label="Home venue"><span>National Stadium</span></InfoRow>
    </InfoCard>
  );
}

type NationCompetition = "league" | "junior" | "games";

function nationCompetition(value: string | undefined): NationCompetition {
  return value === "junior" || value === "games" ? value : "league";
}

export async function NationTeamPanel({ team, params }: { team: LeagueTeam; params: LeagueParams }) {
  const competition = nationCompetition(params.competition);
  const riders = params.panel === "riders" ? await getNationRiders(team.id, competition) : [];

  return (
    <div className="flex flex-col select-none">
      <header className="flex shrink-0 items-center gap-2.5 pr-9 pb-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full text-sm shadow-md ring-1 ring-white/20" style={{ backgroundColor: team.color }}>
          {team.badgeIcon}
        </span>
        <div className="flex min-w-0 flex-col"><h2 className="truncate text-base font-black text-fg uppercase">{team.name}</h2><span className="text-[10px] font-bold text-fg-faint">{team.short}</span></div>
      </header>
      <TabNav variant="aside" label="Nation details" active={params.panel} tabs={PANEL_TABS.map((id) => ({ id, label: PANEL_LABELS[id], href: buildLeagueHref(params, { panel: id }) }))} />
      {params.panel === "stats" ? <NationStats team={team} /> : null}
      {params.panel === "games" ? <NationGames team={team} params={params} /> : null}
      {params.panel === "riders" ? <NationRiders riders={riders} /> : null}
      {params.panel === "details" ? <NationDetails team={team} /> : null}
    </div>
  );
}
