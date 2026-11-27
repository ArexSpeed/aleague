import type { Venue } from "@/components/toggle/venue-toggle";
import type { LeagueRider, RiderTelemetry } from "@/sports/speedway/types/league";

/** Telemetry of a rider for the selected venue filter (All / Home / Away). */
export function getRiderStats(rider: LeagueRider, venue: Venue): RiderTelemetry {
  return venue === "home" ? rider.home : venue === "away" ? rider.away : rider;
}