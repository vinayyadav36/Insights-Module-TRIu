import { ExpenseDTO } from '../../../shared/db';
import { PartyDTO } from '../../parties/services/partyService';
import { bucketDate } from '../../../shared/utils/dateUtils';
import {
  InsightsOverviewDTO,
  CategoryBreakdownItemDTO,
  PaymentModeMixDTO,
  TrendPointDTO,
  PartySpendItemDTO,
  AnomalyItemDTO,
  InsightsFilterDTO
} from '../api/dto';

export class InsightsSelectors {
  static getValidExpenses(expenses: ExpenseDTO[], filter: InsightsFilterDTO): ExpenseDTO[] {
    return expenses.filter(e => {
      if (e.status === 'voided') return false;
      if (filter.categoryId && e.categoryId !== filter.categoryId) return false;
      if (filter.partyId && e.partyId !== filter.partyId) return false;
      if (filter.paymentMode && e.paymentMode !== filter.paymentMode) return false;

      const date = new Date(e.date);
      if (filter.rangeStart && date < new Date(filter.rangeStart)) return false;
      if (filter.rangeEnd && date > new Date(filter.rangeEnd)) return false;
      return true;
    });
  }

  static getOverview(expenses: ExpenseDTO[], filter: InsightsFilterDTO): InsightsOverviewDTO {
    const valid = this.getValidExpenses(expenses, filter);
    let totalSpend = 0;
    let cash = 0;
    let digital = 0;
    const catTotals: Record<string, { name: string; total: number }> = {};

    valid.forEach(e => {
      totalSpend += e.amount;
      if (e.paymentMode === 'cash') cash += e.amount;
      else digital += e.amount;

      if (!catTotals[e.categoryId]) catTotals[e.categoryId] = { name: e.categoryName, total: 0 };
      catTotals[e.categoryId].total += e.amount;
    });

    let topCategory = null;
    let max = -1;
    for (const [id, data] of Object.entries(catTotals)) {
      if (data.total > max) {
        max = data.total;
        topCategory = { id, name: data.name, total: data.total };
      }
    }

    // Approximate average daily spend based on range if provided, else on data points
    let days = 1;
    if (filter.rangeStart && filter.rangeEnd) {
      days = Math.max(1, (new Date(filter.rangeEnd).getTime() - new Date(filter.rangeStart).getTime()) / (1000 * 3600 * 24));
    } else if (valid.length > 0) {
       const dates = valid.map(e => new Date(e.date).getTime());
       const min = Math.min(...dates);
       const max = Math.max(...dates);
       days = Math.max(1, (max - min) / (1000 * 3600 * 24));
    }

    return {
      rangeStart: filter.rangeStart || '',
      rangeEnd: filter.rangeEnd || '',
      totalSpend,
      transactionCount: valid.length,
      avgDailySpend: totalSpend / days,
      topCategory,
      cashVsDigital: { cash, digital },
      deltaVsPreviousPeriod: 0 // Mocking for now, requires fetching prior period
    };
  }

  static getCategoryBreakdown(expenses: ExpenseDTO[], filter: InsightsFilterDTO): CategoryBreakdownItemDTO[] {
    const valid = this.getValidExpenses(expenses, filter);
    const totals: Record<string, CategoryBreakdownItemDTO> = {};
    let totalSpend = 0;

    valid.forEach(e => {
      totalSpend += e.amount;
      if (!totals[e.categoryId]) totals[e.categoryId] = { categoryId: e.categoryId, categoryName: e.categoryName, total: 0, count: 0, percentOfTotal: 0 };
      totals[e.categoryId].total += e.amount;
      totals[e.categoryId].count += 1;
    });

    return Object.values(totals).map(t => ({
      ...t,
      percentOfTotal: totalSpend > 0 ? (t.total / totalSpend) * 100 : 0
    })).sort((a, b) => b.total - a.total);
  }

  static getPaymentModeMix(expenses: ExpenseDTO[], filter: InsightsFilterDTO): PaymentModeMixDTO[] {
    const valid = this.getValidExpenses(expenses, filter);
    const totals: Record<string, PaymentModeMixDTO> = {
      cash: { mode: 'cash', total: 0, percentOfTotal: 0 },
      upi: { mode: 'upi', total: 0, percentOfTotal: 0 },
      bank: { mode: 'bank', total: 0, percentOfTotal: 0 },
      card: { mode: 'card', total: 0, percentOfTotal: 0 },
      other: { mode: 'other', total: 0, percentOfTotal: 0 }
    };

    let totalSpend = 0;
    valid.forEach(e => {
      totalSpend += e.amount;
      if (totals[e.paymentMode]) totals[e.paymentMode].total += e.amount;
    });

    return Object.values(totals).map(t => ({
      ...t,
      percentOfTotal: totalSpend > 0 ? (t.total / totalSpend) * 100 : 0
    }));
  }

  static getTrend(expenses: ExpenseDTO[], filter: InsightsFilterDTO, bucket: 'day' | 'week' | 'month'): TrendPointDTO[] {
    const valid = this.getValidExpenses(expenses, filter);
    const trendMap: Record<string, number> = {};

    valid.forEach(e => {
      const bucketedDate = bucketDate(e.date, bucket);
      trendMap[bucketedDate] = (trendMap[bucketedDate] || 0) + e.amount;
    });

    return Object.entries(trendMap)
      .map(([date, total]) => ({ date, total }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  static getPartySpend(expenses: ExpenseDTO[], parties: PartyDTO[], filter: InsightsFilterDTO): PartySpendItemDTO[] {
    const valid = this.getValidExpenses(expenses, filter);
    const map: Record<string, PartySpendItemDTO> = {};
    const partyMap = new Map(parties.map(p => [p.id, p]));

    valid.forEach(e => {
      if (!e.partyId) return;
      const party = partyMap.get(e.partyId);
      if (!party) return;

      if (!map[e.partyId]) {
        map[e.partyId] = { partyId: e.partyId, partyName: party.name, partyType: party.type, total: 0, transactionCount: 0, lastTransactionDate: e.date };
      }
      map[e.partyId].total += e.amount;
      map[e.partyId].transactionCount += 1;
      if (new Date(e.date) > new Date(map[e.partyId].lastTransactionDate)) {
        map[e.partyId].lastTransactionDate = e.date;
      }
    });

    return Object.values(map).sort((a, b) => b.total - a.total);
  }

  static getAnomalies(expenses: ExpenseDTO[], filter: InsightsFilterDTO): AnomalyItemDTO[] {
    const allActive = expenses.filter(e => e.status !== 'voided');

    const categoryStats: Record<string, { total: number, count: number, avg: number }> = {};
    allActive.forEach(e => {
      if (!categoryStats[e.categoryId]) categoryStats[e.categoryId] = { total: 0, count: 0, avg: 0 };
      categoryStats[e.categoryId].total += e.amount;
      categoryStats[e.categoryId].count += 1;
    });

    for (const key in categoryStats) {
      categoryStats[key].avg = categoryStats[key].total / categoryStats[key].count;
    }

    const valid = this.getValidExpenses(expenses, filter);
    const anomalies: AnomalyItemDTO[] = [];

    valid.forEach(e => {
      const stats = categoryStats[e.categoryId];
      if (stats && stats.count > 1) { // Only flag if we have some baseline
        const threshold = stats.avg * 1.5; // 50% above average
        if (e.amount > threshold) {
          anomalies.push({
            expenseId: e.id,
            categoryId: e.categoryId,
            categoryName: e.categoryName,
            amount: e.amount,
            averageForCategory: stats.avg,
            percentAboveAverage: ((e.amount - stats.avg) / stats.avg) * 100,
            date: e.date
          });
        }
      }
    });

    return anomalies.sort((a, b) => b.percentAboveAverage - a.percentAboveAverage);
  }
}
