import type { CompetitionKey } from "./competition-keys";

export type CompetitionKind = "league" | "nation" | "cup" | "individual" | "tournaments";

export type CompetitionFilterOption = {
  id: string;
  label: string;
};

export type CompetitionFilterLine = {
  parameter: "group" | "competition" | "country" | "category" | "division";
  label: string;
  options: readonly CompetitionFilterOption[];
  dependsOn?: "competition";
  onlyWhen?: string;
};

export type CompetitionKindConfig = {
  id: CompetitionKind;
  label: string;
  lines: readonly CompetitionFilterLine[];
  tabs: readonly CompetitionFilterOption[];
  defaultParams: Record<string, string>;
  leagueKind: boolean;
};

export const COMMON_TABS = [
  { id: "table", label: "Table" },
  { id: "fixtures", label: "Fixtures" },
  { id: "stats", label: "Stats" },
  { id: "history", label: "History" },
] as const;

export const LEAGUE_GROUPS = [
  { id: "gold-west", label: "West" },
  { id: "gold-east", label: "East" },
  { id: "silver-west", label: "West" },
  { id: "silver-east", label: "East" },
] as const;

export const NATION_GROUPS = [
  { id: "league", label: "League" },
  { id: "junior", label: "Junior" },
  { id: "games", label: "Games" },
  { id: "4teams", label: "4Teams" },
  { id: "pairs", label: "Pairs" },
] as const;

export const COUNTRY_OPTIONS = [
  { id: "ark", label: "ARK" },
  { id: "mon", label: "MON" },
  { id: "cel", label: "CEL" },
  { id: "cos", label: "COS" },
  { id: "arv", label: "ARV" },
  { id: "riv", label: "RIV" },
  { id: "rot", label: "ROT" },
  { id: "got", label: "GOT" },
] as const;

const leagueLines = (
  options: readonly CompetitionFilterOption[],
): readonly CompetitionFilterLine[] => [{ parameter: "group", label: "Group", options }];

export const COMPETITION_KINDS = [
  {
    id: "league",
    label: "League",
    lines: leagueLines(LEAGUE_GROUPS),
    tabs: COMMON_TABS,
    defaultParams: { kind: "league", group: "gold-west", tab: "table" },
    leagueKind: true,
  },
  {
    id: "nation",
    label: "Nation",
    lines: leagueLines(NATION_GROUPS),
    tabs: COMMON_TABS,
    defaultParams: { kind: "nation", group: "league", tab: "table" },
    leagueKind: true,
  },
  {
    id: "cup",
    label: "Cup",
    lines: [
      {
        parameter: "competition",
        label: "Cup",
        options: [
          { id: "cup", label: "Cup" },
          { id: "supercup", label: "SuperCup" },
        ],
      },
    ],
    tabs: COMMON_TABS,
    defaultParams: { kind: "cup", competition: "cup", tab: "table" },
    leagueKind: false,
  },
  {
    id: "individual",
    label: "Individual",
    lines: [
      {
        parameter: "competition",
        label: "Competition",
        options: [
          { id: "country", label: "Country" },
          { id: "helmet", label: "Helmet" },
          { id: "gp", label: "GP" },
        ],
      },
      {
        parameter: "country",
        label: "Country",
        dependsOn: "competition",
        options: COUNTRY_OPTIONS,
        onlyWhen: "country",
      },
      {
        parameter: "category",
        label: "Helmet",
        dependsOn: "competition",
        options: [
          { id: "brown", label: "Brown" },
          { id: "silver", label: "Silver" },
          { id: "gold", label: "Gold" },
        ],
        onlyWhen: "helmet",
      },
      {
        parameter: "division",
        label: "Division",
        dependsOn: "competition",
        options: [
          { id: "junior", label: "Junior" },
          { id: "senior", label: "Senior" },
        ],
        onlyWhen: "helmet",
      },
    ],
    tabs: COMMON_TABS,
    defaultParams: { kind: "individual", competition: "country", country: "ark", tab: "table" },
    leagueKind: false,
  },
  {
    id: "tournaments",
    label: "Tournaments",
    lines: [
      {
        parameter: "competition",
        label: "Tournament",
        options: [
          { id: "pairs", label: "Pairs" },
          { id: "fours", label: "Fours" },
          { id: "regio", label: "Regio" },
        ],
      },
    ],
    tabs: [{ id: "rounds", label: "Rounds" }],
    defaultParams: { kind: "tournaments", competition: "pairs", tab: "rounds" },
    leagueKind: false,
  },
] as const satisfies readonly CompetitionKindConfig[];

export function getCompetitionKind(kind: string | undefined): CompetitionKindConfig {
  const found = COMPETITION_KINDS.find((item) => item.id === kind?.toLowerCase());
  return found ?? COMPETITION_KINDS[0];
}

export function isCompetitionKey(value: string | undefined): value is CompetitionKey {
  return Boolean(
    value &&
    (
      ["league", "cup", "supercup", "pairs", "fours", "regio", "junior", "helmet", "gp"] as string[]
    ).includes(value),
  );
}
