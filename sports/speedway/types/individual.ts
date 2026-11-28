import { z } from "zod";

const positiveInt = z.number().int().positive();

export const INDIVIDUAL_DIVISIONS = ["junior", "open"] as const;
export const individualDivisionSchema = z.enum(INDIVIDUAL_DIVISIONS);
export type IndividualDivision = z.infer<typeof individualDivisionSchema>;

/** Key of one cycle in `override`: "<nation code, lower case>-<division>", e.g. "ark-junior". */
export const cycleKeySchema = z.string().regex(/^[a-z]{3}-(junior|open)$/);

/**
 * Individual > Country: one cycle per nation and division, `tournaments` tournaments of
 * `ridersPerTournament` riders each. Everything a season may change lives here, not in code.
 */
export const individualDefinitionSchema = z
  .object({
    id: z.literal("individual-country"),
    format: z.literal("individual-16"),
    /** Tournaments in one cycle (T1..Tn). */
    tournaments: positiveInt,
    ridersPerTournament: positiveInt,
    divisions: z.array(individualDivisionSchema).min(1),
    /**
     * How the riders of a cycle are picked. Done once, when the first tournament starts, then the
     * same riders ride the whole cycle. Ranking: season average points per heat (`avgHeat` of
     * the league stats), best first.
     */
    selection: z.object({
      metric: z.literal("season-avg-heat"),
      lock: z.literal("first-tournament-start"),
      /** Riders with fewer heats than this rank after the others (a 3.0 from one heat is no form). */
      minHeats: z.number().int().nonnegative(),
      /** Order among riders without enough heats, and for everybody before any heat is played. */
      fallback: z.literal("skills-mean"),
    }),
    stages: z.object({
      direct: positiveInt,
      semifinal: positiveInt,
      semifinalAdvance: positiveInt,
    }),
    /** Hand-picked riders per cycle key. Wins over the automatic selection. */
    override: z.record(cycleKeySchema, z.array(z.string().min(1))).default({}),
    /** Base seed; start numbers use `<seed>-<nation>-<division>-t<n>`, see `startNumberSeed`. */
    seed: z.string().min(1),
    scoring: z.object({
      /** Points for places 1-4 in every heat: regular, semi-final and final. */
      heatPoints: z.tuple([
        z.number().int().nonnegative(),
        z.number().int().nonnegative(),
        z.number().int().nonnegative(),
        z.number().int().nonnegative(),
      ]),
      /** Which stages add to the tournament points (the semi-final does not, like in SEC). */
      counts: z.object({ regular: z.boolean(), semifinal: z.boolean(), final: z.boolean() }),
    }),
    notes: z.array(z.string()).default([]),
  })
  .superRefine((def, ctx) => {
    const issue = (message: string, path: (string | number)[]) =>
      ctx.addIssue({ code: "custom", message, path });

    if (new Set(def.divisions).size !== def.divisions.length)
      issue("duplicate division", ["divisions"]);

    const points = def.scoring.heatPoints;
    if (points.some((value, i) => i > 0 && value > points[i - 1]!)) {
      issue("points must not grow with the place", ["scoring", "heatPoints"]);
    }

    for (const [key, riderIds] of Object.entries(def.override)) {
      if (riderIds.length !== def.ridersPerTournament) {
        issue(`expected ${def.ridersPerTournament} riders, got ${riderIds.length}`, [
          "override",
          key,
        ]);
      }
      if (new Set(riderIds).size !== riderIds.length) issue("duplicate rider", ["override", key]);
      if (!def.divisions.includes(key.split("-")[1] as IndividualDivision)) {
        issue("division is not in the definition", ["override", key]);
      }
    }
    const { direct, semifinal, semifinalAdvance } = def.stages;
    if (direct + semifinalAdvance !== 4) issue("a final has 4 riders", ["stages"]);
    if (semifinal !== 4) issue("a semi-final has 4 riders", ["stages", "semifinal"]);
    if (semifinalAdvance >= semifinal) issue("someone must drop out of the semi-final", ["stages"]);
    if (direct + semifinal > def.ridersPerTournament) issue("more places than riders", ["stages"]);
  });

export type IndividualDefinition = z.infer<typeof individualDefinitionSchema>;
export const INDIVIDUAL_STAGES = ["regular", "semifinal", "final"] as const;
export type IndividualStage = (typeof INDIVIDUAL_STAGES)[number];

/** A played heat of a tournament: only who finished where. Points follow from the scoring. */
export const individualHeatResultSchema = z.object({
  /** 1-20 regular, 21 semi-final, 22 final. */
  number: positiveInt,
  stage: z.enum(INDIVIDUAL_STAGES),
  riders: z
    .array(z.object({ riderId: z.string().min(1), position: z.number().int().min(1).max(4) }))
    .length(4),
});
export type IndividualHeatResult = z.infer<typeof individualHeatResultSchema>;

/**
 * One tournament of a cycle. It has no teams, so it is not a `Fixture` (home / away). The riders
 * come from the cycle's stored selection, not from the fixture.
 */
export type IndividualFixture = {
  /** individual-country-<nation>-<division>-t<n>, e.g. individual-country-ark-junior-t1. */
  id: string;
  competitionId: IndividualDefinition["id"];
  /** Nation code in lower case, like the `country` filter. */
  country: string;
  division: IndividualDivision;
  /** 1..tournaments */
  tournament: number;
  /** No calendar yet (separate task), 0 = not scheduled. */
  week: number;
};
