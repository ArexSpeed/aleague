import { cn } from "@/lib/utils";
import { ColorDot, PositionBadge, RowName } from "@/components/table/row-lead";
import type { ThirdPlacedViewItem } from "@/sports/speedway/api/tournaments";

type Props = {
  items: ThirdPlacedViewItem[];
};

export function BestThirdPlacedPanel({ items }: Props) {
  return (
    <section
      data-region="main"
      className="mt-6 rounded-2xl border border-line bg-surface p-4 shadow-xs"
    >
      {/* Header */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-fg uppercase tracking-tight">
            Best third-placed
          </span>
          <span className="rounded-md border border-line bg-control px-2 py-0.5 text-[10px] font-bold text-fg-muted uppercase">
            12 Clubs
          </span>
        </div>
        <span className="text-xs font-semibold text-fg-muted">
          8 najlepszych klubów z 3. miejsc awansuje do Round 2 (dzikie karty)
        </span>
      </div>

      {/* Table */}
      <div className="flex flex-col gap-1">
        {/* Table header */}
        <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 px-2 text-[10px] font-extrabold uppercase text-fg-faint">
          <span className="w-6 text-center sm:w-7">#</span>
          <span>Club</span>
          <span className="w-16 text-center">Group</span>
          <span className="w-12 text-right">Pts</span>
        </div>

        {/* Rows */}
        <ol className="flex flex-col">
          {items.map((item, index) => {
            const isCutoff = index === 7; // Cut-off line after 8th place (index 7)
            const isWildcard = item.wildcard;

            return (
              <div key={item.clubId ?? `third-${item.groupNumber}`}>
                <li
                  className={cn(
                    "grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 rounded-xl px-2 py-1.5 transition-colors",
                    isWildcard
                      ? "bg-surface-hover/40 font-semibold"
                      : "bg-surface text-fg-muted",
                  )}
                >
                  {/* Rank */}
                  <PositionBadge
                    value={item.rank}
                    className={cn(
                      "text-[11px] font-black",
                      isWildcard
                        ? "bg-rank-bronze text-rank-on-dark"
                        : "bg-chip text-chip-foreground",
                    )}
                  />

                  {/* Club lead */}
                  <div className="flex min-w-0 items-center gap-2">
                    {item.clubId ? (
                      <>
                        <ColorDot color={item.color ?? "#888888"} />
                        <div className="min-w-0 flex-1">
                          <RowName primary={item.name} secondary={item.subName} />
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="size-4.5 shrink-0 rounded-full border border-dashed border-line bg-control sm:size-5" />
                        <span className="truncate text-xs font-semibold text-fg-muted">
                          {item.name}
                        </span>
                      </>
                    )}

                    {isWildcard ? (
                      <span
                        title="Awans jako dzika karta"
                        className="ml-auto shrink-0 rounded bg-win/15 px-1.5 py-0.5 text-[10px] font-black text-win uppercase"
                      >
                        Q Wildcard
                      </span>
                    ) : null}
                  </div>

                  {/* Group origin */}
                  <div className="w-16 text-center text-xs font-bold text-fg-muted">
                    Gr. {item.groupNumber}
                  </div>

                  {/* Points */}
                  <div className="w-12 text-right text-xs font-black text-fg">
                    {item.points !== null ? item.points : "-"}
                  </div>
                </li>

                {/* Prominent cutoff separator between rank 8 and 9 */}
                {isCutoff ? (
                  <div className="my-2 flex items-center gap-2 px-2 py-1">
                    <div className="h-px flex-1 bg-positive/40" />
                    <span className="rounded-full border border-positive/30 bg-positive/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-positive">
                      ▲ Awansują do Round 2 (Cut-off)
                    </span>
                    <div className="h-px flex-1 bg-positive/40" />
                  </div>
                ) : null}
              </div>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
