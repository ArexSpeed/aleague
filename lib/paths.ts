/** URL helpers. Every page of the app lives under /<sport>/... */
export function sportPath(sport: string, path = ""): string {
  return path ? `/${sport}/${path}` : `/${sport}`;
}
