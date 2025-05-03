import { Budget, BudgetCategory, Currency } from "@prisma/client";
import { ExpenseItem } from "./expense.types";

interface ExtendedBudget extends Omit<Budget, "amount"> {
  expenses: ExpenseItem[];
  currency: Currency;
  category: BudgetCategory;
  amount: number;
}

// Define a simple User type for the structure within BudgetInsights
interface BudgetInsightsUser {
  id: string;
  email: string;
  username: string;
  baseCurrencyId: string;
}

// Populate the BudgetInsights interface
interface BudgetInsights {
  budgetId: string;
  totalBudget: number;
  totalSpent: number;
  remaining: number;
  spendingPercentage: number;
  status: string;
  currency: string;
  user: BudgetInsightsUser;
  category: BudgetCategory;
  tip: string;
  dailyAverage: number;
  targetDailyAverage: number;
}

export type { ExtendedBudget, BudgetInsights };
