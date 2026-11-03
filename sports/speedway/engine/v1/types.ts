/** Engine v1 works on plain data only: no zod, no React, no imports from the app. */

export type SkillKey = "strength" | "technique" | "fighting" | "reflex" | "condition";
export type Skills = Record<SkillKey, number>;

export type EngineRider = Skills & {
  id: string;
  /** Current form in percent (100 = full base skills). */
  form: number;
};

export type Surface = "soft" | "medium" | "hard";
export type Weather = "sun" | "cloud" | "rain";

export type Conditions = {
  /** metres */
  trackLength: number;
  surface: Surface;
  weather: Weather;
};

export type Rng = () => number;

export type Side = "home" | "away";
export type Helmet = "red" | "blue" | "white" | "yellow";

export type SubstitutionKind = "normal" | "tactic";
export type Substitution = { rider: EngineRider; kind: SubstitutionKind };
