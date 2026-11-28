import type { SportModule } from "../types";
import { speedwayConfig } from "./config";
import { LeaguePage } from "./views/competitions/league/league-page";
import { CupPage } from "./views/competitions/cup/cup-page";
import { TournamentsPage } from "./views/competitions/tournaments/tournaments-page";
import { IndividualPage } from "./views/competitions/individual/individual-page";
import { HomeView } from "./views/home/home-view";
import { TeamsView } from "./views/teams/teams-view";
import { MatchPage } from "./views/matches/match/match-page";

/** Public surface of the speedway module (used only by sports/registry.ts). */
export const speedway: SportModule = {
  config: speedwayConfig,
  HomeView,
  TeamsView,
  MatchView: MatchPage,
  competitionViews: {
    league: LeaguePage,
    tournaments: TournamentsPage,
    cup: CupPage,
    individual: IndividualPage,
  },
};
