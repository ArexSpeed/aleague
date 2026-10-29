import { connection } from "next/server";
import { FixtureList, type FixtureGroupData } from "@/components/fixtures/fixture-list";
import type { FixtureCardData } from "@/components/fixtures/fixture-card";
import { getFixtureStatus } from "@/components/fixtures/fixture-status";
import { formatDate, todayIso } from "@/lib/format";
import { sportPath } from "@/lib/paths";
import { getFixtures } from "@/sports/speedway/api/fixtures";
import type { FixtureWithTeams } from "@/sports/speedway/types/fixtures";
import { buildLeagueHref, type LeagueParams } from "../../search-params";
import { FixturesToolbar } from "./fixtures-toolbar";

export type FixtureFilter = "all" | "upcoming" | "recent";

const isPlayed = (f: FixtureWithTeams) => f.homeScore !== null && f.awayScore !== null;

function applyFilter(fixtures: FixtureWithTeams[], filter: FixtureFilter): FixtureWithTeams[] {
  const sorted = [...fixtures].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  if (filter === "upcoming") return sorted.filter((f) => !isPlayed(f));
  if (filter === "recent") return sorted.filter(isPlayed).reverse(); // newest first
  return sorted;
}

function toCard(f: FixtureWithTeams, params: LeagueParams, today: string): FixtureCardData {
  const score =
    f.homeScore !== null && f.awayScore !== null ? { home: f.homeScore, away: f.awayScore } : null;

  return {
    id: f.id,
    home: {
      name: f.home.name,
      subName: f.home.subName,
      color: f.home.color,
      icon: f.home.badgeIcon,
      href: buildLeagueHref(params, { team: f.home.id, panel: "stats" }),
    },
    away: {
      name: f.away.name,
      subName: f.away.subName,
      color: f.away.color,
      icon: f.away.badgeIcon,
      href: buildLeagueHref(params, { team: f.away.id, panel: "stats" }),
    },
    score,
    status: getFixtureStatus(
      { date: f.date, time: f.time, played: score !== null, draw: score !== null && score.home === score.away },
      today,
    ),
    // The match page does not exist yet: /<sport>/matches/<id>
    matchHref: sportPath(params.sport, `matches/${f.id}`),
  };
}

function toGroups(fixtures: FixtureWithTeams[], params: LeagueParams, today: string): FixtureGroupData[] {
  const byRound = new Map<number, FixtureWithTeams[]>();
  for (const f of fixtures) byRound.set(f.matchday, [...(byRound.get(f.matchday) ?? []), f]);

  return [...byRound.entries()].map(([round, items]) => ({
    id: String(round),
    title: `Round ${round}`,
    // Round with no results yet: show when it is played.
    meta: items.every((f) => !isPlayed(f)) ? formatDate(items[0].date) : undefined,
    fixtures: items.map((f) => toCard(f, params, today)),
  }));
}

/** Fixtures tab: toolbar, then rounds with match cards. `filter` comes from your All / Upcoming / Recent toggle. */
export async function FixturesTab({
  params,
  filter = "all",
}: {
  params: LeagueParams;
  filter?: FixtureFilter;
}) {
  const fixtures = await getFixtures();
  await connection();
  const today = todayIso(); // after the awaits, so it is not read during prerender
  const groups = toGroups(applyFilter(fixtures, filter), params, today);

  return (
    <div className="mt-1 flex min-h-0 min-w-0 flex-1 flex-col">
      {/* Here stays your toolbar with the All / Upcoming / Recent toggle. */}
      <FixturesToolbar params={params} />
      <FixtureList groups={groups} empty="Brak meczów" />
    </div>
  );
}