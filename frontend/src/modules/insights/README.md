# Insights Module - SALTEDHASH Business OS

The Insights module is the reporting and trend engine for the SALTEDHASH Business OS. It provides visibility into financial health, expenses, and cashflow.

## Architecture & Principles

This module is strictly a **read-model layer**. It owns no primary transactional data.

1. **Source of Truth**: Insights reads through existing module contracts (e.g., `expenseService`, `partyService`). There is no duplicate tables or caching unless proven strictly necessary. Changes to Expenses immediately reflect in Insights.
2. **Business Rules**:
   - `status = 'voided'` expenses are always excluded from totals.
   - Timezones and date boundaries rely on shared utilities (`dateUtils.ts`).
   - Currency is formatted using the shared `formatCurrency` utility.
3. **Canonical Stack**: Built entirely in React. Mounted cleanly into the main app via a React wrapper, with zero Vue/Pinia shell residue.

## Directory Structure

- **`api/dto.ts`**: Defines the shapes (DTOs) and the `IInsightsService` contract.
- **`services/insightsSelectors.ts`**: Pure functions taking raw `ExpenseDTO` arrays and transforming them into `InsightsOverviewDTO`, `PaymentModeMixDTO`, etc.
- **`services/insightsService.ts`**: The `LocalInsightsService` implementation that reads from local Dexie-backed services (`expenseService`, `partyService`) and applies the selectors.
- **`hooks/`**: React hooks exposing service calls for the UI.
- **`InsightsPage.tsx`**: The main UI component handling all drill-downs, filtering, and metric visualizations.

## Integration Contracts

External modules (like Desk/Dashboard) can consume this module by calling:
- `insightsService.getOverview({ preset: 'month' })`
- `insightsService.getCategoryBreakdown({ preset: 'month' })`

This ensures consistent KPIs across the entire app.

## Notes

- Any remote/backend implementations of Insights are optional, quarantined, and not wired by default. Core functionality is fully local-first.
- Ensure that the underlying `expenseService` emits reactive events or triggers re-fetches if caching is ever introduced (currently disabled in favor of compute-on-read).
