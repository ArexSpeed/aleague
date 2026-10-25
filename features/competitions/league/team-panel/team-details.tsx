import type { ReactNode } from "react";

import type { LeagueTeam } from "@/types/league";

/**
 * Panel tab "Details". Stadium values are hardcoded placeholders copied from the
 * AI Studio mock. TODO: move to a stadium model once the data structure is settled.
 */
const STADIUM_PLACEHOLDER = {
  name: "Apex Speed Arena",
  trackLength: "372 m",
  trackRecord: "59.42 s (B. Zmarzlik)",
};

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex justify-between py-2">
      <dt className="text-slate-400">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export function TeamDetails({ team }: { team: LeagueTeam }) {
  return (
    <section className="space-y-2 rounded-2xl border border-white/5 bg-white/5 p-3 text-xs text-white">
      <h3 className="text-[10px] font-black tracking-wider text-brand uppercase">
        Informacje o klubie
      </h3>
      <dl className="divide-y divide-white/5 text-[11px]">
        <Row label="Pełna nazwa">
          <span className="font-bold">
            {team.name} {team.subName}
          </span>
        </Row>
        <Row label="Skrót klubowy">
          <span className="font-mono font-bold text-positive">{team.short}</span>
        </Row>
        <Row label="Aktualne miejsce">
          <span className="font-black text-brand">#{team.pos}</span>
        </Row>
        <Row label="Stadion domowy">
          <span className="font-semibold">{STADIUM_PLACEHOLDER.name}</span>
        </Row>
        <Row label="Długość toru">
          <span className="font-mono font-semibold">{STADIUM_PLACEHOLDER.trackLength}</span>
        </Row>
        <Row label="Rekord toru">
          <span className="font-mono font-bold text-amber-400">
            {STADIUM_PLACEHOLDER.trackRecord}
          </span>
        </Row>
      </dl>
    </section>
  );
}
