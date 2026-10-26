import type { Fixture } from "@/types/fixtures";

export const TOTAL_MATCHDAYS = 14;
export const CURRENT_MATCHDAY = 9;

const TEAM_IDS = [
  "rossengaard",
  "lyon",
  "chelsea",
  "barca",
  "bayern",
  "psg",
  "mancity",
  "tarnhem_wolves",
] as const;

// Invented venues, TODO: move to a stadium model together with the team details.
const STADIUMS: Record<(typeof TEAM_IDS)[number], string> = {
  rossengaard: "Rosenpark Speedway",
  lyon: "Parc Lumière",
  chelsea: "Bridge Arena",
  barca: "Velòdrom Camp",
  bayern: "Isar Speedway",
  psg: "Parc Vitesse",
  mancity: "Eastside Oval",
  tarnhem_wolves: "Wolf Den Track",
};

const KICKOFF_TIMES = ["16:30", "17:00", "18:00", "19:30"];
const DAY_MS = 24 * 60 * 60 * 1000;
/** Sunday 6 Sep 2026; one matchday per week. */
const FIRST_MATCHDAY = Date.UTC(2026, 8, 6);

/** Circle method: every team meets every other once, home/away alternates. */
function roundRobin(ids: readonly string[]): [string, string][][] {
  const list = [...ids];
  const n = list.length;
  const rounds: [string, string][][] = [];

  for (let r = 0; r < n - 1; r++) {
    const pairs: [string, string][] = [];
    for (let i = 0; i < n / 2; i++) {
      const a = list[i]!;
      const b = list[n - 1 - i]!;
      pairs.push(r % 2 === 0 ? [a, b] : [b, a]);
    }
    rounds.push(pairs);
    list.splice(1, 0, list.pop()!);
  }
  return rounds;
}

const firstHalf = roundRobin(TEAM_IDS);
const secondHalf = firstHalf.map((round) =>
  round.map(([home, away]): [string, string] => [away, home]),
);

export const FIXTURES: Fixture[] = [...firstHalf, ...secondHalf].flatMap((pairs, index) => {
  const matchday = index + 1;
  const date = new Date(FIRST_MATCHDAY + index * 7 * DAY_MS).toISOString().slice(0, 10);
  const finished = matchday < CURRENT_MATCHDAY;

  return pairs.map(([homeId, awayId], slot): Fixture => {
    const homeScore = 40 + ((matchday * 7 + slot * 13) % 21); // 40..60
    return {
      id: `md${matchday}-${slot + 1}`,
      matchday,
      date,
      time: KICKOFF_TIMES[slot] ?? "18:00",
      homeId,
      awayId,
      stadium: STADIUMS[homeId as (typeof TEAM_IDS)[number]],
      homeScore: finished ? homeScore : null,
      awayScore: finished ? 90 - homeScore : null,
    };
  });
});
