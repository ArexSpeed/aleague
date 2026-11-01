/**
 * Validates regions / clubs / riders of a season and builds the fixtures (regular stages)
 * of every league and every regional league, with a calendar week for each matchday.
 * Works on your own JSON as long as it follows sports/speedway/data/schema.ts.
 *
 *   pnpm dlx tsx scripts/build-fixtures.ts
 */
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";

import {
  clubSchema,
  fixtureSchema,
  regionSchema,
  adaptRiders,
  riderSchema,
  type Club,
  type Fixture,
} from "../sports/speedway/data/schema";
import { doubleRoundRobin, mergeGroups } from "../sports/speedway/sim/schedule";

const DIR = path.join(process.cwd(), "sports/speedway/data/season-1");
const read = <T extends z.ZodType>(file: string, schema: T): z.infer<T>[] =>
  z.array(schema).parse(JSON.parse(fs.readFileSync(path.join(DIR, file), "utf8")));

type Stage = { id: string; groups: { id: string; size: number }[] };
type Competition = { id: string; name: string; teams: number; stages: Stage[] };
const config = JSON.parse(fs.readFileSync(path.join(DIR, "competitions.json"), "utf8")) as {
  competitions: Competition[];
  regional: { idPrefix: string; size: number; stages: Stage[] };
  calendar: { regionalEvery: number };
};

const regions = read("regions.json", regionSchema);
const clubs = read("clubs.json", clubSchema);
const problems: string[] = [];
const fail = (message: string) => problems.push(message);

const adapted = adaptRiders(read("riders.json", riderSchema), clubs);
adapted.errors.forEach(fail);
const riders = z.array(riderSchema).parse(adapted.riders);

// ---------- validation ----------

const unique = (label: string, ids: string[]) => {
  if (new Set(ids).size !== ids.length) fail(`${label}: duplicate ids`);
};
unique(
  "regions",
  regions.map((r) => r.id),
);
unique(
  "clubs",
  clubs.map((c) => c.id),
);
unique(
  "riders",
  riders.map((r) => r.id),
);
unique(
  "club short codes",
  clubs.map((c) => c.short),
);

const regionIds = new Set(regions.map((r) => r.id));
for (const club of clubs)
  if (!regionIds.has(club.regionId)) fail(`${club.id}: unknown region ${club.regionId}`);

const clubIds = new Set(clubs.map((c) => c.id));
const ridersByClub = new Map<string, string[]>();
for (const rider of riders) {
  if (!clubIds.has(rider.clubId)) fail(`${rider.id}: unknown club ${rider.clubId}`);
  ridersByClub.set(rider.clubId, [...(ridersByClub.get(rider.clubId) ?? []), rider.id]);
}
for (const club of clubs) {
  const memberIds = (ridersByClub.get(club.id) ?? []).sort();
  if (memberIds.length < 7) fail(`${club.id}: ${memberIds.length} riders, need at least 7`);
  if (new Set(memberIds).size !== memberIds.length) fail(`${club.id}: duplicate rider ids`);
}

for (const competition of config.competitions) {
  const members = clubs.filter((c) => c.leagueId === competition.id);
  if (members.length !== competition.teams)
    fail(`${competition.id}: ${members.length} clubs, expected ${competition.teams}`);
}
for (const region of regions) {
  const members = clubs.filter((c) => c.regionId === region.id);
  if (members.length !== config.regional.size)
    fail(`region ${region.id}: ${members.length} clubs, expected ${config.regional.size}`);
}

// ---------- fixtures ----------

type Source = { id: string; stage: Stage; members: Club[]; kind: "league" | "regional" };
const sources: Source[] = [
  ...config.competitions.map((c): Source => ({
    id: c.id,
    stage: c.stages[0]!,
    members: clubs.filter((club) => club.leagueId === c.id),
    kind: "league",
  })),
  ...regions.map((r): Source => ({
    id: `${config.regional.idPrefix}${r.id}`,
    stage: config.regional.stages[0]!,
    members: clubs.filter((club) => club.regionId === r.id),
    kind: "regional",
  })),
];

/** Every Nth week is a regional week; matchday k of its kind gets the k-th week of that kind. */
const every = config.calendar.regionalEvery;
const isRegionalWeek = (week: number) => week % every === 0;
function weekOf(kind: Source["kind"], matchday: number): number {
  let week = 0;
  let seen = 0;
  while (seen < matchday) {
    week++;
    if (isRegionalWeek(week) === (kind === "regional")) seen++;
  }
  return week;
}

const fixtures: Fixture[] = [];
for (const source of sources) {
  const groups = source.stage.groups.map((g) => ({
    id: g.id,
    teamIds: source.members
      .filter((c) => (source.stage.groups.length > 1 ? c.group === g.id : true))
      .map((c) => c.id),
  }));
  for (const g of groups) {
    const expected = source.stage.groups.find((x) => x.id === g.id)!.size;
    if (g.teamIds.length !== expected)
      fail(`${source.id}/${g.id}: ${g.teamIds.length} clubs, expected ${expected}`);
  }
  if (problems.length > 0) continue;

  const matchdays = mergeGroups(groups.map((g) => doubleRoundRobin(g.teamIds)));
  matchdays.forEach((round, k) => {
    round.forEach((p, i) => {
      fixtures.push({
        id: `${source.id}-${source.stage.id}-${String(k + 1).padStart(2, "0")}-${i + 1}`,
        competitionId: source.id,
        stage: source.stage.id,
        group: groups.find((g) => g.teamIds.includes(p.home))!.id,
        matchday: k + 1,
        week: weekOf(source.kind, k + 1),
        homeId: p.home,
        awayId: p.away,
      });
    });
  });
}

// ---------- fixture checks ----------

const parsed = z.array(fixtureSchema).parse(fixtures);
const busy = new Set<string>();
for (const f of parsed) {
  for (const club of [f.homeId, f.awayId]) {
    const key = `${club}@${f.week}`;
    if (busy.has(key)) fail(`${club} plays twice in week ${f.week}`);
    busy.add(key);
  }
}

if (problems.length > 0) {
  console.error(`${problems.length} PROBLEMS:\n${problems.slice(0, 25).join("\n")}`);
  process.exit(1);
}

const weeks = Math.max(...parsed.map((f) => f.week));
const byCompetition = new Map<string, number>();
for (const f of parsed)
  byCompetition.set(f.competitionId, (byCompetition.get(f.competitionId) ?? 0) + 1);
console.log(
  `regions ${regions.length}, clubs ${clubs.length}, riders ${riders.length}, fixtures ${parsed.length}, last week of regular stages: ${weeks}`,
);
for (const [id, count] of byCompetition) console.log(`  ${id.padEnd(24)} ${count} matches`);

const lines = (items: unknown[]) =>
  `[\n${items.map((i) => `  ${JSON.stringify(i)}`).join(",\n")}\n]\n`;
fs.writeFileSync(path.join(DIR, "fixtures.json"), lines(parsed));
console.log("checks: OK, fixtures.json written");
