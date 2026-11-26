# Kontekst

Robię w Next.js 16 (App Router, TS, Zod, pnpm, bez folderu src/) symulator żużla "aleague".
Pracujemy małymi krokami: dostaję kod do skopiowania, z oznaczeniem "NOWY PLIK / ZAMIEŃ / DOPISZ".
Odpowiadaj po polsku, widoki i etykiety UI po angielsku.

Cup (puchar klasyfikacyjny, 48 klubów, nikt nie odpada) wg docs/competitions/cup.md.

## Zrobione

- Logika pucharu (sim/cup/*), testy w scripts/check-cup-*.ts, akcje z `ActionResult`
- `api/cup.ts`: getCupFixturesView, getCupTableView, getCupTeamDetail, getCupFixture
- UI pucharu w views/competitions/cup/: cup-page, search-params (CUP_FILTERS na defineFilters:
  schedule, view; param team), cup-toolbar, cup-fixtures-view, cup-table-view,
  cup-team-panel, cup-aside, cup-sim-bar
- Fixtures i Table używają klocków z components/ (FixtureList, FixtureCard, TableRow,
  Column, toggle'e); CompetitionSkeleton przyjmuje opcjonalny prop `aside`
- SimButton kliencki z useActionState, pokazuje błąd z akcji
- `sim/stats.ts` filtruje po `competitionId` (domyślnie tylko ligi), `computeTeamStats(matches, filter)`
- Zakładka Stats pucharu pokazuje dziś "No data yet" (fallback skeletona)

## Ustalone zasady

- Statystyki pucharu liczone wyłącznie z meczów pucharowych (competitionId === CUP_DEFINITION.id,
  tag `cup-cup`); statystyki ligi bez zmian i bez regresji
- Wygląd identyczny jak League Stats, na tych samych komponentach; puchar dostarcza tylko dane
- Bez zmian w schemacie bazy i bez nowych zależności

# Zadanie: Stats pucharu (zawodnicy)

## Cel
Zakładka Stats w Cup wygląda i działa jak Stats w League, ale pokazuje statystyki
zawodników policzone tylko z meczów pucharowych. Na start: lista zawodników klubów
pucharu ze statystykami 0, które rosną po rozegraniu meczów pucharowych.

## Zakres
1. Rozpoznanie: jak League Stats dostaje dane (api, funkcja liczenia statystyk zawodników,
   kształt wiersza, czy to mock czy dane z sim/stats.ts) i z jakich komponentów się składa.
2. Logika: agregacja statystyk zawodników z filtrem po competitionId (jak computeTeamStats).
   Test scripts/check-cup-stats.ts: przed meczami wszystko 0; po symulacji rundy liczą się
   tylko mecze pucharowe; mecze ligowe nie wpływają na wynik pucharu i odwrotnie.
3. API: `getCupStatsView()` w api/cup.ts zwracające dane w kształcie, którego oczekuje UI ligi
   (np. LeagueRider), żeby nie kopiować komponentów. Zawodnicy bez meczów = same zera.
4. Parametry URL: filtry Stats ligi (np. metrics, venue, sortowanie) dopisane do CUP_FILTERS
   z tabs: ["stats"], bez kopiowania search-params ligi.
5. Widok: cup-stats-view na komponentach ligi (toolbar, tabela, wiersz); jeśli któryś klocek
   jest związany z LeagueParams / buildLeagueHref, uogólnić go (hrefFor jako prop),
   nie kopiować.
6. cup-page: tab stats renderuje nowy widok; History zostaje "No data yet".

## Poza zakresem
History, statystyki drużyn, SuperCup, ranking Elo, bieg dodatkowy, rider aside (jeśli liga go ma,
osobne zadanie).

## Kryteria akceptacji
- [ ] `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm build` przechodzą
- [ ] `pnpm exec tsx scripts/check-cup-stats.ts` przechodzi
- [ ] Stats pucharu bez rozegranych meczów: lista zawodników z zerami (nie "No data yet")
- [ ] Po "Simulate Round 1" liczby rosną tylko dla zawodników z tych meczów
- [ ] Wygląd zgodny z League Stats, filtry w URL
- [ ] Liga i inne rozgrywki bez regresji (statystyki ligi bez zmian po symulacji pucharu)

## Otwarte decyzje
- Home/Away w pucharze: zostawić All / Home / Away (każda noga ma gospodarza) czy tylko All
- Czy pokazywać wszystkich zawodników 48 klubów od razu (długa lista), czy sortować
  po punktach i ucinać do N
- Czy zawodnicy w tabeli klikają się do aside (zależy od tego, jak robi to liga)