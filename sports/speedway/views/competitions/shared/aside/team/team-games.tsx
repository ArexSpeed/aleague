import { House, Plane } from "lucide-react";
import Link from "next/link";

import { ResultBadge, type MatchResult } from "@/components/data/result-badge";
import type { ClubPanelGame } from "@/sports/speedway/api/club-panel";

function resultOf(score: ClubPanelGame["score"]): MatchResult {
  if (!score) return "?";
  return score.for > score.against ? "W" : score.for < score.against ? "L" : "D";
}

/** One match from the club's point of view: round, home/away, result, opponent, score. */
function GameRow({ game }: { game: ClubPanelGame }) {
  const result = resultOf(game.score);
  const VenueIcon = game.home ? House : Plane;

  const ownTone = result === "W" ? "text-win" : result === "?" ? "text-fg-faint" : "text-fg";
  const oppTone = result === "L" ? "text-loss" : result === "D" ? "text-fg" : "text-fg-faint";

  return (
    <li>
      <Link
        href={game.href}
        className="flex items-center justify-between rounded-xl border border-line bg-surface p-2 text-xs text-fg transition-colors hover:bg-surface-hover"
      >
        <div className="flex min-w-0 items-center gap-2">
          <span className="min-w-7 text-[10px] font-black text-fg-faint">{game.label}</span>
          <VenueIcon className="size-3.5 shrink-0 text-fg-faint" aria-label={game.home ? "Home" : "Away"} />
          <ResultBadge result={result} />
          <span className="truncate font-extrabold uppercase">{game.opponent}</span>
        </div>
        <div className="flex items-center gap-1 text-xs font-black">
          <span className={ownTone}>{game.score?.for ?? 0}</span>
          <span className="text-fg-faint">:</span>
          <span className={oppTone}>{game.score?.against ?? 0}</span>
        </div>
      </Link>
    </li>
  );
}

type TeamGamesProps = {
  title: string;
  /** Counter on the right, e.g. "18 rounds". */
  countLabel: string;
  games: ClubPanelGame[];
};

/** Panel tab "Games": every match of the club in the chosen competition. */
export function TeamGames({ title, countLabel, games }: TeamGamesProps) {
  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xs font-bold tracking-wider text-fg uppercase">{title}</h3>
        <span className="text-[10px] font-bold text-brand">{countLabel}</span>
      </div>

      {games.length > 0 ? (
        <ul className="space-y-1.5 py-1">
          {games.map((game) => (
            <GameRow key={game.id} game={game} />
          ))}
        </ul>
      ) : (
        <p className="px-1 text-xs font-semibold text-fg-faint">No matches yet.</p>
      )}
    </section>
  );
}