import { formatShortDate, formatWeekday } from "@/lib/format";

export type FixtureStatus = { text: string; tone: "muted" | "brand" };

type StatusInput = {
  /** YYYY-MM-DD, null when the competition has no calendar (cup). */
  date: string | null;
  /** HH:MM, null when unknown. */
  time: string | null;
  played: boolean;
  draw: boolean;
};

/** `today` is YYYY-MM-DD in the app's time zone (see todayIso in lib/format). */
export function getFixtureStatus({ date, time, played, draw }: StatusInput, today: string): FixtureStatus {
  if (played) {
    const label = draw ? "Remis" : "Zakończony";
    return { text: date ? `${label} • ${formatShortDate(date)}` : label, tone: "muted" };
  }
  if (!date) return { text: "Date TBD", tone: "muted" };
  if (date === today) return { text: time ? `Dziś ${time}` : "Dziś", tone: "brand" };
  return { text: time ? `${formatWeekday(date)} ${time}` : formatWeekday(date), tone: "muted" };
}