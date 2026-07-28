import { IInsightsService, InsightsFilterDTO, InsightsOverviewDTO, CategoryBreakdownItemDTO, PaymentModeMixDTO, TrendPointDTO, PartySpendItemDTO, AnomalyItemDTO } from '../api/dto';
import { IExpenseService, expenseService } from '../../expenses/services/expenseService';
import { IPartyService, partyService } from '../../parties/services/partyService';
import { InsightsSelectors } from './insightsSelectors';

export class LocalInsightsService implements IInsightsService {
  constructor(private readonly expenses: IExpenseService, private readonly parties: IPartyService) {}

  async getOverview(filter: InsightsFilterDTO): Promise<InsightsOverviewDTO> {
    const expenses = await this.expenses.getExpenses({ status: 'active' });
    return InsightsSelectors.getOverview(expenses, filter);
  }

  async getCategoryBreakdown(filter: InsightsFilterDTO): Promise<CategoryBreakdownItemDTO[]> {
    const expenses = await this.expenses.getExpenses({ status: 'active' });
    return InsightsSelectors.getCategoryBreakdown(expenses, filter);
  }

  async getPaymentModeMix(filter: InsightsFilterDTO): Promise<PaymentModeMixDTO[]> {
    const expenses = await this.expenses.getExpenses({ status: 'active' });
    return InsightsSelectors.getPaymentModeMix(expenses, filter);
  }

  async getTrend(filter: InsightsFilterDTO, bucket: 'day' | 'week' | 'month'): Promise<TrendPointDTO[]> {
    const expenses = await this.expenses.getExpenses({ status: 'active' });
    return InsightsSelectors.getTrend(expenses, filter, bucket);
  }

  async getPartySpend(filter: InsightsFilterDTO): Promise<PartySpendItemDTO[]> {
    const [expenses, parties] = await Promise.all([
      this.expenses.getExpenses({ status: 'active' }),
      this.parties.getParties()
    ]);
    return InsightsSelectors.getPartySpend(expenses, parties, filter);
  }

  async getAnomalies(filter: InsightsFilterDTO): Promise<AnomalyItemDTO[]> {
    const expenses = await this.expenses.getExpenses({ status: 'active' });
    return InsightsSelectors.getAnomalies(expenses, filter);
  }

  async exportInsightsSummary(filter: InsightsFilterDTO): Promise<object> {
    const [overview, categoryBreakdown, paymentModeMix, trend, partySpend, anomalies] = await Promise.all([
      this.getOverview(filter),
      this.getCategoryBreakdown(filter),
      this.getPaymentModeMix(filter),
      this.getTrend(filter, 'month'),
      this.getPartySpend(filter),
      this.getAnomalies(filter)
    ]);

    return {
      overview,
      categoryBreakdown,
      paymentModeMix,
      trend,
      partySpend,
      anomalies
    };
  }
}

export const insightsService = new LocalInsightsService(expenseService, partyService);
