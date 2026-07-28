import { describe, it, expect } from 'vitest';
import { InsightsSelectors } from './insightsSelectors';
import { ExpenseDTO } from '../../../shared/db';

describe('InsightsSelectors', () => {
  const sampleExpenses: ExpenseDTO[] = [
    { id: '1', amount: 100, categoryId: 'c1', categoryName: 'Food', paymentMode: 'cash', status: 'active', date: '2023-10-01T10:00:00Z', createdAt: '2023-10-01T10:00:00Z' },
    { id: '2', amount: 50, categoryId: 'c1', categoryName: 'Food', paymentMode: 'upi', status: 'active', date: '2023-10-01T14:00:00Z', createdAt: '2023-10-01T14:00:00Z' },
    { id: '3', amount: 500, categoryId: 'c2', categoryName: 'Rent', paymentMode: 'bank', status: 'active', partyId: 'p1', date: '2023-10-02T10:00:00Z', createdAt: '2023-10-02T10:00:00Z' },
    { id: '4', amount: 200, categoryId: 'c1', categoryName: 'Food', paymentMode: 'cash', status: 'voided', date: '2023-10-03T10:00:00Z', createdAt: '2023-10-03T10:00:00Z' }, // Voided, should be ignored
    { id: '5', amount: 5000, categoryId: 'c1', categoryName: 'Food', paymentMode: 'card', status: 'active', date: '2023-10-04T10:00:00Z', createdAt: '2023-10-04T10:00:00Z' }, // Spike/Anomaly
  ];

  it('calculates getOverview correctly, ignoring voided expenses', () => {
    const overview = InsightsSelectors.getOverview(sampleExpenses, {});
    expect(overview.totalSpend).toBe(5650); // 100 + 50 + 500 + 5000
    expect(overview.transactionCount).toBe(4);
    expect(overview.topCategory?.id).toBe('c1');
    expect(overview.topCategory?.total).toBe(5150);
  });

  it('calculates getCategoryBreakdown correctly', () => {
    const breakdown = InsightsSelectors.getCategoryBreakdown(sampleExpenses, {});
    expect(breakdown).toHaveLength(2);
    expect(breakdown[0].categoryId).toBe('c1'); // 5150
    expect(breakdown[0].percentOfTotal).toBeCloseTo(91.15, 2);
    expect(breakdown[1].categoryId).toBe('c2'); // 500
    expect(breakdown[1].percentOfTotal).toBeCloseTo(8.85, 2);
  });

  it('calculates getPaymentModeMix correctly', () => {
    const mix = InsightsSelectors.getPaymentModeMix(sampleExpenses, {});
    const cash = mix.find(m => m.mode === 'cash');
    expect(cash?.total).toBe(100);
    const card = mix.find(m => m.mode === 'card');
    expect(card?.total).toBe(5000);
  });

  it('detects anomalies correctly', () => {
    const anomalies = InsightsSelectors.getAnomalies(sampleExpenses, {});
    expect(anomalies).toHaveLength(1);
    expect(anomalies[0].expenseId).toBe('5');
    expect(anomalies[0].amount).toBe(5000);
  });
});
