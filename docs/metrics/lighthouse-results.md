# Wyniki testów Lighthouse

## Metodologia
- **Tryb**: Navigation (Desktop)
- **Liczba pomiarów**: 3 dla każdej aplikacji
- **Build**: Produkcyjny (`npm run build` + `npm run preview`)

## React (http://localhost:4173/)

### Pomiar 1
- **Performance Score**: 100 / 100
- **LCP (Largest Contentful Paint)**: 0.5 s
- **TBT (Total Blocking Time)**: 0 ms
- **Speed Index**: 0.4 s

### Pomiar 2
- **Performance Score**: 100 / 100
- **LCP (Largest Contentful Paint)**: 0.5 s
- **TBT (Total Blocking Time)**: 0 ms
- **Speed Index**: 0.4 s

### Pomiar 3
- **Performance Score**: 100 / 100
- **LCP (Largest Contentful Paint)**: 0.5 s
- **TBT (Total Blocking Time)**: 0 ms
- **Speed Index**: 0.4 s

### Średnia React
- **Performance Score**: 100 / 100
- **LCP**: 0.5 s
- **TBT**: 0 ms
- **Speed Index**: 0.4 s

## Vue (http://localhost:4174/)

### Pomiar 1
- **Performance Score**: 100 / 100
- **LCP (Largest Contentful Paint)**: 0.5 s
- **TBT (Total Blocking Time)**: 0 ms
- **Speed Index**: 0.4 s

### Pomiar 2
- **Performance Score**: 100 / 100
- **LCP (Largest Contentful Paint)**: 0.5 s
- **TBT (Total Blocking Time)**: 0 ms
- **Speed Index**: 0.4 s

### Pomiar 3
- **Performance Score**: 100 / 100
- **LCP (Largest Contentful Paint)**: 0.5 s
- **TBT (Total Blocking Time)**: 0 ms
- **Speed Index**: 0.4 s

### Średnia Vue
- **Performance Score**: 100 / 100
- **LCP**: 0.5 s
- **TBT**: 0 ms
- **Speed Index**: 0.4 s

## Porównanie (średnie)

| Metryka | React | Vue | Różnica |
|---------|-------|-----|---------|
| Performance Score | 100 | 100 | 0 |
| LCP (s) | 0.5 | 0.5 | 0 |
| TBT (ms) | 0 | 0 | 0 |
| Speed Index (s) | 0.4 | 0.4 | 0 |

### Notatki
W warunkach testowych (localhost, Desktop, prosta aplikacja) oba frameworki osiągnęły identyczne wyniki wydajnościowe (100/100). Główna różnica widoczna jest w rozmiarze bundla:

React: 242.33 KB (76.58 KB gzip) - +136% vs Vue
Vue: 102.32 KB (38.72 KB gzip)
Różnica ta może mieć znaczenie przy:
Wolnym połączeniu internetowym
Urządzeniach mobilnych z ograniczonym transferem
First-time visitors (bez cache).
