# SPA Framework Comparison: React vs Vue

> Praca inżynierska - Porównanie frameworków React i Vue w kontekście implementacji aplikacji SPA (Single Page Application)

## 📋 Opis projektu

Repozytorium zawiera identyczne funkcjonalnie aplikacje do zarządzania zadaniami (Task Manager) zaimplementowane w dwóch popularnych frameworkach JavaScript:
- **React** (v19.2.0) + React Router
- **Vue** (v3.5.24) + Vue Router

Projekt umożliwia obiektywne porównanie obu technologii pod kątem:
- Rozproszenia stanu i mechanizmów synchronizacji
- Wielkości kodu (Lines of Code)
- Wydajności (bundle size, Lighthouse metrics)
- Doświadczenia deweloperskiego (Developer Experience)

## 🏗️ Struktura projektu

```
spa-compare/
├── backend/              # JSON Server - mock REST API
│   ├── db.json          # Baza danych (tasks)
│   └── package.json
├── frontend-react/      # Implementacja w React
│   ├── src/
│   │   ├── pages/       # Komponenty stron
│   │   ├── components/  # Komponenty współdzielone
│   │   ├── api/         # Warstwa komunikacji z API
│   │   └── types/       # Typy TypeScript
│   └── package.json
├── frontend-vue/        # Implementacja w Vue
│   ├── src/
│   │   ├── pages/       # Komponenty stron
│   │   ├── components/  # Komponenty współdzielone
│   │   ├── api/         # Warstwa komunikacji z API
│   │   ├── router/      # Konfiguracja routingu
│   │   └── types/       # Typy TypeScript
│   └── package.json
└── docs/                # Dokumentacja i metryki badawcze
    ├── metrics/         # Wyniki analiz
    │   ├── state-dispersion-metrics.md  # Główne metryki (M1, M2, M3)
    │   ├── lighthouse-results.md         # Wyniki testów Lighthouse
    │   ├── cloc-*.txt                    # Statystyki LOC
    │   └── tree-*.txt                    # Struktura plików
    └── screenshots/     # Zrzuty ekranu aplikacji
        ├── react/
        └── vue/
```

## 🚀 Wymagania

- **Node.js**: v18+ (zalecane: v20+)
- **npm**: v9+ lub **yarn**: v1.22+
- **Git**: v2.30+

## ⚡ Szybki start

### 1. Uruchomienie backendu (wspólne dla obu frontendów)

```bash
cd backend
npm install
npm run dev
```

Backend dostępny na: `http://localhost:4000`

### 2. Uruchomienie frontendu React

```bash
cd frontend-react
npm install
npm run dev
```

Aplikacja React dostępna na: `http://localhost:5173`

### 3. Uruchomienie frontendu Vue

```bash
cd frontend-vue
npm install
npm run dev
```

Aplikacja Vue dostępna na: `http://localhost:5174`

## 🏗️ Build produkcyjny

Aby zbudować wersje produkcyjne (używane w testach wydajnościowych):

```bash
# React
cd frontend-react
npm run build
npm run preview  # Preview na http://localhost:4173

# Vue
cd frontend-vue
npm run build
npm run preview  # Preview na http://localhost:4174
```

## 📊 Funkcjonalności aplikacji

Obie implementacje zawierają identyczny zestaw funkcji:

### Strony
- **Lista zadań** (`/tasks`) - wyświetlanie, filtrowanie, wyszukiwanie
- **Tworzenie zadania** (`/tasks/new`) - formularz dodawania
- **Edycja zadania** (`/tasks/:id/edit`) - formularz edycji
- **Usuwanie zadania** - modal potwierdzenia

### Funkcje
- ✅ Filtrowanie po statusie (Todo / In Progress / Done)
- 🔍 Wyszukiwanie zadań (live search)
- 📝 CRUD operations (Create, Read, Update, Delete)
- 🎨 Responsywny interfejs (Tailwind CSS)
- 🔗 Synchronizacja filtrów z URL (query params)
- ⚡ Debouncing wyszukiwania (300ms)
- 🎯 Walidacja formularzy

## 📈 Wyniki badań

### Metryki rozproszenia stanu (M1, M2, M3)

Szczegółowe wyniki w: [`docs/metrics/state-dispersion-metrics.md`](docs/metrics/state-dispersion-metrics.md)

| Metryka | React | Vue | Różnica |
|---------|-------|-----|---------|
| **M1: Punkty stanu** | 22 | 20 | React +2 (+10%) |
| **M2: Mechanizmy synchronizacji** | 5 useEffect | 4 watch | React +1 (+25%) |
| **M3: LOC komponenty UI** | 551 | 519 | React +32 (+6.2%) |
| **M3: LOC TOTAL** | 606 | 586 | React +20 (+3.4%) |

### Bundle Size (produkcja)

```
React:  242.33 KB (76.58 KB gzip)  ⚠️ +137% vs Vue
Vue:    102.32 KB (38.72 KB gzip)  ✅ Mniejszy bundle
```

### Lighthouse Performance (Desktop)

Obie aplikacje uzyskały identyczne wyniki w testach Lighthouse:
- **Performance Score**: 100/100
- **LCP**: 0.5s
- **TBT**: 0ms
- **Speed Index**: 0.4s

> **Wniosek**: W runtime performance nie ma różnicy. Główna różnica to initial load (bundle size).

## 🔬 Metodologia badawcza

### M1: Liczba miejsc przechowywania stanu
- React: liczba `useState` + `useReducer`
- Vue: liczba `ref()` + `reactive()` + Pinia stores

### M2: Mechanizmy synchronizacji (efekty uboczne)
- React: liczba `useEffect` + średnia liczba zależności
- Vue: liczba `watch()` + `watchEffect()`

### M3: Wielkość warstwy stanu (LOC)
- Narzędzie: `cloc` v2.06
- Liczenie: tylko linie kodu (bez pustych i komentarzy)
- Podział: komponenty UI, warstwa API, routing

## 🛠️ Stack technologiczny

### Wspólne dla obu wersji
- **TypeScript** 5.9.3 - typowanie statyczne
- **Vite** 7.2+ - bundler i dev server
- **Tailwind CSS** 4.1+ - stylowanie
- **JSON Server** 1.0.0-beta.5 - mock REST API

### React
- React 19.2.0
- React Router DOM 7.13.0
- React Hooks (useState, useEffect, useMemo)

### Vue
- Vue 3.5.24
- Vue Router 5.0.1
- Composition API (ref, computed, watch)

## 📁 Dane badawcze

Wszystkie surowe dane pomiarów znajdują się w katalogu `docs/metrics/`:

- `state-dispersion-metrics.md` - główne metryki badawcze
- `lighthouse-results.md` - wyniki testów wydajnościowych
- `cloc-react.txt`, `cloc-vue.txt` - statystyki linii kodu
- `tree-react.txt`, `tree-vue.txt` - struktura katalogów
- `files-react.txt`, `files-vue.txt` - lista plików

## 📝 Wnioski

### Rozproszenie stanu (M1)
Obie aplikacje mają podobny poziom rozproszenia stanu - brak centralnego store jest uzasadniony dla aplikacji tej wielkości.

### Synchronizacja (M2)
React wymaga więcej jawnej synchronizacji (+25%). System reaktywności Vue automatycznie śledzi zależności, co redukuje liczbę punktów synchronizacji.

### Wielkość kodu (M3)
Vue ma o 3.4% mniej kodu ogółem. Główna różnica w warstwie UI (+6.2% w React) wynika z większej liczby efektów ubocznych (useEffect).

### Praktyczne implikacje
- **Małe/średnie aplikacje**: Vue może przekładać się na mniejszy koszt implementacyjny
- **Bundle size**: Vue ma znacząco mniejszy bundle (~43% rozmiaru React)
- **Maintainability**: mniej punktów synchronizacji potencjalnie ułatwia debugowanie

## 📄 Licencja

Projekt stworzony na potrzeby pracy inżynierskiej.

## 👤 Autor

Projekt wykonany w ramach pracy inżynierskiej na kierunku Informatyka.

---

**Data utworzenia**: Styczeń 2026  
**Ostatnia aktualizacja**: Luty 2026
