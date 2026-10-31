import { getTeamEntries } from "@/sports/speedway/api/teams";
import { cn } from "@/lib/utils";
import { buildTeamsHref, matchesSearch, type TeamsParams } from "../teams-params";
import { TeamCard } from "./team-card";
import { TeamsToolbar } from "./teams-toolbar";

/** Clubs and Nations tabs: the same toolbar and grid, different list. */
export async function TeamsTab({ params }: { params: TeamsParams }) {
  const kind = params.tab === "nations" ? "nation" : "club";
  const entries = (await getTeamEntries(kind)).filter(
    (entry) =>
      (kind === "nation" || params.division === "all" || entry.division === params.division) &&
      matchesSearch(entry, params.q),
  );
  const detailed = params.view === "detailed";

  return (
    <div className="pb-3">
      <TeamsToolbar params={params} count={entries.length} />

      {entries.length === 0 ? (
        <p className="p-6 text-center text-sm font-semibold text-fg-faint">Nothing found</p>
      ) : (
        <ul className={cn("mt-3 grid gap-3", detailed ? "xl:grid-cols-2" : "sm:grid-cols-2")}>
          {entries.map((team) => (
            <li key={team.id}>
              <TeamCard
                team={team}
                detailed={detailed}
                selected={params.team === team.id}
                href={buildTeamsHref(params, { team: team.id })}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
