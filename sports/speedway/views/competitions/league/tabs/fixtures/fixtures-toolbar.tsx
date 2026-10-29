import { buildLeagueHref, type LeagueParams } from "@/sports/speedway/views/competitions/league/search-params";
import { FixturesToggle } from "@/components/toggle/fixtures-toggle";

type FixturesToolbarProps = {
  params: LeagueParams;
  matchday?: number;
  current?: number;
  total?: number;
};

/** Previous / "Kolejka N" (click = back to current) / next, plus the view toggle. */
export function FixturesToolbar({ params }: FixturesToolbarProps) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-2 py-1.5">
      <FixturesToggle value={params.schedule} hrefFor={(schedule) => buildLeagueHref(params, { schedule })} />
    </div>
  );
}