## [FEATURE] Multi-team matches and match format "four-team" (20 heats)

### Cel

Mecz czterodrużynowy (4 uczestników) da się ustawić i zagrać bieg po biegu z tabelą 20 biegów z `docs/match-formats/four-team.md`. Wynikiem meczu jest klasyfikacja 4 drużyn. Format używają Fours klubowe, Nation Fours, Nation Junior Fours i Regio.

### Kontekst

- Specyfikacja: `docs/match-formats/four-team.md` (już w repo, przeczytaj ją w całości przed zmianami).
- Zależy od zadania "Match format nation-league" (rejestr formatów `MatchFormat`, ranking zawodników w biegach nominowanych, walidacja zmian rezerwy zwykłej i taktycznej) oraz od zadań Fours, Nations i Regio z fixtures o wielu uczestnikach. Użyj istniejących klocków, nie kopiuj kodu.
- Dziś model meczu, `MatchSetup`, akcje w `sim/actions.ts`, widok meczu i statystyki zakładają dwie strony (gospodarz i gość). Mecze dwustronne mają działać bez zmian.
- Numeracja zawodników zależy od formatu: dla `four-team` numer = 4 × indeks drużyny + slot (podstawowi 1-16), rezerwowi 17-20.
- Przydział liter A-D: w turniejach losowany deterministycznie z ziarnem, w Regio kolejność uczestników fixture to [gospodarz, gość 1, gość 2, gość 3] = A, B, C, D (gospodarz to A).
- Reguły składu pochodzą z definicji rozgrywek (pole `lineup`): Open bez reguł juniorskich (Fours klubowe, Nation Fours), Junior tylko juniorzy (Nation Junior Fours), Regio co najmniej jeden junior wśród czterech zawodników podstawowych i rezerwowy tylko junior.
- Tory nie wpływają na symulację w obecnej wersji gry, ale są zapisywane i wyświetlane.

### Zakres

- rozszerzenie `MatchFormat` o liczbę stron, schemat numeracji, tabelę biegów dla wielu drużyn, reguły nominacji i zmian
- model meczu o N stronach (zgodny wstecz z home i away) w `sports/speedway/sim/`, `MatchSetup`, `StoredMatch`
- symulacja biegów dla czterech zawodników z czterech drużyn (w tym biegi 1-4 z zawodnikami jednej drużyny), punkty zawodników i drużyn, klasyfikacja drużyn z remisami
- walidacja składów (reguły z definicji rozgrywek) i zmian zawodników dla N stron
- widok meczu: Squads (4 drużyny po 5 slotów), Heats (20 biegów), klasyfikacja drużyn
- podpięcie formatu do rozgrywek (definicja `matchFormat`) i włączenie linków z kart meczów
- aktualizacja statusu w `docs/match-formats/four-team.md`

### Poza zakresem

- Pairs (osobny format, 6 drużyn w meczu)
- Losowanie podziału klubów na grupy i awanse w turniejach (istniejące funkcje czytają klasyfikację z tego zadania)
- Przebudowa wyglądu kart biegów
- Schemat bazy w Supabase i nowe zależności (rozszerzamy kształt jsonb, stare mecze zostają czytelne)

### Kroki

**Etap 1: model i format jako dane (bez interfejsu)**

1. **Diagnoza (bez zmian w kodzie).** Opisz w PR: wszystkie miejsca zakładające dwie strony (`StoredMatch`, `MatchSetup`, kształt `squads` i `substitutions`, wejście silnika dla biegu, `match-stats.ts`, helper numeracji, widoki Squads, Heats i HeatCard), co dostarczyło zadanie nation-league (rejestr formatów, ranking nominowanych, walidacja zmian), jakie statusy wyniku biegu zapisuje silnik oraz krótki plan zmian modelu na `sides` zgodny wstecz.
2. **Model meczu o N stronach.** Lista stron (uczestnik i skład), przy czym w meczach dwustronnych strona 0 to gospodarz, a strona 1 to gość. Adapter odczytuje stary kształt, zapisane mecze zostają czytelne.
3. **Format `four-team` jako dane.** `MatchFormat`: liczba stron 4, schemat numeracji (numer = 4 × indeks drużyny + slot, rezerwowi 17 + indeks), tabela biegów 1-16 (tor, strona, slot) i 17-20 (tor, strona, miejsce w rankingu drużyny), reguły zmian i limity (`maxHeatsPerRider: 5`, `maxHeatsPerRiderWithTactical: 6`, `reserveMaxHeats: 5`, `tacticalPointsMultiplier: 1`, próg taktycznej: strata do lidera co najmniej 6 punktów od biegu 5).
4. **Przydział liter.** Funkcja czysta: w turniejach losuje litery A-D z ziarna zależnego od fixture (deterministycznie), a w Regio zachowuje kolejność uczestników. Sposób wybierany w definicji rozgrywek (`letterAssignment`).
5. **Niezmienniki (test lub skrypt deweloperski, bez nowych zależności).** Każdy zawodnik 1-16 jedzie w biegach 1-16 dokładnie 4 razy, w biegach 1-4 jadą tylko zawodnicy jednej drużyny (A, B, C, D po kolei), w biegach 5-16 jest po jednym zawodniku z każdej drużyny, w biegach 17-20 każda drużyna występuje dokładnie raz, rezerwowi 17-20 nie występują w biegach 1-16.

**Etap 2: skład, symulacja i widok (biegi 1-16)** 6. **Symulacja biegu.** Uczestnicy biegu z tabeli formatu (cztery tory, zawodnicy z czterech drużyn), punkty 3-2-1-0 zawodnikom, suma drużyn, zapis wyników z zawodnikiem, który faktycznie jechał. 7. **Klasyfikacja meczu.** Funkcja czysta: klasyfikacja 4 drużyn według sumy punktów, remisy kolejno: mini tabela (liczba trójek, dwójek, jedynek, zer i wykluczeń zawodników drużyny, więcej trójek, dwójek i jedynek jest lepiej, mniej zer i wykluczeń jest lepiej), potem bieg liderów (bieg 20: wyżej drużyna, której lider zajął lepsze miejsce, zawodnik bez miejsca niżej niż każdy z miejscem), potem kolejność liter A-D. Wynik zapisany tak, by funkcje awansu z grup (zadanie Fours) i tabela Regio mogły go czytać. 8. **Składy dla N stron.** Skład 4 plus rezerwowy na drużynę. Walidacja z definicji rozgrywek: reguły juniorskie (`allJuniors`, `minJuniorsAmongRiders`, `reserveMustBeJunior`) nie są zaszyte w kodzie. Numeracja przez wspólny helper zależny od formatu. Zmiana składu przed pierwszym biegiem działa tak jak w lidze (swap, zamiana, Save). 9. **Widok meczu.** Zakładka Squads: cztery sekcje drużyn po 5 slotów (na telefonie zwijane lub przewijane). Zakładka Heats: 20 biegów z tabeli, karta biegu z czterema torami i oznaczeniem drużyny. Pod wynikiem klasyfikacja drużyn. Mecz da się rozegrać od biegu 1 do 16 bez zmian zawodników.

**Etap 3: biegi nominowane (17-20)** 10. Ranking zawodników każdej drużyny po 16 biegach (tylko zawodnicy podstawowi, ten sam klucz co w Nation League: punkty, liczba 1., 2., 3. i 4. miejsc, statusy nieukończenia, niższy numer wyżej). Bieg 17: zawodnicy z 4. miejsc, 18: z 3. miejsc, 19: z 2. miejsc, 20: liderzy. Tory dokładnie według tabeli. Użyj funkcji rankingu z zadania nation-league, uogólnionej na drużyny.

**Etap 4: zmiany zawodników i podpięcie do rozgrywek** 11. **Rezerwa zwykła.** W dowolnym momencie przed biegiem rezerwowy może zastąpić dowolnego zawodnika podstawowego swojej drużyny, maksymalnie w 5 biegach, bez podwójnego startu w jednym biegu. 12. **Rezerwa taktyczna.** Dostępna od biegu 5, gdy drużyna traci do lidera meczu co najmniej 6 punktów. Inny zawodnik podstawowy swojej drużyny może pojechać zamiast zaplanowanego, każdy zawodnik tylko raz jako taktyczny, bez podwajania punktów. Limit biegów: 5, a 6 dla zawodnika, który jechał jako taktyczny. 13. **Walidacja i interfejs.** Naruszenia reguł zwracają `{ ok: false, error }` z czytelnym komunikatem (po angielsku), interfejs wyłącza niedozwolone opcje z podpowiedzią. Przełącznik Normal i Tactic jak w zadaniu nation-league. 14. **Podpięcie do rozgrywek.** Definicje Fours klubowych (`tournaments-fours`), Nation Fours (`nation-fours`), Nation Junior Fours (`nation-junior-fours`) i Regio (`tournaments-regio`) wskazują `matchFormat: "four-team"` oraz właściwe reguły składu i sposób przydziału liter. Karty meczów w widokach tych turniejów prowadzą do widoku meczu (Pairs bez zmian). Zaktualizuj status w `docs/match-formats/four-team.md`.

### Kryteria akceptacji

- [ ] Mecze dwustronne (liga, Cup, Nation League) działają jak wcześniej, a stare zapisane mecze są czytelne.
- [ ] Format `four-team` jest danymi, a niezmienniki tabeli (4 starty zawodnika w biegach 1-16, biegi 1-4 jednej drużyny, jeden zawodnik z każdej drużyny w biegach 5-16, każda drużyna raz w biegach 17-20) są sprawdzane.
- [ ] Mecz czterodrużynowy ma 20 biegów zgodnych z tabelą z dokumentu, składy 4 plus rezerwowy i numerację 1-16 oraz 17-20.
- [ ] Litery A-D: w turniejach losowane deterministycznie (ten sam wynik dla tego samego fixture), w Regio gospodarz to A.
- [ ] Punkty biegu to 3-2-1-0 dla zawodników, punkty drużyn to sumy, w meczu bez zmian suma wynosi 120, a klasyfikacja drużyn jest zapisana.
- [ ] Remisy w klasyfikacji drużyn: mini tabela (trójki, dwójki, jedynki, zera, wykluczenia), potem bieg 20, potem litery, deterministycznie.
- [ ] Biegi 17-20 mają obsadę z rankingu wewnątrz drużyn (4., 3., 2. miejsca i liderzy) z torami według tabeli.
- [ ] Rezerwa zwykła działa w dowolnym momencie z limitem 5 biegów, rezerwa taktyczna tylko od biegu 5 przy stracie co najmniej 6 punktów do lidera, raz na zawodnika, bez podwajania punktów.
- [ ] Reguły składu: Open bez ograniczeń, Junior tylko juniorzy, Regio co najmniej jeden junior wśród czterech podstawowych i rezerwowy tylko junior.
- [ ] Niedozwolone zmiany i składy zwracają czytelny błąd, interfejs wyłącza opcje z podpowiedzią.
- [ ] Karty meczów Fours klubowych, Nation Fours, Nation Junior Fours i Regio prowadzą do meczu, Pairs bez zmian.
- [ ] Brak zmian w schemacie bazy i nowych zależności, `pnpm lint` i `pnpm build` przechodzą.

### Dodatkowe informacje

- Kolory lub oznaczenia drużyn A-D spójne w całym widoku meczu.
- Ten sam model N stron wykorzystać później dla meczu parowego (6 drużyn).

### Decyzje otwarte

- Szczegóły mini tabeli i ostatni krok remisu.
