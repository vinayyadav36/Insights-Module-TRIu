import {
  InsightKPI,
  InsightTrendPoint,
  TopEntitySummary,
  CashflowSummaryResponse,
  CreditSummaryResponse
} from '../api/dto';
import { RawSale, RawExpense, RawParty, RawCatalogItem } from './insightsRepository';

export class InsightsDomain {

  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }

  static calculateKPIs(sales: RawSale[], expenses: RawExpense[]): InsightKPI[] {
    const totalSales = sales.reduce((sum, s) => sum + s.amount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const netTotal = totalSales - totalExpenses;

    const cashCollected = sales
        .filter(s => s.paymentMode === 'cash' || s.paymentMode === 'upi' || s.paymentMode === 'bank')
        .reduce((sum, s) => sum + s.amount, 0);

    const creditIssued = sales.reduce((sum, s) => sum + (s.credit || 0), 0);

    return [
      {
        key: 'total_sales',
        label: 'Total Sales',
        value: totalSales,
        formattedValue: this.formatCurrency(totalSales),
        trendDirection: totalSales > 0 ? 'up' : 'flat'
      },
      {
        key: 'total_expenses',
        label: 'Total Expenses',
        value: totalExpenses,
        formattedValue: this.formatCurrency(totalExpenses),
        trendDirection: totalExpenses > 0 ? 'down' : 'flat'
      },
      {
        key: 'net_result',
        label: 'Net Result',
        value: netTotal,
        formattedValue: this.formatCurrency(netTotal),
        trendDirection: netTotal > 0 ? 'up' : (netTotal < 0 ? 'down' : 'flat')
      },
      {
        key: 'cash_in',
        label: 'Cash In',
        value: cashCollected,
        formattedValue: this.formatCurrency(cashCollected)
      },
      {
        key: 'credit_issued',
        label: 'Credit Issued',
        value: creditIssued,
        formattedValue: this.formatCurrency(creditIssued)
      }
    ];
  }

  static buildTrendSeries(sales: RawSale[], expenses: RawExpense[]): InsightTrendPoint[] {
    const dateMap: Record<string, InsightTrendPoint> = {};

    const addDate = (date: string) => {
      if (!dateMap[date]) {
        dateMap[date] = { date, salesTotal: 0, expenseTotal: 0, netTotal: 0, collectionTotal: 0, creditIssued: 0 };
      }
    };

    sales.forEach(s => {
      addDate(s.date);
      dateMap[s.date].salesTotal += s.amount;
      dateMap[s.date].netTotal += s.amount;
      if (s.credit) {
         dateMap[s.date].creditIssued! += s.credit;
      } else {
         dateMap[s.date].collectionTotal! += s.amount;
      }
    });

    expenses.forEach(e => {
      addDate(e.date);
      dateMap[e.date].expenseTotal += e.amount;
      dateMap[e.date].netTotal -= e.amount;
    });

    return Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date));
  }

  static calculateCashflow(sales: RawSale[], expenses: RawExpense[]): CashflowSummaryResponse {
    const totalIncoming = sales
      .filter(s => !s.credit) // Only count actual payments received, not credit sales
      .reduce((sum, s) => sum + s.amount, 0);

    const totalOutgoing = expenses
      .filter(e => !e.payable) // Only count actual payments made
      .reduce((sum, e) => sum + e.amount, 0);

    const net = totalIncoming - totalOutgoing;

    return {
      totalIncoming,
      totalOutgoing,
      net,
      formattedIncoming: this.formatCurrency(totalIncoming),
      formattedOutgoing: this.formatCurrency(totalOutgoing),
      formattedNet: this.formatCurrency(net)
    };
  }

  static calculateCreditSummary(parties: RawParty[], expenses: RawExpense[]): CreditSummaryResponse {
    // Negative balance means they owe us
    const outstandingCustomerCredit = parties
      .filter(p => p.balance < 0)
      .reduce((sum, p) => sum + Math.abs(p.balance), 0);

    const supplierPayableExposure = expenses
      .reduce((sum, e) => sum + (e.payable || 0), 0);

    return {
      outstandingCustomerCredit,
      supplierPayableExposure,
      formattedCustomerCredit: this.formatCurrency(outstandingCustomerCredit),
      formattedSupplierPayable: this.formatCurrency(supplierPayableExposure)
    };
  }

  static getTopItems(sales: RawSale[], catalog: RawCatalogItem[]): TopEntitySummary[] {
    const itemMap: Record<string, { qty: number, amount: number }> = {};
    sales.forEach(s => {
      s.items.forEach(i => {
        if (!itemMap[i.id]) itemMap[i.id] = { qty: 0, amount: 0 };
        itemMap[i.id].qty += i.qty;

        const catalogItem = catalog.find(c => c.id === i.id);
        const price = catalogItem ? catalogItem.price : 0;
        itemMap[i.id].amount += i.qty * price; // Simplified valuation
      });
    });

    return Object.entries(itemMap)
      .map(([id, data]) => ({
        id,
        label: catalog.find(c => c.id === id)?.name || id,
        amount: data.amount,
        count: data.qty
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }

  static getTopParties(sales: RawSale[], parties: RawParty[]): TopEntitySummary[] {
    const partyMap: Record<string, { amount: number, count: number }> = {};
    sales.forEach(s => {
        if (!s.partyId) return;
        if (!partyMap[s.partyId]) partyMap[s.partyId] = { amount: 0, count: 0 };
        partyMap[s.partyId].amount += s.amount;
        partyMap[s.partyId].count += 1;
    });

    return Object.entries(partyMap)
      .map(([id, data]) => ({
        id,
        label: parties.find(p => p.id === id)?.name || id,
        amount: data.amount,
        count: data.count
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }

  static getTopCategories(expenses: RawExpense[]): TopEntitySummary[] {
     const catMap: Record<string, { amount: number, count: number }> = {};
     expenses.forEach(e => {
         if (!catMap[e.categoryId]) catMap[e.categoryId] = { amount: 0, count: 0 };
         catMap[e.categoryId].amount += e.amount;
         catMap[e.categoryId].count += 1;
     });

     return Object.entries(catMap)
      .map(([id, data]) => ({
        id,
        label: id, // In a real app we'd join with a category table
        amount: data.amount,
        count: data.count
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }
}
