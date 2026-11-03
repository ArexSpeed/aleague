/**
 * Simulation tools (Start / Set buttons, simulate match and round) exist only when SIM_TOOLS=true,
 * so the same code can run as the test version (env on) and as the real game (env off).
 * SIM_LUCK (default 1) is the engine's luck knob, see engine/v1/heat.ts.
 */
export const isSimEnabled = () => {
  const flag = process.env.SIM_TOOLS;
  if (flag === "true") return true;
  if (flag === "false") return false;
  return process.env.NODE_ENV !== "production";
};

export function simLuck(): number {
  const luck = Number(process.env.SIM_LUCK);
  return Number.isFinite(luck) && luck > 0 ? luck : 1;
}
