import type {
  IndividualTournamentStatus,
  IndividualTournamentView,
} from "@/sports/speedway/api/individual";
import type { IndividualParams } from "./search-params";

const STATUS_LABEL: Record<IndividualTournamentStatus, string> = {
  "not-started": "Not started",
  "in-progress": "In progress",
  finished: "Finished",
};

const keep = (tournament: IndividualTournamentView, schedule: IndividualParams["schedule"]) => {
  if (schedule === "upcoming") return tournament.status !== "finished";
  if (schedule === "recent") return tournament.status !== "not-started";
  return true;
};

/** One card per tournament of the cycle. The tournament page ("Coming soon") comes with the simulation. */
export function IndividualFixturesView({
  tournaments,
  params,
}: {
  tournaments: IndividualTournamentView[];
  params: IndividualParams;
}) {
  const shown = tournaments.filter((tournament) => keep(tournament, params.schedule));
  if (shown.length === 0) {
    return <p className="p-4 text-center text-sm font-semibold text-fg-faint">No tournaments here</p>;
  }

  return (
    <ul className="space-y-1.5 px-1 pb-1">
      {shown.map((tournament) => (
        <li
          key={tournament.id}
          className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-3 py-3"
        >
          <div className="min-w-0">
            <p className="text-sm font-bold">Tournament {tournament.tournament}</p>
            {params.view === "detailed" ? (
              <p className="text-xs font-semibold text-fg-muted">
                {tournament.heatsPlayed} / {tournament.heatsTotal} heats
              </p>
            ) : null}
          </div>
          <span className="shrink-0 rounded-md bg-fg/5 px-2 py-1 text-[11px] font-bold text-fg-muted">
            {STATUS_LABEL[tournament.status]}
          </span>
        </li>
      ))}
    </ul>
  );
}