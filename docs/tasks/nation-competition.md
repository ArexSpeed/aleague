## [FEATURE] Nations competitions: data, fixtures and layouts (League, Junior, Games, 4Teams, Pairs)

### Cel

W Competitions dla `kind=nation` druga linia filtrów zawiera League, Junior, Games, 4Teams i Pairs. Każde rozgrywki pokazują terminarz i tabele zgodnie ze specyfikacją w `docs/competitions/nations.md`, na danych z JSON zbudowanych z definicji rozgrywek per sezon. Bez symulacji.

### Kontekst

- Specyfikacja: `docs/competitions/nations.md` (już w repo, przeczytaj ją w całości przed zmianami).
- Zależy od zadań: Competitions z parametrem `kind` i konfiguracją rodzajów oraz Nations (dane w `nations.json`).
- Dziś `kind=nation` pokazuje coś innego (w URL było `group=cel-nation`). Nowa druga linia zastępuje dotychczasowe opcje.
- Parametry: druga linia `competition` (`league`, `junior`, `games`, `fours`, `pairs`), trzecia linia `category` (`senior`, `junior`) dla `fours` i `pairs`.
- Format rozgrywek ma być danymi per sezon (schematy będą się zmieniać między sezonami), nie stałymi w kodzie.
- Mecze czterodrużynowe (4Teams) i Pairs mają więcej niż dwóch uczestników, a widok meczu i `MatchSetup` obsługują dziś tylko dwie strony.
- Games ma gospodarza (jedno miasto i stadion), na razie nieustalonego.

### Zakres

- konfiguracja rodzajów (druga i trzecia linia filtrów, taby dla `kind=nation`)
- definicje rozgrywek jako dane i generator fixtures w `sports/speedway/data/season-1/`, z polem `competition` przy każdym meczu
- stałe identyfikatory rozgrywek (`nation-league` itd.) w pliku z kluczami rozgrywek
- widoki w `sports/speedway/views/` (użyj istniejących klocków z `components/` i widoków ligi)
- aktualizacja statusu w `docs/competitions/nations.md`

### Poza zakresem

- Symulacja, tabele biegowe (League i Junior, 4Teams, Pairs), strona meczu dla meczów wieloosobowych
- Wybór składów reprezentacji, daty i kalendarz sezonu, wybór gospodarza (tylko pole w danych)
- Widoki i dane innych rodzajów (Cup, Individual, Tournaments) i trofea na kartach
- Schemat bazy w Supabase i nowe zależności

### Kroki

**Etap 1: definicje, tag i League/Junior (najmniejsza działająca zmiana)**

1. **Diagnoza (bez zmian w kodzie).** Opisz w PR: co dziś renderuje `kind=nation` i co znaczy `group=cel-nation`, które komponenty ligi (tabela per grupa, terminarz z selektorem kolejki) da się użyć bez zmian, czy model fixture obsługuje inną liczbę uczestników niż 2, jak generator tworzy dane ligowe, oraz czy nazwy narodów w `nations.json` zgadzają się z dokumentem (pisownia).
2. **Identyfikatory i pole `competition`.** Dodaj typ `CompetitionId` o postaci `<kind>-<competition>` z wartościami z dokumentu. Każdy fixture Nations ma pole `competition`. Model fixture rozszerz tak, by obsługiwał uczestników jako listę (4 lub 8), a mecze dwuosobowe zostawały bez zmian (nie psuj lig klubowych).
3. **Definicje rozgrywek jako dane.** Dla każdych rozgrywek Nations osobna definicja w `data/season-1/` (np. `nation-competitions.json`): `id`, `kind`, `competition`, `category?`, `format` (zamknięta lista typów: `double-round-robin`, `groups-knockout`, `multi-team-knockout`, `single-event`), liczba uczestników, liczba kolejek, reguła rozstawienia, opcjonalny `host` (miasto, stadion). Generator buduje fixtures wyłącznie z definicji, a liczby (8, 14, 56) nie występują w kodzie na sztywno. Nowy sezon to kopia definicji ze zmianami.
4. **Generator League i Junior.** Z definicji: 8 narodów, jedna grupa, każdy z każdym dwa razy, 14 kolejek po 4 mecze (po 56 meczów), gospodarz i gość zamienieni w rewanżach. Id zgodnie z dokumentem i istniejącą konwencją (np. `nation-league-regular-06-3`).
5. **Konfiguracja i widok League/Junior.** Druga linia dla `kind=nation`: League, Junior, Games, 4Teams, Pairs (domyślnie League). Taby League i Junior: Table (jedna tabela 8 narodów), Fixtures (kolejki 1-14), Stats, History. Dane filtrowane po `competition`, pusta tabela (zera) do czasu wyników.
6. **Walidacja parametrów.** `category` ważne tylko dla `fours` i `pairs`, nieprawidłowe wartości zastępowane domyślnymi, zmiana rozgrywek czyści parametry spoza nowych (jak przy zmianie `kind`).
7. **Tag w statystykach.** Jeśli statystyki zawodników liczone są w jednym miejscu (`match-stats.ts`), dodaj filtr po `competition` bez zmiany wyników lig klubowych. Jeśli to wymaga większej przebudowy, zostaw samo pole i opisz w PR.

**Etap 2: Games** 8. Definicja Games: 2 grupy po 4 narody, rozstawienie wstążką (grupa A = rozstawienie 1, 4, 5, 8, grupa B = 2, 3, 6, 7), w grupie każdy z każdym raz (3 kolejki po 2 mecze), potem półfinały, mecz o 3. miejsce i finał (razem 16 meczów). 9. Rozstawienie: fixtures używają placeholderów rozstawienia ("Seed 1" do "Seed 8") i placeholderów fazy pucharowej (A1 vs B2, B1 vs A2, przegrani półfinałów, zwycięzcy półfinałów). Czysta funkcja podmienia je na narody na podstawie kolejności rozstawienia. Kolejność pochodzi z końcowej tabeli `nation-league` z tego samego sezonu, gdy jest rozstrzygnięta, albo z ręcznie podanej listy w definicji (tymczasowo alfabetycznie, `TODO: ranking`). Zwraca "nierozstrzygnięte", gdy brak danych. Jeśli mechanizm placeholderów powstał przy zadaniu West Silver, użyj go. 10. Widok: tab Groups (osobna tabela dla każdej grupy i jej terminarz, obok siebie na szerokim ekranie, jedna pod drugą na telefonie), tab Final (drabinka: półfinały, finał i mecz o 3. miejsce, na telefonie jako pionowa lista etapów). W nagłówku "Host: TBD" lub nazwa miasta i stadionu z `host`.

**Etap 3: 4Teams i Pairs** 11. Definicja i generator 4Teams: osobno `senior` i `junior`, w każdym 2 półfinały po 4 narody (przydział wstążką jak w Games, `TODO: confirm`) i finał z placeholderami (po 2 najlepszych z każdego półfinału). Razem 3 mecze na kategorię. 12. Widok 4Teams: trzecia linia Seniors / Juniors, taby Semifinals (dwie karty po 4 narody z pustą klasyfikacją) i Final (karta 4 narodów z opisem "Top 2 from each semifinal"). Karty meczów wieloosobowych nie prowadzą do strony meczu (wyłączone z podpowiedzią "Coming soon"). 13. Definicja i generator Pairs: osobno `senior` i `junior`, w każdym jeden mecz z 8 narodami. Widok: trzecia linia Seniors / Juniors, taby Table (klasyfikacja 8 narodów, puste wartości) i Heats (pusty stan "Heat table coming soon"). 14. Zaktualizuj tabelę statusu w `docs/competitions/nations.md` (terminarz i widoki: zrobione).

### Kryteria akceptacji

- [ ] Dla `kind=nation` druga linia: League, Junior, Games, 4Teams, Pairs, domyślnie League. Dla 4Teams i Pairs jest trzecia linia Seniors / Juniors.
- [ ] Liczba meczów w danych: League 56, Junior 56, Games 16, 4Teams 3 na kategorię, Pairs 1 na kategorię. Każdy mecz ma pole `competition`.
- [ ] Liczby (uczestnicy, kolejki, rozstawienie) pochodzą z definicji, a zmiana definicji zmienia wygenerowany terminarz bez zmian w kodzie generatora.
- [ ] League i Junior: jedna tabela 8 narodów, 14 kolejek po 4 mecze, każdy naród gra z każdym dwa razy (raz jako gospodarz, raz jako gość).
- [ ] Games: dwie tabele po 4 narody (grupa A z rozstawieniem 1, 4, 5, 8, grupa B z 2, 3, 6, 7), 3 kolejki po 2 mecze w grupie, drabinka z półfinałami, meczem o 3. miejsce i finałem (placeholdery), nagłówek z hostem.
- [ ] 4Teams: dla każdej kategorii dwa półfinały po 4 narody i finał z placeholderami. Pairs: dla każdej kategorii jedna tabela 8 narodów.
- [ ] Brak wyników nie powoduje błędów (puste tabele, placeholdery, "Host: TBD").
- [ ] Zmiana rozgrywek czyści nieprawidłowe parametry, `category` działa tylko dla 4Teams i Pairs.
- [ ] Ligi klubowe i inne rodzaje bez regresji.
- [ ] Brak zmian w schemacie bazy i brak nowych zależności.
- [ ] `pnpm lint` i `pnpm build` przechodzą.

### Do poprawy / propozycje

- [DO UZUPEŁNIENIA: źródło rankingu do rozstawienia w Games. Propozycja: końcowa tabela `nation-league` z tego samego sezonu, z ręczną listą do testów.]
- [DO UZUPEŁNIENIA: wybór gospodarza (losowanie, rotacja, ręcznie) i czy pole `host` dotyczy też 4Teams i Pairs.]
- [DO UZUPEŁNIENIA: przydział do półfinałów w 4Teams (propozycja: ta sama wstążka).]
- Propozycja: komponent drabinki zrobić ogólny, bo użyje go też Cup klubowy.
- Propozycja: typ meczu wieloosobowego (`participants`) jako docelowy model dla 4Teams i Pairs, żeby później nie przepisywać fixtures.
- Propozycja: zakładka History pokazuje format rozgrywek z danego sezonu (po wprowadzeniu zmian schematu).

### Decyzje otwarte

- Źródło rankingu do rozstawienia w Games.
- Wybór gospodarza i jego zakres.
- Przydział do półfinałów w 4Teams.
