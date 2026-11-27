export function formatBilans(value: number): string {
  return value > 0 ? `+${value}` : String(value);
}

export function winRate(won: number, games: number): number {
  return games > 0 ? Math.round((won / games) * 100) : 0;
}