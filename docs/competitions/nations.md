# Nations: rozgrywki reprezentacji narodowych

Opis zasad rozgrywek i status implementacji. Kolejne rozgrywki (Cup, Individual, Tournaments, ligi regionalne) opisujemy tym samym schematem (patrz "Szablon" na końcu).

## Zasady wspólne

- Uczestnicy: 8 narodów (pisownia wg `sports/speedway/data/season-1/nations.json`): Arkadia, Arvia, Celtia, Costalia, Gotavia, Montania, Rivia, Rotan.
- Filtry w UI: `kind=nation`, druga linia `competition=league|junior|games|fours|pairs`, dla `fours` i `pairs` trzecia linia `category=senior|junior`. Linie filtrów są przewijane poziomo.
- Identyfikator rozgrywek (tag) ma postać `<kind>-<competition>`: `nation-league`, `nation-junior`, `nation-games`, `nation-fours`, `nation-pairs`. Każdy mecz w danych ma pole `competition` z tym identyfikatorem. Wyniki i statystyki zawodników są liczone osobno dla każdego tagu (punkty z `nation-league` nie mieszają się z `nation-junior`).
- Tournaments (Pairs i Fours) to osobny turniej klubowy (`tournaments-pairs`, `tournaments-fours`), nie mylić z `nation-pairs` i `nation-fours`. Ma własny dokument.
- Format w danych per sezon: definicja rozgrywek (liczba uczestników, typ formatu, liczba kolejek, zasada rozstawienia, gospodarz) jest zapisana jako dane danego sezonu, a nie na sztywno w kodzie. Zmiana schematu (nowe rozgrywki, inny format) od wybranego sezonu to nowa definicja. Wcześniejsze sezony zachowują swój format i historię.
- Skład: reprezentacja narodu (ok. 10 zawodników wybieranych na starcie sezonu, osobne zadanie). W rozgrywkach juniorskich tylko juniorzy.
- Tabele biegowe (kolejność zawodników w biegach): League i Junior mają inną niż liga klubowa, 4Teams (4 drużyny w biegu) i Pairs (pary) mają własne. Każda to osobne zadanie. Do tego czasu mecze Nations są tylko w terminarzu i tabelach, bez symulacji.
- Punktacja tabel i rozstrzyganie remisów: jak w lidze klubowej, do czasu osobnej decyzji.
- Daty: na razie brak. Mecze są symulowane ręcznie (docelowo realtime), kolejność wyznacza numer kolejki lub rundy. Daty lub kalendarz sezonu to osobne zadanie.
- Gospodarz (Games): rozgrywki w stylu Euro w jednym miejscu. Dla turnieju wybierane jest miasto i stadion, w danych sezonu pole `host`, w UI "Host: TBD" do czasu wyboru. Dla 4Teams i Pairs analogicznie (do potwierdzenia).

## League (`nation-league`)

- Format: 8 narodów, jedna grupa, każdy z każdym dwa razy (mecz i rewanż), 14 kolejek po 4 mecze, razem 56 meczów.
- Widok: taby Table (jedna tabela), Fixtures (kolejki 1-14), Stats, History.
- Statystyki zawodników z tagiem `nation-league`.
- Id meczów: `nation-league-regular-<round>-<match>`.

## Junior (`nation-junior`)

- Format identyczny jak League (56 meczów, 14 kolejek), ale w składach tylko juniorzy.
- Widok i statystyki jak League, tag `nation-junior`.
- Id meczów: `nation-junior-regular-<round>-<match>`.

## Games (`nation-games`, trofeum Cup)

- Rozstawienie wg rankingu (wstążka): pozycje 1-8 dzielone na grupy A = 1, 4, 5, 8 oraz B = 2, 3, 6, 7. Źródło rankingu: końcowa tabela `nation-league` z tego samego sezonu (do potwierdzenia). Do czasu jej rozstrzygnięcia w terminarzu widać "Seed n". W danych można ręcznie podać kolejność rozstawienia (do testów).
- Faza grupowa: w grupie każdy z każdym raz, 3 kolejki po 2 mecze, razem 12 meczów.
- Faza pucharowa: dwa półfinały (1. miejsce A vs 2. miejsce B, 1. miejsce B vs 2. miejsce A), mecz o 3. miejsce (przegrani półfinałów), finał (zwycięzcy półfinałów). Razem 16 meczów w rozgrywkach.
- Gospodarz: jedno miasto i stadion dla całego turnieju (patrz Zasady wspólne).
- Widok: tab Groups (osobna tabela dla każdej grupy i jej terminarz), tab Final (drabinka: półfinały, mecz o 3. miejsce, finał).
- Id meczów: `nation-games-group-<round>-<match>`, `nation-games-semi-<n>`, `nation-games-third`, `nation-games-final`.

## 4Teams (`nation-fours`)

- Mecz czterodrużynowy: w jednym meczu jadą 4 narody (klasyczny czwórmecz, tabela biegowa dla 4 drużyn).
- Format: 2 półfinały po 4 narody (razem wszystkie 8), z każdego półfinału awansują 2 najlepsze, finał 4 narodów. Razem 3 mecze.
- Przydział do półfinałów: domyślnie jak wstążka w Games (1, 4, 5, 8 oraz 2, 3, 6, 7), do potwierdzenia.
- Osobne rozgrywki Seniors i Juniors (`category`), każde z własnymi półfinałami i finałem. Statystyki rozdzielone także po kategorii.
- Widok: taby Semifinals (dwie karty po 4 narody) i Final (karta 4 narodów). Wynik meczu to klasyfikacja 4 narodów.
- Id meczów: `nation-fours-<category>-semi-<n>`, `nation-fours-<category>-final`.

## Pairs (`nation-pairs`)

- Jeden duży mecz z udziałem 8 narodów, tabela biegowa parowa. Wynik to jedna klasyfikacja 8 narodów.
- Osobne rozgrywki Seniors i Juniors (`category`).
- Widok: tab Table (klasyfikacja 8 narodów), tab Heats (lista biegów, na razie pusty stan).
- Id meczu: `nation-pairs-<category>-1`.

## Do ustalenia

- Źródło rankingu do rozstawienia w Games (propozycja: końcowa tabela `nation-league` z tego samego sezonu).
- Wybór gospodarza (losowanie, rotacja, ręcznie) i czy dotyczy też 4Teams i Pairs.
- Przydział do półfinałów w 4Teams (propozycja: ta sama wstążka).
- Punktacja tabel i remisy (do czasu decyzji jak w lidze klubowej).
- Awanse i spadki (brak w Nations).
- Powiązanie z trofeami na kartach: League = `nation-league`, Cup = `nation-games`, Junior = `nation-junior`, Pair = `nation-pairs`, 4Team = `nation-fours` (liczenie dla seniorów i juniorów).
- Kalendarz sezonu (osobne zadanie).

## Status implementacji

| Rozgrywki | Terminarz i widoki | Tabela biegowa   | Symulacja |
| --------- | ------------------ | ---------------- | --------- |
| League    | do zrobienia       | osobne zadanie   | nie       |
| Junior    | do zrobienia       | osobne zadanie   | nie       |
| Games     | do zrobienia       | jak liga klubowa | nie       |
| 4Teams    | do zrobienia       | osobne zadanie   | nie       |
| Pairs     | do zrobienia       | osobne zadanie   | nie       |

## Szablon opisu rozgrywek (do kolejnych)

Uczestnicy, Format, Kolejki lub rundy, Punktacja i tie-break, Awanse, Statystyki (tag), Tabela biegowa, Widok w UI, Id meczów, Status.
