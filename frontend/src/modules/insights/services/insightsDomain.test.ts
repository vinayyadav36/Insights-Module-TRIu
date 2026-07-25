import { describe, it, expect } from 'vitest';
import { InsightsDomain } from './insightsDomain';
import { RawSale, RawExpense, RawParty } from './insightsRepository';

describe('InsightsDomain', () => {

  const sampleSales: RawSale[] = [
    { id: 's1', date: '2023-10-01', amount: 100, items: [{ id: 'i1', qty: 2 }], paymentMode: 'cash' },
    { id: 's2', date: '2023-10-01', amount: 200, items: [{ id: 'i2', qty: 1 }], paymentMode: 'credit', credit: 200 },
    { id: 's3', date: '2023-10-02', amount: 50, items: [{ id: 'i1', qty: 1 }], paymentMode: 'upi' },
  ];

  const sampleExpenses: RawExpense[] = [
    { id: 'e1', date: '2023-10-01', amount: 30, categoryId: 'c1', paymentMode: 'cash' },
    { id: 'e2', date: '2023-10-02', amount: 100, categoryId: 'c2', paymentMode: 'bank', payable: 100 },
  ];

  it('calculates KPIs correctly', () => {
    const kpis = InsightsDomain.calculateKPIs(sampleSales, sampleExpenses);

    const totalSales = kpis.find(k => k.key === 'total_sales');
    expect(totalSales?.value).toBe(350);

    const totalExpenses = kpis.find(k => k.key === 'total_expenses');
    expect(totalExpenses?.value).toBe(130);

    const netResult = kpis.find(k => k.key === 'net_result');
    expect(netResult?.value).toBe(220); // 350 - 130

    const cashIn = kpis.find(k => k.key === 'cash_in');
    expect(cashIn?.value).toBe(150); // s1 (100) + s3 (50)

    const creditIssued = kpis.find(k => k.key === 'credit_issued');
    expect(creditIssued?.value).toBe(200);
  });

  it('builds trend series correctly', () => {
    const trends = InsightsDomain.buildTrendSeries(sampleSales, sampleExpenses);

    expect(trends).toHaveLength(2);

    const day1 = trends.find(t => t.date === '2023-10-01');
    expect(day1?.salesTotal).toBe(300);
    expect(day1?.expenseTotal).toBe(30);
    expect(day1?.netTotal).toBe(270);
  });

  it('calculates cashflow correctly', () => {
    const cashflow = InsightsDomain.calculateCashflow(sampleSales, sampleExpenses);

    // totalIncoming excludes credit sales
    expect(cashflow.totalIncoming).toBe(150); // s1 + s3

    // totalOutgoing excludes payable expenses
    expect(cashflow.totalOutgoing).toBe(30); // e1 only

    expect(cashflow.net).toBe(120); // 150 - 30
  });

  it('calculates credit summary correctly', () => {
    const sampleParties: RawParty[] = [
      { id: 'p1', name: 'Alice', balance: -500 }, // Owes us 500
      { id: 'p2', name: 'Bob', balance: 100 }
    ];

    const credit = InsightsDomain.calculateCreditSummary(sampleParties, sampleExpenses);

    expect(credit.outstandingCustomerCredit).toBe(500);
    expect(credit.supplierPayableExposure).toBe(100); // e2
  });

});
