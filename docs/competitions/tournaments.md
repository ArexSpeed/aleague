# Tournaments: turnieje klubowe

Opis zasad rozgrywek i status implementacji. Konwencje wspólne (identyfikatory, format jako dane per sezon) jak w `docs/competitions/nations.md`. Rodzaj `kind=tournaments`, druga linia: Pairs, Fours, Regio.

## Zasady wspólne

- Identyfikatory rozgrywek (tag) mają postać `tournaments-<competition>`: `tournaments-regio`, `tournaments-pairs`, `tournaments-fours`. Każdy mecz w danych ma pole `competition` z tym identyfikatorem, a wyniki i statystyki zawodników są liczone osobno dla tagu.
- Format w danych per sezon: definicja rozgrywek (grupy, schemat rund, finał, reguły składu) jest danymi sezonu, a nie stałymi w kodzie.
- Mecze turniejów są wieloosobowe (czwórmecze lub większe), więc tabele biegowe są osobnymi zadaniami. Do tego czasu turnieje mają tylko terminarz, tabele i finał (bez symulacji).
- Reguły składu są zapisane w definicji rozgrywek (różnią się między rozgrywkami).
- Daty: na razie brak, kolejność wyznacza runda.

## Regio (`tournaments-regio`)

- Uczestnicy: wszystkie 48 klubów w 8 grupach po 6 klubów według regionu klubu (te same kluby, które jeżdżą w ligach, a kluby jednego regionu mogą być w Gold i Silver swojej strony).
- Mecz: czwórmecz, czyli 4 kluby w jednym meczu (gospodarz i trzech gości). Kluby jadą parami zawodników, w stylu Ekstraligi U24. Tabela biegowa: osobne zadanie.
- Faza grupowa: 6 rund na grupę, w każdej rundzie jeden czwórmecz. Każdy klub jest raz gospodarzem i jedzie łącznie 4 mecze. Schemat według numerów klubów w grupie (1-6):

| Runda | Gospodarz | Gość 1 | Gość 2 | Gość 3 |
| ----- | --------- | ------ | ------ | ------ |
| 1     | 1         | 2      | 3      | 4      |
| 2     | 2         | 1      | 5      | 6      |
| 3     | 3         | 4      | 5      | 6      |
| 4     | 4         | 1      | 2      | 5      |
| 5     | 5         | 1      | 3      | 6      |
| 6     | 6         | 2      | 3      | 4      |

- Pary klubów spotykają się w czwórmeczach 2 lub 3 razy (to nie jest pełne każdy z każdym).
- Przydział numerów 1-6 w grupie: do ustalenia (tymczasowo alfabetycznie).
- Finał: 4 najlepsze kluby tabeli grupy po 6 rundach, na stadionie najlepszego klubu (gospodarz to 1. miejsce w tabeli). Zwycięzca finału to zwycięzca turnieju Regio danej grupy.
- Razem na grupę 7 czwórmeczów (6 rund i finał), w całym turnieju 56.
- Skład klubu w meczu: 4 zawodników plus rezerwowy. Rezerwowy jest juniorem, a wśród 4 zawodników musi być minimum jeden junior.
- Punktacja czwórmeczu, tabela grupy i rozstrzyganie remisów: do ustalenia.
- Id meczów: `tournaments-regio-<group>-<round>`, finał `tournaments-regio-<group>-final`.
- Widok w UI: Tournaments, Regio: filtr grupy (All i 8 grup), taby Groups (tabela grupy i 6 meczów) oraz Final (finały 8 grup).
- 8 zwycięzców finałów to miejsca w SuperCup.

## Pairs i Fours (turnieje klubowe)

- Do opisania. Tagi `tournaments-pairs` i `tournaments-fours`, nie mylić z `nation-pairs` i `nation-fours`.

## Zasady wspólne dla Fours i Pairs

- Turnieje jednorazowe w sezonie, w których gra wszystkie 48 klubów. Format: kolejne rundy grup, w każdej grupie jeden mecz wieloosobowy. Awansują najlepsze kluby z grupy, a ostatnia runda to finał jednego meczu.
- Podział na grupy w każdej rundzie według rankingu klubów: koszyki wg rankingu (liczba koszyków równa liczbie klubów w grupie), w każdej grupie po jednym klubie z każdego koszyka, losowanie w koszykach deterministyczne z ziarnem w definicji. Do potwierdzenia (alternatywa: rozkładanie "wężem" bez losowania).
- Kolejność klubów w meczu: suma punktów biegowych (do potwierdzenia).
- Ranking klubów w pierwszym sezonie: tymczasowo miejsce w lidze (Gold przed Silver, w obrębie ligi wyżej w końcowej tabeli, przy równej pozycji East przed West). Docelowo ranking klubów (osobne zadanie, patrz SuperCup). Turnieje rozgrywane po zakończeniu lig (do potwierdzenia).
- Tabele biegowe czwórmeczu i meczu parowego: osobne zadania. Do tego czasu terminarz, grupy i awanse, bez symulacji.
- Skład klubu w meczu: do ustalenia.

## Fours (`tournaments-fours`)

- Mecze: czwórmecze (4 kluby w meczu), każda grupa to jeden czwórmecz.
- Rundy: Round 1 (12 grup po 4, awansują 2 najlepsze z grupy, czyli 24, oraz 8 najlepszych klubów z 3. miejsc według punktów, razem 32), Round 2 (8 grup po 4, awansują 2 najlepsze, czyli 16), Semifinals (4 grupy po 4, awansuje tylko najlepszy, czyli 4), Final (jeden czwórmecz 4 klubów).
- Razem 25 czwórmeczów (12 + 8 + 4 + 1).
- Porównanie 3. miejsc: suma punktów biegowych w meczu, przy remisie na granicy pozycja w rankingu klubów.
- Id meczów: `tournaments-fours-<round>-<group>` (`r1`, `r2`, `sf`) oraz `tournaments-fours-final`.

## Pairs (`tournaments-pairs`)

- Mecze: w jednym meczu jedzie 6 klubów (kluby jadą parami zawodników), każda grupa to jeden mecz.
- Rundy: Round 1 (8 grup po 6, awansują 3 z grupy, czyli 24), Round 2 (4 grupy po 6, awansują 3, czyli 12), Semifinals (2 grupy po 6, awansują 3, czyli 6), Final (jeden mecz 6 klubów).
- Razem 15 meczów (8 + 4 + 2 + 1).
- Id meczów: `tournaments-pairs-<round>-<group>` (`r1`, `r2`, `sf`) oraz `tournaments-pairs-final`.

## Do ustalenia

- Przydział numerów klubów w grupie (losowanie, rozstawienie, kolejność według danych).
- Punktacja czwórmeczu (propozycja: punkty za miejsce 3-2-1-0, remisy według punktów biegowych) i rozstrzyganie remisów w tabeli.
- Tabela biegowa Regio (osobne zadanie).
- Uogólnienie walidacji składów na reguły per rozgrywki (osobne zadanie).
- Pairs i Fours (turnieje klubowe).
- Kalendarz.

## Rozstrzygnięte (2026-11-20)

- Regio jest turniejem w Tournaments (zastępuje ligi regionalne).
- 8 grup po 6 klubów, czwórmecze, 6 rund plus finał czterech najlepszych na stadionie najlepszego klubu.

## Status implementacji

| Rozgrywki | Terminarz i widoki | Tabela biegowa | Symulacja |
| --------- | ------------------ | -------------- | --------- |
| Regio     | do zrobienia       | osobne zadanie | nie       |
| Pairs     | zrobione (Rounds)  | osobne zadanie | nie       |
| Fours     | zrobione (Rounds)  | osobne zadanie | nie       |

## Szablon opisu rozgrywek (do kolejnych)

Uczestnicy, Format, Kolejki lub rundy, Punktacja i tie-break, Awanse, Statystyki (tag), Tabela biegowa, Widok w UI, Id meczów, Status.
