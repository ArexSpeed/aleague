import Link from "next/link";

import { TeamLogo } from "@/components/data/team-logo";
import { cn } from "@/lib/utils";
import type { FixtureStatus } from "./fixture-status";

export type FixtureCardTeam = {
  name: string;
  subName?: string;
  color: string;
  icon?: string;
  /** Where a click on the team goes (e.g. opens the team in the aside). Null = not a link. */
  href: string | null;
};

export type FixtureCardData = {
  id: string;
  home: FixtureCardTeam;
  away: FixtureCardTeam;
  /** null = not played yet. */
  score: { home: number; away: number } | null;
  status: FixtureStatus;
  /** Where a click on the score goes (match page). Null = no match page yet. */
  matchHref: string | null;
  /** Small caption under the score, e.g. "Leg 1". */
  label?: string;
};

const SCORE_TONE = {
  win: "bg-positive text-rank-on-light",
  loss: "bg-negative text-rank-on-dark",
  pending: "bg-fg/5 text-fg-muted",
} as const;

type ScoreTone = keyof typeof SCORE_TONE;

function scoreTones(score: FixtureCardData["score"]): [ScoreTone, ScoreTone] {
  if (!score) return ["pending", "pending"];
  if (score.home === score.away) return ["win", "win"]; // draw: both green
  return score.home > score.away ? ["win", "loss"] : ["loss", "win"];
}

function ScoreBox({ value, tone }: { value: number; tone: ScoreTone }) {
  return (
    <span
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-xl text-base font-black sm:h-14 sm:w-18",
        SCORE_TONE[tone],
      )}
    >
      {value}
    </span>
  );
}

function TeamSide({ team, align }: { team: FixtureCardTeam; align: "left" | "right" }) {
  const logo = <TeamLogo color={team.color} icon={team.icon} />;
  const name = (
    <span className={cn("flex min-w-0 flex-col leading-tight", align === "right" && "items-end text-right")}>
      <span className="max-w-full truncate text-sm font-black tracking-tight text-fg uppercase transition-colors group-hover:text-brand sm:text-base">
        {team.name}
      </span>
      {team.subName ? (
        <span className="max-w-full truncate text-[11px] font-bold text-fg-muted uppercase sm:text-base">
          {team.subName}
        </span>
      ) : null}
    </span>
  );

  const content =
    align === "left" ? (
      <>
        {logo}
        {name}
      </>
    ) : (
      <>
        {name}
        {logo}
      </>
    );
  const layout = cn("flex min-w-0 items-center gap-2 sm:gap-3", align === "right" && "justify-end");

  if (!team.href) return <div className={layout}>{content}</div>;
  return (
    <Link href={team.href} scroll={false} className={cn("group", layout)}>
      {content}
    </Link>
  );
}

/**
 * One match: logo - name | score + status | name - logo.
 * Click a team -> team link, click the score -> match link (both optional).
 */
export function FixtureCard({ fixture }: { fixture: FixtureCardData }) {
  const { home, away, score, matchHref, label } = fixture;
  const [homeTone, awayTone] = scoreTones(score);

  const scoreBlock = (
    <>
      <span className="flex items-center gap-1">
        <ScoreBox value={score?.home ?? 0} tone={homeTone} />
        <span className="font-black text-fg-faint">:</span>
        <ScoreBox value={score?.away ?? 0} tone={awayTone} />
      </span>
      {label ? (
        <span className="text-[10px] font-black tracking-wider text-fg-faint uppercase">{label}</span>
      ) : null}
    </>
  );

  return (
    <li className="grid grid-cols-[1fr_auto_1fr] items-center gap-1 rounded-xl border border-line bg-surface px-3 py-3 shadow-xs sm:gap-4 sm:px-5 sm:py-4">
      <TeamSide team={home} align="left" />

      {matchHref ? (
        <Link
          href={matchHref}
          aria-label={`Game report: ${home.name} ${home.subName ?? ""} - ${away.name} ${away.subName ?? ""}`}
          className="group flex flex-col items-center gap-1.5 transition-transform hover:scale-[1.03]"
        >
          {scoreBlock}
        </Link>
      ) : (
        <div className="flex flex-col items-center gap-1.5">{scoreBlock}</div>
      )}

      <TeamSide team={away} align="right" />
    </li>
  );
}