import { Budget, BudgetCategory, Currency } from "@prisma/client";
import { ExpenseItem } from "./expense.types";

interface ExtendedBudget extends Omit<Budget, "amount"> {
  expenses: ExpenseItem[];
  currency: Currency;
  category: BudgetCategory;
  amount: number;
}

export type { ExtendedBudget };
