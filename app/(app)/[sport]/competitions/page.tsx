import { notFound } from "next/navigation";
import { Suspense } from "react";

import { PagePlaceholder } from "@/components/layout/page-placeholder";
import { sportPath } from "@/lib/paths";
import { requireSport, SPORT_IDS } from "@/sports/registry";
import type { RawSearchParams } from "@/sports/types";

type CompetitionPageProps = {
  params: Promise<{ sport: string; type: string }>;
  searchParams: Promise<RawSearchParams>;
};

/** Every sport x competition type is known at build time. */
export function generateStaticParams() {
  return SPORT_IDS.flatMap((sport) =>
    requireSport(sport).config.competitions.map((c) => ({ sport, type: c.type })),
  );
}

/**
 * One route for every sport and competition type:
 *   /speedway/competitions/league, /skijump/competitions/individual, ...
 * params are runtime data, so they are read inside Suspense (the static shell renders the fallback).
 */
export default function CompetitionPage(props: CompetitionPageProps) {
  return (
    <Suspense fallback={<div className="p-4 text-sm font-semibold opacity-60">Ładowanie…</div>}>
      <CompetitionContent {...props} />
    </Suspense>
  );
}

async function CompetitionContent({ params, searchParams }: CompetitionPageProps) {
  const { sport, type } = await params;
  const { config, competitionViews } = requireSport(sport);

  const competition = config.competitions.find((c) => c.type === type);
  if (!competition) notFound();

  const View = competitionViews[competition.type];
  if (!View) {
    return <PagePlaceholder title={competition.label} hint="Ten widok jest jeszcze w przygotowaniu" />;
  }

  return (
    <View
      sport={config.id}
      basePath={sportPath(config.id, `competitions/${competition.type}`)}
      searchParams={searchParams}
    />
  );
}