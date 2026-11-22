# Format meczu `nation-league`

Format meczu Nation League. Używany przez rozgrywki Nation League (`nation-league`) i Nation Junior (`nation-junior`). Przypisany do rozgrywek w definicji (`matchFormat`), a tabela biegowa jest danymi, nie stałymi w silniku.

## Składy

- 7 zawodników na drużynę. Numeracja: gospodarze 1-7, goście 9-15 (numer = slot + 8, numery 8 i 16 nieużywane).
- W biegach zasadniczych jadą numery 1-6 i 9-14. Rezerwowi to 7 (gospodarze) i 15 (goście).
- Reguły juniorskie: w Nation League brak (open, junior lub senior), w Nation Junior jadą tylko juniorzy.
- Zmiany składu przed pierwszym biegiem: dowolne, jak w lidze.

## Tabela biegowa

Tor A jest wewnętrzny, tor D zewnętrzny. W każdym biegu jadą 2 zawodników gospodarzy i 2 gości.

| Bieg | Tor A      | Tor B      | Tor C      | Tor D      |
| ---- | ---------- | ---------- | ---------- | ---------- |
| 1    | 1          | 9          | 2          | 10         |
| 2    | 3          | 11         | 4          | 12         |
| 3    | 13         | 5          | 14         | 6          |
| 4    | 11         | 1          | 12         | 2          |
| 5    | 4          | 13         | 3          | 14         |
| 6    | 5          | 10         | 6          | 9          |
| 7    | 2          | 14         | 1          | 13         |
| 8    | 9          | 3          | 10         | 4          |
| 9    | 6          | 12         | 5          | 11         |
| 10   | 10         | 4          | 13         | 1          |
| 11   | 14         | 6          | 11         | 3          |
| 12   | 12         | 2          | 9          | 5          |
| 13   | najsłabszy | najsłabszy | najsłabszy | najsłabszy |
| 14   | średni     | średni     | średni     | średni     |
| 15   | najlepszy  | najlepszy  | najlepszy  | najlepszy  |

W biegach 1-12 każdy z sześciu zawodników drużyny jedzie dokładnie 4 razy.

## Biegi nominowane (13-15)

- Do biegów nominowanych automatycznie trafiają tylko zawodnicy z numerów 1-6 (rezerwowy 7 lub 15 tylko przez zmianę). Każda drużyna wystawia parę: w biegu 13 zawodników na miejscach 5 i 6 rankingu drużyny, w biegu 14 na miejscach 3 i 4, w biegu 15 na miejscach 1 i 2.
- Ranking zawodników drużyny (miejsca 1-6): punkty zdobyte w tym meczu do danego momentu. Przy równej liczbie punktów decyduje kolejno liczba pierwszych miejsc, drugich, trzecich, czwartych, potem wykluczenia i inne statusy nieukończenia biegu (mniej jest lepiej), a przy dalszej równości zawodnik z niższym numerem jest wyżej.
- Przydział torów: wyższe miejsce w rankingu dostaje tor wewnętrzny (A lub B), niższe zewnętrzny (C lub D). Domyślnie gospodarze jadą na A i C, goście na B i D (jak w biegu 1). Bieg 13: miejsce 5 na A (gospodarze) lub B (goście), miejsce 6 na C lub D. Bieg 14: miejsca 3 i 4. Bieg 15: miejsca 1 i 2.

## Zmiany zawodników

- Rezerwa zwykła (numer 7 lub 15): może pojechać w każdej chwili w miejsce dowolnego zawodnika z numerów 1-6. Zastąpiony zawodnik nie jedzie w tym biegu. Rezerwowy może pojechać maksymalnie w 5 biegach.
- Rezerwa taktyczna: tylko gdy drużyna przegrywa co najmniej 6 punktami po poprzednim biegu. Wtedy zawodnik z numerów 1-6 może zostać wstawiony za innego zawodnika z numerów 1-6 (np. zawodnik 1 za zawodnika 4). Każdy zawodnik może być zawodnikiem taktycznym, ale tylko jeden raz w meczu.
- Limity biegów: zawodnik z numerów 1-6 jedzie normalnie maksymalnie 5 biegów (4 zasadnicze i 1 nominowany), a jeśli jechał jako taktyczny, maksymalnie 6.
- Podwajanie punktów zawodnika taktycznego: parametr `tacticalPointsMultiplier`, domyślnie 1 (bez podwajania), do potwierdzenia.

## Punktacja

- Jak w lidze: za miejsce w biegu 3-2-1-0. Wynik meczu to suma punktów biegowych obu drużyn.

## Do ustalenia

- Podwajanie punktów zawodnika taktycznego (parametr, domyślnie bez podwajania).
- Które statusy nieukończenia biegu istnieją w silniku i w jakiej kolejności rozstrzygają remisy po czwartych miejscach.
- Skład reprezentacji (osobne zadanie): wybór zawodników na start sezonu, najlepiej według średniej z poprzedniego lub bieżącego sezonu albo rankingu zawodników.

## Rozstrzygnięte (2026-11-22)

- Ranking w biegach nominowanych: punkty w meczu, remisy według miejsc w biegach, wykluczeń i numeru. Tory według miejsca w rankingu.
- Rezerwa taktyczna: klasyczna, próg 6 punktów, raz na zawodnika, każdy może być taktyczny.
- Rezerwa zwykła: maksymalnie 5 biegów.
- Reguły juniorskie: brak w Nation League, w Nation Junior tylko juniorzy.

## Status implementacji

| Element                                        | Stan         |
| ---------------------------------------------- | ------------ |
| Format jako dane (rejestr formatów)            | do zrobienia |
| Tabela biegowa, składy 7 zawodników            | do zrobienia |
| Biegi nominowane                               | do zrobienia |
| Zmiany zawodników (rezerwa zwykła i taktyczna) | do zrobienia |
