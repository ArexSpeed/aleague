import assert from "node:assert";
import { TOURNAMENT_BY_ID, CLUBS } from "../sports/speedway/data/season";
import {
  generateTournamentFixtures,
  drawGroups,
  resolveRoundAdvancement,
  resolveNextRound,
  createPots,
} from "../sports/speedway/sim/tournaments";
import {
  getDeterministicDefaultClubOrder,
  getTemporaryClubRanking,
} from "../sports/speedway/sim/club-ranking";

console.log("=== RUNNING TOURNAMENTS TESTS ===");

// 1. Definition check
const foursDef = TOURNAMENT_BY_ID.get("tournaments-fours");
const pairsDef = TOURNAMENT_BY_ID.get("tournaments-pairs");

assert(foursDef, "tournaments-fours definition exists");
assert(pairsDef, "tournaments-pairs definition exists");
assert.strictEqual(foursDef.formatType, "multi-team-group-rounds");
assert.strictEqual(pairsDef.formatType, "multi-team-group-rounds");

// 2. Fixtures generator check
const foursFixtures = generateTournamentFixtures(foursDef);
const pairsFixtures = generateTournamentFixtures(pairsDef);

assert.strictEqual(foursFixtures.length, 25, "Fours must have 25 fixtures (12 + 8 + 4 + 1)");
assert.strictEqual(pairsFixtures.length, 15, "Pairs must have 15 fixtures (8 + 4 + 2 + 1)");

// Check specific fixture IDs
assert(foursFixtures.some((f) => f.id === "tournaments-fours-r1-1"), "Fours r1-1 exists");
assert(foursFixtures.some((f) => f.id === "tournaments-fours-r1-12"), "Fours r1-12 exists");
assert(foursFixtures.some((f) => f.id === "tournaments-fours-r2-1"), "Fours r2-1 exists");
assert(foursFixtures.some((f) => f.id === "tournaments-fours-r2-8"), "Fours r2-8 exists");
assert(foursFixtures.some((f) => f.id === "tournaments-fours-sf-1"), "Fours sf-1 exists");
assert(foursFixtures.some((f) => f.id === "tournaments-fours-sf-4"), "Fours sf-4 exists");
assert(foursFixtures.some((f) => f.id === "tournaments-fours-final"), "Fours final exists");

assert(pairsFixtures.some((f) => f.id === "tournaments-pairs-r1-1"), "Pairs r1-1 exists");
assert(pairsFixtures.some((f) => f.id === "tournaments-pairs-r1-8"), "Pairs r1-8 exists");
assert(pairsFixtures.some((f) => f.id === "tournaments-pairs-r2-1"), "Pairs r2-1 exists");
assert(pairsFixtures.some((f) => f.id === "tournaments-pairs-r2-4"), "Pairs r2-4 exists");
assert(pairsFixtures.some((f) => f.id === "tournaments-pairs-sf-1"), "Pairs sf-1 exists");
assert(pairsFixtures.some((f) => f.id === "tournaments-pairs-sf-2"), "Pairs sf-2 exists");
assert(pairsFixtures.some((f) => f.id === "tournaments-pairs-final"), "Pairs final exists");

console.log("✓ Fixture counts and IDs verified (Fours: 25, Pairs: 15, Total: 40)");

// 3. Club ranking check
const defaultClubsOrder = getDeterministicDefaultClubOrder(CLUBS);
assert.strictEqual(defaultClubsOrder.length, 48, "Must order all 48 clubs");
assert.strictEqual(new Set(defaultClubsOrder).size, 48, "All 48 club IDs must be unique");

// Without matches, ranking must be pending
const pendingRanking = getTemporaryClubRanking();
assert.strictEqual(pendingRanking.status, "pending", "Without finished leagues ranking is pending");

// With manual order, ranking resolves
const resolvedRanking = getTemporaryClubRanking({ manualClubOrder: defaultClubsOrder });
assert.strictEqual(resolvedRanking.status, "resolved");

console.log("✓ Club ranking logic verified (pending without leagues, resolves with manual)");

// 4. Group draw check
const r1Fours = foursDef.rounds[0]!;
const potsFours = createPots(defaultClubsOrder, r1Fours.groupCount, r1Fours.groupSize);
assert.strictEqual(potsFours.length, 4, "Fours R1 has 4 pots");
assert.strictEqual(potsFours[0]!.length, 12, "Each pot has 12 clubs");

const groupsFoursR1 = drawGroups(defaultClubsOrder, r1Fours, "fours-2026-r1");
assert.strictEqual(groupsFoursR1.length, 12, "Fours R1 produces 12 groups");

const allDrawnFours = groupsFoursR1.flatMap((g) => g.clubIds);
assert.strictEqual(allDrawnFours.length, 48, "Total 48 clubs drawn in Fours R1");
assert.strictEqual(new Set(allDrawnFours).size, 48, "Every club in Fours R1 drawn exactly once");

// Verify that each group got 1 club from each pot
const pot0Set = new Set(potsFours[0]);
const pot1Set = new Set(potsFours[1]);
const pot2Set = new Set(potsFours[2]);
const pot3Set = new Set(potsFours[3]);

for (const group of groupsFoursR1) {
  assert.strictEqual(group.clubIds.length, 4, "Group size must be 4");
  assert(pot0Set.has(group.clubIds[0]!), "Slot 1 comes from Pot 0");
  assert(pot1Set.has(group.clubIds[1]!), "Slot 2 comes from Pot 1");
  assert(pot2Set.has(group.clubIds[2]!), "Slot 3 comes from Pot 2");
  assert(pot3Set.has(group.clubIds[3]!), "Slot 4 comes from Pot 3");
}

// Determinism check: same seed gives identical groups
const groupsFoursR1Repeat = drawGroups(defaultClubsOrder, r1Fours, "fours-2026-r1");
assert.deepStrictEqual(groupsFoursR1, groupsFoursR1Repeat, "Same seed must be deterministic");

// Pairs R1 draw check
const r1Pairs = pairsDef.rounds[0]!;
const groupsPairsR1 = drawGroups(defaultClubsOrder, r1Pairs, "pairs-2026-r1");
assert.strictEqual(groupsPairsR1.length, 8, "Pairs R1 produces 8 groups");

const allDrawnPairs = groupsPairsR1.flatMap((g) => g.clubIds);
assert.strictEqual(allDrawnPairs.length, 48, "Total 48 clubs drawn in Pairs R1");
assert.strictEqual(new Set(allDrawnPairs).size, 48, "Every club in Pairs R1 drawn exactly once");

console.log("✓ Group drawing verified (all clubs drawn once, exactly 1 from each pot, deterministic)");

// 5. Advancements check: Fours Round 1 -> 32 clubs (24 direct + 8 third-placed)
const foursR1MockResults = groupsFoursR1.map((g) => ({
  groupNumber: g.groupNumber,
  // Give points 40, 30, 20 + g.groupNumber, 10
  results: [
    { clubId: g.clubIds[0]!, points: 40 },
    { clubId: g.clubIds[1]!, points: 30 },
    { clubId: g.clubIds[2]!, points: 20 + g.groupNumber }, // Groups 5..12 will have higher 3rd place scores
    { clubId: g.clubIds[3]!, points: 10 },
  ],
}));

const advancementFoursR1 = resolveRoundAdvancement(foursR1MockResults, r1Fours, defaultClubsOrder);
assert.strictEqual(advancementFoursR1.status, "resolved");
if (advancementFoursR1.status === "resolved") {
  assert.strictEqual(advancementFoursR1.directAdvancing.length, 24, "24 direct advancing in Fours R1");
  assert.strictEqual(advancementFoursR1.wildcardAdvancing.length, 8, "8 wildcard advancing in Fours R1");
  assert.strictEqual(advancementFoursR1.allAdvancing.length, 32, "Total 32 advancing in Fours R1");
  assert.strictEqual(advancementFoursR1.thirdPlacedRanking?.length, 12, "12 clubs ranked in third-placed panel");

  // Check that the cutoff marked top 8 as wildcards
  const wildcardsInRanking = advancementFoursR1.thirdPlacedRanking.filter((t) => t.wildcard);
  assert.strictEqual(wildcardsInRanking.length, 8, "Top 8 marked as wildcards in third-placed panel");
}

// Fours Round 2 -> 16 clubs
const r2Fours = foursDef.rounds[1]!;
const advancing32 = (advancementFoursR1 as { allAdvancing: string[] }).allAdvancing;
const groupsFoursR2 = resolveNextRound(advancing32, r2Fours, defaultClubsOrder, "fours-2026-r2");
assert.strictEqual(groupsFoursR2.length, 8, "Fours R2 has 8 groups");

const foursR2MockResults = groupsFoursR2.map((g) => ({
  groupNumber: g.groupNumber,
  results: [
    { clubId: g.clubIds[0]!, points: 40 },
    { clubId: g.clubIds[1]!, points: 30 },
    { clubId: g.clubIds[2]!, points: 20 },
    { clubId: g.clubIds[3]!, points: 10 },
  ],
}));

const advancementFoursR2 = resolveRoundAdvancement(foursR2MockResults, r2Fours, defaultClubsOrder);
assert.strictEqual(advancementFoursR2.status, "resolved");
if (advancementFoursR2.status === "resolved") {
  assert.strictEqual(advancementFoursR2.allAdvancing.length, 16, "16 advancing in Fours R2");
}

// Fours Semifinals -> 4 clubs
const sfFours = foursDef.rounds[2]!;
const advancing16 = (advancementFoursR2 as { allAdvancing: string[] }).allAdvancing;
const groupsFoursSF = resolveNextRound(advancing16, sfFours, defaultClubsOrder, "fours-2026-sf");
assert.strictEqual(groupsFoursSF.length, 4, "Fours SF has 4 groups");

const foursSFMockResults = groupsFoursSF.map((g) => ({
  groupNumber: g.groupNumber,
  results: [
    { clubId: g.clubIds[0]!, points: 40 },
    { clubId: g.clubIds[1]!, points: 30 },
    { clubId: g.clubIds[2]!, points: 20 },
    { clubId: g.clubIds[3]!, points: 10 },
  ],
}));

const advancementFoursSF = resolveRoundAdvancement(foursSFMockResults, sfFours, defaultClubsOrder);
assert.strictEqual(advancementFoursSF.status, "resolved");
if (advancementFoursSF.status === "resolved") {
  assert.strictEqual(advancementFoursSF.allAdvancing.length, 4, "4 advancing in Fours SF to Final");
}

// Pairs Round 1 -> 24 clubs
const pairsR1MockResults = groupsPairsR1.map((g) => ({
  groupNumber: g.groupNumber,
  results: [
    { clubId: g.clubIds[0]!, points: 50 },
    { clubId: g.clubIds[1]!, points: 40 },
    { clubId: g.clubIds[2]!, points: 30 },
    { clubId: g.clubIds[3]!, points: 20 },
    { clubId: g.clubIds[4]!, points: 10 },
    { clubId: g.clubIds[5]!, points: 0 },
  ],
}));

const advancementPairsR1 = resolveRoundAdvancement(pairsR1MockResults, r1Pairs, defaultClubsOrder);
assert.strictEqual(advancementPairsR1.status, "resolved");
if (advancementPairsR1.status === "resolved") {
  assert.strictEqual(advancementPairsR1.allAdvancing.length, 24, "24 advancing in Pairs R1");
}

// Pairs Round 2 -> 12 clubs
const r2Pairs = pairsDef.rounds[1]!;
const advancingPairs24 = (advancementPairsR1 as { allAdvancing: string[] }).allAdvancing;
const groupsPairsR2 = resolveNextRound(advancingPairs24, r2Pairs, defaultClubsOrder, "pairs-2026-r2");
assert.strictEqual(groupsPairsR2.length, 4, "Pairs R2 has 4 groups");

const pairsR2MockResults = groupsPairsR2.map((g) => ({
  groupNumber: g.groupNumber,
  results: [
    { clubId: g.clubIds[0]!, points: 50 },
    { clubId: g.clubIds[1]!, points: 40 },
    { clubId: g.clubIds[2]!, points: 30 },
    { clubId: g.clubIds[3]!, points: 20 },
    { clubId: g.clubIds[4]!, points: 10 },
    { clubId: g.clubIds[5]!, points: 0 },
  ],
}));

const advancementPairsR2 = resolveRoundAdvancement(pairsR2MockResults, r2Pairs, defaultClubsOrder);
assert.strictEqual(advancementPairsR2.status, "resolved");
if (advancementPairsR2.status === "resolved") {
  assert.strictEqual(advancementPairsR2.allAdvancing.length, 12, "12 advancing in Pairs R2");
}

// Pairs Semifinals -> 6 clubs
const sfPairs = pairsDef.rounds[2]!;
const advancingPairs12 = (advancementPairsR2 as { allAdvancing: string[] }).allAdvancing;
const groupsPairsSF = resolveNextRound(advancingPairs12, sfPairs, defaultClubsOrder, "pairs-2026-sf");
assert.strictEqual(groupsPairsSF.length, 2, "Pairs SF has 2 groups");

const pairsSFMockResults = groupsPairsSF.map((g) => ({
  groupNumber: g.groupNumber,
  results: [
    { clubId: g.clubIds[0]!, points: 50 },
    { clubId: g.clubIds[1]!, points: 40 },
    { clubId: g.clubIds[2]!, points: 30 },
    { clubId: g.clubIds[3]!, points: 20 },
    { clubId: g.clubIds[4]!, points: 10 },
    { clubId: g.clubIds[5]!, points: 0 },
  ],
}));

const advancementPairsSF = resolveRoundAdvancement(pairsSFMockResults, sfPairs, defaultClubsOrder);
assert.strictEqual(advancementPairsSF.status, "resolved");
if (advancementPairsSF.status === "resolved") {
  assert.strictEqual(advancementPairsSF.allAdvancing.length, 6, "6 advancing in Pairs SF to Final");
}

console.log("✓ All advancement numbers verified:");
console.log("  - Fours: 32 -> 16 -> 4 (with 8 best 3rd wildcards)");
console.log("  - Pairs: 24 -> 12 -> 6");
console.log("=== ALL TESTS PASSED SUCCESSFULLY! ===");
