import {
  InsightsOverviewResponse,
  InsightsKPIResponse,
  InsightsTrendResponse,
  TopItemsResponse,
  TopPartiesResponse,
  TopCategoriesResponse,
  CashflowSummaryResponse,
  CreditSummaryResponse,
  InsightRange
} from './dto';

export interface IInsightsService {
  getInsightsOverview(range?: InsightRange): Promise<InsightsOverviewResponse>;
  getInsightsKPIs(range?: InsightRange): Promise<InsightsKPIResponse>;
  getInsightsTrends(range?: InsightRange): Promise<InsightsTrendResponse>;
  getTopItems(range?: InsightRange): Promise<TopItemsResponse>;
  getTopParties(range?: InsightRange): Promise<TopPartiesResponse>;
  getTopCategories(range?: InsightRange): Promise<TopCategoriesResponse>;
  getCashflowSummary(range?: InsightRange): Promise<CashflowSummaryResponse>;
  getCreditSummary(range?: InsightRange): Promise<CreditSummaryResponse>;
}
