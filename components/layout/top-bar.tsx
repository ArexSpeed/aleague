import { Bell, Search, User, Zap } from "lucide-react";

/**
 * Static for now: popups (notifications, profile, theme toggle) and live data
 * come in later steps. Mock values below are placeholders.
 */
export function TopBar() {
  return (
    <header className="relative z-30 flex h-12 shrink-0 items-center justify-between gap-2 border-b border-white/10 bg-shell px-3 text-shell-foreground sm:px-4">
      {/* Left: logo + current competition chip */}
      <div className="flex items-center gap-3">
        <div
          className="flex size-8 items-center justify-center rounded-xl border border-brand/50 bg-linear-to-tr from-brand to-shell shadow-md"
          title="Apex Dynamic Sport"
        >
          <Zap className="size-4 fill-positive text-positive" aria-hidden />
        </div>
        <span className="hidden rounded-lg border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-bold text-gray-300 sm:inline-flex">
          Premier League
        </span>
      </div>

      {/* Center: live match ticker */}
      <button
        type="button"
        className="flex min-w-0 items-center gap-2 rounded-full border border-white/10 bg-shell-surface px-3 py-1 text-xs transition-colors hover:bg-shell-surface-hover"
        title="Przejdź do meczu na żywo"
      >
        <span className="size-2 shrink-0 rounded-full bg-negative" aria-hidden />
        <span className="truncate font-mono font-bold text-gray-300">
          MCI <strong className="text-white">2 - 1</strong> ARS
        </span>
        <span className="shrink-0 rounded bg-black/40 px-1.5 py-0.5 font-mono text-[10px] font-bold text-positive">
          74’ LIVE
        </span>
      </button>

      {/* Right: search, notifications, profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative hidden md:block">
          <Search
            className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-shell-muted"
            aria-hidden
          />
          <input
            type="search"
            placeholder="Szukaj w bazie..."
            aria-label="Szukaj w bazie"
            className="w-36 rounded-xl border border-white/10 bg-white/5 py-1 pr-2.5 pl-8 text-xs text-white transition-all placeholder:text-gray-500 hover:bg-white/10 focus:w-56 focus:border-brand focus:bg-shell-surface focus:outline-none lg:w-44"
          />
        </div>

        <button
          type="button"
          className="relative rounded-xl bg-white/5 p-1.5 text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
          title="Powiadomienia"
          aria-label="Powiadomienia"
        >
          <Bell className="size-4" aria-hidden />
          <span className="absolute top-1 right-1 size-1.5 rounded-full bg-negative" />
        </button>

        <button
          type="button"
          className="flex size-8 items-center justify-center rounded-full border-2 border-positive bg-shell-surface text-gray-300 transition-colors hover:border-white"
          title="Profil i ustawienia"
          aria-label="Profil użytkownika"
        >
          <User className="size-4" aria-hidden />
        </button>
      </div>
    </header>
  );
}
