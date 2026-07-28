import { v4 as uuidv4 } from 'uuid';
import { db, ExpenseDTO } from '../../../shared/db';

export interface IExpenseService {
  getExpenses(filter?: {
    startDate?: string;
    endDate?: string;
    categoryId?: string;
    partyId?: string;
    status?: 'active' | 'voided' | 'all';
  }): Promise<ExpenseDTO[]>;
  createExpense(data: Omit<ExpenseDTO, 'id' | 'createdAt' | 'status'>): Promise<ExpenseDTO>;
  voidExpense(id: string): Promise<void>;
  seedFixtures(expenses: ExpenseDTO[]): Promise<void>;
}

export class LocalExpenseService implements IExpenseService {
  async getExpenses(filter?: {
    startDate?: string;
    endDate?: string;
    categoryId?: string;
    partyId?: string;
    status?: 'active' | 'voided' | 'all';
  }): Promise<ExpenseDTO[]> {
    let collection = db.expenses.toCollection();

    if (filter?.startDate || filter?.endDate) {
      if (filter.startDate && filter.endDate) {
         collection = db.expenses.where('date').between(filter.startDate, filter.endDate, true, true);
      } else if (filter.startDate) {
         collection = db.expenses.where('date').aboveOrEqual(filter.startDate);
      } else if (filter.endDate) {
         collection = db.expenses.where('date').belowOrEqual(filter.endDate);
      }
    }

    let results = await collection.toArray();

    if (filter?.categoryId) {
      results = results.filter(e => e.categoryId === filter.categoryId);
    }

    if (filter?.partyId) {
      results = results.filter(e => e.partyId === filter.partyId);
    }

    const statusFilter = filter?.status || 'active';
    if (statusFilter !== 'all') {
      results = results.filter(e => e.status === statusFilter);
    }

    return results;
  }

  async createExpense(data: Omit<ExpenseDTO, 'id' | 'createdAt' | 'status'>): Promise<ExpenseDTO> {
    const expense: ExpenseDTO = {
      ...data,
      id: uuidv4(),
      status: 'active',
      createdAt: new Date().toISOString()
    };
    await db.expenses.add(expense);
    return expense;
  }

  async voidExpense(id: string): Promise<void> {
    const expense = await db.expenses.get(id);
    if (!expense) throw new Error(`Expense with id ${id} not found`);
    await db.expenses.update(id, { status: 'voided' });
  }

  async seedFixtures(expenses: ExpenseDTO[]): Promise<void> {
     await db.expenses.bulkPut(expenses);
  }
}

export const expenseService = new LocalExpenseService();
