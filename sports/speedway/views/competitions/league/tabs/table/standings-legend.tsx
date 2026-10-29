const LEGEND = [
  { dot: "bg-rank-gold", label: "Złoty: Mistrz" },
  { dot: "bg-rank-silver", label: "Srebrny: V-ce mistrz" },
  { dot: "bg-rank-bronze", label: "Brązowy: 3. miejsce" },
  { dot: "bg-rank-relegation", label: "Czerwony: Spadek" },
] as const;

export function StandingsLegend() {
  return (
    <ul className="mt-1.5 flex shrink-0 flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-control px-3 py-2 text-[11px] font-semibold text-fg-muted shadow-xs backdrop-blur-xs">
      {LEGEND.map((item) => (
        <li key={item.label} className="flex items-center gap-1.5">
          <span className={`size-2.5 shrink-0 rounded-full shadow-xs ${item.dot}`} aria-hidden />
          <span>{item.label}</span>
        </li>
      ))}
    </ul>
  );
}
