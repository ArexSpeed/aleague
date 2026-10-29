import { notFound } from "next/navigation";
import { Suspense } from "react";

import { PagePlaceholder } from "@/components/layout/page-placeholder";
import { sportPath } from "@/lib/paths";
import { requireSport } from "@/sports/registry";
import type { RawSearchParams } from "@/sports/types";

type Props = {
  params: Promise<{ sport: string; type: string }>;
  searchParams: Promise<RawSearchParams>;
};

export default function CompetitionPage(props: Props) {
  return (
    <Suspense fallback={null}>
      <CompetitionContent {...props} />
    </Suspense>
  );
}

async function CompetitionContent({ params, searchParams }: Props) {
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