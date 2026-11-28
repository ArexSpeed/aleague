import { Suspense } from "react";

import { sportPath } from "@/lib/paths";
import { requireSport } from "@/sports/registry";
import { getCompetitionKind, type CompetitionKind } from "@/sports/speedway/competitions-config";
import { CompetitionSkeleton } from "@/sports/speedway/views/competitions/competition-skeleton";
import { LeaguePage } from "@/sports/speedway/views/competitions/league/league-page";
import { CupPage } from "@/sports/speedway/views/competitions/cup/cup-page";
import { TournamentsPage } from "@/sports/speedway/views/competitions/tournaments/tournaments-page";
import { IndividualPage } from "@/sports/speedway/views/competitions/individual/individual-page";
import type { RawSearchParams } from "@/sports/types";

type Props = {
  params: Promise<{ sport: string }>;
  searchParams: Promise<RawSearchParams>;
};

export default function CompetitionPage(props: Props) {
  return (
    <Suspense fallback={<div className="p-4 text-sm font-semibold opacity-60">Ładowanie…</div>}>
      <CompetitionContent {...props} />
    </Suspense>
  );
}

async function CompetitionContent({ params, searchParams }: Props) {
  const { sport } = await params;
  const { config } = requireSport(sport);
  const raw = await searchParams;
  const kindValue = typeof raw.kind === "string" ? raw.kind : undefined;
  const kind = getCompetitionKind(kindValue).id as CompetitionKind;
  const basePath = sportPath(config.id, "competitions");

  if (kind === "league" || kind === "nation") {
    return <LeaguePage sport={config.id} basePath={basePath} searchParams={Promise.resolve(raw)} />;
  }

  if (kind === "cup") {
    return <CupPage sport={config.id} basePath={basePath} searchParams={Promise.resolve(raw)} />;
  }

  if (kind === "tournaments") {
    return <TournamentsPage sport={config.id} basePath={basePath} searchParams={Promise.resolve(raw)} />;
  }

  if (kind === "individual") {
    return <IndividualPage sport={config.id} basePath={basePath} searchParams={Promise.resolve(raw)} />;
  }

  return <CompetitionSkeleton sport={config.id} kind={kind} searchParams={Promise.resolve(raw)} />;
}