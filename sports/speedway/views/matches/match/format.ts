const dayMonth = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

/** "2026-09-06" -> "6 Sep". Noon UTC avoids day shifts. TODO: move to lib/format with i18n. */
export function formatDayMonth(date: string): string {
  return dayMonth.format(new Date(`${date}T12:00:00Z`));
}
