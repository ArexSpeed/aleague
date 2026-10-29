import { InfoCard, InfoRow } from "@/components/data/info-card";
import type { LeagueTeam } from "@/sports/speedway/types/league";

/**
 * Panel tab "Details". Stadium values are hardcoded placeholders copied from the
 * AI Studio mock. TODO: move to a stadium model once the data structure is settled.
 */
const STADIUM_PLACEHOLDER = {
  name: "Apex Speed Arena",
  trackLength: "372 m",
  trackRecord: "59.42 s (B. Zmarzlik)",
};

export function TeamDetails({ team }: { team: LeagueTeam }) {
  return (
    <InfoCard title="Informacje o klubie">
      <InfoRow label="Pełna nazwa">
        <span className="font-bold">
          {team.name} {team.subName}
        </span>
      </InfoRow>
      <InfoRow label="Skrót klubowy">
        <span className="font-mono font-bold text-positive">{team.short}</span>
      </InfoRow>
      <InfoRow label="Aktualne miejsce">
        <span className="font-black text-brand">#{team.pos}</span>
      </InfoRow>
      <InfoRow label="Stadion domowy">{STADIUM_PLACEHOLDER.name}</InfoRow>
      <InfoRow label="Długość toru">
        <span className="font-mono">{STADIUM_PLACEHOLDER.trackLength}</span>
      </InfoRow>
      <InfoRow label="Rekord toru">
        <span className="font-mono font-bold text-warning">{STADIUM_PLACEHOLDER.trackRecord}</span>
      </InfoRow>
    </InfoCard>
  );
}
