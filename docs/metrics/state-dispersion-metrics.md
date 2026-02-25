# Analiza rozproszenia stanu - Metryki

## Definicje metryk

- **M1 (Miejsca przechowywania stanu)**: liczba wywołań useState/useReducer (React) lub ref/reactive (Vue) w komponentach UI
- **M2 (Mechanizmy synchronizacji)**: liczba useEffect (React) lub watch/watchEffect (Vue) – jawne punkty synchronizacji/reakcji na zmiany
- **M3 (Wielkość kodu)**: Lines of Code (LOC) zmierzone narzędziem cloc – bez pustych linii i komentarzy

## M1. Liczba miejsc przechowywania stanu UI

### React
- **useState**: 22 wywołania
  - `TasksPage.tsx`: 8 (tasks, status, error, taskToDelete, query, debouncedQuery, statusFilter, refreshKey)
  - `TaskEditPage.tsx`: 9 (task, loadStatus, loadError, saveStatus, saveError, title, status, priority)
  - `TaskCreatePage.tsx`: 5 (title, status, priority, isSaving, error)
- **useReducer**: 0
- **Razem**: **22 punkty przechowywania stanu**

### Vue
- **ref()**: 20 wywołań
  - `TasksPage.vue`: 8 (tasks, status, error, taskToDelete, query, debouncedQuery, statusFilter, refreshKey)
  - `TaskEditPage.vue`: 7 (task, loadStatus, loadError, saveStatus, saveError, title, status, priority)
  - `TaskCr absolutna**: +2 punkty stanu w React
- **Różnica względna**: (22-20)/20 = 10% więcej względem Vue
- Główna różnica: TaskEditPage ma 2 punkty stanu więcej w React (9 vs 7)
- Obie aplikacje mają **podobny poziom rozproszenia stanu** - brak centralnego store
- **Uwaga**: W obu implementacjach świadomie nie zastosowano centralnego store, aby porównanie dotyczyło mechanizmów frameworka, a nie wyboru architektury
- **Pinia stores**: 0
- **Razem**: **20 punktów przechowywania stanu**

### Wnioski M1
- React: 22 punkty
- Vue: 20 punktów
- **Różnica**: +10% więcej punktów stanu w React (TaskEditPage ma 1 dodatkowy ref w React)
- Obie aplikacje mają **podobny poziom rozproszenia stanu** - brak centralnego store

## M2. Liczba mechanizmów synchronizacji (efekty uboczne)

### React
- **useEffect**: 5 wywołań
  - `TasksPage.tsx`: 4
    1. Synchronizacja URL → state (zależności: `[searchParams]` - 1)
    2. Debouncing query (zależności: `[query]` - 1)
    3. State → URL (zależności: `[debouncedQuery, statusFilter, searchParams, setSearchParams]` - 4)
    4. Fetch danych (zależności: `[apiParams, refreshKey]` - 2)
  - `TaskEditPage.tsx`: 1
    5. Fetch zadania (zależności: `[id]` - 1)
- **Średnia liczba zależności**: 1.8 (9 zależności / 5 effectów)
- **Razem**: **5 efektów, 9 zależności**

### Vue
- **watch()**: 4 wywołania
  - `TasksPage.vue`: 4
    1. URL query → state (obserwuje: `route.query`)
    2. Debouncing query (obserwuje: `query.value`)
    3. State → URLywołania watchwuje: `[debouncedQuery.value, statusFilter.value]`)
    4. Fetch danych (obserwuje: `[apiParams, refreshKey.value]`)
- **watchEffect()**: 0
- **Razem**: **4 watche'y**
ywołania watch
- **Różnica**: React ma +25% więcej punktów synchronizacji względem Vue
- W obu wersjach występuje synchronizacja URL ↔ stan, jednak w Vue została zrealizowana w ramach mechanizmu obserwacji (watch), a w React za pomocą useEffect, co w analizowanej implementacji przełożyło się na większą liczbę punktów synchronizacji po stronie React
- **Uwaga**: M2 opisuje liczbę jawnych punktów synchronizacji, a nie pełny koszt mentalny/debuggingowy
- Vue: 4 watch
- **Różnica**: React ma +25% więcej punktów synchronizacji
- Vue ma bardziej zwięzły kod dzięki reaktywności - nie potrzebuje synchronizacji URL→state przy backward/forward navigation w osobnym efekcie

## M3. Wielkość warstwy stanu (Lines of Code - cloc)

### React
| Warstwa | Pliki | LOC (bez pustych/komentarzy) |
|---------|-------|------------------------------|
| **Komponenty UI (pages)** | 3 | 507 |
| **Komponenty UI (components)** | 1 | 44 |
| **Warstwa API** | 2 | 55 |
| **SUMA UI** | 4 | **551** |
| **SUMA TOTAL** | 6 | **606** |

### Vue
| Warstwa | Pliki | LOC (bez pustych/komentarzy) |
|---------|-------|------------------------------|
| **Komponenty UI (pages)** | 3 | 473 |
| **Komponenty UI (components)** | 1 | 46 |
| **Warstwa API** | 2 | 54 |
| **Router** | 1 | 13 |
| **SUMA UI** | 4 | **519** |
| **SUMA TOTAL** | 7 | **586** |

### Wnioski M3
- **Komponenty UI**: React 551 LOC vs względem Vue
  - Główna różnica: React wymaga więcej kodu w `TasksPage` (większa liczba useEffect)
- **Warstwa API**: niemal identyczna (55 vs 54 LOC)
- **Router**: W Vue konfiguracja routingu znajduje się w osobnym pliku (+13 LOC), natomiast w React została ujęta bezpośrednio w strukturze komponentu App
- **TOTAL**: React 606 LOC vs Vue 586 LOC (+3.4% względem Vue)
- W analizowanej implementacji warstwa UI w Vue ma mniej LOC; różnica wynika głównie z mniejszej liczby punktów synchronizacji oraz sposobu organizacji logiki w komponentach+13 LOC), React używa komponentów inline
- **TOTAL**: React 606 LOC vs Vue 586 LOC (+3.4%)

## Podsumowanie ogólne

| Metryka | React | Vue | Różnica |
|---------|-------|-----|---------|
| **M1: Punkty stanu** | 22 | 20 | React +2 (+10% względem Vue) |
| **M2: Mechanizmy synchronizacji** | 5 useEffect | 4 watch | React +1 (+25% względem Vue) |
| **M2: Średnia zależności** | 1.8 | - | - |
| **M3: LOC komponenty UI** | 551 | 519 | React +32 (+6.2% względem Vue) |
| **M3: LOC API** | 55 | 54 | ~0% |
| **M3: LOC TOTAL** | 606 | 586 | React +20 (+3.4% względem Vue) |

## Wnioski końcowe

### 1. Rozproszenie stanu (M1)
Obie aplikacje mają **podobny poziom rozproszenia stanu** - żadna nie używa centralnego store (Redux/Pinia). Stan jest lokalny w komponentach, co dla tej wielkości aplikacji jest uzasadnione.
 względem Vue):
- Więcej useEffect do koordynacji między stanem a URL
- W obu wersjach występuje synchronizacja URL ↔ stan, jednak sposób realizacji różni się mechanizmem frameworka
- System reaktywności Vue automatycznie śledzi zależności

### 3. Wielkość kodu (M3)
**Vue ma o 3.4% mniej kodu ogółem** względem React:
- Główna różnica w warstwie UI (+6.2% w React)
- React potrzebuje więcej kodu boilerplate w useEffect
- W analizowanej implementacji warstwa UI w Vue ma mniej LOC; różnica wynika głównie z mniejszej liczby punktów synchronizacji oraz sposobu organizacji logiki w komponentach
- React potrzebuje więcej kodu boilerplate w useEffect
- Vue template syntax jest bardziej zwięzła niż JSX w tym kontekście
W analizowanej implementacji Vue wymagało mniej kodu warstwy UI oraz mniej punktów synchronizacji, co może przekładać się na mniejszy koszt implementacyjny
- **Dla dużych aplikacji**: różnice te będą się skalować - warto rozważyć centralny store
- **Maintainability**: mniej punktów synchronizacji potencjalnie zmniejsza liczbę miejsc, które trzeba przeanalizować podczas debugowania przepływu kodu synchronizacji)
- **Dla dużych aplikacji**: różnice te będą się skalować - warto rozważyć centralny store
- **Maintainability**: mniej punktów synchronizacji (M2) = łatwiejsze debugowanie flow danych

### Uwagi metodologiczne
- Liczono tylko stan związany z UI/flow aplikacji
- Nie liczono stanów lokalnych typu `isHovered` (żadna aplikacja ich nie używa)
- cloc v2.06 - zlicza tylko faktyczne linie kodu (bez pustych i komentarzy)
- Analiza przeprowadzona na identycznych funkcjonalnościach obu aplikacji
