import type { SportConfig } from "../types";

export const speedwayConfig: SportConfig = {
  id: "speedway",
  name: "Speedway",
  labels: {
    participant: "Rider",
    participants: "Riders",
    match: "Match",
    matchday: "Kolejka",
  },
  competitions: [
    { type: "league", label: "League" },
    { type: "cup", label: "Cup" },
    { type: "tournaments", label: "Tournaments" },
    { type: "individual", label: "Individual" },
    { type: "national", label: "National" },
  ],
};
