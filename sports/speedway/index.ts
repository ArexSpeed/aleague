import type { SportModule } from "../types";
import { speedwayConfig } from "./config";
import { LeaguePage } from "./views/competitions/league/league-page";
import { HomeView } from "./views/home/home-view";
import { TeamsView } from "./views/teams/teams-view";

/** Public surface of the speedway module (used only by sports/registry.ts). */
export const speedway: SportModule = {
  config: speedwayConfig,
  HomeView,
  TeamsView,
  competitionViews: {
    league: LeaguePage,
  },
};
