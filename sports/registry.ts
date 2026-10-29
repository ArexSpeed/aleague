import { notFound } from "next/navigation";

import { speedway } from "./speedway";
import type { SportId, SportModule } from "./types";

/** The only place that knows every sport. TS forces an entry for each SportId. */
const SPORTS: Record<SportId, SportModule> = {
  speedway,
};

export const SPORT_IDS = Object.keys(SPORTS) as SportId[];
export const DEFAULT_SPORT: SportId = "speedway";

export function isSportId(value: string): value is SportId {
  return value in SPORTS;
}

/** Unknown sport in the URL = 404. */
export function requireSport(value: string): SportModule {
  if (!isSportId(value)) notFound();
  return SPORTS[value];
}
