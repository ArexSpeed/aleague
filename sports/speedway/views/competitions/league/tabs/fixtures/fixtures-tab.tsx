import { connection } from "next/server";
import { FixtureList } from "@/components/fixtures/fixture-list";
import { todayIso } from "@/lib/format";
import { getFixtures } from "@/sports/speedway/api/fixtures";
import type { FixtureWithTeams } from "@/sports/speedway/types/fixtures";
import { isPlayed, toGroups } from "../../fixture-cards";
import type { LeagueParams } from "../../search-params";
import { FixturesToolbar } from "./fixtures-toolbar";
import { RoundSimBar } from "./round-sim-bar";

export type FixtureFilter = "all" | "upcoming" | "recent";

function applyFilter(fixtures: FixtureWithTeams[], filter: FixtureFilter): FixtureWithTeams[] {
  const sorted = [...fixtures].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  if (filter === "upcoming") return sorted.filter((f) => !isPlayed(f));
  if (filter === "recent") return sorted.filter(isPlayed).reverse(); // newest first
  return sorted;
}

/** Fixtures tab: toolbar, then rounds with match cards. `filter` comes from your All / Upcoming / Recent toggle. */
export async function FixturesTab({ params }: { params: LeagueParams }) {
  const fixtures = await getFixtures(params.group);
  await connection();
  const today = todayIso();
  const groups = toGroups(applyFilter(fixtures, params.schedule), params, today);

  // First round that still has a match to play (for the test tool "Simulate round").
  const open = fixtures.filter((f) => !isPlayed(f)).map((f) => f.matchday);
  const nextRound = open.length > 0 ? Math.min(...open) : null;

  return (
    <div className="mt-1 min-w-0">
      {/* Here stays your toolbar with the All / Upcoming / Recent toggle. */}
      <FixturesToolbar params={params} />
      <RoundSimBar group={params.group} matchday={nextRound} />
      <FixtureList groups={groups} empty="Brak meczów" />
    </div>
  );
}
