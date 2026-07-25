import Dexie, { Table } from 'dexie';

// A generic Database for local mock storage
export class InsightsMockDB extends Dexie {
  sales!: Table<any, string>;
  expenses!: Table<any, string>;
  parties!: Table<any, string>;
  catalog!: Table<any, string>;

  constructor() {
    super('InsightsMockDB');
    this.version(1).stores({
      sales: 'id, date, amount',
      expenses: 'id, date, amount, categoryId',
      parties: 'id, name',
      catalog: 'id, name'
    });
  }
}

export const db = new InsightsMockDB();

// Mock seeding data logic
export async function seedMockData() {
  const count = await db.sales.count();
  if (count > 0) return; // Already seeded

  const today = new Date();
  const d1 = new Date(today); d1.setDate(today.getDate() - 1);
  const d2 = new Date(today); d2.setDate(today.getDate() - 3);
  const d3 = new Date(today); d3.setDate(today.getDate() - 10);

  const formatDate = (d: Date) => d.toISOString().split('T')[0];

  await db.sales.bulkAdd([
    { id: 's1', date: formatDate(today), amount: 150.00, items: [{id: 'i1', qty: 2}], partyId: 'p1', paymentMode: 'cash', credit: 0 },
    { id: 's2', date: formatDate(d1), amount: 300.00, items: [{id: 'i2', qty: 1}], partyId: 'p2', paymentMode: 'credit', credit: 300.00 },
    { id: 's3', date: formatDate(d2), amount: 45.00, items: [{id: 'i1', qty: 1}], partyId: 'p1', paymentMode: 'upi', credit: 0 },
    { id: 's4', date: formatDate(d3), amount: 1200.00, items: [{id: 'i3', qty: 4}], partyId: 'p3', paymentMode: 'bank', credit: 0 },
  ]);

  await db.expenses.bulkAdd([
    { id: 'e1', date: formatDate(today), amount: 50.00, categoryId: 'cat1', paymentMode: 'cash' },
    { id: 'e2', date: formatDate(d2), amount: 20.00, categoryId: 'cat2', paymentMode: 'upi' },
    { id: 'e3', date: formatDate(d3), amount: 500.00, categoryId: 'cat3', paymentMode: 'bank', payable: 500.00 },
  ]);

  await db.parties.bulkAdd([
    { id: 'p1', name: 'Alice Smith', balance: 0 },
    { id: 'p2', name: 'Bob Jones', balance: -300.00 }, // Owes us 300
    { id: 'p3', name: 'Charlie Inc', balance: 0 },
  ]);

  await db.catalog.bulkAdd([
    { id: 'i1', name: 'Standard Widget', price: 45.00 },
    { id: 'i2', name: 'Premium Gadget', price: 300.00 },
    { id: 'i3', name: 'Bulk Materials', price: 300.00 },
  ]);

  console.log('Insights Mock Data Seeded.');
}
