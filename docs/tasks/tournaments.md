## [FEATURE] Tournaments → Fours and Pairs: multi-round group tournaments (no simulation yet)

### Cel

W Competitions dla `kind=tournaments` opcje Fours i Pairs pokazują strukturę turniejów (rundy, grupy, awanse, finał), zgodnie z `docs/competitions/tournaments.md`. Grupy i awanse są wyliczane z rankingu klubów i wyników poprzednich rund. Bez symulacji.

### Kontekst

- Specyfikacja: `docs/competitions/tournaments.md` (sekcje Zasady wspólne dla Fours i Pairs, Fours, Pairs, już w repo, przeczytaj ją w całości przed zmianami).
- Zależy od zadania Tournaments → Regio (konfiguracja `kind=tournaments`, model fixture z listą uczestników, usunięty stary `regio`). Jeśli czegoś brakuje, dodaj kompatybilnie.
- Oba turnieje mają tę samą strukturę (rundy grup, w grupie jeden mecz, awans najlepszych, w Fours dodatkowo dzikie karty z 3. miejsc), więc dodaj jeden ogólny format z dwiema definicjami jako dane.
- Gra wszystkie 48 klubów. Fours: 12, 8, 4 grupy po 4 i finał (25 meczów). Pairs: 8, 4, 2 grupy po 6 i finał (15 meczów).
- Mecze są wieloosobowe, więc widok meczu, `MatchSetup` i tabele biegowe tego jeszcze nie obsługują. Karty meczów nie prowadzą do widoku meczu.
- Do tworzenia grup potrzebny jest ranking klubów. Tymczasowo według miejsca w lidze, w jednym wspólnym module (do wymiany na ranking Elo w osobnym zadaniu).
- Jeśli istnieje generator liczb pseudolosowych z ziarnem z zadania Cup, użyj go.

### Zakres

- definicje Fours i Pairs jako dane per sezon i generator fixtures w `sports/speedway/data/season-1/`, z polem `competition` (`tournaments-fours`, `tournaments-pairs`)
- funkcje czyste w `sports/speedway/sim/`: ranking klubów (tymczasowy, wspólny moduł), podział na grupy, awans z grup, rozwiązywanie rund
- konfiguracja rodzajów (`kind=tournaments`, druga linia Pairs / Fours / Regio) i widoki w `sports/speedway/views/`
- aktualizacja statusu w `docs/competitions/tournaments.md`

### Poza zakresem

- Symulacja, tabele biegowe czwórmeczu i meczu parowego, strona meczu wieloosobowego
- Reguły składu dla Fours i Pairs (w definicji zostają puste do ustalenia)
- Ranking klubów Elo (tu tylko tymczasowa wersja), powiązanie z SuperCup, kafelki trofeów
- Schemat bazy w Supabase i nowe zależności

### Kroki

**Etap 1: definicje, fixtures i widok**

1. **Diagnoza (bez zmian w kodzie).** Opisz w PR: jak zadanie Regio zdefiniowało format z listą uczestników i konfigurację `kind=tournaments`, czy istnieje generator liczb pseudolosowych z ziarnem, oraz jak odczytać końcową kolejność każdej z czterech lig (także z fazą finałową).
2. **Ogólny format.** Dodaj typ formatu (np. `multi-team-group-rounds`) do zamkniętej listy typów. Definicja rundy: `id`, etykieta, liczba grup, liczba klubów w grupie, liczba awansujących z grupy, opcjonalna dzika karta (miejsce w grupie, liczba klubów, kryterium: punkty). Pola wspólne: metoda podziału na grupy (koszyki wg rankingu z losowaniem z ziarnem, ziarno osobno na rundę), źródło rankingu (tymczasowo miejsce w lidze, z opcjonalną ręczną listą do testów), kolejność w meczu (suma punktów biegowych), `lineup` (puste, `TODO`).
3. **Definicje.** Fours: Round 1 (12 grup po 4, awans 2 i dzika karta: 8 najlepszych z 3. miejsc), Round 2 (8 grup po 4, awans 2), Semifinals (4 grupy po 4, awans 1), Final (1 grupa po 4). Pairs: Round 1 (8 grup po 6, awans 3), Round 2 (4 grupy po 6, awans 3), Semifinals (2 grupy po 6, awans 3), Final (1 grupa po 6). Liczby tylko w danych, nie w kodzie.
4. **Generator.** Fixtures dla każdej grupy każdej rundy (Fours 25, Pairs 15, razem 40), uczestnicy jako placeholdery do czasu utworzenia grup. Id `tournaments-fours-<round>-<group>` (`r1`, `r2`, `sf`), `tournaments-fours-final`, analogicznie Pairs. Pola `competition`, `round`, `group`.
5. **Konfiguracja i widoki.** `kind=tournaments`: Pairs i Fours przestają być pustym stanem. Jeden tab Rounds z wyborem rundy (Round 1, Round 2, Semifinals, Final) jako przewijane przyciski. Dla rundy siatka kart grup: w karcie kluby z miejscem i punktami (puste przed wynikami), oznaczenie klubów awansujących. Dla Fours Round 1 dodatkowo panel "Best third-placed" (ranking 12 trzecich miejsc z linią odcięcia po 8). Karty nieklikalne z podpowiedzią "Coming soon". Przed utworzeniem grup komunikat, czego brakuje (np. zakończonych lig).
6. **Ładowanie danych i tag.** Tylko dane tego turnieju. Tag `competition` jak w zadaniu Nations.

**Etap 2: ranking, grupy i awanse (funkcje czyste)** 7. **Tymczasowy ranking klubów (wspólny moduł).** Funkcja zwraca uporządkowaną listę 48 klubów: Gold przed Silver, w obrębie ligi według końcowej kolejności, przy równej pozycji East przed West, oznaczona `TODO: club ranking (Elo)`. Zwraca "nierozstrzygnięte", dopóki ligi nie są zakończone, i akceptuje ręczną listę z definicji (testy). Jeśli moduły Cup lub SuperCup mają własny tymczasowy ranking, przepnij je na ten wspólny. 8. **Podział na grupy.** Funkcja czysta: z uporządkowanej listy klubów tworzy koszyki (liczba koszyków równa liczbie klubów w grupie, wielkość koszyka równa liczbie grup), a każda grupa dostaje po jednym klubie z każdego koszyka, losowanie w koszykach deterministyczne z ziarnem. Każdy klub dokładnie raz. 9. **Awans z grup.** Funkcja czysta: z wyników rundy wyznacza awansujących (najlepsze k z grupy według sumy punktów biegowych, w Fours Round 1 także 8 najlepszych trzecich miejsc), przy remisie decyduje pozycja w rankingu klubów. Zwraca "nierozstrzygnięte", dopóki wszystkie grupy rundy nie mają wyników. 10. **Rozwiązywanie rund.** Grupy rundy N+1 powstają z awansujących rundy N (nowy podział według rankingu, nie według wyników turnieju). Użyj wspólnego `resolveFixture`, jeśli istnieje. 11. **Przykłady (testy).** Jeśli w repo jest konfiguracja testów, dodaj przypadki na danych testowych: Fours Round 1 daje 32 awansujących (24 + 8 trzecich), Round 2 daje 16, Semifinals 4, Pairs daje 24, 12, 6. Podział na grupy daje każdy klub raz i po jednym klubie z każdego koszyka. Jeśli konfiguracji testów nie ma, zrób skrypt deweloperski, bez nowych zależności. 12. Zaktualizuj tabelę statusu w `docs/competitions/tournaments.md`.

### Kryteria akceptacji

- [ ] Fours ma 25 meczów (12, 8, 4, 1), Pairs 15 meczów (8, 4, 2, 1), każdy z polem `competition` i pola `round`, `group`. Liczby grup i klubów pochodzą z definicji.
- [ ] Zakładka Rounds pokazuje 4 rundy dla każdego turnieju i karty grup z placeholderami przed utworzeniem grup, bez błędów.
- [ ] Podział na grupy: każdy klub dokładnie raz, w każdej grupie po jednym klubie z każdego koszyka, powtarzalny dla tego samego ziarna.
- [ ] Fours Round 1 daje 32 awansujących (24 z miejsc 1-2 oraz 8 najlepszych trzecich), Round 2 daje 16, Semifinals 4. Pairs: 24, 12, 6.
- [ ] Panel "Best third-placed" w Fours Round 1 pokazuje ranking 12 trzecich miejsc z linią odcięcia po 8.
- [ ] Do czasu zakończenia lig lub wyników rundy widoczny jest czytelny komunikat, bez błędów.
- [ ] Karty meczów wieloosobowych nie prowadzą do widoku meczu.
- [ ] Ligi klubowe, Cup, Nations, Regio i inne rodzaje bez regresji, brak zmian w schemacie bazy i nowych zależności.
- [ ] `pnpm lint` i `pnpm build` przechodzą.

### Do poprawy / propozycje

- [DO UZUPEŁNIENIA: metoda podziału na grupy: koszyki z losowaniem (przyjęte) czy rozkładanie "wężem" bez losowania.]
- [DO UZUPEŁNIENIA: kolejność w meczu i porównanie 3. miejsc: suma punktów biegowych (przyjęte).]
- [DO UZUPEŁNIENIA: reguły składu dla Fours i Pairs (jak Regio: 4 zawodników plus rezerwowy junior? dla Pairs inaczej?).]
- [DO UZUPEŁNIENIA: moment rozgrywania turniejów względem lig (przyjęte: po zakończeniu lig).]
- Propozycja: osobne zadanie "mecz wieloosobowy": model meczu o N stronach, tabele biegowe dla 4 i 6 klubów, strona meczu, reguły składu per rozgrywki jako dane. Od niego zależy symulacja pięciu rozgrywek (Regio, Fours i Pairs klubowe oraz Nations Fours i Pairs).
- Propozycja: widok "ścieżka klubu" (przez które rundy przeszedł dany klub).

### Decyzje otwarte

- Metoda podziału na grupy.
- Reguły składu dla Fours i Pairs.
