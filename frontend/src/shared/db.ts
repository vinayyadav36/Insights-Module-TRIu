import { Dexie, Table } from 'dexie';

export interface ExpenseDTO {
  id: string;
  amount: number;
  categoryId: string;
  categoryName: string;
  paymentMode: 'cash' | 'upi' | 'bank' | 'card' | 'other';
  partyId?: string;
  date: string; // ISO 8601 UTC
  status: 'active' | 'voided';
  notes?: string;
  createdAt: string; // ISO 8601 UTC
}

class OSAppDB extends Dexie {
  expenses!: Table<ExpenseDTO, string>;
  parties!: Table<any, string>;

  constructor() {
    super('OSAppDB');
    this.version(1).stores({
      expenses: 'id, date, status, categoryId, partyId',
      parties: 'id, name, type'
    });
  }
}

export const db = new OSAppDB();
