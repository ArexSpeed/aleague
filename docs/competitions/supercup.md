# SuperCup: superpuchar klubowy

Opis zasad rozgrywek i status implementacji. Konwencje wspólne (identyfikatory, format jako dane per sezon) jak w `docs/competitions/nations.md`. SuperCup jest drugą opcją filtra `kind=cup` (`competition=supercup`).

## Zasady wspólne

- Identyfikator rozgrywek (tag): `cup-supercup`. Osobne trofeum od Cup (`cup-cup`).
- Rozgrywany na koniec sezonu, po zakończeniu lig, Cup, Regio, Pairs i 4Teams.
- Mecze to zwykłe mecze klubowe (15 biegów), więc używają istniejącej tabeli biegowej, widoku meczu i symulacji.
- Format w danych per sezon: lista miejsc, kolejność rezerwy i format rozgrywek są definicją sezonu, a nie stałymi w kodzie.

## Uczestnicy: 16 klubów

Tylko mistrzowie z danego sezonu:

| Miejsca | Źródło                                                                     |
| ------- | -------------------------------------------------------------------------- |
| 4       | Mistrzowie lig: East Gold, West Gold, East Silver, West Silver             |
| 1       | Obrońca SuperCup (zwycięzca poprzedniego sezonu, w pierwszym sezonie brak) |
| 1       | Zwycięzca Cup                                                              |
| 8       | Zwycięzcy 8 turniejów Regio (po jednym na region)                          |
| 1       | Zwycięzca turnieju Pairs (`tournaments-pairs`)                             |
| 1       | Zwycięzca turnieju 4Teams (`tournaments-fours`)                            |

## Dublowanie klubów

- Klub zajmuje jedno miejsce, nawet jeśli zakwalifikował się z kilku źródeł (w widoku pokazujemy wszystkie powody, np. "East Gold champion, Cup winner").
- Wolne miejsca (16 minus liczba różnych klubów, w tym puste źródła, np. brak obrońcy) uzupełniane są po kolei z listy rezerwowej, z pominięciem klubów już zakwalifikowanych:
  1. wicemistrz East Gold, 2. wicemistrz West Gold (srebrni Gold),
  2. 3. miejsce East Gold, 4. 3. miejsce West Gold (brązowi Gold),
  3. finalista Cup (2. miejsce), 6. i 7. przegrani półfinaliści Cup (3. i 4. miejsce),
  4. ranking klubów, od najwyższej pozycji.
- Uzupełnianie zaczyna się dopiero, gdy wszystkie źródła podstawowe są rozstrzygnięte (inaczej nie wiadomo, ile jest wolnych miejsc). Puste źródło (brak obrońcy w pierwszym sezonie) jest rozstrzygnięte jako puste.
- Algorytm jest deterministyczny, bez losowania.

## Ranking klubów

- Ranking zespołów budowany na wzór Elo lub rankingu FIFA: na podstawie wyników oraz wygranych turniejów. To osobne zadanie.
- Do czasu jego powstania kolejność rezerwy z punktu 8: pozycja w lidze (Gold przed Silver, w obrębie ligi wyżej w końcowej tabeli).

## Format rozgrywek

- Do ustalenia: liczba rund (propozycja jak w Cup: 1/8, 1/4, 1/2, Final), mecz czy dwumecz, losowanie (otwarte czy rozstawione według źródła lub rankingu), gospodarz.

## Id meczów

Do ustalenia razem z formatem, według konwencji `cup-supercup-<round>-<pair>-<leg>`.

## Widok w UI

- `kind=cup&competition=supercup`, tab Field: lista 16 miejsc (klub lub "TBD" z nazwą źródła), powody kwalifikacji, oznaczenie miejsc uzupełnionych z rezerwy oraz komunikat, na jakie źródła jeszcze czekamy.

## Do ustalenia

- Format rozgrywek (rundy, mecz lub dwumecz, losowanie, gospodarz).
- Kolejność medalistów Gold w rezerwie (przyjęto: srebrni East i West, potem brązowi East i West).
- Kolejność przegranych półfinalistów Cup na miejscach 3 i 4.
- Ranking klubów (model, aktualizacja).
- Definicja mistrza w ligach z fazą finałową (grupa mistrzowska lub awansowa).
- Wygrani Regio, Pairs i 4Teams: definicje tych rozgrywek (osobne dokumenty).

## Status implementacji

| Element                                 | Stan            |
| --------------------------------------- | --------------- |
| Lista uczestników (logika kwalifikacji) | do zrobienia    |
| Terminarz i mecze                       | czeka na format |
| Ranking klubów                          | osobne zadanie  |

## Szablon opisu rozgrywek (do kolejnych)

Uczestnicy, Format, Kolejki lub rundy, Punktacja i tie-break, Awanse, Statystyki (tag), Tabela biegowa, Widok w UI, Id meczów, Status.
