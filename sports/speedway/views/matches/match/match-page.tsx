import { notFound } from "next/navigation";
import { Suspense } from "react";

import { MasterDetail } from "@/components/layout/master-detail";
import { getMatch } from "@/sports/speedway/api/match";
import type { MatchViewProps } from "@/sports/types";
import { MatchAside } from "./aside/match-aside";
import { LineupProvider } from "./lineup/lineup-provider";
import { MatchView } from "./match-view";
import { buildMatchHref, isAsideOpen, parseMatchParams } from "./match-params";

/**
 * Speedway > Match (/speedway/matches/<id>).
 * Master part = Info / Squads / Heats / Stats tabs. Detail part = match report aside.
 */
export function MatchPage(props: MatchViewProps) {
  return (
    <Suspense fallback={<div className="p-4 text-sm font-semibold opacity-60">Loading…</div>}>
      <MatchContent {...props} />
    </Suspense>
  );
}

async function MatchContent({ sport, matchId, basePath, searchParams }: MatchViewProps) {
  const match = await getMatch(matchId);
  if (!match) notFound();

  const params = parseMatchParams(await searchParams, basePath, sport, matchId);

  return (
    <LineupProvider
      matchId={match.id}
      teams={{ home: match.home, away: match.away }}
      roster={match.roster}
    >
      <MasterDetail
        scrollMaster={false}
        detailOpen={isAsideOpen(params)}
        closeHref={buildMatchHref(params, { panel: undefined, rider: undefined, heat: undefined })}
        master={<MatchView match={match} params={params} sport={sport} />}
        detail={<MatchAside match={match} params={params} />}
      />
    </LineupProvider>
  );
}
