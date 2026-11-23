import { cn } from "@/lib/utils";
import { ColorDot, PositionBadge, RowName } from "@/components/table/row-lead";
import type { TournamentGroupView } from "@/sports/speedway/api/tournaments";

type Props = {
  group: TournamentGroupView;
};

export function TournamentGroupCard({ group }: Props) {
  return (
    <div
      title="Coming soon"
      data-region="main"
      className="flex cursor-default flex-col overflow-hidden rounded-2xl border border-line bg-surface p-3.5 shadow-xs transition-colors hover:border-line"
    >
      {/* Group header */}
      <div className="mb-2.5 flex items-center justify-between border-b border-line pb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-fg uppercase tracking-tight">
            {group.groupLabel}
          </span>
        </div>
        <span className="rounded-md border border-line bg-control px-2 py-0.5 text-[10px] font-bold text-fg-muted uppercase">
          {group.clubs.length} Clubs
        </span>
      </div>

      {/* Clubs table */}
      <div className="flex flex-col gap-1">
        {/* Table header */}
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 px-1 text-[10px] font-extrabold uppercase text-fg-faint">
          <span className="w-6 text-center sm:w-7">#</span>
          <span>Club</span>
          <span className="w-8 text-right">Pts</span>
        </div>

        {/* Club rows */}
        <ol className="flex flex-col gap-1">
          {group.clubs.map((club) => {
            const isAdvancing = club.advancing;
            const isWildcard = club.wildcardEligible;

            return (
              <li
                key={club.clubId ?? `slot-${club.slot}`}
                className={cn(
                  "grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-xl px-1.5 py-1.5 transition-colors",
                  isAdvancing
                    ? "bg-surface-hover/50 font-bold"
                    : isWildcard
                      ? "bg-brand/5"
                      : "bg-surface",
                )}
              >
                {/* Position / Slot */}
                <div className="flex items-center gap-1">
                  <PositionBadge
                    value={club.rank ?? club.slot}
                    className={cn(
                      "text-[11px] font-black",
                      isAdvancing
                        ? "bg-rank-gold text-rank-on-light"
                        : isWildcard
                          ? "bg-rank-bronze text-rank-on-dark"
                          : "bg-chip text-chip-foreground",
                    )}
                  />
                </div>

                {/* Lead: dot + name */}
                <div className="flex min-w-0 items-center gap-2">
                  {club.clubId ? (
                    <>
                      <ColorDot color={club.color} />
                      <div className="min-w-0 flex-1">
                        <RowName
                          primary={club.name}
                          secondary={club.subName ?? club.short}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="size-4.5 shrink-0 rounded-full border border-dashed border-line bg-control sm:size-5" />
                      <span className="truncate text-xs font-semibold text-fg-muted">
                        {club.name}
                      </span>
                    </>
                  )}

                  {/* Advancing tags */}
                  {isAdvancing ? (
                    <span
                      title="Awans do kolejnej rundy"
                      className="ml-auto shrink-0 rounded bg-win/15 px-1 py-0.5 text-[10px] font-black text-win uppercase"
                    >
                      Q
                    </span>
                  ) : isWildcard ? (
                    <span
                      title="Potencjalna dzika karta z 3. miejsca"
                      className="ml-auto shrink-0 rounded bg-brand/15 px-1 py-0.5 text-[10px] font-black text-brand uppercase"
                    >
                      WC
                    </span>
                  ) : null}
                </div>

                {/* Points */}
                <div className="w-8 text-right text-xs font-black text-fg">
                  {club.points !== null ? club.points : "-"}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
