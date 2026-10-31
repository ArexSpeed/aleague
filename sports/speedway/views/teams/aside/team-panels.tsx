import { InfoCard, InfoRow } from "@/components/data/info-card";
import { StatTile } from "@/components/data/stat-tile";
import { getTeamRiders } from "@/sports/speedway/api/league";
import type { TeamEntry } from "@/sports/speedway/types/teams";
import { TrophyCase } from "../clubs/trophy-case";

export function InfoPanel({ team }: { team: TeamEntry }) {
  const { stadium } = team;
  return (
    <div className="space-y-3">
      <InfoCard title="Stadium & track">
        <InfoRow label="Stadium">{stadium.name}</InfoRow>
        <InfoRow label="Capacity">{stadium.capacity.toLocaleString("en-US")}</InfoRow>
        <InfoRow label="Track length">
          <span className="text-brand">{stadium.trackLength} m</span>
        </InfoRow>
        <InfoRow label="Surface">{stadium.surface}</InfoRow>
        <InfoRow label="Track record">
          <span className="text-win">
            {stadium.record.time.toFixed(2)} s ({stadium.record.rider}, {stadium.record.year})
          </span>
        </InfoRow>
      </InfoCard>

      <InfoCard title="Staff & board">
        <InfoRow label="Coach">{team.coach}</InfoRow>
        <InfoRow label="President">{team.president}</InfoRow>
        <InfoRow label="Founded">{team.founded}</InfoRow>
      </InfoCard>

      <section className="space-y-2 rounded-2xl border border-line bg-surface p-3 text-fg">
        <h3 className="text-[10px] font-black tracking-wider text-brand uppercase">
          About the {team.kind === "club" ? "club" : "team"}
        </h3>
        <p className="text-xs leading-relaxed font-medium text-fg-muted">{team.description}</p>
      </section>
    </div>
  );
}

/** Squad of the club (league riders for now; a national squad has no data yet). */
export async function RidersPanel({ team }: { team: TeamEntry }) {
  const riders = (await getTeamRiders(team.id)).sort((a, b) => b.avgHeat - a.avgHeat);

  if (riders.length === 0) {
    return <p className="pt-4 text-center text-sm font-semibold text-fg-faint">Squad not announced yet</p>;
  }

  return (
    <ul className="space-y-1.5">
      {riders.map((rider) => (
        <li
          key={rider.id}
          className="flex items-center gap-3 rounded-xl border border-line bg-surface px-3 py-2"
        >
          <span className="flex min-w-0 flex-1 flex-col leading-tight">
            <span className="truncate text-sm font-black text-fg uppercase">
              {rider.firstName} {rider.lastName}
            </span>
            <span className="truncate text-[11px] font-semibold text-fg-faint">{rider.role}</span>
          </span>
          <span className="rounded-md bg-fg/5 px-2 py-1 text-[11px] font-black text-fg-muted">
            AVG {rider.avgHeat.toFixed(2)}
          </span>
          <span className="rounded-md bg-brand px-2 py-1 text-[11px] font-black text-brand-foreground">
            {rider.points} pts
          </span>
        </li>
      ))}
    </ul>
  );
}

export function StatsPanel({ team }: { team: TeamEntry }) {
  const { stats } = team;
  return (
    <div className="grid grid-cols-2 gap-2">
      <StatTile label="Win rate" value={`${team.winRate.toFixed(1)}%`} />
      <StatTile label="Heats 3:3+" title="Heats ended 3:3 or better" value={`${stats.heatWins33.toFixed(1)}%`} />
      <StatTile label="Avg match" value={stats.avgMatch.toFixed(1)} />
      <StatTile label="Clean heats" title="Heats won 5:1" value={stats.cleanHeats} />
      <StatTile label="Falls" value={stats.falls} tone={stats.falls > 0 ? "negative" : "default"} />
    </div>
  );
}

export function HistoryPanel({ team }: { team: TeamEntry }) {
  return (
    <div className="space-y-3">
      <TrophyCase trophies={team.trophies} large />
      <ul className="divide-y divide-line rounded-2xl border border-line bg-surface px-3">
        {team.history.map((item) => (
          <li key={`${item.year}-${item.title}`} className="flex items-center gap-3 py-2.5 text-sm">
            <span className="w-10 shrink-0 font-black text-brand">{item.year}</span>
            <span className="min-w-0 flex-1 truncate font-semibold text-fg">{item.title}</span>
            <span className="shrink-0 text-xs font-bold text-fg-muted">{item.result}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
