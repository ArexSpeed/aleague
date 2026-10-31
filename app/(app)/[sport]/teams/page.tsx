import { Suspense } from "react";

import { sportPath } from "@/lib/paths";
import { requireSport } from "@/sports/registry";
import type { RawSearchParams } from "@/sports/types";

type TeamsRouteProps = {
  params: Promise<{ sport: string }>;
  searchParams: Promise<RawSearchParams>;
};

export default function TeamsRoute(props: TeamsRouteProps) {
  return (
    <Suspense fallback={<div className="p-4 text-sm font-semibold opacity-60">Loading…</div>}>
      <TeamsRouteContent {...props} />
    </Suspense>
  );
}

async function TeamsRouteContent({ params, searchParams }: TeamsRouteProps) {
  const { sport } = await params;
  const { config, TeamsView } = requireSport(sport);

  return (
    <TeamsView sport={config.id} basePath={sportPath(config.id, "teams")} searchParams={searchParams} />
  );
}
