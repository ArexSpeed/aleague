## [FEATURE] Match format "nation-league": heat table, nominated heats, reserves

### Cel

Mecze Nation League i Nation Junior da się ustawić i zagrać bieg po biegu z nową tabelą biegową (12 biegów zasadniczych i 3 nominowane), składami po 7 zawodników i regułami zmian z `docs/match-formats/nation-league.md`. Format meczu jest danymi przypisanymi do rozgrywek, a liga klubowa działa bez zmian.

### Kontekst

- Specyfikacja: `docs/match-formats/nation-league.md` (już w repo, przeczytaj ją w całości przed zmianami).
- Zależy od zadań: Nations (fixtures `nation-league` i `nation-junior` z definicjami rozgrywek) oraz zmiana składu przed pierwszym biegiem (Save lineup, swap i zamiana).
- Dziś tabela biegowa i skład 8 slotów (juniorzy na 6-8) są zaszyte w silniku i logice składu. Nowy format ma inną liczbę slotów (7), inną tabelę i własne biegi nominowane, więc format trzeba wynieść do danych.
- Numeracja: slot 1-7 na stronę, wyświetlany numer: gospodarze = slot, goście = slot + 8 (jak dziś, jeden helper). Rezerwowi to sloty 7.
- Skład reprezentacji to osobne zadanie. Do testów użyj tymczasowych składów (opisz w PR, skąd je wzięto) i oznacz `TODO: national squads`.
- Rezerwa taktyczna jest dziś tylko zapisywana (`substitution: "tactic"`) i bez podwajania punktów.

### Zakres

- rejestr formatów meczu jako dane (`classic-15` dla istniejącej ligi i `nation-league`), przypisanie formatu w definicji rozgrywek (`matchFormat`)
- budowanie uczestników biegu z tabeli formatu (w tym biegi nominowane) w `sports/speedway/sim/` i `engine/v1` tylko w zakresie niezbędnym do tego
- logika składu i walidacji zależna od formatu (liczba slotów, rezerwa, reguły juniorskie)
- walidacja i obsługa zmian zawodników (rezerwa zwykła i taktyczna)
- widok meczu: zakładka Squads (7 slotów na stronę) i Heats (tabela z formatu)
- aktualizacja statusu w `docs/match-formats/nation-league.md`

### Poza zakresem

- Formaty dla Regio, Fours i Pairs (czwórmecze), mecze wieloosobowe
- Wybór składów reprezentacji
- Przebudowa wyglądu kart biegów, przyciski Start/Edit w HeatCard
- Schemat bazy w Supabase i nowe zależności

### Kroki

**Etap 1: formaty jako dane (czysty refaktor, bez zmiany działania)**

1. **Diagnoza (bez zmian w kodzie).** Opisz w PR: gdzie jest zdefiniowana obecna tabela biegowa i logika biegów nominowanych 14 i 15, jak `startHeatAction` buduje uczestników biegu, jak reprezentowane są `squads` i `substitutions`, gdzie jest zaszyta liczba slotów i reguła juniorów na slotach 6-8, jak widok meczu wyświetla numery zawodników oraz jakie wyniki i statusy biegu zapisuje silnik (miejsca 1-4, wykluczenie, upadek, defekt itp.).
2. **Rejestr formatów.** Typ `MatchFormat`: id, liczba slotów na stronę, slot rezerwy, tabela biegów (dla każdego biegu cztery tory z numerem slotu strony lub regułą nominacji), reguły zmian i limity biegów (`maxHeatsPerRider`, `maxHeatsPerRiderWithTactical`, `reserveMaxHeats`, `tacticalPointsMultiplier`). Wynieś do danych obecny format ligi jako `classic-15` i przypisz go ligom klubowym i Cup przez pole `matchFormat` w definicji rozgrywek.
3. **Brak regresji.** Dla przykładowego meczu ligowego uczestnicy każdego biegu muszą być identyczni jak przed zmianą.

**Etap 2: tabela biegowa i składy 7 zawodników** 4. **Format `nation-league`.** Dodaj format z tabelą z dokumentu (biegi 1-12 jako konkretne sloty, biegi 13-15 jako reguły nominacji dla miejsc 5-6, 3-4 i 1-2 rankingu). Parametry: `maxHeatsPerRider: 5`, `maxHeatsPerRiderWithTactical: 6`, `reserveMaxHeats: 5`, `tacticalPointsMultiplier: 1` (`TODO: confirm`). Przypisz format rozgrywkom `nation-league` i `nation-junior`. 5. **Składy i numeracja.** Skład 7 slotów na stronę (slot 7 rezerwowy), numer wyświetlany przez wspólny helper (gospodarze = slot, goście = slot + 8). Walidacja składu pobiera liczbę slotów i reguły juniorskie z formatu i rozgrywek, nie ze stałych w kodzie: Nation League bez reguł juniorskich, Nation Junior tylko juniorzy. 6. **Biegi nominowane.** W chwili startu biegu 13, 14 i 15 funkcja czysta wyznacza ranking sześciu zawodników z numerów 1-6 każdej drużyny (rezerwowy nigdy nie jest nominowany automatycznie). Klucz rankingu: punkty zdobyte w meczu do tego momentu, potem liczba 1., 2., 3. i 4. miejsc, potem statusy nieukończenia biegu w kolejności z silnika (mniej jest lepiej), na końcu niższy numer wyżej. Bieg 13: zawodnicy z miejsc 5 i 6, bieg 14: 3 i 4, bieg 15: 1 i 2. Tory: wyższe miejsce w rankingu na tor wewnętrzny (A lub B), niższe na zewnętrzny (C lub D), gospodarze na A i C, goście na B i D. 7. **Widok meczu.** Zakładka Squads pokazuje 7 slotów na stronę, a Heats tabelę biegów z formatu (cztery tory z zawodnikami lub opisem nominacji, np. "Ranks 5-6"). Mecz da się rozegrać od biegu 1 do 15 bez zmian zawodników. 8. **Niezmienniki (test lub skrypt deweloperski, bez nowych zależności).** W biegach 1-12 każdy zawodnik 1-6 i 9-14 jedzie dokładnie 4 razy, w każdym biegu jest 2 gospodarzy i 2 gości, sloty rezerwowych nie występują w tabeli.

**Etap 3: zmiany zawodników** 9. **Rezerwa zwykła.** W dowolnym momencie przed biegiem trener może wstawić rezerwowego (slot 7) za dowolnego zawodnika zaplanowanego w tym biegu. Zastąpiony nie jedzie w tym biegu, nikt nie jedzie dwa razy w jednym biegu, rezerwowy może pojechać maksymalnie w 5 biegach, a punkty trafiają do zawodnika, który faktycznie jechał. 10. **Rezerwa taktyczna.** Dozwolona tylko gdy drużyna przegrywa co najmniej 6 punktami po poprzednim biegu. Wtedy zawodnika z numerów 1-6 można wstawić za innego z numerów 1-6 (np. 1 za 4). Każdy zawodnik może być zawodnikiem taktycznym, ale tylko raz w meczu. Zawodnik 1-6 jedzie maksymalnie 5 biegów, a jeśli jechał jako taktyczny, maksymalnie 6. Zapisuj jako `substitution: "tactic"`. Punkty mnożone przez `tacticalPointsMultiplier`. 11. **Walidacja i komunikaty.** Naruszenie reguł (próg 6 punktów, drugi raz taktyczny, przekroczony limit biegów, dwa razy w jednym biegu) zwraca `{ ok: false, error }` z czytelnym komunikatem (po angielsku), bez rzucania wyjątku. Interfejs wyłącza niedozwolone opcje z podpowiedzią (np. "Available when trailing by 6 or more"). 12. **Interfejs zmian.** W Heats wybór zmiany dla zaplanowanego biegu: przełącznik Normal i Tactic (jak w istniejącej konwencji), Tactic aktywny tylko przy przegranej o co najmniej 6 punktów. 13. Zaktualizuj tabelę statusu w `docs/match-formats/nation-league.md`.

### Kryteria akceptacji

- [ ] Formaty `classic-15` i `nation-league` są danymi, a rozgrywki wskazują format w definicji.
- [ ] Liga klubowa i Cup działają jak wcześniej (uczestnicy biegów identyczni jak przed zmianą).
- [ ] Mecz Nation League i Nation Junior ma 15 biegów zgodnych z tabelą z dokumentu, składy po 7 zawodników z numeracją 1-7 i 9-15.
- [ ] Niezmienniki tabeli (po 4 starty, 2 gospodarzy i 2 gości w biegu, rezerwowi poza tabelą) są sprawdzane.
- [ ] Biegi 13, 14 i 15 wyznaczają pary z rankingu (punkty w meczu, remisy według miejsc, statusów i numeru), tylko z numerów 1-6, z torami według miejsca. W meczu bez zmian każdy z sześciu zawodników jedzie dokładnie jeden bieg nominowany.
- [ ] Rezerwa zwykła może zastąpić dowolnego zawodnika w dowolnym biegu i jedzie maksymalnie 5 biegów.
- [ ] Rezerwa taktyczna działa tylko przy przegranej o co najmniej 6 punktów, tylko wśród numerów 1-6, raz na zawodnika, z limitem 5 biegów (6 dla zawodnika, który jechał jako taktyczny).
- [ ] Niedozwolone zmiany zwracają czytelny błąd, interfejs wyłącza opcje z podpowiedzią.
- [ ] Punkty i wyniki trafiają do zawodnika, który faktycznie jechał (także po zmianach), a mnożnik taktycznej jest parametrem.
- [ ] Cały mecz (15 biegów) da się rozegrać i zapisać, a po odświeżeniu widok jest taki sam.
- [ ] Brak zmian w schemacie bazy i nowych zależności, `pnpm lint` i `pnpm build` przechodzą.
