# Folder structure

One implementation of pages for every sport, plus per-sport modules for what differs.
Dependencies point one way: `app → sports/<sport> → components, lib`.

```text
app/
├── globals.css                    imports only
├── styles/
│   ├── themes/light.css, dark.css colour VALUES per theme (edit colours here)
│   ├── regions.css                surface/fg/line... per region (shell vs main)
│   ├── theme-map.css              variables -> Tailwind utilities
│   └── utilities.css
├── layout.tsx                     ThemeProvider
├── page.tsx                       redirect to /<default sport>/home
└── (app)/[sport]/                 generic routes, sport validated in layout
    ├── layout.tsx                 AppShell for the sport
    ├── home/page.tsx
    ├── teams/page.tsx
    └── competitions/
        ├── page.tsx               -> first available type
        └── [type]/page.tsx        league | cup | tournaments | individual | national

sports/
├── types.ts                       SportId, SportConfig, SportModule
├── registry.ts                    the only place that lists all sports
└── speedway/
    ├── index.ts                   SportModule: config + views
    ├── config.ts                  names, vocabulary, competition types
    ├── api/ mocks/ types/         data layer of this sport
    └── views/
        ├── home/  teams/
        └── competitions/league/
            ├── league-page.tsx    master + aside
            ├── league-view.tsx    tabs + filters + TAB_CONTENT
            ├── search-params.ts   URL state
            ├── tabs/table, tabs/fixtures
            └── aside/team, aside/match

components/                        shared bricks, no sport knowledge
├── ui/                            shadcn (Base UI)
├── layout/                        app-shell, nav, top-bar, master-detail, theme-toggle
├── table/                         TableRow, TableHeader, row-lead, Column
├── toggle/                        SegmentedControl, ViewModeToggle, VenueToggle
├── tabs/                          TabNav (master and aside variants)
├── data/                          StatCard, InfoCard, ResultBadge
└── providers/                     ThemeProvider
lib/                               utils, format, paths, navigation, themes
stores/                            Zustand, UI state only
```

## Adding a sport
1. `SportId` union in `sports/types.ts`, folder `sports/<id>/` with `config.ts`, `index.ts`, `views/...`.
2. Register it in `sports/registry.ts` and in `SPORTS` in `eslint.config.mjs`.
3. Routes, nav and TopBar pick it up automatically.

## Adding a competition view
Build `sports/<id>/views/competitions/<type>/...-page.tsx` and add it to `competitionViews` in the sport's `index.ts`. Types without a view show a placeholder.

## Theming
Components use semantic classes only (`bg-surface text-fg text-fg-muted border-line text-win`).
`data-region="main|shell"` decides what they resolve to, `data-theme` (next-themes) decides the palette.
New theme = new `themes/<id>.css` + a line in `lib/themes.ts`.
