import { CLUBS, CUP_DEFINITION, SEASON_FIXTURES } from "../sports/speedway/data/season";
import { cupStructure } from "../sports/speedway/sim/cup/definition";

const rows = [...new Set(CLUBS.map((club) => club.leagueId))].map((leagueId) => {
  const matchdays = Math.max(
    0,
    ...SEASON_FIXTURES.filter((f) => f.competitionId === leagueId && f.stage === "regular").map((f) => f.matchday),
  );
  return {
    league: leagueId,
    clubs: CLUBS.filter((club) => club.leagueId === leagueId).length,
    regularMatchdays: matchdays,
    snapshotMatchday: Math.floor(matchdays * CUP_DEFINITION.seeding.snapshot.share),
  };
});

console.table(rows);
console.log(cupStructure(rows.reduce((sum, row) => sum + row.clubs, 0)));