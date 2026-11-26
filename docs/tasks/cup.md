## [FEATURE] Cup: classification knockout (nikt nie odpada), seeded start, draws (SuperCup deferred)

### Cel

W Competitions dla `kind=cup`, `competition=cup` działa puchar klasyfikacyjny zgodnie z `docs/competitions/cup.md`: 16 rozstawionych klubów lig Gold startuje od Round 2, 32 pozostałe kluby grają Round 1, a w każdej rundzie grupa miejsc dzieli się na pół (wygrani walczą o górną połowę miejsc, przegrani o dolną), aż do pełnej klasyfikacji 1-48. Każda para gra dwumecz (liczba nóg w danych). Mecze da się zagrać istniejącym widokiem meczu i symulacją. SuperCup pokazuje pusty stan.

### Kontekst

- Specyfikacja: `docs/competitions/cup.md` (już w repo, przeczytaj ją w całości przed zmianami). Zastępuje poprzedni format z odpadaniem.
- Gałąź ma już wcześniejszą implementację (`types/cup.ts`, `data/season-1/cup.json`, `cup-fixtures.json`, `api/cup.ts`, `sim/cup.ts`, `views/competitions/cup/cup-rounds-view.tsx`, zmiany w `season.ts`, `actions.ts`, `match-setup.ts`). Traktuj ją jako punkt wyjścia: zachowaj to, co pasuje (rejestracja fixtures, podpięcie do akcji), resztę przepisz. Ręcznie utrzymywany `cup-fixtures.json` (848 linii) zastąp generatorem z definicji.
- Znany błąd do naprawienia: `seedingLeagues` w `types/cup.ts` było unią dwóch jednoelementowych tablic, więc `["east-gold", "west-gold"]` nie przechodziło walidacji i wywalało całą aplikację przy starcie (`season.ts` parsuje przy imporcie). Użyj `z.enum([...])` w tablicy.
- Gra 48 klubów z czterech lig: Gold (East Gold 16, West Gold 12) i Silver (East Silver 8, West Silver 12).
- Rozstawienie wymaga tabel lig Gold po połowie fazy zasadniczej (East Gold po kolejce 15, West Gold po kolejce 11), czyli funkcji liczącej tabelę "na dany numer kolejki". Numery migawki wylicz z definicji lig, nie wpisuj na sztywno.
- Mecze to zwykłe mecze klubowe (15 biegów).
- Do rozwiązywania par potrzebny jest mechanizm "uczestnicy meczu wyliczani z wyników" (placeholdery), wspólny dla fazy finałowej lig, Games w Nations, turniejów i pucharu. Jeśli istnieje, użyj go.
- Generator liczb pseudolosowych z ziarnem już jest (`createRng` w `engine/v1/rng`, ziarno jako string). Użyj go, nie pisz nowego.
- Znany dług: `readMatches()` pobiera wszystkie mecze sezonu. Ładuj tylko mecze pucharu i mecze lig Gold do tabel.
- Liczby rund, grup i par mają pochodzić z definicji i z reguły podziału, nie z magicznych liczb w kodzie.

### Struktura rozgrywek (skrót, szczegóły w docs)

| Runda | Pary | Grupy wejściowe |
| ----- | ---- | --------------- |
| `r1` | 16 | 32 kluby |
| `r2` | 24 | 1-32 (16 par), 33-48 (8 par) |
| `r3` | 24 | 1-16, 17-32 (po 8 par), 33-40, 41-48 (po 4 pary) |
| `r4` | 24 | 4 grupy po 8 (po 4 pary), 4 grupy po 4 (po 2 pary) |
| `r5` | 24 | 8 grup po 4 (po 2 pary), 8 grup po 2 (po 1 parze) |
| `r6` | 16 | 16 grup po 2 |

Razem 128 par (256 meczów przy dwumeczu). Id meczu: `cup-<round>-<group>-<pair>-<leg>`, `<group>` to zakres miejsc (`1-16`) lub `qual` w Round 1.

### Zakres

- konfiguracja rodzajów (`kind=cup`: druga linia Cup / SuperCup, tab Rounds)
- definicja pucharu jako dane per sezon i generator fixtures z definicji, z polem `competition` (`cup-cup`)
- funkcje czyste w `sports/speedway/sim/`: tabela na dany numer kolejki, rozstawiona szesnastka, losowania, wynik pary, podział grupy po rundzie, klasyfikacja końcowa, rozwiązywanie par
- widok Rounds w `sports/speedway/views/` (klocki z `components/`)
- podłączenie fixtures pucharu do tego samego źródła, z którego korzystają widok meczu i akcje w `sim/actions.ts`
- aktualizacja statusu w `docs/competitions/cup.md`

### Poza zakresem

- Bieg dodatkowy liderów (silnik i widok meczu, osobne zadanie), tu tylko stan pary i tymczasowa reguła
- SuperCup, kalendarz i daty
- Wpływ klasyfikacji pucharu na ranking klubów (Elo)
- Animacja lub interfejs losowania, graficzna drabinka
- Kafelki trofeów na kartach klubów
- Schemat bazy w Supabase i nowe zależności

### Kroki

**Etap 1: dane i widok (najmniejsza działająca zmiana)**

1. **Diagnoza i naprawa startu (bez nowych funkcji).** Opisz w PR, co z obecnej implementacji pucharu zostaje, a co jest przepisywane. Napraw walidację `seedingLeagues`, tak by aplikacja startowała. Opisz: z których pól da się odczytać ligę klubu (Gold lub Silver, East lub West), ile kolejek fazy zasadniczej mają cztery ligi, jak liczone są dziś tabele (czy da się liczyć "na kolejkę N"), jak widok meczu i `sim/actions.ts` znajdują fixture po id i jak zarejestrować nowe fixtures.
2. **Definicja pucharu jako dane (per sezon).** Pola: `id` (`cup-cup`), `format` (`classification-knockout`), `legs` (liczba nóg, tymczasowo 2), rundy jako lista obiektów (`id` od `r1` do `r6`, etykieta), rozstawienie (liczba klubów z East Gold i West Gold, tymczasowo 8 i 8 z `TODO: confirm`, walidacja sumy równej 16, migawka tabeli wyliczana z definicji lig), koszyki Round 1 jako reguła (Gold spoza szesnastki, Silver), ziarno bazowe (string) z osobnym ziarnem na rundę i grupę, reguła wyniku pary (suma punktów biegowych, `TODO: confirm`), remis (`runoff` z `fallback: seedRank`). Bez pola ze stanem pary. Schemat Zod z `.int().positive()` i walidacją spójności (np. suma rozstawionych, unikalność rund).
3. **Reguła podziału grup.** Zamiast zapisywać wszystkie grupy w danych, zapisz regułę: po rundzie grupa miejsc `[a, b]` dzieli się na `[a, mid]` (wygrani) i `[mid+1, b]` (przegrani). Funkcja czysta `splitGroup(range)` oraz `groupsForRound(roundId)` wyliczające grupy miejsc i liczbę par dla każdej rundy z definicji (24, 24, 24, 24, 16 w kolejnych rundach, 16 w Round 1).
4. **Generator fixtures.** 256 meczów z definicji: id `cup-<round>-<group>-<pair>-<leg>`, pola `competition: "cup-cup"`, `round`, `group`, `pair`, `leg`. Uczestnicy to placeholdery do czasu losowania ("Draw pending", "Winner of r2 1-32 #3", "Loser of r2 1-32 #3"). Brak statycznego pliku z fixtures.
5. **Konfiguracja i widok Rounds.** `kind=cup`: druga linia Cup / SuperCup (domyślnie Cup). Cup ma jeden tab Rounds. Wybór rundy jako przewijane przyciski (Round 1 do Round 6). W rundzie sekcje per grupa miejsc (nagłówek "Places 1-16"), w nich karty par: mecz, rewanż, wynik łączny, stan. Gdy dane wejściowe nie są kompletne, komunikat czego brakuje (np. "Available after round 15 of East Gold and round 11 of West Gold"). SuperCup: pusty stan "Not defined yet". Detail Panel zamknięty.
6. **Ładowanie danych.** Tylko puchar i mecze lig Gold potrzebne do tabel. Bez wołania `readMatches()` dla całego sezonu.
7. **Tag w statystykach.** Jak w zadaniu Nations (filtr po `competition`, jeśli to proste, w przeciwnym razie samo pole i opis w PR).

**Etap 2: rozstawienie, losowania, wyniki i klasyfikacja (funkcje czyste)**

8. **Tabela na kolejkę.** `standingsAsOfRound(league, round)` oparta na istniejącej logice tabel (bez zmiany wyników lig).
9. **Rozstawiona szesnastka.** Z tabel East Gold i West Gold po kolejkach migawki wyznacza najlepsze N i M klubów (razem 16). Zwraca "nierozstrzygnięte", dopóki wszystkie mecze tych kolejek nie są rozegrane.
10. **Losowanie Round 1.** `drawQual(unseeded, seed)`: 12 klubów Gold z koszyka Gold losuje przeciwników z koszyka Silver (20 klubów), pozostałe 8 klubów Silver losuje pary między sobą (16 par, każdy z 32 klubów raz). Pierwszy klub pary jest gospodarzem pierwszego meczu.
11. **Losowanie w rundach 2-6.** Jedna funkcja `drawGroupPairs(clubs, seed)` losująca pary w grupie (deterministycznie z ziarna `<seed>-<round>-<group>`), plus `drawRound2Main(seeded, qualWinners, seed)` dla grupy 1-32 (rozstawieni z wygranymi Round 1). Każdy klub dokładnie raz. Zwraca "nierozstrzygnięte", dopóki wejście grupy nie jest kompletne.
12. **Wynik pary.** Z wyników obu meczów liczy sumę punktów biegowych i zwraca stan (`pending`, `leg1-played`, `decided`, `needs-runoff`) oraz zwycięzcę i przegranego. Przy remisie `needs-runoff` i tymczasowa reguła rankingu rozstawienia (Gold przed Silver, w obrębie ligi wyżej w tabeli na kolejkę migawki), `TODO: run-off heat, osobne zadanie`.
13. **Podział grup i przejście do kolejnej rundy.** Z rozstrzygniętych par rundy N wyznacza grupy rundy N+1 (zwycięzcy do górnej połowy zakresu miejsc, przegrani do dolnej).
14. **Klasyfikacja końcowa.** Funkcja czysta zwracająca dla każdego klubu miejsce 1-48 lub zakres miejsc, jeśli grupa nie jest rozstrzygnięta. Panel "Final standings" w widoku.
15. **Jedno miejsce rozwiązywania par.** `resolveFixture` (lub istniejący odpowiednik) używany przez widoki i przez akcje w `sim/actions.ts`. Mecz z nierozwiązanymi uczestnikami albo rewanż przed rozegraniem pierwszego meczu nie może być zagrany (`{ ok: false, error }`, bez rzucania wyjątku, unia dyskryminowana).
16. **Testy.** Jeśli jest konfiguracja testów, dodaj przypadki. Jeśli nie, skrypt deweloperski w `scripts/` (poza `app/` i `src/`) bez nowych zależności, uruchamiany z `package.json`. Sprawdza m.in. liczby z kryteriów poniżej i powtarzalność losowań.
17. Zaktualizuj tabelę statusu w `docs/competitions/cup.md`.

### Kryteria akceptacji

- [ ] Aplikacja startuje, a `cup.json` przechodzi walidację (naprawiony `seedingLeagues`).
- [ ] W danych jest 256 meczów pucharowych (liczba par w rundach: 16, 24, 24, 24, 24, 16, po 2 mecze), każdy z polem `competition: "cup-cup"`, bez fazy grupowej. Liczby pochodzą z definicji i reguły podziału.
- [ ] Zakładka Rounds pokazuje 6 rund, w nich grupy miejsc i karty par z placeholderami przed losowaniem, bez błędów.
- [ ] Przed połową sezonu lig Gold widoczny jest komunikat, czego brakuje do losowania.
- [ ] Po rozegraniu połowy fazy zasadniczej lig Gold szesnastka składa się z 16 różnych klubów (najlepsze N z East Gold i M z West Gold).
- [ ] Losowanie Round 1 obejmuje 32 różne kluby (każdy raz): 12 klubów Gold gra z klubami Silver, a pozostałe 8 klubów Silver tworzy 4 pary.
- [ ] Round 2: grupa 1-32 łączy każdego rozstawionego z innym wygranym Round 1, grupa 33-48 tworzy 8 par z 16 przegranych Round 1.
- [ ] Po każdej rundzie zwycięzcy trafiają do górnej, a przegrani do dolnej połowy zakresu miejsc. Żaden klub nie odpada, a każdy klub ma w każdej rundzie dokładnie jedną parę w swojej grupie.
- [ ] Żadna para nie powtarza się w całym pucharze.
- [ ] Losowania są powtarzalne dla tego samego ziarna i różne dla innego.
- [ ] Każda para ma mecz i rewanż z zamienionymi gospodarzami, a rewanż nie startuje przed pierwszym meczem.
- [ ] Wynik pary to suma punktów biegowych, a remis daje stan `needs-runoff` z tymczasowym awansem wyżej rozstawionego.
- [ ] Klasyfikacja końcowa zwraca miejsca 1-48, każde dokładnie raz, po rozstrzygnięciu wszystkich grup. Przed tym zwraca zakresy miejsc.
- [ ] Mecz z nierozwiązanymi uczestnikami nie startuje i zwraca czytelny błąd.
- [ ] SuperCup pokazuje pusty stan.
- [ ] Ligi klubowe, Regio, turnieje i inne rodzaje bez regresji, brak zmian w schemacie bazy i nowych zależności.
- [ ] `pnpm lint` i `pnpm build` przechodzą.

### Do poprawy / propozycje

- [DO UZUPEŁNIENIA: podział szesnastki między East Gold i West Gold. Tymczasowo 8 + 8.]
- [DO UZUPEŁNIENIA: liczba nóg. Przy dwumeczu we wszystkich rundach jest 256 meczów, rozważ jeden mecz w niższych grupach miejsc.]
- [DO UZUPEŁNIENIA: losowanie w rundach 3-6 (czysto losowe w grupie przyjęte, alternatywa: według rankingu).]
- [DO UZUPEŁNIENIA: czy Round 2 dla grupy 33-48 jest losowane z koszyków. Domyślnie czysto losowo.]
- [DO UZUPEŁNIENIA: reguła wyniku pary (suma punktów biegowych) i gospodarz pierwszego meczu po Round 1.]
- **Wariant A (rekomendowany): losowanie jako funkcja deterministyczna z ziarnem w definicji.** Plus: bez zmian w bazie, powtarzalne. Minus: to losowanie ze znanym z góry ziarnem, nie widowisko.
- **Wariant B:** zapis losowania w bazie po jego wykonaniu. Plus: losowanie "na żywo" z animacją. Minus: zmiana schematu bazy, osobne zadanie.
- Propozycja: panel "Seeded clubs" z listą 16 rozstawionych po wyznaczeniu szesnastki.
- Propozycja: widok "ścieżka klubu" (przez które grupy miejsc przeszedł klub), wspólny z turniejami.
- Propozycja: po zadaniu West Silver uogólnić przycisk "Simulate round" na rundy pucharu.

### Decyzje otwarte

- Podział szesnastki między East Gold i West Gold.
- Liczba nóg w poszczególnych rundach.
- Sposób losowania w rundach 3-6 i w grupie 33-48.
- Reguła wyniku pary i gospodarz po Round 1.