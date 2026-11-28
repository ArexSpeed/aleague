export const COMPETITION_KEYS = [
  "league",
  "cup",
  "supercup",
  "pairs",
  "fours",
  "regio",
  "junior",
  "country",
  "helmet",
  "helmet",
  "gp",
] as const;

export type CompetitionKey = (typeof COMPETITION_KEYS)[number];
