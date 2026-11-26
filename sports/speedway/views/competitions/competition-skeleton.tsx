import type { ReactNode } from "react";
import { ScrollArea } from "@/components/layout/scroll-area";
import { MasterDetail } from "@/components/layout/master-detail";
import { SegmentedControl } from "@/components/toggle/segmented-control";
import { TabNav } from "@/components/tabs/tab-nav";
import { competitionsHref } from "@/lib/paths";
import type { CompetitionKind } from "../../competitions-config";
import { COMPETITION_KINDS, getCompetitionKind } from "../../competitions-config";
import type { RawSearchParams } from "@/sports/types";

export async function CompetitionSkeleton({
  sport,
  kind,
  searchParams,
  children,
  aside,
}: {
  sport: "speedway";
  kind: CompetitionKind;
  searchParams: Promise<RawSearchParams>;
  children?: ReactNode;
  /** Optional detail pane (e.g. the cup's club panel). Without it the detail stays empty. */
  aside?: { detail: ReactNode; open: boolean; closeHref: string };
}) {
  const raw = await searchParams;
  const config = getCompetitionKind(kind);
  const base = `/${sport}/competitions`;
  const competitionRaw = typeof raw.competition === "string" ? raw.competition : undefined;
  const competitionLine = config.lines.find((line) => line.parameter === "competition");
  const competition = competitionLine?.options.some((item) => item.id === competitionRaw)
    ? competitionRaw
    : config.defaultParams.competition;
  const divisionRaw = typeof raw.division === "string" ? raw.division : undefined;
  const divisionLine = config.lines.find((line) => line.parameter === "division");
  const division = divisionLine?.options.some((item) => item.id === divisionRaw)
    ? divisionRaw
    : divisionLine?.options[0]?.id;
  const tab = config.tabs.some((item) => item.id === raw.tab)
    ? String(raw.tab)
    : config.defaultParams.tab;

  const countryRaw = typeof raw.country === "string" ? raw.country : undefined;
  const countryLine = config.lines.find((line) => line.parameter === "country");
  const country = countryLine?.options.some((item) => item.id === countryRaw)
    ? countryRaw
    : config.defaultParams.country;
  const categoryRaw = typeof raw.category === "string" ? raw.category : undefined;
  const categoryLine = config.lines.find((line) => line.parameter === "category");
  const category = categoryLine?.options.some((item) => item.id === categoryRaw)
    ? categoryRaw
    : categoryLine?.options[0]?.id;

  const firstLine = COMPETITION_KINDS.map((item) => ({
    id: item.id,
    label: item.label,
  }));

  const master = (
    <>
      {config.tabs.length > 0 ? (
        <TabNav
          label={`${config.label} sections`}
          active={tab}
          tabs={config.tabs.map((item) => ({
            id: item.id,
            label: item.label,
            href: competitionsHref({ sport, kind, competition, tab: item.id }),
          }))}
        />
      ) : null}
      <ScrollArea>
        <div className="mt-1 mb-0.5 flex shrink-0 flex-col gap-1">
          <div className="py-0.5">
            <SegmentedControl label="Competition kind" variant="brand" options={firstLine.map((item) => ({
              key: item.id,
              label: item.label,
              active: kind === item.id,
              href: competitionsHref({ sport, kind: item.id }),
            }))} />
          </div>
          {config.lines.map((line) => (
            line.dependsOn === "competition" && line.onlyWhen && line.onlyWhen !== competition ? null : (
              <div className="min-w-0 py-0.5" key={line.parameter}>
                <SegmentedControl
                  label={line.label}
                  variant="brand"
                  options={line.options.map((item) => ({
                    key: item.id,
                    label: item.label,
                    active:
                      line.parameter === "competition" ? competition === item.id :
                      line.parameter === "country" ? country === item.id :
                      line.parameter === "category" ? category === item.id :
                      division === item.id,
                    href: competitionsHref({
                      sport,
                      kind,
                      competition: line.parameter === "competition" ? item.id : competition,
                      country: line.parameter === "country" ? item.id : country,
                      category: line.parameter === "category" ? item.id : category,
                      division: line.parameter === "division" ? item.id : division,
                      tab,
                    }),
                  }))}
                />
              </div>
            )
          ))}
        </div>
        {children ?? (
          <div className="flex flex-1 items-center justify-center text-sm font-semibold text-fg-faint">
            No data yet
          </div>
        )}
      </ScrollArea>
    </>
  );

  return (
    <MasterDetail
      scrollMaster={false}
      detailOpen={aside?.open ?? false}
      closeHref={aside?.closeHref ?? base}
      master={master}
      detail={aside?.detail ?? null}
    />
  );
}
