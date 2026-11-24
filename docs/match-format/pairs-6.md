# Format meczu `pairs-6`

Turniej parowy dla 6 drużyn (par): 15 biegów, w których każda para jedzie z każdą inną dokładnie raz, oraz 2 biegi dodatkowe (o 3. i o 1. miejsce), razem 17 biegów. Format jest przypisany do rozgrywek w definicji (`matchFormat`), a tabela biegowa i punktacja miejsc są danymi.

Używany przez: Pairs klubowe (`tournaments-pairs`, każda grupa 6 klubów to jeden mecz). Nation Pairs i Nation Junior Pairs (8 narodów) potrzebują osobnego formatu.

## Składy i numeracja
- Pary A-F, w każdej 2 zawodników podstawowych i 1 rezerwowy: A 1, 2 (rez. 13), B 3, 4 (rez. 14), C 5, 6 (rez. 15), D 7, 8 (rez. 16), E 9, 10 (rez. 17), F 11, 12 (rez. 18). Numer podstawowego = 2 × indeks pary + slot (indeks od 0, slot 1-2), numer rezerwowego = 13 + indeks.
- Przydział liter A-F: losowany deterministycznie (ziarno w definicji), jak w turniejach Fours.
- Reguły składu pochodzą z definicji rozgrywek: Open (bez reguł juniorskich, Pairs klubowe przyjęto) oraz Junior (tylko juniorzy).
- Zmiany składu przed pierwszym biegiem: dowolne, jak w lidze.
- Tory nie wpływają na symulację w obecnej wersji gry (są zapisywane i wyświetlane).

## Punktacja biegu
- Za miejsca 1-4 w biegu: 4, 3, 2, 0 punktów (parametr formatu). W biegu rozdawanych jest 9 punktów, więc dwie pary nigdy nie remisują w biegu.
- Punkty pary to suma punktów jej zawodników.

## Tabela biegowa (biegi 1-15)
Tor A jest wewnętrzny, tor D zewnętrzny. W każdym biegu jadą obie pary po 2 zawodników.

| Bieg | Zespoły | Tor A | Tor B | Tor C | Tor D |
|---|---|---|---|---|---|
| 1 | A - B | 1 | 3 | 2 | 4 |
| 2 | C - D | 5 | 7 | 6 | 8 |
| 3 | E - F | 11 | 9 | 12 | 10 |
| 4 | A - C | 5 | 1 | 6 | 2 |
| 5 | B - E | 9 | 3 | 10 | 4 |
| 6 | D - F | 11 | 7 | 12 | 8 |
| 7 | A - D | 1 | 7 | 2 | 8 |
| 8 | C - E | 9 | 5 | 10 | 6 |
| 9 | B - F | 11 | 3 | 12 | 4 |
| 10 | C - F | 5 | 11 | 6 | 12 |
| 11 | A - E | 1 | 9 | 2 | 10 |
| 12 | B - D | 7 | 3 | 8 | 4 |
| 13 | D - E | 7 | 9 | 8 | 10 |
| 14 | B - C | 5 | 3 | 6 | 4 |
| 15 | A - F | 11 | 1 | 12 | 2 |

- Każda para jedzie dokładnie 5 biegów (z każdą inną parą raz), każdy zawodnik podstawowy też 5. W 15 biegach pary zdobywają łącznie 135 punktów.
- Rezerwowi nie występują w tabeli, jadą tylko w zastępstwie.

## Tabela po 15 biegach i remisy
- Tabela: 6 par według sumy punktów. Służy do wyznaczenia uczestników biegów dodatkowych.
- Remisy w tabeli, kolejno (do potwierdzenia):
  1. mini tabela bezpośrednia remisujących par: punkty zdobyte w biegach bezpośrednich między nimi (dla dwóch par to bieg, w którym się spotkały),
  2. liczba pierwszych, drugich, trzecich i czwartych miejsc oraz wykluczeń zawodników pary (więcej wyższych miejsc jest lepiej, mniej wykluczeń jest lepiej),
  3. kolejność liter A-F (A wyżej).

## Biegi dodatkowe (16-17)
- Bieg 16 (o 3. miejsce): jadą pary z miejsc 3 i 4 tabeli (rozstrzyga trzecią awansującą parę).
- Bieg 17 (o 1. miejsce): jadą pary z miejsc 1 i 2 tabeli.
- Bieg 16 jedzie przed biegiem 17. Uczestnicy obu biegów są znani po biegu 15.
- Tory (kosmetyczne): para wyżej w tabeli na torach A i C, para niżej na B i D, w parze zawodnik z niższym numerem na A lub B.
- Kolejność końcowa: miejsca 1-2 wynikają z biegu 17, miejsca 3-4 z biegu 16, miejsca 5-6 z tabeli. W biegach dodatkowych nie ma remisu.
- Punkty z biegów dodatkowych liczą się zawodnikom (statystyki), ale nie zmieniają tabeli po 15 biegach (przyjęto).
- Kolejność końcowa jest wynikiem meczu (z grupy awansują 3 pierwsze pary).

## Zmiany zawodników
- Rezerwa zwykła (13-18): może pojechać w każdej chwili w miejsce jednego z dwóch zawodników swojej pary, także w biegach dodatkowych. Maksymalnie 5 biegów (łącznie z biegami dodatkowymi).
- Zmiany taktycznej nie ma.
- Limit biegów zawodnika podstawowego: 6 (5 w tabeli i bieg dodatkowy).

## Do ustalenia
- Remisy w tabeli (przyjęto powyższą kolejność).
- Czy punkty z biegów dodatkowych mają wchodzić do statystyk zawodników (przyjęto: tak).
- Reguły składu klubowych Pairs (przyjęto Open).
- Format i punktacja dla Nation Pairs i Nation Junior Pairs (8 narodów, tabela biegowa dla 8 par, czy punktacja 4-3-2-0 i biegi dodatkowe też obowiązują).

## Rozstrzygnięte
- Rezerwa zwykła w dowolnej chwili, maksymalnie 5 biegów, brak zmiany taktycznej.
- Warianty Open i Junior klasycznie.
- Punktacja biegu 4-3-2-0 i dwa biegi dodatkowe (o 3. i o 1. miejsce).

## Status implementacji
| Element | Stan |
|---|---|
| Format jako dane (6 par, punktacja miejsc) | do zrobienia |
| Biegi 1-15, składy 2 plus rezerwowy | do zrobienia |
| Biegi dodatkowe 16-17 i klasyfikacja końcowa | do zrobienia |
| Zmiany zawodników | do zrobienia |