/** URL helpers. Every page of the app lives under /<sport>/... */
export function sportPath(sport: string, path = ""): string {
  return path ? `/${sport}/${path}` : `/${sport}`;
}

export function matchPath(sport: string, matchId: string): string {
  return sportPath(sport, `matches/${matchId}`);
}

/** Do czasu strony klubu otwiera drużynę w asidzie ligi. Tu przełączysz na `teams/<id>`. */
export function teamPath(sport: string, teamId: string): string {
  return `${sportPath(sport, "competitions/league")}?tab=table&team=${teamId}`;
}
