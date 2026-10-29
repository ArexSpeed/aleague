import { cn } from "@/lib/utils";
import { speedwayConfig } from "@/sports/speedway/config";
import type { LeagueRider, LeagueTeam } from "@/sports/speedway/types/league";
import type { Venue } from "@/sports/speedway/views/competitions/league/search-params";
import { getRiderStats } from "@/sports/speedway/views/competitions/league/standings";

function rankClass(index: number): string {
  if (index === 0) return "bg-rank-gold text-rank-on-light";
  if (index === 1) return "bg-rank-silver text-rank-on-light";
  if (index === 2) return "bg-rank-bronze text-rank-on-dark";
  return "bg-surface-hover text-fg";
}

/** Panel tab "Riders": the team's squad, sorted by heat average for the chosen venue. */
export function TeamRiders({
  team,
  riders,
  venue,
}: {
  team: LeagueTeam;
  riders: LeagueRider[];
  venue: Venue;
}) {
  const sorted = [...riders].sort(
    (a, b) => getRiderStats(b, venue).avgHeat - getRiderStats(a, venue).avgHeat,
  );

  return (
    <section>
      <div className="flex items-center justify-between border-b border-line px-1.5 py-1 text-[10px] font-extrabold tracking-wider text-fg-faint uppercase">
        <div className="flex items-center gap-1.5">
          <span className="w-5 text-center font-bold">#</span>
          <span>{speedwayConfig.labels.participant}</span>
        </div>
        <div className="flex items-center gap-1 text-center font-bold">
          <span className="w-4">M</span>
          <span className="w-4">H</span>
          <span className="w-6">AM</span>
          <span className="w-7 font-black text-brand">AH</span>
          <span className="w-4">B</span>
          <span className="w-6 text-fg">Pts</span>
        </div>
      </div>

      <ul className="space-y-1.5 py-2">
        {sorted.map((rider, index) => {
          const stats = getRiderStats(rider, venue);
          return (
            <li
              key={rider.id}
              className="flex items-center justify-between rounded-xl border border-line bg-surface p-1.5 text-fg shadow-xs transition-colors hover:bg-surface-hover"
            >
              <div className="flex min-w-0 items-center gap-2 pr-1">
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-md text-[10px] font-black shadow-xs",
                    rankClass(index),
                  )}
                >
                  {index + 1}
                </span>
                <span
                  className="flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] shadow-xs"
                  style={{ backgroundColor: rider.teamColor }}
                >
                  {rider.teamIcon}
                </span>
                <span className="flex min-w-0 flex-col truncate text-[11px] leading-tight font-extrabold tracking-tight uppercase">
                   <span className="truncate text-[9px] font-semibold text-fg-faint">
                    {rider.firstName}
                  </span>
                  <span className="truncate">{rider.lastName}</span>
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-1 text-[10px] font-semibold text-fg-muted">
                <span className="w-4 text-center">{stats.matches}</span>
                <span className="w-4 text-center">{stats.heats}</span>
                <span className="w-6 text-center">{stats.avgMatch.toFixed(2)}</span>
                <span className="w-7 text-center font-black text-brand">
                  {stats.avgHeat.toFixed(3)}
                </span>
                <span className="w-4 text-center">{stats.bonus}</span>
                <span className="flex h-5 w-6 items-center justify-center rounded-md bg-brand font-black text-brand-foreground shadow-xs">
                  {stats.points}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
