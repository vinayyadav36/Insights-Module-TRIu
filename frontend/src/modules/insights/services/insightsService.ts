import { IInsightsService } from '../api/contracts';
import {
  InsightRange,
  InsightsOverviewResponse,
  InsightsKPIResponse,
  InsightsTrendResponse,
  TopItemsResponse,
  TopPartiesResponse,
  TopCategoriesResponse,
  CashflowSummaryResponse,
  CreditSummaryResponse
} from '../api/dto';
import { insightsRepository } from './insightsRepository';
import { InsightsDomain } from './insightsDomain';
import { seedMockData } from './mockAdapters';

export class InsightsService implements IInsightsService {
  constructor() {
    // Ensure mock data is seeded on init if no backend exists
    seedMockData();
  }

  private getDateRange(range?: InsightRange) {
    // Basic implementation - in a real scenario we'd use date-fns to parse the preset
    return { startDate: range?.startDate, endDate: range?.endDate };
  }

  async getInsightsOverview(range?: InsightRange): Promise<InsightsOverviewResponse> {
    const { startDate, endDate } = this.getDateRange(range);

    const [sales, expenses, parties, catalog] = await Promise.all([
      insightsRepository.getSales(startDate, endDate),
      insightsRepository.getExpenses(startDate, endDate),
      insightsRepository.getParties(),
      insightsRepository.getCatalogItems()
    ]);

    return {
      kpis: InsightsDomain.calculateKPIs(sales, expenses),
      trends: InsightsDomain.buildTrendSeries(sales, expenses),
      topItems: InsightsDomain.getTopItems(sales, catalog),
      topParties: InsightsDomain.getTopParties(sales, parties),
      topCategories: InsightsDomain.getTopCategories(expenses),
      cashflow: InsightsDomain.calculateCashflow(sales, expenses),
      credit: InsightsDomain.calculateCreditSummary(parties, expenses)
    };
  }

  async getInsightsKPIs(range?: InsightRange): Promise<InsightsKPIResponse> {
    const { startDate, endDate } = this.getDateRange(range);
    const sales = await insightsRepository.getSales(startDate, endDate);
    const expenses = await insightsRepository.getExpenses(startDate, endDate);
    return { kpis: InsightsDomain.calculateKPIs(sales, expenses) };
  }

  async getInsightsTrends(range?: InsightRange): Promise<InsightsTrendResponse> {
    const { startDate, endDate } = this.getDateRange(range);
    const sales = await insightsRepository.getSales(startDate, endDate);
    const expenses = await insightsRepository.getExpenses(startDate, endDate);
    return { trends: InsightsDomain.buildTrendSeries(sales, expenses) };
  }

  async getTopItems(range?: InsightRange): Promise<TopItemsResponse> {
    const { startDate, endDate } = this.getDateRange(range);
    const sales = await insightsRepository.getSales(startDate, endDate);
    const catalog = await insightsRepository.getCatalogItems();
    return { items: InsightsDomain.getTopItems(sales, catalog) };
  }

  async getTopParties(range?: InsightRange): Promise<TopPartiesResponse> {
    const { startDate, endDate } = this.getDateRange(range);
    const sales = await insightsRepository.getSales(startDate, endDate);
    const parties = await insightsRepository.getParties();
    return { parties: InsightsDomain.getTopParties(sales, parties) };
  }

  async getTopCategories(range?: InsightRange): Promise<TopCategoriesResponse> {
    const { startDate, endDate } = this.getDateRange(range);
    const expenses = await insightsRepository.getExpenses(startDate, endDate);
    return { categories: InsightsDomain.getTopCategories(expenses) };
  }

  async getCashflowSummary(range?: InsightRange): Promise<CashflowSummaryResponse> {
    const { startDate, endDate } = this.getDateRange(range);
    const sales = await insightsRepository.getSales(startDate, endDate);
    const expenses = await insightsRepository.getExpenses(startDate, endDate);
    return InsightsDomain.calculateCashflow(sales, expenses);
  }

  async getCreditSummary(_range?: InsightRange): Promise<CreditSummaryResponse> {
    const parties = await insightsRepository.getParties();
    // Assuming credit summary might look at expenses across all time or specifically within range,
    // usually outstanding is all time up to endDate
    const expenses = await insightsRepository.getExpenses();
    return InsightsDomain.calculateCreditSummary(parties, expenses);
  }
}

export const insightsService = new InsightsService();
