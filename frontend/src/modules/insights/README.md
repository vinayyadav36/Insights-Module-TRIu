# Insights Module - SALTEDHASH Business OS

The Insights module is the reporting and trend engine for the SALTEDHASH Business OS. It provides small business owners with visibility into their financial health, sales trends, and cashflow.

## Architecture

This module is designed as an API-ready, local-first package:

1. **API Contracts (`api/`)**: Defines JSON-serializable requests and response shapes (DTOs) and service interfaces (`contracts.ts`). This allows the module to be easily mounted as a backend API route later (`/api/insights/*`) if the application architecture evolves.
2. **Domain Logic (`services/insightsDomain.ts`)**: Pure calculation functions for KPIs, cashflow, and ranking algorithms. They are completely decoupled from UI and storage.
3. **Repository Layer (`services/insightsRepository.ts`)**: Handles local-first data retrieval. It interacts with the IndexedDB instances via Dexie.js. If external modules are incomplete, the repository falls back to mock service adapters.
4. **Mock Adapters (`services/mockAdapters.ts`)**: Seeds initial deterministic demo data. This guarantees that Insights will render correctly even if upstream dependencies (like the Sales or Expense modules) are not yet fully built.
5. **UI Layer (`components/` & `InsightsPage.tsx`)**: The visual representation built with React. Hooks (`useInsightsOverview`, etc.) bridge the UI with the service layer.

## How to use

Insights relies on `react` and `dexie`. It operates entirely without authentication requirements, keeping local-first usage fast and available.

### Routing

The main page is accessible via the `/insights` route. Because the surrounding framework is Vue 3, the React `InsightsPage` component is mounted dynamically via the `Insights.vue` wrapper.

### Inter-Module Integration

The underlying service layer exposes functions such as `getInsightsOverview()` and `getTopItems()`. Other modules (e.g., Desk) can import these service methods directly and securely consume pre-aggregated business data without knowing the intricacies of the analytics engine.

## Migration Note

Previous attempts to build alternative analytics or dashboard reporting should be considered deprecated. This module unifies reporting behaviors and fully replaces old Vue-based metric components, creating a single coherent source of truth for business intelligence.
