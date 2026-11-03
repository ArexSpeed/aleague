import type { Rng, Surface, Weather } from "./types";

/** Stadium surface labels from clubs.json. */
const SURFACES: Record<string, Surface> = { Soft: "soft", Medium: "medium", Hard: "hard" };

export function surfaceOf(label: string): Surface {
  return SURFACES[label] ?? "medium";
}

/** Weather of a match: mostly sun, sometimes clouds, rarely rain. */
export function rollWeather(rng: Rng): Weather {
  const r = rng();
  return r < 0.55 ? "sun" : r < 0.85 ? "cloud" : "rain";
}
