/** URL helpers. Every page of the app lives under /<sport>/... */
export function sportPath(sport: string, path = ""): string {
  return path ? `/${sport}/${path}` : `/${sport}`;
}

export function matchPath(sport: string, matchId: string): string {
  return sportPath(sport, `matches/${matchId}`);
}

export type CompetitionsHrefParams = {
  sport: string;
  kind?: string;
  group?: string;
  competition?: string;
  country?: string;
  category?: string;
  division?: string;
  tab?: string;
  team?: string;
  match?: string;
  matchday?: number;
  panel?: string;
  view?: string;
  venue?: string;
  schedule?: string;
  metrics?: string;
};

export function competitionsHref(params: CompetitionsHrefParams): string {
  const qs = new URLSearchParams();
  if (params.kind && params.kind !== "league") qs.set("kind", params.kind);
  if (params.group) qs.set("group", params.group);
  if (params.competition) qs.set("competition", params.competition);
  if (params.country) qs.set("country", params.country);
  if (params.category) qs.set("category", params.category);
  if (params.division) qs.set("division", params.division);
  for (const key of [
    "tab",
    "team",
    "match",
    "panel",
    "view",
    "venue",
    "schedule",
    "metrics",
  ] as const) {
    const value = params[key];
    if (value) qs.set(key, String(value));
  }
  if (params.matchday !== undefined) qs.set("matchday", String(params.matchday));
  const query = qs.toString();
  const base = sportPath(params.sport, "competitions");
  return query ? `${base}?${query}` : base;
}

/** Do czasu strony klubu otwiera drużynę w asidzie ligi. Tu przełączysz na `teams/<id>`. */
export function teamPath(sport: string, teamId: string): string {
  return competitionsHref({ sport, kind: "league", tab: "table", team: teamId });
}
