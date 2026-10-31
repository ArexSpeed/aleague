import type { ComponentType } from "react";

/** Add a sport: extend this union, create sports/<id>/, register it in registry.ts. */
export type SportId = "speedway";

export type CompetitionType = "league" | "cup" | "tournaments" | "individual" | "national";

export type SportConfig = {
  id: SportId;
  /** Shown in the TopBar. */
  name: string;
  /** Sport vocabulary, so shared UI never hardcodes "riders" / "players" / "jumpers". */
  labels: {
    participant: string;
    participants: string;
    match: string;
    matchday: string;
  };
  /** Order = order in the Competitions menu. */
  competitions: { type: CompetitionType; label: string }[];
};

export type RawSearchParams = Record<string, string | string[] | undefined>;

export type CompetitionViewProps = {
  sport: SportId;
  /** URL of this view without query, e.g. /speedway/competitions/league */
  basePath: string;
  searchParams: Promise<RawSearchParams>;
};

export type SportViewProps = { sport: SportId };

export type TeamsViewProps = {
  sport: SportId;
  basePath: string;
  searchParams: Promise<RawSearchParams>;
};

export type MatchViewProps = {
  sport: SportId;
  matchId: string;
  basePath: string;
  searchParams: Promise<RawSearchParams>;
};

/**
 * Everything the app needs from one sport. `app/` routes are generic and look
 * the views up here, so a sport only ever adds files under sports/<id>/.
 * A competition type without a view renders a "coming soon" placeholder.
 */
export type SportModule = {
  config: SportConfig;
  HomeView: ComponentType<SportViewProps>;
  TeamsView: ComponentType<TeamsViewProps>;
  MatchView: ComponentType<MatchViewProps>;
  competitionViews: Partial<Record<CompetitionType, ComponentType<CompetitionViewProps>>>;
};
