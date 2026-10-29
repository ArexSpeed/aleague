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
const shortDate = new Intl.DateTimeFormat("pl-PL", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});
const weekday = new Intl.DateTimeFormat("pl-PL", { weekday: "long", timeZone: "UTC" });

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** "2026-10-24" -> "24 Paź" */
export function formatShortDate(date: string): string {
  const [day, ...month] = shortDate.format(new Date(`${date}T12:00:00Z`)).split(" ");
  return `${day} ${capitalize(month.join(" "))}`;
}

/** "2026-10-30" -> "Piątek" */
export function formatWeekday(date: string): string {
  return capitalize(weekday.format(new Date(`${date}T12:00:00Z`)));
}

/** Today as YYYY-MM-DD in the app's time zone (not the server's). */
export function todayIso(timeZone = "Europe/Warsaw"): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone }).format(new Date());
}
