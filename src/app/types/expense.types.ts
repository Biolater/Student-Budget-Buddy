import { Currency, Expense, ExpenseCategory } from "@prisma/client";

interface createExpenseData {
    date: Date;
    currency: string;
    category: string;
    description: string;
    amount: number;
}

type ExtendedExpense = {
    amount: number;
    currency: Currency;
    category: ExpenseCategory;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    date: Date;
    description: string | null;
    currencyId: string;
    expenseCategoryId: string;
}

export type { createExpenseData, ExtendedExpense };