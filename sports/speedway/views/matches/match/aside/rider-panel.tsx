import Link from "next/link";

import { StatTile } from "@/components/data/stat-tile";
import { cn } from "@/lib/utils";
import type { Match } from "@/sports/speedway/types/match";
import { heatHref, riderHref, type MatchParams } from "../match-params";
import {
  findRider,
  isFinished,
  riderStarts,
  SIDES,
  sumBonus,
  sumPoints,
} from "../match-stats";
import { HELMETS, HelmetDot } from "../shared/helmet";
import { RunChip } from "../shared/run-chip";

/** Aside > Rider: one rider of this match (starts, points) and a switcher for the others. */
export function RiderPanel({ match, params }: { match: Match; params: MatchParams }) {
  const found = (params.rider && findRider(match, params.rider)) || findRider(match, match.squads.home[0]!.id);
  if (!found) return null;

  const { rider, side } = found;
  const team = match[side];
  const finished = isFinished(match);
  const starts = riderStarts(match, rider.id);
  const points = sumPoints(starts);
  const bonus = sumBonus(starts);
  const average = starts.length > 0 ? points / starts.length : 0;

  return (
    <div className="mt-3 space-y-3">
      <section className="rounded-2xl border border-line bg-surface p-3">
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand/10 text-sm font-black text-brand">
            #{rider.number}
          </span>
          <div className="flex min-w-0 flex-1 flex-col leading-tight">
            <span className="truncate text-sm font-black text-fg uppercase">
              {rider.firstName} {rider.lastName}
            </span>
            <span className="truncate text-[11px] font-semibold text-fg-faint">
              {rider.role} · {team.name}
            </span>
          </div>
          {finished ? (
            <span className="shrink-0 rounded-lg bg-brand px-2.5 py-1 text-sm font-black text-brand-foreground">
              {points}
              {bonus > 0 ? <sup className="ml-px text-[9px]">+{bonus}</sup> : null} pts
            </span>
          ) : null}
        </div>

        {finished ? (
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            <StatTile label="Heats" value={starts.length} />
            <StatTile label="Bonus" value={bonus > 0 ? `+${bonus}` : 0} />
            <StatTile label="Avg" value={average.toFixed(2)} />
          </div>
        ) : (
          <div className="mt-3 grid grid-cols-6 gap-1.5">
            <StatTile label="S" title="Start" value={rider.skills.start} />
            <StatTile label="T" title="Technique" value={rider.skills.technique} />
            <StatTile label="F" title="Form" value={rider.skills.form} />
            <StatTile label="R" title="Judgement" value={rider.skills.judgement} />
            <StatTile label="C" title="Character" value={rider.skills.character} />
            <StatTile label="AVG" value={rider.avgHeat.toFixed(2)} />
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-line bg-surface p-3">
        <h3 className="flex items-baseline justify-between text-[11px] font-black tracking-wider text-brand uppercase">
          Starts
          <span className="font-bold text-fg-faint normal-case">Helmet / gate</span>
        </h3>
        {finished && starts.length > 0 ? (
          <ul className="divide-y divide-line pt-1">
            {starts.map(({ heat, start }) => (
              <li key={heat}>
                <Link
                  href={heatHref(params, heat)}
                  scroll={false}
                  className="flex items-center gap-2 py-2 text-sm transition-colors hover:text-brand"
                >
                  <HelmetDot helmet={start.helmet} />
                  <span className="font-black text-fg">Heat {heat}</span>
                  <span className="text-xs text-fg-faint">
                    (Gate {start.gate}, {HELMETS[start.helmet].label})
                  </span>
                  <span className="ml-auto w-9">
                    <RunChip run={start} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="pt-2 text-xs font-semibold text-fg-faint">
            {finished ? "Did not start in this match." : "Starts appear once the match is played."}
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-line bg-surface p-3">
        <h3 className="text-[11px] font-black tracking-wider text-fg-faint uppercase">Switch rider</h3>
        {SIDES.map((s) => (
          <div key={s} className="pt-2">
            <p className="text-[11px] font-black text-brand uppercase">
              {match[s].name} ({s === "home" ? "home" : "away"})
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {match.squads[s].map((r) => (
                <Link
                  key={r.id}
                  href={riderHref(params, r.id)}
                  replace
                  scroll={false}
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-xs font-bold transition-colors",
                    r.id === rider.id
                      ? "bg-brand text-brand-foreground"
                      : "bg-fg/5 text-fg-muted hover:text-fg",
                  )}
                >
                  #{r.number} {r.lastName}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

