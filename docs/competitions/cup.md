# Cup: puchar klubowy

Opis zasad rozgrywek i status implementacji. Konwencje wspólne (identyfikatory, format jako dane per sezon) jak w `docs/competitions/nations.md`.

## Zasady wspólne

- Identyfikator rozgrywek (tag): `cup-cup`. Każdy mecz w danych ma pole `competition` z tym identyfikatorem, a wyniki i statystyki zawodników są liczone osobno dla tagu. SuperCup (`cup-supercup`) jest poza zakresem.
- Filtry w UI: `kind=cup`, druga linia `competition=cup|supercup` (SuperCup na razie pusty stan).
- Format w danych per sezon: definicja pucharu (rozstawienie, rundy, losowania) jest danymi sezonu, a nie stałymi w kodzie. Format rozgrywek: `seeded-knockout`.
- Mecze to zwykłe mecze klubowe (15 biegów), więc używają istniejącej tabeli biegowej, widoku meczu i symulacji. Wyjątek: bieg dodatkowy (patrz Wynik pary), osobne zadanie.
- Skład: jak w lidze (zmiany dowolne przed pierwszym biegiem, sloty juniorskie 6-8).
- Forma i kontuzje: jak w pozostałych rozgrywkach, bez osobnej obsługi.
- Daty: na razie brak, kolejność wyznacza runda i numer meczu. Kalendarz to osobne zadanie.

## Uczestnicy

- Wszystkie 48 klubów czterech lig: Gold (East 16 i West 12, razem 28) oraz Silver (East 8 i West 12, razem 20).
- Rozstawiona szesnastka: 16 najlepszych klubów lig Gold według tabel po połowie fazy zasadniczej (East Gold: najlepsze N, West Gold: najlepsze M, N + M = 16). Podział do ustalenia (tymczasowo 8 + 8). Startują od Rundy 2.
- Pozostałe 32 kluby (12 Gold spoza szesnastki i 20 Silver) grają Rundę 1.
- Regio (ligi regionalne) to osobne rozgrywki, poza zakresem. W pucharze nie ma grup ani regionów.

## Format

- Czysty puchar, bez fazy grupowej. Każda para gra dwumecz (mecz i rewanż), także finał (do potwierdzenia).
- Rundy: Round 1 (kwalifikacyjna, 32 kluby, 16 par), Round 2 (16 rozstawionych i 16 zwycięzców Rundy 1, 16 par), 1/8 (8 par), 1/4 (4 pary), 1/2 (2 pary), Final (1 para). Razem 47 par i 94 mecze.
- Terminy: Round 1 po połowie sezonu ligowego (tabele lig Gold po połowie fazy zasadniczej: East Gold po 15. kolejce, West Gold po 11.), cały puchar w "miesiącu pucharowym" (12 terminów: 6 rund po 2 mecze).

## Losowanie

- Round 1: dwa koszyki, Gold (12 klubów Gold spoza szesnastki) i Silver (20 klubów). Najpierw każdy klub z koszyka Gold losuje przeciwnika z koszyka Silver (12 par), potem pozostałe 8 klubów Silver losuje pary między sobą (4 pary). Interpretacja do potwierdzenia.
- Round 2: 16 rozstawionych losuje przeciwników spośród 16 zwycięzców Rundy 1 (losowanie po zakończeniu Rundy 1).
- Gospodarz pierwszego meczu: pierwszy klub w wylosowanej parze (nie zależy od rankingu, może to być słabszy klub).
- Po Rundzie 2 drabinka stała: zwycięzca pary 2n-1 z zwycięzcą pary 2n. Gospodarzem pierwszego meczu jest zwycięzca pary o niższym numerze (do potwierdzenia).
- Losowania to funkcje deterministyczne z ziarnem zapisanym w definicji (osobne ziarno na rundę): wynik losowy, ale powtarzalny. Wykonywane, gdy dane wejściowe są kompletne.

## Wynik pary

- Suma punktów biegowych z obu meczów (do potwierdzenia). Rewanż można zagrać dopiero po pierwszym meczu.
- Remis: bieg dodatkowy liderów (osobne zadanie silnika i widoku meczu). Do czasu jego wdrożenia awansuje klub z wyższą pozycją w rankingu rozstawienia (Gold przed Silver, w obrębie ligi wyżej w tabeli po połowie fazy zasadniczej), a stan pary pokazuje "run-off needed".

## Id meczów

`cup-qual-<pair>-<leg>`, `cup-r32-<pair>-<leg>`, `cup-r16-<pair>-<leg>`, `cup-qf-<pair>-<leg>`, `cup-sf-<pair>-<leg>`, `cup-final-<leg>`, gdzie `<leg>` to 1 lub 2.

## SuperCup (`cup-supercup`)

- Na koniec sezonu, najlepsze drużyny sezonu (raczej 16). Do ustalenia, na razie pominięty (pusty stan w UI). Osobne trofeum.

## Widok w UI

- Jeden tab Rounds: wybór rundy (Round 1, Round 2, 1/8, 1/4, 1/2, Final) i karty par (mecz, rewanż, wynik łączny, stan). Przed dostępnością danych komunikat, czego brakuje (np. połowa sezonu lig Gold).

## Do ustalenia

- Podział rozstawionej szesnastki między East Gold i West Gold (w opisie 10 + 8 sumuje się do 18).
- Koszyki w Rundzie 1: czy pozycja w tabeli wpływa na losowanie poza wyborem szesnastki.
- Czy losowanie Rundy 2 odbywa się po Rundzie 1 (założenie), czy cała drabinka od razu.
- Wynik pary (suma punktów biegowych) i czy finał jest dwumeczem.
- Gospodarz pierwszego meczu w rundach po Rundzie 2.
- Bieg dodatkowy: ilu liderów z drużyny (dwóch pasuje do biegu czteroosobowego), jak wyznaczany lider, jaka tabela biegowa.
- SuperCup (liczba drużyn, zasady).

## Rozstrzygnięte (2026-11-20)

- Gra wszystkie 48 klubów, czysty puchar bez grup, dwumecze.
- Najlepsze 16 klubów lig Gold startuje od Rundy 2, pozostałe 32 grają Rundę 1.
- Drabinka stała, forma i kontuzje jak w innych rozgrywkach.
- Osobne trofea: Cup = `cup-cup`, Supercup = `cup-supercup`.

## Status implementacji

| Element                  | Terminarz i widoki | Symulacja                         |
| ------------------------ | ------------------ | --------------------------------- |
| Rozstawienie i losowania | do zrobienia       | nie dotyczy                       |
| Mecze pucharowe          | do zrobienia       | po wprowadzeniu rozwiązywania par |
| Bieg dodatkowy           | osobne zadanie     | osobne zadanie                    |
| SuperCup                 | poza zakresem      | nie                               |

## Szablon opisu rozgrywek (do kolejnych)

Uczestnicy, Format, Kolejki lub rundy, Punktacja i tie-break, Awanse, Statystyki (tag), Tabela biegowa, Widok w UI, Id meczów, Status.
