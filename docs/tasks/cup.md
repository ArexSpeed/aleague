## [FEATURE] Cup: seeded two-leg knockout with draws (SuperCup deferred)

### Cel

W Competitions dla `kind=cup`, `competition=cup` działa puchar: 16 rozstawionych klubów lig Gold startuje od Rundy 2, 32 pozostałe kluby grają Rundę 1, dalej 1/8, 1/4, 1/2 i Final, każda para dwumeczem, z losowaniami Rundy 1 i Rundy 2, zgodnie z `docs/competitions/cup.md`. Mecze da się zagrać istniejącym widokiem meczu i symulacją. SuperCup pokazuje pusty stan.

### Kontekst

- Specyfikacja: `docs/competitions/cup.md` (już w repo, przeczytaj ją w całości przed zmianami).
- Zależy od zadania Competitions z parametrem `kind` i konfiguracją rodzajów.
- Format jako dane per sezon: dodaj typ formatu `seeded-knockout` do zamkniętej listy typów z zadania Nations (jeśli istnieje). Jeśli typ definicji jeszcze nie powstał, dodaj kompatybilny w `data/season-1/`.
- Gra 48 klubów z czterech lig: Gold (East Gold 16, West Gold 12) i Silver (East Silver 8, West Silver 12).
- Rozstawienie wymaga tabel lig Gold po połowie fazy zasadniczej (East Gold po kolejce 15, West Gold po kolejce 11), czyli funkcji liczącej tabelę "na dany numer kolejki".
- Mecze to zwykłe mecze klubowe (15 biegów), więc korzystają z istniejącej tabeli biegowej i silnika.
- Do rozwiązywania par potrzebny jest mechanizm "uczestnicy meczu wyliczani z wyników" (placeholdery), wspólny dla fazy finałowej West Silver, Games w Nations i pucharu. Jeśli już istnieje, użyj go.
- Znany dług: `readMatches()` pobiera wszystkie mecze sezonu. Ładuj tylko dane potrzebne dla pucharu (mecze pucharu i mecze lig Gold do tabel).

### Zakres

- konfiguracja rodzajów (`kind=cup`: druga linia Cup / SuperCup, tab Rounds)
- definicja pucharu jako dane i generator fixtures w `sports/speedway/data/season-1/`, z polem `competition` (`cup-cup`)
- funkcje czyste w `sports/speedway/sim/`: tabela na dany numer kolejki, rozstawiona szesnastka, losowanie Rundy 1 i Rundy 2, wynik pary, rozwiązywanie par
- widok Rounds w `sports/speedway/views/` (klocki z `components/`)
- podłączenie fixtures pucharu do tego samego źródła, z którego korzystają widok meczu i akcje w `sim/actions.ts`
- aktualizacja statusu w `docs/competitions/cup.md`

### Poza zakresem

- Bieg dodatkowy liderów (silnik i widok meczu, osobne zadanie), tu tylko stan pary i tymczasowa reguła
- SuperCup, kalendarz i daty
- Regio (ligi regionalne), grupy i regiony w pucharze
- Animacja lub interfejs losowania, graficzna drabinka
- Kafelki trofeów na kartach klubów
- Schemat bazy w Supabase i nowe zależności

### Kroki

**Etap 1: dane i widok (najmniejsza działająca zmiana)**

1. **Diagnoza (bez zmian w kodzie).** Opisz w PR: z których pól da się odczytać ligę każdego klubu (Gold lub Silver, East lub West), ile kolejek fazy zasadniczej mają cztery ligi i jak liczone są dziś tabele (czy da się liczyć "na kolejkę N"), jak widok meczu i `sim/actions.ts` znajdują fixture po id i jak nowe fixtures trzeba zarejestrować, żeby dało się zagrać mecz.
2. **Definicja pucharu jako dane (per sezon).** Pola: `id` (`cup-cup`), `format` (`seeded-knockout`), rundy (`qual`, `r32`, `r16`, `qf`, `sf`, `final`), `legs: 2`, rozstawienie (lista lig z liczbą klubów: tymczasowo East Gold 8 i West Gold 8, `TODO: confirm`, oraz numer kolejki migawki wyliczany z definicji lig jako połowa fazy zasadniczej), koszyki Rundy 1 (Gold, Silver), ziarno losowania osobno dla Rundy 1 i Rundy 2, reguła wyniku pary (suma punktów biegowych, `TODO: confirm`), remis (`runoff` z tymczasowym `fallback: seedRank`).
3. **Generator fixtures.** 94 mecze: Round 1 (16 par, 32 mecze), Round 2 (16 par, 32 mecze), 1/8 (8 par, 16), 1/4 (4 pary, 8), 1/2 (2 pary, 4), Final (1 para, 2 mecze). Id `cup-qual-<pair>-<leg>`, `cup-r32-<pair>-<leg>` itd., `cup-final-<leg>`. Pola `competition: "cup-cup"`, `round`, `pair`, `leg`. Uczestnicy to placeholdery do czasu losowania ("Draw pending", "Winner of Round 1 #n").
4. **Konfiguracja i widok Rounds.** `kind=cup`: druga linia Cup / SuperCup (domyślnie Cup). Cup ma jeden tab Rounds (jeśli komponent tabów nie obsługuje jednego taba, schowaj pasek tabów). Wybór rundy jako przewijane przyciski (Round 1, Round 2, 1/8, 1/4, 1/2, Final), karty par: mecz, rewanż, wynik łączny, stan pary. Gdy dane wejściowe nie są kompletne, komunikat czego brakuje (np. "Available after round 15 of East Gold and round 11 of West Gold"). SuperCup: pusty stan "Not defined yet". Detail Panel zamknięty.
5. **Ładowanie danych.** Tylko puchar i mecze lig Gold potrzebne do tabel. Bez wołania `readMatches()` dla całego sezonu.
6. **Tag w statystykach.** Jak w zadaniu Nations (filtr po `competition`, jeśli to proste, w przeciwnym razie samo pole i opis w PR).

**Etap 2: rozstawienie, losowania i rozgrywanie** 7. **Tabela na kolejkę.** Funkcja czysta `standingsAsOfRound(league, round)` oparta na istniejącej logice tabel (bez zmiany wyników dla lig). 8. **Rozstawiona szesnastka.** Funkcja czysta: z tabel East Gold i West Gold po kolejkach migawki wyznacza najlepsze N i M klubów (razem 16). Zwraca "nierozstrzygnięte", dopóki wszystkie mecze tych kolejek nie są rozegrane. 9. **Losowanie Rundy 1.** Funkcja czysta `drawQual(unseeded, seed)`: 12 klubów Gold spoza szesnastki z koszyka Gold losuje przeciwników z koszyka Silver (20 klubów), pozostałe 8 klubów Silver losuje pary między sobą (razem 16 par, każdy z 32 klubów dokładnie raz). Generator liczb pseudolosowych z ziarnem napisz w repo (bez nowych zależności), wynik deterministyczny dla tego samego ziarna. Pierwszy klub w wylosowanej parze jest gospodarzem pierwszego meczu. 10. **Losowanie Rundy 2.** Funkcja czysta `drawRound2(seeded, qualWinners, seed)`: 16 rozstawionych z 16 zwycięzcami Rundy 1, każdy dokładnie raz. Zwraca "nierozstrzygnięte", dopóki wszystkie pary Rundy 1 nie są rozstrzygnięte. 11. **Wynik pary.** Funkcja czysta: z wyników obu meczów liczy sumę punktów biegowych i zwraca stan pary (`pending`, `leg1-played`, `decided`, `needs-runoff`). Przy remisie sumy zwraca `needs-runoff` i stosuje tymczasowo regułę rankingu rozstawienia (Gold przed Silver, w obrębie ligi wyżej w tabeli na kolejkę migawki), `TODO: run-off heat, osobne zadanie`. 12. **Drabinka stała.** Po Rundzie 2 zwycięzca pary 2n-1 z zwycięzcą pary 2n, a gospodarzem pierwszego meczu jest zwycięzca pary o niższym numerze (`TODO: confirm`). Do czasu rozstrzygnięcia poprzedniej rundy uczestnicy to placeholdery. 13. **Jedno miejsce rozwiązywania par.** `resolveFixture` (lub istniejący odpowiednik) używany przez widoki i przez akcje w `sim/actions.ts`. Mecz z nierozwiązanymi uczestnikami albo rewanż przed rozegraniem pierwszego meczu nie może być zagrany (`{ ok: false, error }`, bez rzucania wyjątku). 14. **Widok i status.** Karty par pokazują wylosowane kluby i stan ("Run-off needed" przy remisie). Zaktualizuj tabelę statusu w `docs/competitions/cup.md`.

### Kryteria akceptacji

- [ ] W danych jest 94 mecze pucharowe (32, 32, 16, 8, 4, 2), każdy z polem `competition: "cup-cup"`, bez żadnej fazy grupowej.
- [ ] Zakładka Rounds pokazuje 6 rund i karty par z placeholderami przed losowaniem, bez błędów.
- [ ] Przed połową sezonu lig Gold widoczny jest komunikat, czego brakuje do losowania.
- [ ] Po rozegraniu połowy fazy zasadniczej lig Gold szesnastka składa się z 16 różnych klubów (najlepsze N z East Gold i M z West Gold).
- [ ] Losowanie Rundy 1 obejmuje 32 różne kluby (każdy raz): 12 klubów Gold gra z klubami Silver, a pozostałe 8 klubów Silver tworzy 4 pary.
- [ ] Losowanie Rundy 2 łączy każdego rozstawionego z innym zwycięzcą Rundy 1.
- [ ] Losowania są powtarzalne dla tego samego ziarna i różne dla innego.
- [ ] Każda para ma mecz i rewanż z zamienionymi gospodarzami, a rewanż nie startuje przed pierwszym meczem.
- [ ] Wynik pary to suma punktów biegowych, a remis daje stan `needs-runoff` z tymczasowym awansem wyżej rozstawionego.
- [ ] Mecz z nierozwiązanymi uczestnikami nie startuje i zwraca czytelny błąd.
- [ ] SuperCup pokazuje pusty stan.
- [ ] Ligi klubowe, Regio i inne rodzaje bez regresji, brak zmian w schemacie bazy i nowych zależności.
- [ ] `pnpm lint` i `pnpm build` przechodzą.

### Do poprawy / propozycje

- [DO UZUPEŁNIENIA: podział szesnastki między East Gold i West Gold. Tymczasowo 8 + 8 (w opisie 10 + 8 sumuje się do 18).]
- [DO UZUPEŁNIENIA: czy pozycja w tabeli wpływa na losowanie w koszykach Rundy 1 poza wyborem szesnastki. Domyślnie nie.]
- [DO UZUPEŁNIENIA: reguła wyniku pary (suma punktów biegowych), czy finał też jest dwumeczem, oraz gospodarz pierwszego meczu po Rundzie 2.]
- **Wariant A (rekomendowany): losowanie jako funkcja deterministyczna z ziarnem w definicji.** Plus: bez zmian w bazie, powtarzalne. Minus: to "losowanie z góry znanym ziarnem", nie widowisko.
- **Wariant B:** zapis losowania w bazie po jego wykonaniu. Plus: możliwe losowanie "na żywo" z animacją. Minus: potrzebne miejsce w bazie (zmiana schematu), osobne zadanie.
- Propozycja: panel "Seeded clubs" z listą 16 rozstawionych po wyznaczeniu szesnastki.
- Propozycja: graficzna drabinka na desktopie (poziome przewijanie), osobne zadanie.
- Propozycja: po zadaniu West Silver uogólnić przycisk "Simulate round" na rundy pucharu.

### Decyzje otwarte

- Podział szesnastki między East Gold i West Gold.
- Wpływ pozycji w tabeli na koszyki Rundy 1.
- Reguła wyniku pary, dwumecz w finale, gospodarz po Rundzie 2.
