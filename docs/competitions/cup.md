# Cup: puchar klubowy (klasyfikacyjny)

Opis zasad rozgrywek i status implementacji. Konwencje wspólne (identyfikatory, format jako dane per sezon) jak w `docs/competitions/nations.md`.

## Zasady wspólne

- Identyfikator rozgrywek (tag): `cup-cup`. Każdy mecz w danych ma pole `competition` z tym identyfikatorem, a wyniki i statystyki zawodników są liczone osobno dla tagu. SuperCup (`cup-supercup`) jest poza zakresem.
- Filtry w UI: `kind=cup`, druga linia `competition=cup|supercup` (SuperCup na razie pusty stan).
- Format w danych per sezon: definicja pucharu (rozstawienie, rundy, reguła podziału grup, ziarna losowań) jest danymi sezonu, a nie stałymi w kodzie. Format rozgrywek: `classification-knockout`.
- Mecze to zwykłe mecze klubowe (15 biegów), więc używają istniejącej tabeli biegowej, widoku meczu i symulacji. Wyjątek: bieg dodatkowy (patrz Wynik pary), osobne zadanie.
- Skład: jak w lidze. Forma i kontuzje: jak w pozostałych rozgrywkach.
- Daty: na razie brak, kolejność wyznacza runda, grupa miejsc i numer pary. Kalendarz to osobne zadanie.

## Idea formatu

Nikt nie odpada. Każda para rozstrzyga, kto walczy dalej o wyższe miejsca, a kto o niższe. Grupa klubów, które walczą o zakres miejsc (np. 1-16), w każdej rundzie dzieli się na pół: zwycięzcy par walczą o górną połowę zakresu (1-8), przegrani o dolną (9-16). Gra się do momentu, gdy zakres ma 2 miejsca (mecz o to, które z nich zajmie który klub). Wynik to pełna klasyfikacja końcowa 1-48.

Konsekwencja: kluby, które spotkały się w rundzie N, trafiają po niej do różnych grup, więc nie spotkają się już nigdy w tym pucharze. Wszystkie pary są nowymi parami, bez zasady unikania rewanżów.

## Uczestnicy

- Wszystkie 48 klubów czterech lig: Gold (East 16 i West 12, razem 28) oraz Silver (East 8 i West 12, razem 20).
- Rozstawiona szesnastka: 16 najlepszych klubów lig Gold według tabel po połowie fazy zasadniczej (East Gold: najlepsze N, West Gold: najlepsze M, N + M = 16). Podział do ustalenia (tymczasowo 8 + 8). Startuje od Round 2.
- Pozostałe 32 kluby grają Round 1.

## Rundy

Grupa miejsc to zakres miejsc, o które walczą jej kluby (np. 1-16).

| Runda | Grupy wejściowe | Pary | Podział po rundzie |
| ----- | --------------- | ---- | ------------------ |
| Round 1 (`r1`) | 32 kluby (bez rozstawionych) | 16 | wygrani (16) do grupy 1-32, przegrani (16) do grupy 33-48 |
| Round 2 (`r2`) | 1-32 (16 rozstawionych + 16 wygranych R1): 16 par. 33-48 (16 przegranych R1): 8 par | 24 | 1-32 na 1-16 i 17-32. 33-48 na 33-40 i 41-48 |
| Round 3 (`r3`) | 1-16 i 17-32 (po 8 par), 33-40 i 41-48 (po 4 pary) | 24 | 1-8, 9-16, 17-24, 25-32, 33-36, 37-40, 41-44, 45-48 |
| Round 4 (`r4`) | grupy po 8 (po 4 pary, dla 1-8 to ćwierćfinały), grupy po 4 (po 2 pary) | 24 | grupy po 4 (1-4, 5-8, ..., 29-32) oraz grupy po 2 (33-34, 35-36, ..., 47-48) |
| Round 5 (`r5`) | grupy po 4 (po 2 pary, dla 1-4 to półfinały), grupy po 2 (po 1 parze) | 24 | grupy po 2 dla miejsc 1-32. Miejsca 33-48 rozstrzygnięte |
| Round 6 (`r6`) | 16 grup po 2 (miejsca 1-2, 3-4, ..., 31-32) | 16 | miejsca 1-32 rozstrzygnięte (1-2 to finał) |

- Razem 128 par. Każda para gra dwumecz (liczba nóg to dane, patrz Do ustalenia), czyli 256 meczów przy dwumeczu.
- Miejsca 33-48 są rozstrzygnięte po Round 5, miejsca 1-32 po Round 6.
- Kolejne rundy wykonują się dopiero po zakończeniu poprzedniej (dla danej grupy wystarczy zakończenie jej poprzedniej pary, ale widok i losowania liczymy per runda).

## Losowanie

- Round 1: dwa koszyki, Gold (12 klubów Gold spoza szesnastki) i Silver (20 klubów). Najpierw każdy klub z koszyka Gold losuje przeciwnika z koszyka Silver (12 par), potem pozostałe 8 klubów Silver losuje pary między sobą (4 pary). Interpretacja do potwierdzenia.
- Round 2, grupa 1-32: 16 rozstawionych losuje przeciwników spośród 16 wygranych Rundy 1. Grupa 33-48: 16 przegranych Rundy 1 losuje pary między sobą (8 par).
- Round 3 i dalej: w każdej grupie miejsc kluby losują pary między sobą (bez koszyków, do potwierdzenia).
- Gospodarz pierwszego meczu: pierwszy klub w wylosowanej parze.
- Losowania to funkcje deterministyczne z ziarnem zapisanym w definicji (osobne ziarno na rundę i grupę, np. `<seed>-<round>-<group>`): wynik losowy, ale powtarzalny. Wykonywane, gdy dane wejściowe grupy są kompletne.

## Wynik pary

- Suma punktów biegowych z obu meczów (do potwierdzenia). Rewanż można zagrać dopiero po pierwszym meczu.
- Remis sumy: bieg dodatkowy liderów (osobne zadanie silnika i widoku meczu). Do czasu jego wdrożenia awansuje klub z wyższą pozycją w rankingu rozstawienia (Gold przed Silver, w obrębie ligi wyżej w tabeli po połowie fazy zasadniczej), a stan pary pokazuje "run-off needed".
- Stan pary: `pending`, `leg1-played`, `decided`, `needs-runoff`. Stan jest wyliczany z wyników, nie zapisywany w definicji.

## Id meczów

`cup-<round>-<group>-<pair>-<leg>`, gdzie `<round>` to `r1`..`r6`, `<group>` to zakres miejsc `<od>-<do>` (np. `1-16`, `33-40`; w Round 1 `qual`), `<pair>` to numer pary w grupie, `<leg>` to 1 lub 2. Przykład: `cup-r3-1-16-5-2`.

## Klasyfikacja końcowa

Po zakończeniu pucharu każdy klub ma miejsce 1-48 (zwycięzca pary o miejsca 1-2 to zwycięzca pucharu). Klasyfikacja jest wyliczana funkcją czystą z wyników. Do czasu rozstrzygnięcia grupy jej kluby mają zakres miejsc (np. "9-16").

## SuperCup (`cup-supercup`)

Na koniec sezonu, najlepsze drużyny sezonu (raczej 16). Do ustalenia, na razie pominięty (pusty stan w UI). Osobne trofeum.

## Widok w UI

- Jeden tab Rounds: wybór rundy (Round 1 ... Round 6) jako przewijane przyciski. W rundzie sekcje per grupa miejsc (nagłówek np. "Places 1-16"), a w nich karty par (mecz, rewanż, wynik łączny, stan). Przed dostępnością danych komunikat, czego brakuje (np. połowa sezonu lig Gold albo zakończenie poprzedniej rundy).
- Panel "Final standings" (klasyfikacja 1-48 z zakresami miejsc dla nierozstrzygniętych grup).

## Do ustalenia

- Podział rozstawionej szesnastki między East Gold i West Gold (tymczasowo 8 + 8).
- Liczba nóg: dwumecz we wszystkich rundach (256 meczów) czy dwumecz tylko w wybranych (np. mecze o miejsca 1-4), a reszta jeden mecz.
- Losowanie w Round 3 i dalej: czysto losowe w grupie (założenie) czy według rankingu (najlepszy z najgorszym).
- Czy Round 2 dla grupy 33-48 jest losowane z koszyków (np. Gold/Silver) czy czysto losowo (założenie).
- Wynik pary (suma punktów biegowych) i gospodarz pierwszego meczu po Round 1.
- Bieg dodatkowy: ilu liderów, jak wyznaczany lider, jaka tabela biegowa.
- Czy klasyfikacja końcowa pucharu wpływa na ranking klubów (Elo) lub SuperCup.
- SuperCup (liczba drużyn, zasady).

## Rozstrzygnięte (2026-11-23)

- Format klasyfikacyjny: nikt nie odpada, wygrani walczą o górną połowę miejsc grupy, przegrani o dolną.
- Rozstawiona szesnastka startuje od Round 2, 32 pozostałe kluby grają Round 1, przegrani Round 1 (33-48) grają dalej od Round 2.
- Zastępuje wcześniejszy format pucharu z odpadaniem (47 par, 94 mecze).
- Osobne trofea: Cup = `cup-cup`, Supercup = `cup-supercup`.

## Status implementacji

| Element | Terminarz i widoki | Symulacja |
| ------- | ------------------ | --------- |
| Rozstawienie i losowania | do zrobienia | nie dotyczy |
| Mecze pucharowe | do zrobienia | po wprowadzeniu rozwiązywania par |
| Klasyfikacja końcowa | do zrobienia | nie dotyczy |
| Bieg dodatkowy | osobne zadanie | osobne zadanie |
| SuperCup | poza zakresem | nie |

## Szablon opisu rozgrywek (do kolejnych)

Uczestnicy, Format, Kolejki lub rundy, Punktacja i tie-break, Awanse, Statystyki (tag), Tabela biegowa, Widok w UI, Id meczów, Status.