/**
 * SAMPLE data generator: 48 clubs (4 leagues), 8 regions, 10 riders per club.
 * Only needed until you paste your own regions/clubs/riders JSON (same shape as data/schema.ts).
 * Deterministic: same SEED = same files.
 *
 *   pnpm dlx tsx scripts/generate-season.ts
 */
import fs from "node:fs";
import path from "node:path";

const SEED = "season-1";
const DIR = path.join(process.cwd(), "sports/speedway/data/season-1");
const RIDERS_PER_CLUB = 10; // 7 in the match squad + 3 reserves

// ---------- helpers ----------

function seeded(seed: string): () => number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = (h ^ (h >>> 16)) >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = seeded(SEED);
const int = (min: number, max: number) => min + Math.floor(rand() * (max - min + 1));
const pick = <T>(list: readonly T[]): T => list[Math.floor(rand() * list.length)]!;
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
/** Roughly normal (sum of 3 uniforms), mean 0, sd ~0.5. */
const gauss = () => (rand() + rand() + rand() - 1.5) * 0.8;

function shuffle<T>(list: readonly T[]): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

function hslToHex(h: number, s: number, l: number): string {
  const a = (s / 100) * Math.min(l / 100, 1 - l / 100);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const c = l / 100 - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(255 * c)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// ---------- name pools (invented) ----------

const PREFIX = [
  "Tarn",
  "Ross",
  "Brun",
  "Kal",
  "Mor",
  "Vel",
  "Ost",
  "Hald",
  "Nor",
  "Sund",
  "Fjor",
  "Bren",
  "Cor",
  "Dun",
  "Eld",
  "Gren",
  "Hav",
  "Isen",
  "Jar",
  "Lund",
  "Mar",
  "Nid",
  "Ors",
  "Pol",
  "Rav",
  "Sel",
  "Tor",
  "Ulm",
  "Vard",
  "Wex",
];
const SUFFIX = [
  "hem",
  "gaard",
  "berg",
  "stad",
  "holm",
  "ford",
  "vik",
  "ton",
  "mark",
  "dal",
  "burg",
  "heim",
];
const MASCOTS: [string, string][] = [
  ["Wolves", "🐺"],
  ["Roses", "🌹"],
  ["Eagles", "🦅"],
  ["Bears", "🐻"],
  ["Lions", "🦁"],
  ["Foxes", "🦊"],
  ["Hawks", "🦉"],
  ["Stags", "🦌"],
  ["Sharks", "🦈"],
  ["Bulls", "🐂"],
  ["Tigers", "🐯"],
  ["Falcons", "🪶"],
  ["Storm", "⚡"],
  ["Anchors", "⚓"],
  ["Dragons", "🐉"],
  ["Knights", "🛡️"],
  ["Comets", "☄️"],
  ["Rams", "🐏"],
  ["Ravens", "🐦"],
  ["Vikings", "⚔️"],
  ["Panthers", "🐆"],
  ["Spartans", "🏛️"],
  ["Miners", "⛏️"],
  ["Sailors", "⛵"],
];
const FIRST = [
  "Adam",
  "Piotr",
  "Marek",
  "Tomasz",
  "Jakub",
  "Kamil",
  "Oskar",
  "Filip",
  "Dawid",
  "Szymon",
  "Patryk",
  "Michał",
  "Kacper",
  "Bartek",
  "Igor",
  "Jan",
  "Erik",
  "Lars",
  "Mats",
  "Ivan",
  "Luca",
  "Noah",
  "Leo",
  "Max",
  "Viktor",
  "Emil",
  "Anton",
  "Niko",
  "Rafał",
  "Paweł",
  "Artem",
  "Jonas",
  "Oliver",
  "Henrik",
  "Tobias",
  "Marcel",
  "Daniel",
  "Mikael",
  "Sven",
  "Karol",
];
const LAST = [
  "Kowal",
  "Lis",
  "Wolny",
  "Sowa",
  "Rudy",
  "Zając",
  "Bielik",
  "Orzeł",
  "Kruk",
  "Jeleń",
  "Bóbr",
  "Żbik",
  "Sokół",
  "Lew",
  "Wilk",
  "Tur",
  "Nilsson",
  "Berg",
  "Holm",
  "Lund",
  "Dahl",
  "Aas",
  "Voss",
  "Kern",
  "Brandt",
  "Moreau",
  "Rossi",
  "Silva",
  "Novak",
  "Horvat",
  "Petrov",
  "Kowalczyk",
  "Mazur",
  "Pawlak",
  "Duda",
  "Kubiak",
  "Krajewski",
  "Sikora",
  "Baran",
  "Rutkowski",
  "Olsen",
  "Hansen",
  "Larsen",
  "Berglund",
  "Ekström",
  "Lindahl",
  "Strand",
  "Fjeld",
  "Haugen",
  "Vik",
  "Müller",
  "Fischer",
  "Weber",
  "Keller",
  "Braun",
  "Hahn",
  "Roth",
  "Frey",
  "Lang",
  "Stein",
  "Wirth",
  "Baum",
  "Jansen",
  "Visser",
  "Bakker",
  "Smit",
  "Dekker",
  "Mulder",
  "Kramer",
];
const REGIONS = [
  "Arkadia",
  "Montania",
  "Riveria",
  "Norlund",
  "Valdoria",
  "Estermark",
  "Sunvale",
  "Kaldera",
];
const SURFACES = ["Syenite (hard)", "Granite (medium)", "Shale (soft)", "Mixed (technical)"];

// ---------- clubs ----------

type League = { id: string; level: number; teams: number; stages: { groups: { id: string }[] }[] };
const { competitions } = JSON.parse(
  fs.readFileSync(path.join(DIR, "competitions.json"), "utf8"),
) as {
  competitions: League[];
};

const leagues = ["east-gold", "west-gold", "east-silver", "west-silver"].map((id) =>
  competitions.find((c) => c.id === id)!,
);
const totalClubs = leagues.reduce((sum, l) => sum + l.teams, 0);
const cityNames = shuffle(PREFIX.flatMap((p) => SUFFIX.map((s) => p + s))).slice(0, totalClubs);
const usedShorts = new Set<string>();

function shortCode(city: string): string {
  const up = city.toUpperCase();
  for (const code of [up.slice(0, 3), up[0]! + up[1]! + up[3], up[0]! + up[2]! + up[3]]) {
    if (code.length === 3 && !usedShorts.has(code)) return (usedShorts.add(code), code);
  }
  let n = 1;
  while (usedShorts.has(`${up.slice(0, 2)}${n}`)) n++;
  const code = `${up.slice(0, 2)}${n}`;
  usedShorts.add(code);
  return code;
}

const regions = REGIONS.map((name) => ({ id: slug(name), name }));

const clubs = leagues.flatMap((league, li) => {
  const groups = league.stages[0]!.groups;
  const before = leagues.slice(0, li).reduce((sum, l) => sum + l.teams, 0);
  return Array.from({ length: league.teams }, (_, i) => {
    const index = before + i;
    const city = cityNames[index]!;
    const [mascot, icon] = MASCOTS[index % MASCOTS.length]!;
    const level = league.level;
    return {
      id: slug(`${city} ${mascot}`),
      name: `${city} ${mascot}`.toUpperCase(),
      subName: mascot.toUpperCase(),
      short: shortCode(city),
      fullName: `${city} ${mascot}`,
      city,
      color: hslToHex((index * 137.5) % 360, 62, 46),
      icon,
      leagueId: league.id,
      ...(groups.length > 1 ? { group: groups[i % groups.length]!.id } : {}),
      regionId: regions[index % regions.length]!.id,
      stadium: {
        name: `${city} Speedway Arena`,
        capacity: level === 1 ? int(25000, 45000) : int(12000, 28000),
        trackLength: int(290, 400),
        surface: pick(SURFACES),
      },
      /** Only shapes the generated rider skills; dropped before writing. */
      strength: (level === 1 ? 0.6 : 0) + gauss(),
    };
  });
});

// ---------- riders ----------

const usedNames = new Set<string>();
function riderName(): [string, string] {
  for (let tries = 0; tries < 100; tries++) {
    const name: [string, string] = [pick(FIRST), pick(LAST)];
    if (!usedNames.has(name.join(" "))) return (usedNames.add(name.join(" ")), name);
  }
  throw new Error("name pool exhausted");
}

let nextId = 1;
const riders = clubs.flatMap((club) =>
  Array.from({ length: RIDERS_PER_CLUB }, (_, i) => {
    const [name, Surname] = riderName();
    const number = i + 1;
    const junior = number > 7;
    const base = 70 + club.strength * 8 + (number === 1 ? 8 : 0) - (junior ? 6 : 0);
    const skill = () => clamp(Math.round(base + gauss() * 14), 45, 99);
    return {
      Id: nextId++,
      name,
      Surname,
      Age: junior ? int(16, 20) : int(21, 36),
      Strength: skill(),
      Technique: skill(),
      Fighting: skill(),
      Reflex: skill(),
      Condition: skill(),
      Forma: 100,
      Club: club.fullName,
      ClubId: club.short,
    };
  }),
);

/** One record per line: readable and easy to diff. */
const lines = (items: unknown[]) =>
  `[\n${items.map((i) => `  ${JSON.stringify(i)}`).join(",\n")}\n]\n`;
const publicClubs = clubs.map(({ strength: _strength, ...club }) => club);

fs.writeFileSync(path.join(DIR, "regions.json"), lines(regions));
fs.writeFileSync(path.join(DIR, "clubs.json"), lines(publicClubs));
fs.writeFileSync(path.join(DIR, "riders.json"), lines(riders));
console.log(`regions ${regions.length}, clubs ${clubs.length}, riders ${riders.length}`);
