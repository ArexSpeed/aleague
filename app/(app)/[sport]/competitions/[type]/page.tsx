import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

import { PagePlaceholder } from "@/components/layout/page-placeholder";
import { competitionsHref, sportPath } from "@/lib/paths";
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

export async function CompetitionLegacyPage({ params, searchParams }: Props) {
  const { sport, type } = await params;
  const { config } = requireSport(sport);
  const raw = await searchParams;
  const round = typeof raw.round === "string" ? raw.round : undefined;
  const kind = (round ?? type).toLowerCase();

  const qs = new URLSearchParams();
  if (["league", "nation", "cup", "individual", "tournaments"].includes(kind)) {
    qs.set("kind", kind);
  }
  for (const key of ["group", "tab", "team", "match", "matchday", "panel", "view", "venue", "schedule", "metrics"] as const) {
    const value = raw[key];
    if (typeof value === "string" && value) qs.set(key, value);
  }

  const base = competitionsHref({ sport: config.id });
  redirect(qs.size ? `${base}?${qs}` : base);
}