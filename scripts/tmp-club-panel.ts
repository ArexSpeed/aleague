import { getClubPanelData } from "@/sports/speedway/api/club-panel";

async function main() {
  for (const source of ["league", "cup"] as const) {
    const data = await getClubPanelData("NEP", source);
    console.log(
      source,
      data && { place: data.place, games: data.stats.games, riders: data.riders.length, listed: data.games.length },
    );
  }
}

main();