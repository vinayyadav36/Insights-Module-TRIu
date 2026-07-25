export interface InsightKPI {
  key: string;
  label: string;
  value: number;
  formattedValue: string;
  delta?: number;
  deltaLabel?: string;
  trendDirection?: 'up' | 'down' | 'flat';
}

export interface InsightTrendPoint {
  date: string; // YYYY-MM-DD
  salesTotal: number;
  expenseTotal: number;
  netTotal: number;
  collectionTotal?: number;
  creditIssued?: number;
}

export interface TopEntitySummary {
  id: string;
  label: string;
  amount: number;
  count: number;
  type?: string;
}

export interface InsightRange {
  startDate: string; // ISO string
  endDate: string; // ISO string
  preset: 'today' | '7d' | '30d' | '90d' | 'custom';
}

export interface InsightsOverviewResponse {
  kpis: InsightKPI[];
  trends: InsightTrendPoint[];
  topItems: TopEntitySummary[];
  topParties: TopEntitySummary[];
  topCategories: TopEntitySummary[];
  cashflow: CashflowSummaryResponse;
  credit: CreditSummaryResponse;
}

export interface InsightsKPIResponse {
  kpis: InsightKPI[];
}

export interface InsightsTrendResponse {
  trends: InsightTrendPoint[];
}

export interface TopItemsResponse {
  items: TopEntitySummary[];
}

export interface TopPartiesResponse {
  parties: TopEntitySummary[];
}

export interface TopCategoriesResponse {
  categories: TopEntitySummary[];
}

export interface CashflowSummaryResponse {
  totalIncoming: number;
  totalOutgoing: number;
  net: number;
  formattedIncoming: string;
  formattedOutgoing: string;
  formattedNet: string;
}

export interface CreditSummaryResponse {
  outstandingCustomerCredit: number;
  supplierPayableExposure: number;
  formattedCustomerCredit: string;
  formattedSupplierPayable: string;
}
