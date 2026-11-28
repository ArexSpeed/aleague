import { INDIVIDUAL_DEFINITION, NATIONS, RIDERS } from "@/sports/speedway/data/season";
import { cycleTable, type CycleRow } from "@/sports/speedway/sim/individual/cycle";
import {
  cyclePrefix,
  cycleRecordId,
  cycleRidersProblems,
  isCycleLocked,
} from "@/sports/speedway/sim/individual/cycle-record";
import { selectRiders } from "@/sports/speedway/sim/individual/select";
import { individualFixtureId } from "@/sports/speedway/sim/individual/fixtures";
import { tournamentPoints } from "@/sports/speedway/sim/individual/tournament";
import {
  readMatches,
  readRecordsByPrefix,
  removeMatch,
  saveRecord,
} from "@/sports/speedway/sim/results-store";
import { computeRiderStats } from "@/sports/speedway/sim/stats";
import {
  cycleRecordSchema,
  tournamentRecordSchema,
  type CycleRecord,
  type IndividualDivision,
  type TournamentRecord,
} from "@/sports/speedway/types/individual";
import { divisionPool } from "@/sports/speedway/sim/individual/definition";

const DEFINITION = INDIVIDUAL_DEFINITION;
const RIDER_BY_ID = new Map(RIDERS.map((rider) => [rider.id, rider]));
const riderName = (rider: { firstName: string; lastName: string }) =>
  `${rider.firstName} ${rider.lastName}`;

export type IndividualRiderView = {
  id: string;
  name: string;
  age: number;
  skills: {
    strength: number;
    technique: number;
    fighting: number;
    reflex: number;
    condition: number;
  };
};

export type IndividualCycleView = {
  riders: IndividualRiderView[];
  /** false = a preview from the current season average, nothing is stored yet. */
  stored: boolean;
  /** true = the first heat was ridden, the riders can no longer change. */
  locked: boolean;
  manual: boolean;
};

export type IndividualTableRow = CycleRow & { name: string };

export type IndividualTableView = {
  cycle: IndividualCycleView;
  rows: IndividualTableRow[];
  /** Tournaments (T1..Tn) with at least one heat ridden. */
  played: number[];
};

const toNameOrId = (id: string) => {
  const rider = RIDER_BY_ID.get(id);
  return rider ? riderName(rider) : id;
};

const toView = (riderIds: readonly string[]): IndividualRiderView[] =>
  riderIds.map((id) => {
    const rider = RIDER_BY_ID.get(id);
    if (!rider) throw new Error(`Unknown rider ${id}`);
    return {
      id,
      name: riderName(rider),
      age: rider.age,
      skills: {
        strength: rider.strength,
        technique: rider.technique,
        fighting: rider.fighting,
        reflex: rider.reflex,
        condition: rider.condition,
      },
    };
  });

/** Season average points per heat from the league matches (the selection ranking). */
async function seasonAverages() {
  const stats = computeRiderStats(await readMatches());
  return new Map([...stats].map(([id, s]) => [id, { heats: s.heats, avgHeat: s.avgHeat }]));
}

async function pick(country: string, division: IndividualDivision, override?: readonly string[]) {
  return selectRiders({
    riders: RIDERS,
    country,
    division,
    stats: await seasonAverages(),
    selection: DEFINITION.selection,
    count: DEFINITION.ridersPerTournament,
    override: override ?? DEFINITION.override[`${country.toLowerCase()}-${division}`],
  });
}

type CycleData = { record: CycleRecord | null; tournaments: Map<number, TournamentRecord> };

async function readCycleData(country: string, division: IndividualDivision): Promise<CycleData> {
  const raw = await readRecordsByPrefix(cyclePrefix(DEFINITION.id, country, division));
  const cycleId = cycleRecordId(DEFINITION.id, country, division);
  const recordRaw = raw.get(cycleId);
  const tournaments = new Map<number, TournamentRecord>();
  for (let n = 1; n <= DEFINITION.tournaments; n++) {
    const data = raw.get(individualFixtureId(DEFINITION.id, country, division, n));
    if (data) tournaments.set(n, tournamentRecordSchema.parse(data));
  }
  return { record: recordRaw ? cycleRecordSchema.parse(recordRaw) : null, tournaments };
}

/** The riders of a cycle: the stored ones, otherwise a preview from the season average. */
export async function getIndividualCycle(
  country: string,
  division: IndividualDivision,
): Promise<IndividualCycleView> {
  const { record, tournaments } = await readCycleData(country, division);
  const locked = isCycleLocked([...tournaments.values()]);
  if (record)
    return { riders: toView(record.riderIds), stored: true, locked, manual: record.manual };
  return { riders: toView(await pick(country, division)), stored: false, locked, manual: false };
}

/**
 * Freezes the cycle's riders (the automatic pick). Called when the first tournament starts.
 * Does nothing when the cycle is already stored.
 */
export async function ensureCycle(
  country: string,
  division: IndividualDivision,
): Promise<CycleRecord> {
  const { record } = await readCycleData(country, division);
  if (record) return record;
  const created: CycleRecord = {
    riderIds: await pick(country, division),
    selectedAt: new Date().toISOString(),
    manual: false,
  };
  await saveRecord(cycleRecordId(DEFINITION.id, country, division), created);
  return created;
}

/** Hand-picked riders. Allowed only until the first heat; returns the problems, empty = saved. */
export async function saveCycleRiders(
  country: string,
  division: IndividualDivision,
  riderIds: readonly string[],
): Promise<string[]> {
  const nation = NATIONS.find((item) => item.code.toLowerCase() === country.toLowerCase());
  if (!nation) return [`Unknown country ${country}`];

  const { tournaments } = await readCycleData(country, division);
  if (isCycleLocked([...tournaments.values()]))
    return ["The cycle has started, the riders are locked"];

  const problems = cycleRidersProblems(
    riderIds,
    RIDERS,
    nation.code,
    division,
    DEFINITION.ridersPerTournament,
  );
  if (problems.length) return problems;

  const record: CycleRecord = {
    riderIds: [...riderIds],
    selectedAt: new Date().toISOString(),
    manual: true,
  };
  await saveRecord(cycleRecordId(DEFINITION.id, country, division), record);
  return [];
}

/** Cycle table: tournament points of T1..Tn and the total. */
export async function getIndividualTable(
  country: string,
  division: IndividualDivision,
): Promise<IndividualTableView> {
  const { record, tournaments } = await readCycleData(country, division);
  const locked = isCycleLocked([...tournaments.values()]);
  const riderIds = record?.riderIds ?? (await pick(country, division));

  const perTournament = Array.from({ length: DEFINITION.tournaments }, (_, i) => {
    const tournament = tournaments.get(i + 1);
    if (!tournament || tournament.heats.length === 0) return null;
    const rows = tournamentPoints(tournament.heats, riderIds, DEFINITION.scoring);
    return new Map([...rows].map(([id, row]) => [id, row.total]));
  });

  const rows = cycleTable(riderIds, perTournament).map((row) => ({
    ...row,
    name: toNameOrId(row.riderId),
  }));

  return {
    cycle: {
      riders: toView(riderIds),
      stored: Boolean(record),
      locked,
      manual: record?.manual ?? false,
    },
    rows,
    played: perTournament.flatMap((points, i) => (points ? [i + 1] : [])),
  };
}

export type IndividualTournamentStatus = "not-started" | "in-progress" | "finished";

export type IndividualTournamentView = {
  id: string;
  tournament: number;
  status: IndividualTournamentStatus;
  /** Heats ridden so far, of `heatsTotal` (20 regular + semi-final + final). */
  heatsPlayed: number;
  heatsTotal: number;
};

/** T1..Tn of one cycle with their state. */
export async function getIndividualFixtures(
  country: string,
  division: IndividualDivision,
): Promise<IndividualTournamentView[]> {
  const { tournaments } = await readCycleData(country, division);
  const heatsTotal = 22;
  return Array.from({ length: DEFINITION.tournaments }, (_, i) => {
    const heatsPlayed = tournaments.get(i + 1)?.heats.length ?? 0;
    return {
      id: individualFixtureId(DEFINITION.id, country.toLowerCase(), division, i + 1),
      tournament: i + 1,
      status:
        heatsPlayed === 0 ? "not-started" : heatsPlayed >= heatsTotal ? "finished" : "in-progress",
      heatsPlayed,
      heatsTotal,
    };
  });
}

export type IndividualPoolRider = IndividualRiderView & { heats: number; avgHeat: number };

/** Everybody who may ride the cycle (nation x division) with the season average, best first. */
export async function getIndividualPool(
  country: string,
  division: IndividualDivision,
): Promise<IndividualPoolRider[]> {
  const stats = await seasonAverages();
  return divisionPool(RIDERS, country, division)
    .map((rider) => ({
      ...toView([rider.id])[0]!,
      heats: stats.get(rider.id)?.heats ?? 0,
      avgHeat: stats.get(rider.id)?.avgHeat ?? 0,
    }))
    .sort((a, b) => b.avgHeat - a.avgHeat || a.name.localeCompare(b.name));
}

/** Back to the automatic pick: drops the stored riders. Allowed only until the first heat. */
export async function resetCycleRiders(
  country: string,
  division: IndividualDivision,
): Promise<string[]> {
  const { tournaments } = await readCycleData(country, division);
  if (isCycleLocked([...tournaments.values()]))
    return ["The cycle has started, the riders are locked"];
  await removeMatch(cycleRecordId(DEFINITION.id, country, division), false);
  return [];
}
