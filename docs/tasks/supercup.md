## [FEATURE] SuperCup: qualification list (no fixtures yet)

### Cel

Czysta funkcja wyznaczająca 16 uczestników SuperCup z powodami kwalifikacji i uzupełnianiem wolnych miejsc według `docs/competitions/supercup.md`, oraz widok listy w `kind=cup&competition=supercup`.

### Kontekst

- Specyfikacja: `docs/competitions/supercup.md` (już w repo, przeczytaj ją w całości przed zmianami).
- Część źródeł jeszcze nie istnieje (Regio, Pairs, 4Teams, ranking klubów, a Cup zależnie od stanu zadania Cup). Funkcja przyjmuje je jako dane wejściowe, a źródła niedostępne traktuje jako "oczekujące".
- Format i terminarz SuperCup nie są jeszcze ustalone, więc to zadanie ich nie obejmuje.
- Konfiguracja rodzajów (`kind=cup`, druga linia Cup / SuperCup) z zadania Competitions.

### Zakres

- plik z funkcją w `sports/speedway/sim/` (np. `supercup-field.ts`)
- definicja SuperCup jako dane per sezon w `data/season-1/` (lista miejsc ze źródłami, kolejność rezerwy, rozmiar 16)
- widok taba Field w `sports/speedway/views/` (klocki z `components/`)
- aktualizacja statusu w `docs/competitions/supercup.md`

### Poza zakresem

- Format rozgrywki, terminarz, losowanie i mecze SuperCup
- Obliczanie rankingu klubów, Regio, Pairs i 4Teams
- Kafelki trofeów na kartach klubów
- Schemat bazy w Supabase i nowe zależności

### Kroki

1. **Diagnoza (bez zmian w kodzie).** Opisz w PR: jak wyznaczana jest końcowa tabela każdej z czterech lig (także z fazą finałową) i skąd odczytać mistrza, wicemistrza i 3. miejsce, czy wynik Cup da się odczytać (jeśli zadanie Cup jest już zrobione), oraz jak wygląda id klubu.
2. **Definicja jako dane.** Rozmiar 16, lista miejsc ze źródłami (mistrz każdej z czterech lig, obrońca, zwycięzca Cup, osiem zwycięzców Regio, zwycięzca Pairs, zwycięzca 4Teams) i kolejność rezerwy (srebrni East i West Gold, brązowi East i West Gold, finalista Cup, dwaj przegrani półfinaliści Cup, ranking klubów).
3. **Typ wejścia.** `QualificationInputs` z polami opcjonalnymi lub oznaczonymi jako niedostępne: końcowe tabele czterech lig (uporządkowane listy id klubów), obrońca (id lub `null` gdy brak), Cup (zwycięzca, finalista, przegrani półfinaliści), zwycięzcy Regio (8), zwycięzca Pairs, zwycięzca 4Teams, ranking klubów (uporządkowana lista id lub niedostępny).
4. **Funkcja `resolveSuperCupField(definition, inputs)`.** Zwraca listę 16 miejsc (id miejsca, klub lub brak, powody kwalifikacji, status: `qualified`, `filled`, `pending`), flagę `complete` i listę brakujących źródeł. Algorytm:
   - przypisz kluby do miejsc ze źródeł podstawowych,
   - klub z kilku źródeł zajmuje jedno miejsce i zachowuje wszystkie powody,
   - wolne miejsca (16 minus liczba różnych klubów) uzupełniaj po kolei z rezerwy, pomijając kluby już zakwalifikowane,
   - uzupełniaj dopiero, gdy wszystkie źródła podstawowe są rozstrzygnięte (puste źródło, np. brak obrońcy w pierwszym sezonie, liczy się jako rozstrzygnięte),
   - gdy rezerwa się wyczerpie, a miejsca zostają wolne, status `pending`,
   - bez losowania, wynik w pełni deterministyczny.
5. **Tymczasowy ranking.** Dopóki ranking klubów nie jest dostępny, użyj kolejności: pozycja w lidze (Gold przed Silver, w obrębie ligi wyżej w końcowej tabeli), oznaczone `TODO: club ranking`.
6. **Przykłady (testy).** Jeśli w repo jest konfiguracja testów, dodaj przypadki: (a) bez dubli, (b) mistrz East Gold wygrał też Cup i 4Teams (dwa wolne miejsca, uzupełnienie srebrnymi Gold East i West), (c) brak obrońcy w pierwszym sezonie, (d) rezerwa wyczerpana i użyty ranking, (e) brakujące źródło zwraca `pending` z listą braków. Jeśli konfiguracji testów nie ma, dodaj przykłady jako skrypt deweloperski lub sekcję w dokumentacji i nie dodawaj nowych zależności.
7. **Widok Field.** Dla `kind=cup&competition=supercup` jeden tab Field: lista 16 miejsc (klub z logo lub "TBD" z nazwą źródła), powody kwalifikacji (np. "East Gold champion, Cup winner"), oznaczenie miejsc uzupełnionych z rezerwy (np. "Fill: West Gold runner-up"), komunikat o brakujących źródłach (np. "Waiting for: Regio winners, Pairs winner"). Do czasu dostępności źródeł lista pokazuje placeholdery bez błędów.
8. Zaktualizuj status w `docs/competitions/supercup.md`.

### Kryteria akceptacji

- [ ] Funkcja jest czysta i deterministyczna (to samo wejście daje ten sam wynik).
- [ ] Po rozstrzygnięciu wszystkich źródeł lista ma 16 różnych klubów, bez duplikatów.
- [ ] Klub z kilku źródeł ma wszystkie powody przy jednym miejscu, a zwolnione miejsca wypełniane są w kolejności z dokumentu.
- [ ] Brak obrońcy w pierwszym sezonie nie blokuje uzupełniania.
- [ ] Brakujące źródło daje status `pending` z listą braków i nie uzupełnia miejsc z rezerwy.
- [ ] Widok Field pokazuje placeholdery, powody i komunikat o braku źródeł, bez błędów.
- [ ] Inne rodzaje rozgrywek bez regresji, brak zmian w schemacie bazy i nowych zależności.
- [ ] `pnpm lint` i `pnpm build` przechodzą.

### Do poprawy / propozycje

- [DO UZUPEŁNIENIA: kolejność medalistów Gold w rezerwie (przyjęto: srebrni East i West, potem brązowi East i West).]
- [DO UZUPEŁNIENIA: kolejność przegranych półfinalistów Cup na miejscach 3 i 4 (propozycja: wyższy wynik łączny w półfinale, a przy remisie wyżej rozstawiony).]
- [DO UZUPEŁNIENIA: czy tymczasowy ranking (pozycja w lidze) jest akceptowalny do czasu rankingu Elo.]
- Propozycja: przy każdym miejscu pokazać w podpowiedzi pełny łańcuch powodów i miejsce w rezerwie.
- Propozycja: osobne zadanie na format SuperCup (po decyzji o rundach, dwumeczu i losowaniu).

### Decyzje otwarte

- Kolejność rezerwy (medaliści Gold, półfinaliści Cup).
- Akceptacja tymczasowego rankingu.
