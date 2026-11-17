import { getClubCards, getNations } from "@/sports/speedway/api/teams";
import { cn } from "@/lib/utils";
import type { ClubCardData } from "@/sports/speedway/types/teams";
import {
  buildTeamsHref,
  CLUB_LEAGUE_ORDER,
  DIVISION_LABELS,
  type TeamsParams,
} from "../teams-params";
import { ClubCard } from "./club-card";
import { NationCard } from "./nation-card";
import { TeamsToolbar } from "./teams-toolbar";

/** Clubs and Nations tabs: the same toolbar and grid, different list. */
export async function TeamsTab({ params }: { params: TeamsParams }) {
  const detailed = params.view === "detailed";

  if (params.tab === "clubs") {
    const league = params.division === "all" ? "all" : params.division;
    const entries = (await getClubCards(league)).filter((club) => {
      const haystack = [club.name, club.subName, club.short, club.fullName, club.region, club.city, club.leagueLabel]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return !params.q || haystack.includes(params.q.toLowerCase());
    });

    const renderCards = (clubs: ClubCardData[]) => (
      <ul
        className={cn(
          "grid gap-3",
          detailed
            ? "grid-cols-1 lg:grid-cols-2"
            : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
        )}
      >
        {clubs.map((club) => (
          <li key={club.id}>
            <ClubCard
              club={club}
              detailed={detailed}
              selected={params.team === club.id}
              href={buildTeamsHref(params, { team: club.id })}
              showLeague={params.division === "all"}
            />
          </li>
        ))}
      </ul>
    );

    return (
      <div className="pb-3">
        <TeamsToolbar params={params} count={entries.length} />

        {entries.length === 0 ? (
          <p className="p-6 text-center text-sm font-semibold text-fg-faint">No clubs in this league</p>
        ) : params.division === "all" ? (
          <div className="mt-3 space-y-5">
            {CLUB_LEAGUE_ORDER.map((leagueId) => {
              const clubs = entries.filter((club) => club.leagueId === leagueId);
              if (clubs.length === 0) return null;
              return (
                <section key={leagueId}>
                  <h2 className="mb-2 text-xs font-black tracking-wider text-fg-muted uppercase">
                    {DIVISION_LABELS[leagueId]}
                  </h2>
                  {renderCards(clubs)}
                </section>
              );
            })}
          </div>
        ) : (
          <div className="mt-3">{renderCards(entries)}</div>
        )}
      </div>
    );
  }

  const entries = (await getNations()).filter((nation) =>
    !params.q || `${nation.name} ${nation.code}`.toLowerCase().includes(params.q.toLowerCase()),
  );

  return (
    <div className="pb-3">
      <TeamsToolbar params={params} count={entries.length} />

      {entries.length === 0 ? (
        <p className="p-6 text-center text-sm font-semibold text-fg-faint">Nothing found</p>
      ) : (
        <ul
          className={cn(
            "mt-3 grid gap-3",
            detailed
              ? "grid-cols-1 lg:grid-cols-2"
              : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
          )}
        >
          {entries.map((nation) => (
            <li key={nation.id}>
              <NationCard
                nation={nation}
                detailed={detailed}
                selected={params.team === nation.id}
                href={buildTeamsHref(params, { team: nation.id })}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
