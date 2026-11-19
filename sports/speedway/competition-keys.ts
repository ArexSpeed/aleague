export const COMPETITION_KEYS = [
  "league",
  "cup",
  "supercup",
  "pairs",
  "fours",
  "junior",
  "helmet",
  "gp",
] as const;

export type CompetitionKey = (typeof COMPETITION_KEYS)[number];
