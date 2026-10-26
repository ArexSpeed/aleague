const longDate = new Intl.DateTimeFormat("pl-PL", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});

/** "2026-11-01" -> "niedziela, 1 listopada". Noon UTC avoids day shifts. */
export function formatDate(date: string): string {
  return longDate.format(new Date(`${date}T12:00:00Z`));
}
