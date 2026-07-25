import { db } from './mockAdapters';

export interface RawSale {
  id: string;
  date: string;
  amount: number;
  items: { id: string; qty: number }[];
  partyId?: string;
  paymentMode: string;
  credit?: number;
}

export interface RawExpense {
  id: string;
  date: string;
  amount: number;
  categoryId: string;
  paymentMode: string;
  payable?: number;
}

export interface RawParty {
  id: string;
  name: string;
  balance: number;
}

export interface RawCatalogItem {
  id: string;
  name: string;
  price: number;
}

export class InsightsRepository {
  async getSales(startDate?: string, endDate?: string): Promise<RawSale[]> {
    if (startDate && endDate) {
      return await db.sales.where('date').between(startDate, endDate, true, true).toArray();
    }
    return await db.sales.toArray();
  }

  async getExpenses(startDate?: string, endDate?: string): Promise<RawExpense[]> {
    if (startDate && endDate) {
      return await db.expenses.where('date').between(startDate, endDate, true, true).toArray();
    }
    return await db.expenses.toArray();
  }

  async getParties(): Promise<RawParty[]> {
    return await db.parties.toArray();
  }

  async getParty(id: string): Promise<RawParty | undefined> {
    return await db.parties.get(id);
  }

  async getCatalogItems(): Promise<RawCatalogItem[]> {
    return await db.catalog.toArray();
  }

  async getCatalogItem(id: string): Promise<RawCatalogItem | undefined> {
    return await db.catalog.get(id);
  }
}

export const insightsRepository = new InsightsRepository();
