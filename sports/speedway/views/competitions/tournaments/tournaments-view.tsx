import Link from "next/link";
import { Info, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/layout/scroll-area";
import { TabNav } from "@/components/tabs/tab-nav";
import type { TournamentViewData } from "@/sports/speedway/api/tournaments";
import { BestThirdPlacedPanel } from "./best-third-placed-panel";
import {
  buildTournamentHref,
  type TournamentParams,
} from "./search-params";
import { TournamentGroupCard } from "./tournament-group-card";
import { TournamentsFilters } from "./tournaments-filters";

type Props = {
  params: TournamentParams;
  data: TournamentViewData | { isRegio: true } | null;
};

export function TournamentsView({ params, data }: Props) {
  const tabs = [
    {
      id: "rounds",
      label: "Rounds",
      href: buildTournamentHref(params, { tab: "rounds" }),
    },
  ];

  if (!data) {
    return (
      <>
        <TabNav label="Tournament sections" active={params.tab} tabs={tabs} />
        <ScrollArea>
          <TournamentsFilters params={params} />
          <div className="flex flex-1 items-center justify-center py-12 text-sm font-semibold text-fg-faint">
            Nie znaleziono turnieju
          </div>
        </ScrollArea>
      </>
    );
  }

  if ("isRegio" in data) {
    return (
      <>
        <TabNav label="Tournament sections" active={params.tab} tabs={tabs} />
        <ScrollArea>
          <TournamentsFilters params={params} />
          <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-line bg-surface p-8 text-center shadow-xs">
            <h3 className="text-base font-black text-fg uppercase tracking-tight">
              Regio Tournament
            </h3>
            <p className="mt-2 max-w-md text-xs font-semibold text-fg-muted">
              Turniej regionalny z udziałem 48 klubów w 8 grupach po 6 klubów według regionu.
              Terminarz, tabele i finały w osobnym zadaniu.
            </p>
          </div>
        </ScrollArea>
      </>
    );
  }

  return (
    <>
      <TabNav label="Tournament sections" active={params.tab} tabs={tabs} />
      <ScrollArea key={`${params.competition}-${params.round}`}>
        <TournamentsFilters params={params} rounds={data.rounds} />

        {/* Informative notice / preview toggle */}
        {data.pendingReason ? (
          <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-line bg-surface px-3 py-2.5 text-xs">
            <div className="flex items-center gap-2 text-fg-muted">
              <Info className="size-4 shrink-0 text-brand" aria-hidden />
              <span className="font-semibold">{data.pendingReason}</span>
            </div>
            <Link
              href={buildTournamentHref(params, { preview: !params.preview })}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-control px-2.5 py-1 text-[11px] font-bold text-fg transition-colors hover:bg-control-active"
            >
              <Sparkles className="size-3 text-brand" aria-hidden />
              <span>
                {params.preview ? "Pokaż placeholdery" : "Podgląd rozlosowanych grup"}
              </span>
            </Link>
          </div>
        ) : params.preview ? (
          <div className="mb-3.5 flex items-center justify-between rounded-xl border border-line bg-surface px-3 py-2 text-xs">
            <span className="font-semibold text-fg-muted">
              Tryb podglądu rozlosowania koszyków z ziarnem (dane demonstracyjne)
            </span>
            <Link
              href={buildTournamentHref(params, { preview: false })}
              className="rounded-lg border border-line bg-control px-2 py-0.5 text-[11px] font-bold text-fg hover:bg-control-active"
            >
              Wyłącz podgląd
            </Link>
          </div>
        ) : null}

        {/* Siatka kart grup */}
        <div
          className={
            data.activeRound.groupCount === 1
              ? "mx-auto max-w-xl"
              : "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          }
        >
          {data.groups.map((group) => (
            <TournamentGroupCard key={group.groupNumber} group={group} />
          ))}
        </div>

        {/* Best third-placed panel (Fours Round 1 only) */}
        {data.thirdPlacedRanking && data.activeRound.id === "r1" ? (
          <BestThirdPlacedPanel items={data.thirdPlacedRanking} />
        ) : null}
      </ScrollArea>
    </>
  );
}
