# Format meczu `four-team`

Czwórmecz drużynowy: 4 drużyny w jednym meczu, w każdej 4 zawodników podstawowych i 1 rezerwowy, 20 biegów. Format jest przypisany do rozgrywek w definicji (`matchFormat`), a tabela biegowa jest danymi.

Używany przez: Fours klubowe (`tournaments-fours`), Nation Fours (`nation-fours`), Nation Junior Fours (`nation-junior-fours`) oraz Regio (`tournaments-regio`).

## Składy i numeracja

- Drużyny A, B, C, D. Zawodnicy podstawowi: A 1-4, B 5-8, C 9-12, D 13-16 (numer = 4 × indeks drużyny + slot, indeks od 0). Rezerwowi: A 17, B 18, C 19, D 20.
- Przydział liter: w turniejach (Fours klubowe, Nation Fours, Nation Junior Fours) litery A-D są losowane (deterministycznie, ziarno w definicji). W Regio gospodarz meczu to drużyna A, a kolejne według schematu rund (gospodarz, gość 1, gość 2, gość 3 to A, B, C, D).
- Reguły składu pochodzą z definicji rozgrywek:
  - Open (bez reguł juniorskich): Fours klubowe (przyjęto) i Nation Fours,
  - Junior (tylko juniorzy): Nation Junior Fours,
  - Regio: wśród czterech zawodników podstawowych co najmniej jeden junior, rezerwowy tylko junior.
- Zmiany składu przed pierwszym biegiem: dowolne, jak w lidze.
- Tory nie wpływają na symulację w obecnej wersji gry (są zapisywane i wyświetlane).

## Tabela biegowa

Tor A jest wewnętrzny, tor D zewnętrzny.

| Bieg | Tor A                | Tor B                | Tor C                | Tor D                |
| ---- | -------------------- | -------------------- | -------------------- | -------------------- |
| 1    | 2                    | 1                    | 3                    | 4                    |
| 2    | 6                    | 5                    | 7                    | 8                    |
| 3    | 10                   | 9                    | 11                   | 12                   |
| 4    | 14                   | 13                   | 15                   | 16                   |
| 5    | 15                   | 11                   | 1                    | 5                    |
| 6    | 9                    | 2                    | 6                    | 16                   |
| 7    | 3                    | 14                   | 10                   | 8                    |
| 8    | 13                   | 7                    | 12                   | 4                    |
| 9    | 11                   | 3                    | 16                   | 6                    |
| 10   | 1                    | 13                   | 8                    | 10                   |
| 11   | 12                   | 5                    | 14                   | 2                    |
| 12   | 7                    | 15                   | 4                    | 9                    |
| 13   | 8                    | 12                   | 2                    | 13                   |
| 14   | 16                   | 10                   | 5                    | 3                    |
| 15   | 4                    | 6                    | 9                    | 14                   |
| 16   | 1                    | 11                   | 7                    | 15                   |
| 17   | 4. miejsce w dr. (A) | 4. miejsce w dr. (D) | 4. miejsce w dr. (C) | 4. miejsce w dr. (B) |
| 18   | 3. miejsce w dr. (B) | 3. miejsce w dr. (C) | 3. miejsce w dr. (D) | 3. miejsce w dr. (A) |
| 19   | 2. miejsce w dr. (C) | 2. miejsce w dr. (B) | 2. miejsce w dr. (A) | 2. miejsce w dr. (D) |
| 20   | 1. miejsce w dr. (D) | 1. miejsce w dr. (A) | 1. miejsce w dr. (B) | 1. miejsce w dr. (C) |

- W biegach 1-4 jadą czterej zawodnicy jednej drużyny (bieg 1: A, 2: B, 3: C, 4: D). Punkty liczą się zawodnikom i drużynie (każda drużyna zdobywa w swoim biegu 6 punktów, co jest neutralne dla klasyfikacji).
- W biegach 5-16 jedzie po jednym zawodniku z każdej drużyny.
- Każdy zawodnik podstawowy jedzie w biegach 1-16 dokładnie 4 razy.

## Biegi nominowane (17-20)

- Obsada wynika z klasyfikacji punktowej zawodników wewnątrz każdej drużyny po 16 biegach. Rezerwowy nie jest nominowany automatycznie. Bieg 17: zawodnicy z 4. miejsc w swoich drużynach, bieg 18: z 3. miejsc, bieg 19: z 2. miejsc, bieg 20: liderzy drużyn. Tory według tabeli.
- Ranking zawodników drużyny: punkty zdobyte w meczu, przy remisie kolejno liczba 1., 2., 3. i 4. miejsc w biegach, potem statusy nieukończenia biegu (mniej jest lepiej), a przy dalszej równości zawodnik z niższym numerem jest wyżej (tak jak w Nation League).

## Zmiany zawodników

- Rezerwa zwykła (17-20): może pojechać w każdej chwili w miejsce dowolnego zawodnika podstawowego swojej drużyny. Maksymalnie 5 biegów.
- Rezerwa taktyczna: gdy drużyna traci do lidera meczu co najmniej 6 punktów, od biegu 5, inny zawodnik podstawowy swojej drużyny może pojechać zamiast zaplanowanego. Każdy zawodnik może być zawodnikiem taktycznym tylko raz w meczu. Punkty nie są podwajane.
- Limity biegów: zawodnik podstawowy jedzie normalnie maksymalnie 5 biegów (4 zasadnicze i 1 nominowany), a jeśli jechał jako taktyczny, maksymalnie 6 (jak w Nation League).

## Punktacja i klasyfikacja

- Za miejsce w biegu 3-2-1-0. Punkty drużyny w meczu to suma punktów jej zawodników (łącznie 120 punktów w meczu). Klasyfikacja 4 drużyn według sumy punktów.
- Remisy w klasyfikacji drużyn, kolejno:
  1. mini tabela bezpośrednia remisujących drużyn: liczba trójek, dwójek, jedynek, zer i wykluczeń zawodników drużyny w meczu (więcej trójek, dwójek i jedynek jest lepiej, mniej zer i wykluczeń jest lepiej),
  2. bieg liderów (bieg 20): wyżej drużyna, której lider zajął w nim lepsze miejsce (zawodnik bez miejsca jest niżej niż każdy z miejscem),
  3. przy dalszej równości kolejność liter A-D (A wyżej).

## Dodatkowe informacje

- Rezerwa taktyczna: strata do lidera co najmniej 6 punktów, od biegu 5, raz na zawodnika, bez podwajania punktów.
- Przydział liter: losowanie w turniejach, w Regio gospodarz to A.
- Remisy w klasyfikacji drużyn: mini tabela, potem bieg liderów.
- Format dotyczy też Regio (z własnymi regułami składu).

## Status implementacji

| Element                                     | Stan         |
| ------------------------------------------- | ------------ |
| Model meczu o 4 stronach i format jako dane | do zrobienia |
| Biegi 1-16, składy 4 plus rezerwowy         | do zrobienia |
| Biegi nominowane 17-20                      | do zrobienia |
| Zmiany zawodników                           | do zrobienia |
