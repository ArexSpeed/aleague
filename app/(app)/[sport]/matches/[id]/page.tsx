import { Suspense } from "react";

import { sportPath } from "@/lib/paths";
import { requireSport } from "@/sports/registry";
import type { RawSearchParams } from "@/sports/types";

type MatchRouteProps = {
  params: Promise<{ sport: string; id: string }>;
  searchParams: Promise<RawSearchParams>;
};

/** One route for every sport: /speedway/matches/md1-1. The view comes from the sport's module. */
export default function MatchRoute(props: MatchRouteProps) {
  return (
    <Suspense fallback={<div className="p-4 text-sm font-semibold opacity-60">Loading…</div>}>
      <MatchRouteContent {...props} />
    </Suspense>
  );
}

async function MatchRouteContent({ params, searchParams }: MatchRouteProps) {
  const { sport, id } = await params;
  const { config, MatchView } = requireSport(sport);

  return (
    <MatchView
      sport={config.id}
      matchId={id}
      basePath={sportPath(config.id, `matches/${id}`)}
      searchParams={searchParams}
    />
  );
}
