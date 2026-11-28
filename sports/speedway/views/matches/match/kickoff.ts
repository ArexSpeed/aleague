import { formatDayMonth } from "./format";

/** "12 Nov · 18:00", "12 Nov" or "Date TBD" when the match has no date yet. */
export function kickoffLabel(match: { date: string | null; time: string | null }): string {
  if (!match.date) return "Date TBD";
  return match.time ? `${formatDayMonth(match.date)} · ${match.time}` : formatDayMonth(match.date);
}