import Link from "next/link";

import { formatBilans } from "@/sports/speedway/views/competitions/league/standings";
import type { CupTeamDetail, CupTeamGame } from "@/sports/speedway/api/cup";

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-xl bg-fg/5 px-2 py-2">
      <span className="text-sm font-black text-fg tabular-nums">{value}</span>
      <span className="text-[10px] font-bold tracking-wider text-fg-faint uppercase">{label}</span>
    </div>
  );
}

function resultTone(score: CupTeamGame["score"]): string {
  if (!score || score.for === score.against) return "text-fg";
  return score.for > score.against ? "text-win" : "text-loss";
}

function Game({ game }: { game: CupTeamGame }) {
  return (
    <li>
      <Link
        href={game.href}
        className="flex items-center justify-between gap-2 rounded-lg bg-surface px-3 py-2 text-xs shadow-xs transition-colors hover:bg-surface-hover"
      >
        <span className="flex min-w-0 flex-col leading-tight">
          <span className="text-[10px] font-black tracking-wider text-fg-faint uppercase">
            {game.round} • Leg {game.leg} • {game.home ? "Home" : "Away"}
          </span>
          <span className="truncate font-extrabold text-fg uppercase">
            {game.opponent.name} {game.opponent.subName ?? ""}
          </span>
        </span>
        <span className={`shrink-0 text-sm font-black tabular-nums ${resultTone(game.score)}`}>
          {game.score ? `${game.score.for}:${game.score.against}` : "–"}
        </span>
      </Link>
    </li>
  );
}

/** Detail pane for a cup club: header like the league's team panel, then cup numbers and cup matches. */
export function CupTeamPanel({ detail }: { detail: CupTeamDetail }) {
  const { team, row, games } = detail;
  const place = row.decided && row.place !== null ? row.place : (row.rangeLabel ?? "–");

  return (
    <div className="flex flex-col gap-4 select-none">
      <header className="flex shrink-0 items-center gap-2.5 pr-9">
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-sm shadow-md ring-1 ring-white/20"
          style={{ backgroundColor: team.color }}
        >
          <span className="drop-shadow">{team.icon}</span>
        </span>
        <div className="flex min-w-0 flex-col">
          <h2 className="truncate text-base font-black tracking-wide text-fg uppercase sm:text-lg">
            {team.name}
          </h2>
          <span className="truncate text-[10px] font-bold text-fg-faint uppercase">{team.short}</span>
        </div>
      </header>

      <section aria-label="Cup numbers" className="grid grid-cols-4 gap-1.5">
        <Stat label="Place" value={place} />
        <Stat label="M" value={row.games} />
        <Stat label="W" value={row.won} />
        <Stat label="D" value={row.draw} />
        <Stat label="L" value={row.lost} />
        <Stat label="Pts+" value={row.pointsPlus} />
        <Stat label="Pts-" value={row.pointsMinus} />
        <Stat label="+/-" value={formatBilans(row.bilans)} />
      </section>

      <section aria-label="Cup matches" className="space-y-1.5">
        <h3 className="px-1 text-[11px] font-black tracking-wider text-fg-faint uppercase">Matches</h3>
        {games.length > 0 ? (
          <ul className="space-y-1.5">
            {games.map((game) => (
              <Game key={game.id} game={game} />
            ))}
          </ul>
        ) : (
          <p className="px-1 text-xs font-semibold text-fg-faint">No drawn matches yet.</p>
        )}
      </section>
    </div>
  );
}