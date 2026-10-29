import { Bell, Search, User, Zap } from "lucide-react";

import { ThemeToggle } from "./theme-toggle";

/**
 * Static for now: popups (notifications, profile, theme toggle) and live data
 * come in later steps. Mock values below are placeholders.
 */
export function TopBar({ sportName }: { sportName: string }) {
  return (
    <header
      data-region="shell"
      className="relative z-30 flex h-12 shrink-0 items-center justify-between gap-2 bg-shell px-3 text-fg sm:px-4"
    >
      {/* Left: logo + current sport chip */}
      <div className="flex items-center gap-3">
        <div
          className="flex size-8 items-center justify-center rounded-xl border border-brand/50 bg-linear-to-tr from-brand to-shell shadow-md"
          title="Apex Dynamic Sport"
        >
          <Zap className="size-4 fill-positive text-positive" aria-hidden />
        </div>
        <span className="hidden rounded-lg border border-line bg-surface px-2 py-0.5 text-[11px] font-bold text-fg-muted sm:inline-flex">
          {sportName}
        </span>
      </div>

      {/* Center: live match ticker */}
      <button
        type="button"
        className="flex min-w-0 items-center gap-2 rounded-full border border-line bg-shell-surface px-3 py-1 text-xs transition-colors hover:bg-shell-surface-hover"
        title="Przejdź do meczu na żywo"
      >
        <span className="size-2 shrink-0 rounded-full bg-negative" aria-hidden />
        <span className="truncate font-mono font-bold text-fg-muted">
          MCI <strong className="text-fg">2 - 1</strong> ARS
        </span>
        <span className="shrink-0 rounded bg-black/40 px-1.5 py-0.5 font-mono text-[10px] font-bold text-positive">
          74’ LIVE
        </span>
      </button>

      {/* Right: search, notifications, profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative hidden md:block">
          <Search
            className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-fg-faint"
            aria-hidden
          />
          <input
            type="search"
            placeholder="Szukaj w bazie..."
            aria-label="Szukaj w bazie"
            className="w-36 rounded-xl border border-line bg-surface py-1 pr-2.5 pl-8 text-xs text-fg transition-all placeholder:text-fg-faint hover:bg-surface-hover focus:w-56 focus:border-brand focus:bg-shell-surface focus:outline-none lg:w-44"
          />
        </div>

        <ThemeToggle />

        <button
          type="button"
          className="relative rounded-xl bg-surface p-1.5 text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg"
          title="Powiadomienia"
          aria-label="Powiadomienia"
        >
          <Bell className="size-4" aria-hidden />
          <span className="absolute top-1 right-1 size-1.5 rounded-full bg-negative" />
        </button>

        <button
          type="button"
          className="flex size-8 items-center justify-center rounded-full border-2 border-positive bg-shell-surface text-fg-muted transition-colors hover:border-fg"
          title="Profil i ustawienia"
          aria-label="Profil użytkownika"
        >
          <User className="size-4" aria-hidden />
        </button>
      </div>
    </header>
  );
}
