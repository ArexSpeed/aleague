import { CLUB_BY_REF, TOURNAMENT_BY_ID } from "../data/season";
import { readMatches, type StoredMatch } from "../sim/results-store";
import {
  getDeterministicDefaultClubOrder,
  getTemporaryClubRanking,
} from "../sim/club-ranking";
import {
  drawGroups,
  generateTournamentFixtures,
} from "../sim/tournaments";
import type {
  TournamentDef,
  TournamentRoundDef,
} from "../types/tournaments";

export type TournamentGroupClubView = {
  slot: number;
  clubId: string | null;
  name: string;
  subName?: string;
  short?: string;
  color: string;
  icon?: string;
  points: number | null;
  rank: number | null;
  advancing: boolean;
  wildcardEligible?: boolean;
};

export type TournamentGroupView = {
  groupNumber: number;
  groupLabel: string;
  clubs: TournamentGroupClubView[];
};

export type ThirdPlacedViewItem = {
  rank: number;
  clubId: string | null;
  name: string;
  subName?: string;
  color?: string;
  icon?: string;
  groupNumber: number;
  points: number | null;
  wildcard: boolean;
};

export type TournamentViewData = {
  def: TournamentDef;
  activeRound: TournamentRoundDef;
  rounds: readonly TournamentRoundDef[];
  groups: TournamentGroupView[];
  thirdPlacedRanking?: ThirdPlacedViewItem[];
  rankingStatus: "resolved" | "pending";
  pendingReason?: string;
};

export async function getTournamentData(
  competitionKey: string,
  roundId?: string,
  preview?: boolean,
): Promise<TournamentViewData | { isRegio: true } | null> {
  if (competitionKey === "regio") {
    return { isRegio: true };
  }

  const defId = `tournaments-${competitionKey}`;
  const def = TOURNAMENT_BY_ID.get(defId);
  if (!def) return null;

  const rounds = def.rounds;
  const activeRound = rounds.find((r) => r.id === roundId) ?? rounds[0]!;

  let matches: Record<string, StoredMatch> = {};
  try {
    matches = await readMatches();
  } catch {
    matches = {};
  }
  const manualList = preview || def.manualClubOrder ? (def.manualClubOrder ?? getDeterministicDefaultClubOrder()) : undefined;
  const rankingResult = getTemporaryClubRanking({ matches, manualClubOrder: manualList });

  // If ranking is pending (leagues not finished yet and no manual override)
  if (rankingResult.status === "pending") {
    const allFixtures = generateTournamentFixtures(def);
    const roundFixtures = allFixtures.filter((f) => f.round === activeRound.id);

    const groups: TournamentGroupView[] = roundFixtures.map((f) => ({
      groupNumber: f.group,
      groupLabel: f.groupLabel,
      clubs: f.slots.map((s, idx) => ({
        slot: s.slot,
        clubId: null,
        name: s.name,
        color: "transparent",
        points: null,
        rank: idx + 1,
        advancing: idx < activeRound.advancePerGroup,
        wildcardEligible:
          activeRound.wildcard && idx === activeRound.wildcard.groupRank - 1,
      })),
    }));

    let thirdPlacedRanking: ThirdPlacedViewItem[] | undefined;
    if (def.competition === "tournaments-fours" && activeRound.id === "r1") {
      thirdPlacedRanking = Array.from({ length: 12 }, (_, i) => ({
        rank: i + 1,
        clubId: null,
        name: `3rd place Gr. ${i + 1}`,
        groupNumber: i + 1,
        points: null,
        wildcard: i < 8,
      }));
    }

    return {
      def,
      activeRound,
      rounds,
      groups,
      thirdPlacedRanking,
      rankingStatus: "pending",
      pendingReason:
        "Ligi nie zostały jeszcze zakończone. Grupy zostaną rozlosowane po wyłonieniu końcowej kolejności lig.",
    };
  }

  // Ranking is resolved!
  const clubs = rankingResult.clubs;
  const seed = def.seeds[activeRound.id] ?? `${def.competition}-${activeRound.id}`;

  // For Round 1: groups are drawn from full 48 clubs ranking
  if (activeRound.id === "r1") {
    const draws = drawGroups(clubs, activeRound, seed);
    const groups: TournamentGroupView[] = draws.map((g) => ({
      groupNumber: g.groupNumber,
      groupLabel: `Group ${g.groupNumber}`,
      clubs: g.clubIds.map((clubId, idx) => {
        const club = CLUB_BY_REF.get(clubId);
        return {
          slot: idx + 1,
          clubId,
          name: club ? club.name.split(" ")[0]! : clubId,
          subName: club?.subName,
          short: club?.short,
          color: club?.color ?? "#888888",
          icon: club?.icon,
          points: null,
          rank: idx + 1,
          advancing: idx < activeRound.advancePerGroup,
          wildcardEligible:
            activeRound.wildcard && idx === activeRound.wildcard.groupRank - 1,
        };
      }),
    }));

    let thirdPlacedRanking: ThirdPlacedViewItem[] | undefined;
    if (def.competition === "tournaments-fours") {
      thirdPlacedRanking = groups.map((g, idx) => {
        const thirdClub = g.clubs[2];
        return {
          rank: idx + 1,
          clubId: thirdClub?.clubId ?? null,
          name: thirdClub?.name ?? `3rd place Gr. ${g.groupNumber}`,
          subName: thirdClub?.subName,
          color: thirdClub?.color,
          icon: thirdClub?.icon,
          groupNumber: g.groupNumber,
          points: null,
          wildcard: idx < 8,
        };
      });
    }

    return {
      def,
      activeRound,
      rounds,
      groups,
      thirdPlacedRanking,
      rankingStatus: "resolved",
    };
  }

  // For later rounds (r2, sf, final), prior round matches are not simulated yet
  const allFixtures = generateTournamentFixtures(def);
  const roundFixtures = allFixtures.filter((f) => f.round === activeRound.id);

  const groups: TournamentGroupView[] = roundFixtures.map((f) => ({
    groupNumber: f.group,
    groupLabel: f.groupLabel,
    clubs: f.slots.map((s, idx) => ({
      slot: s.slot,
      clubId: null,
      name: s.name,
      color: "transparent",
      points: null,
      rank: idx + 1,
      advancing: idx < activeRound.advancePerGroup,
      wildcardEligible: false,
    })),
  }));

  return {
    def,
    activeRound,
    rounds,
    groups,
    rankingStatus: "resolved",
    pendingReason:
      "Runda oczekuje na rozegranie meczów i wyłonienie awansujących z poprzedniej rundy.",
  };
}
