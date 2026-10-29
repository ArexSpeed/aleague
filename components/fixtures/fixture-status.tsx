import { formatShortDate, formatWeekday } from "@/lib/format";

export type FixtureStatus = { text: string; tone: "muted" | "brand" };

type StatusInput = {
  /** YYYY-MM-DD */
  date: string;
  /** HH:MM */
  time: string;
  played: boolean;
  draw: boolean;
};

/** `today` is YYYY-MM-DD in the app's time zone (see todayIso in lib/format). */
export function getFixtureStatus({ date, time, played, draw }: StatusInput, today: string): FixtureStatus {
  if (played) {
    return { text: `${draw ? "Remis" : "Zakończony"} • ${formatShortDate(date)}`, tone: "muted" };
  }
  if (date === today) return { text: `Dziś ${time}`, tone: "brand" };
  return { text: `${formatWeekday(date)} ${time}`, tone: "muted" };
}