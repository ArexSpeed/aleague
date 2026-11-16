import type { Side } from "@/sports/speedway/engine/v1";

export type LineupDraft = {
  /** slot (1-8) -> riderId, only before the first heat */
  squads?: Partial<Record<Side, Record<number, string>>>;
  /** heat -> gate (1-4) -> substitute */
  substitutions?: Record<number, Record<number, { riderId: string; kind: "normal" | "tactic" }>>;
};

export function isJuniorSlot(slotIndex: number): boolean {
  return slotIndex >= 5 && slotIndex <= 7;
}

export function isJuniorRider(rider?: { age?: number; role?: string } | null): boolean {
  if (!rider) return false;
  if (typeof rider.age === "number") return rider.age <= 21;
  return (rider.role ?? "").toLowerCase().includes("junior");
}

export function validateSquad(
  squad: string[],
  riders: Map<string, { age?: number; role?: string }>,
): { ok: true } | { ok: false; reason: string } {
  const seen = new Set<string>();

  for (let slotIndex = 0; slotIndex < squad.length; slotIndex++) {
    const riderId = squad[slotIndex];
    if (!riderId) continue;
    if (seen.has(riderId)) {
      return { ok: false, reason: "A rider can be in the squad only once" };
    }
    seen.add(riderId);

    if (isJuniorSlot(slotIndex)) {
      const rider = riders.get(riderId);
      if (!rider || !isJuniorRider(rider)) {
        return { ok: false, reason: "Only junior riders can fill slots 6-8" };
      }
    }
  }

  return { ok: true };
}

export function changeRider(
  squad: string[],
  slotIndex: number,
  riderId: string,
  riders: Map<string, { age?: number; role?: string }>,
): { ok: true; squad: string[] } | { ok: false; reason: string } {
  const next = [...squad];
  const current = next[slotIndex];
  if (current === riderId) return { ok: true, squad: next };

  const otherIndex = next.indexOf(riderId);
  if (otherIndex >= 0 && otherIndex !== slotIndex) {
    [next[slotIndex], next[otherIndex]] = [next[otherIndex], next[slotIndex]];
  } else {
    next[slotIndex] = riderId;
  }

  const validation = validateSquad(next, riders);
  if (!validation.ok) return { ok: false, reason: validation.reason };
  return { ok: true, squad: next };
}
