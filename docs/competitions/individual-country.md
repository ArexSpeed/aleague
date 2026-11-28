## [FEATURE] Individual → Country: cykl 3 turniejów (wybór szesnastki, tabela, terminarz, aside; bez symulacji)

### Cel

W Competitions dla `kind=individual`, `competition=country` działa cykl rozgrywek indywidualnych zgodnie z `docs/competitions/individual.md`: dla każdego z 8 narodów i każdej dywizji (Junior, Open) trzy turnieje po 16 zawodników, tabela cyklu jako suma punktów z turniejów. Strona ma taby i aside jak Cup: Table, Fixtures, Stats, History oraz panel zawodnika w asidzie. Bez symulacji i bez strony turnieju z biegami (osobne zadanie `docs/tasks/match-format/individual-16.md`).

### Kontekst

- Specyfikacja: `docs/competitions/individual.md` i `docs/match-format/individual-16.md` (już w repo, przeczytaj je w całości przed zmianami).
- `kind=individual` istnieje w `sports/speedway/competitions-config.ts` (linie: `competition` Country / Helmet / GP, `country` z ośmioma kodami, `category` Helmet, `division` Junior / Senior tylko dla Helmet, taby `COMMON_TABS`, domyślnie `competition=country&country=ark&tab=table`), ale `competitionViews` w `sports/speedway/index.ts` nie ma `individual`, więc dziś jest placeholder. Dodaj `IndividualPage`.
- Wzorzec układu to Cup (`views/competitions/cup/`): `cup-page.tsx` (Suspense, treść, `CompetitionSkeleton` z `aside`), `search-params.ts` (`defineFilters`, parse i build href), toolbar, widoki Table, Fixtures i Stats, `cup-aside.tsx` zwracający `{ detail, open, closeHref }`. Tournaments klubowe (`views/competitions/tournaments/`) nie mają asida (`detail={null}`), więc nie są wzorcem dla layoutu.
- `CompetitionSkeleton` buduje linki tabów tylko z `kind`, `competition` i `tab`, czyli przy zmianie taba gubi `country`, `category` i `division`. Dla Individual trzeba je przekazywać dalej.
- Dywizje: filtr `division` ma w konfiguracji id `junior` i `senior` oraz `onlyWhen: "helmet"` (jedna wartość). Country potrzebuje tego filtra z etykietą Open. Rozstrzygnij w diagnozie (patrz Decyzje otwarte).
- Dane: `data/season-1/riders.json` ma 479 zawodników, każdy z polem `nation` (kod trzyliterowy wielkimi literami, w filtrze małymi), 57-65 na naród, w tym 25-31 juniorów. Junior to wiek do 21 lat (`JUNIOR_MAX_AGE` w `engine/v1/squad.ts`, `NATION_JUNIOR_MAX_AGE` w `api/nations.ts`: użyj jednej stałej). Nie ma flagi juniora ani gotowej średniej: licz z umiejętności (`overall` w `engine/v1/squad.ts` to średnia z formą, `mean` w `data/schema.ts` to średnia bez formy).
- Silnik: `simulateHeat` w `engine/v1/heat.ts` jest generyczny (czterech zawodników na torach), ale `MatchSetup`, `HEAT_PROGRAM`, `MATCH_HEATS = 15` i model `Heat` (home/away) zakładają dwie drużyny. Tu nie symulujemy.
- Generator liczb pseudolosowych z ziarnem już jest (`createRng` w `engine/v1/rng`, ziarno jako string). Użyj go.
- Tag: `competition-keys.ts` zawiera `junior`, `helmet`, `gp`, ale nie `country`, a `isCompetitionKey` w `competitions-config.ts` ma własną listę. Tag turniejów to `individual-country` (wzorzec `<kind>-<competition>` jak `nation-league`, `tournaments-fours`). Wyprowadź obie listy z jednego miejsca.
- Mechanizm placeholderów uczestników wyliczanych z wyników istnieje przy Cup (`sim/cup/resolve-fixture.ts`). Jeśli pasuje do uczestników indywidualnych, użyj go.
- Wyniki: `speedway_sim_matches` (Supabase, jsonb, klucz id fixture), `readMatchesByPrefix` w `sim/results-store.ts` ładuje po prefiksie i rzuca przy błędzie. Brak zmian schematu bazy.
- `competitionsHref` w `lib/paths.ts` obsługuje `country`, `category` i `division`, ale nie ma parametru `rider` (Cup używa `team`). Dodaj `rider`.

### Zakres

- konfiguracja rodzajów: filtr `division` dla Country (Junior / Open), poprawka linków tabów, `individual` w `competitionViews`, tag `individual-country`
- definicja cyklu jako dane per sezon (`data/season-1/individual.json`) i generator fixtures turniejów z polem `competition` (`individual-country`), `country`, `division`, `tournament`
- funkcje czyste w `sports/speedway/sim/individual/`: wybór szesnastki, numery startowe, ranking po rundzie Regular, awans, punkty turnieju, tabela cyklu
- widoki w `sports/speedway/views/competitions/individual/` (klocki z `components/` i `views/competitions/shared/`): Table, Fixtures, Stats, History oraz aside z panelem zawodnika
- dane przez `sports/speedway/api/individual.ts`, typy w `sports/speedway/types/individual.ts`
- aktualizacja statusu w `docs/competitions/individual.md`

### Poza zakresem

- Symulacja biegów, tabela biegowa, strona turnieju z biegami 1-22 (`docs/tasks/match-format/individual-16.md`)
- Helmet i GP (pusty stan "Not defined yet", jak SuperCup)
- Interfejs edycji szesnastki (w danych jest pole `override`, ręcznie w JSON)
- Ranking zawodników i klubów, kalendarz i daty, kafelki trofeów
- Schemat bazy w Supabase i nowe zależności

### Kroki

**Etap 1: konfiguracja, dane i widok (najmniejsza działająca zmiana)**

1. **Diagnoza (bez zmian w kodzie).** Opisz w PR: jak `CompetitionSkeleton` czyta `country`, `category` i `division` i co zmienić, by Country miał Junior / Open (`onlyWhen` jako lista, id `senior` kontra etykieta Open), czy kody z `COUNTRY_OPTIONS` (małe litery) zgadzają się z `nation` w `riders.json` (wielkie litery), jak liczone są dziś statystyki zawodników (`getCupStatsView`, `computeRiderStats` z filtrem `competitionId`) i czy da się je policzyć dla turnieju indywidualnego, czy filtr `venue` (home / away) ma sens dla zawodnika indywidualnego oraz czy `resolve-fixture.ts` z Cup nadaje się do uczestników indywidualnych.
2. **Konfiguracja i tag.** Filtr `division` dla `competition=country` (Junior / Open), domyślnie Junior lub Open do ustalenia. Linki tabów w `CompetitionSkeleton` niosą `country`, `category` i `division`. `individual` w `competitionViews`. Tag `individual-country` w pliku z kluczami rozgrywek, jedna lista dla `COMPETITION_KEYS` i `isCompetitionKey`. Nieprawidłowe parametry zastępowane domyślnymi, zmiana `competition` czyści `country` i `division`.
3. **Definicja cyklu jako dane (per sezon).** Pola: `id` (`individual-country`), `format` (`individual-16`), `tournaments` (liczba turniejów, tymczasowo 3), `ridersPerTournament` (16), `selection` (metryka: średnia umiejętności, pula Open: wszyscy zawodnicy narodu, pula Junior: wiek do `JUNIOR_MAX_AGE`), `override` (lista id zawodników per naród i dywizja, domyślnie pusta), `seed` (string bazowy, osobne ziarno na turniej), `scoring` (`heatPoints: [3, 2, 1, 0]`, `countInTournament: { regular: true, semifinal: false, final: true }`). Schemat Zod z `.int().positive()` i walidacją spójności (długość `override` równa liczbie zawodników, brak duplikatów, id istnieje w `riders.json`).
4. **Generator fixtures.** 48 turniejów z definicji: id `individual-country-<country>-<division>-t<n>`, pola `competition`, `country`, `division`, `tournament`. Uczestnicy to placeholdery do czasu wyboru szesnastki ("Rider 1" do "Rider 16"). Brak statycznego pliku z fixtures. Liczby (8 narodów, 2 dywizje, 3 turnieje, 16 zawodników) pochodzą z definicji i konfiguracji, nie z kodu generatora.
5. **Strona i parametry URL.** `IndividualPage` (Suspense, treść, `CompetitionSkeleton`), `search-params.ts` w stylu Cup (`defineFilters`: `view`, `schedule`, `metrics`, parametry `rider` i `panel`), toolbar z `ViewModeToggle`. Dla `competition=helmet` i `gp` pusty stan "Not defined yet". Aside tylko dla Country i tabów Table, Fixtures, Stats.
6. **Tab Table (tabela cyklu).** Kolumny przez `Column<T>` jak w `cup-table-view.tsx`: miejsce (`PositionBadge`), zawodnik, T1, T2, T3, Total. Wiersz klika do asida (`rider`). Przed wynikami lista 16 w kolejności wyboru z zerami i komunikat (np. "Available after tournament 1"). Miejsca rozstrzygnięte wyglądają jak w lidze, tymczasowe są przygaszone.
7. **Tab Fixtures.** T1, T2, T3 jako grupy `FixtureList`, w nich karta turnieju: status (Pending, In progress, Finished), liczba rozegranych biegów, zwycięzca, najlepszych 4 po punktach. Karta nie prowadzi do strony turnieju (podpowiedź "Coming soon"), dopóki nie powstanie zadanie `individual-16`. Filtr `schedule` jak w Cup.
8. **Tab Stats i History.** Stats: `StatsToolbar` i `RidersTable` z danymi zawodników cyklu (tag `individual-country`, dywizja), bez filtra `venue` (albo ukryty dla Individual). Przed wynikami puste wartości. History: "No data yet" ze szkieletu.
9. **Aside z panelem zawodnika.** `getIndividualAside(params)` zwraca `{ detail, open, closeHref }` jak `getCupAside`. Na lg+ zawsze widoczny (lider tabeli, gdy nic nie wybrano), na telefonie drawer tylko przy `?rider=`. Nagłówek: imię, nazwisko, naród, wiek, klub. Taby przez `panel`: Stats (punkty T1-T3 i Total, liczba 1., 2., 3. miejsc w biegach, `StatTile`), Tournaments (lista T1-T3 z punktami i miejscem), Details (wiek, klub, umiejętności). Taby panelu to osobna lista (`RIDER_PANEL_TABS`), bo `PANEL_TABS` w `shared/aside/panel-tabs.ts` opisuje panel klubu.
10. **Ładowanie danych.** Tylko turnieje wybranego narodu i dywizji przez `readMatchesByPrefix(["individual-country-<country>-<division>-"])`, bez `readMatches()` dla całego sezonu. Dane przez `api/individual.ts` (funkcje zwracające Promise), kształty w `types/individual.ts` jako schematy Zod.

**Etap 2: wybór szesnastki, punkty i tabela cyklu (funkcje czyste)**

11. **Wybór szesnastki.** `selectRiders(riders, { country, division, metric, override })`: najlepszych 16 według metryki z puli narodu i dywizji, remis rozstrzyga id (deterministycznie). Gdy jest `override`, ma pierwszeństwo, ale walidacja pilnuje puli (Junior tylko wiek do 21 lat). Zwraca "nierozstrzygnięte", gdy w puli jest mniej niż 16 zawodników.
12. **Numery startowe.** `assignStartNumbers(riders16, seed)`: losowanie numerów 1-16 z `createRng`, ziarno `<seed>-t<n>`, deterministyczne.
13. **Ranking po rundzie Regular.** Punkty z biegów 1-20, remisy: liczba 1., 2., 3. i 4. miejsc w biegach, potem statusy nieukończenia, potem niższy numer startowy wyżej (`TODO: confirm`).
14. **Awans.** Z rankingu: miejsca 1-2 do Final, miejsca 3-6 do Semi-final (placeholdery "Winner of Semi-final" i "2nd of Semi-final" dla Final do czasu biegu 21).
15. **Punkty turnieju.** Funkcja czysta: Regular plus Final, bez Semi-final, zgodnie z `countInTournament` z definicji.
16. **Tabela cyklu.** Suma punktów z trzech turniejów, miejsce, remis: liczba wygranych turniejów, potem wyższe miejsca (`TODO: confirm`). Zwraca miejsca tymczasowe, dopóki nie rozegrano T3.
17. **Testy.** Skrypt `scripts/check-individual-country.ts` (jak `scripts/check-cup-*.ts`), uruchamiany przez `pnpm dlx tsx`, bez nowych zależności. Sprawdza liczby z kryteriów poniżej i powtarzalność losowań. Do czasu dostarczenia tabeli biegowej używa wyników testowych.
18. **Zapis szesnastki i edycja przed startem.** Rekord cyklu `individual-country-<naród>-<dywizja>-cycle` (id zawodników, data, `manual`) w tabeli wyników, ten sam co wyniki. Edycja w UI (`Edit riders`) i powrót do wyboru automatycznego (`Auto pick`) do pierwszego biegu cyklu, potem skład jest zablokowany. `ensureCycle` zamraża skład przy starcie T1 (wywoła go symulacja).
19. Zaktualizuj tabelę statusu w `docs/competitions/individual.md`.

### Kryteria akceptacji

- [ ] Dla `kind=individual` druga linia: Country, Helmet, GP (domyślnie Country), dla Country trzecia linia Country (8 narodów) i czwarta Division (Junior / Open). Zmiana taba nie gubi narodu ani dywizji.
- [ ] W danych jest 48 turniejów (8 narodów × 2 dywizje × 3), każdy z polem `competition: "individual-country"`, `country`, `division`. Liczby pochodzą z definicji.
- [ ] Szesnastka Open: 16 najlepszych zawodników narodu według średniej (w tym juniorzy), szesnastka Junior: 16 najlepszych w wieku do 21 lat, bez duplikatów. `override` ma pierwszeństwo i jest walidowany.
- [ ] Numery startowe 1-16 przydzielone raz każdy, powtarzalne dla tego samego ziarna i różne dla innego.
- [ ] Punkty turnieju to Regular plus Final, bez Semi-final. Tabela cyklu to suma z trzech turniejów.
- [ ] Table pokazuje 16 zawodników z kolumnami T1, T2, T3, Total, Fixtures trzy turnieje, Stats tabelę zawodników, History pusty stan, wszystko bez błędów przed wynikami.
- [ ] Aside: na lg+ zawsze widoczny panel zawodnika z tabami Stats, Tournaments, Details. Na telefonie otwiera się po wybraniu zawodnika i zamyka bez zmiany reszty parametrów.
- [ ] Karty turniejów nie prowadzą do strony turnieju ("Coming soon"). Helmet i GP pokazują "Not defined yet".
- [ ] Ligi klubowe, Cup, Nations, Tournaments i inne rodzaje bez regresji, brak zmian w schemacie bazy i nowych zależności.
- [ ] `pnpm typecheck && pnpm lint && pnpm build` przechodzą.

### Do poprawy / propozycje

- [DO UZUPEŁNIENIA: metryka wyboru szesnastki (średnia umiejętności bez formy, propozycja, albo `overall` z formą).]
- [DO UZUPEŁNIENIA: czy lista szesnastki może się zmieniać między turniejami.]
- [DO UZUPEŁNIENIA: czy zawodnik może jechać w cyklu Junior i Open tego samego narodu jednocześnie (propozycja: tak).]
- [DO UZUPEŁNIENIA: remisy w tabeli cyklu.]
- Propozycja: osobny krok "Edycja szesnastki" w UI (zamiana zawodnika, walidacja dokładnie 16 i puli dywizji), zapis jako `override`.
- Propozycja: panel "Qualified riders" w tabie Table z listą szesnastki i średnią, z której wynikał wybór.
- Propozycja: po zadaniu `individual-16` uogólnić przycisk "Simulate round" na turnieje cyklu.

### Decyzje otwarte

- Identyfikator i etykieta dywizji Open: zostawić id `senior` z etykietą Open w Country, czy dodać `open`.
- Metryka wyboru szesnastki i moment jej wyznaczenia.
- Remisy w tabeli cyklu.
- Domyślna dywizja w filtrze (Junior czy Open).
