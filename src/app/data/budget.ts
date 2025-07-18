import { prisma } from "@/app/lib/client";
import { requireUser } from "@/app/utils/auth.utils";
import { getConversionRate } from "./currency";
import { apiRequest } from "../lib/apiClient";
import { BudgetInsights } from "../types/budget.types";

export const fetchBudgets = async () => {
  const user = await requireUser();
  const userId = user.userId!;

  const budgets = await prisma.budget.findMany({
    where: { userId },
    include: {
      category: true,
      currency: true,
      expenses: {
        include: {
          currency: true,
        },
      },
      user: {
        include: {
          baseCurrency: true,
        },
      },
    },
  });

  return budgets.map((budget) => ({
    ...budget,
    amount: budget.amount.toNumber(),
    expenses: budget.expenses.map((expense) => ({
      ...expense,
      amount: expense.amount.toNumber(),
    })),
  }));
};

export const fetchBudgetStats = async () => {
  const user = await requireUser();
  const userId = user.userId!;

  const budgets = await prisma.budget.findMany({
    where: { userId },
    include: {
      category: true,
      currency: true,
      expenses: {
        include: {
          currency: true,
        },
      },
      user: {
        include: {
          baseCurrency: true,
        },
      },
    },
  });

  if (budgets.length === 0)
    return {
      budgets: [],
      overallBudgetAmount: 0,
      overallSpentAmount: 0,
      overallRemainingAmount: 0,
    };

  const userDefaultCurrency = budgets[0].user.baseCurrency.code;

  const budgetsWithNumbers = budgets.map((budget) => ({
    ...budget,
    amount: budget.amount.toNumber(),
    expenses: budget.expenses.map((expense) => ({
      ...expense,
      amount: expense.amount.toNumber(),
    })),
  }));

  let overallBudgetAmount = 0;
  let overallSpentAmount = 0;
  let overallRemainingAmount = 0;

  for (const budget of budgetsWithNumbers) {
    let budgetAmountInDefault = budget.amount;
    if (budget.currency.code !== userDefaultCurrency) {
      const conversionRate = await getConversionRate(
        budget.currency.code,
        userDefaultCurrency
      );
      budgetAmountInDefault = budget.amount * conversionRate;
    }
    overallBudgetAmount += budgetAmountInDefault;

    let budgetSpent = 0;
    for (const expense of budget.expenses) {
      let expenseAmountInDefault = expense.amount;
      if (expense.currency.code !== userDefaultCurrency) {
        const conversionRate = await getConversionRate(
          expense.currency.code,
          userDefaultCurrency
        );
        expenseAmountInDefault = expense.amount * conversionRate;
      }
      budgetSpent += expenseAmountInDefault;
    }
    overallSpentAmount += budgetSpent;
    overallRemainingAmount += budgetAmountInDefault - budgetSpent;
  }

  return {
    budgets: budgetsWithNumbers,
    overallBudgetAmount,
    overallSpentAmount,
    overallRemainingAmount,
  };
};

export const fetchBudgetInsights = async (budgetId: string) => {
  const user = await requireUser();
  const userId = user.userId;

  const token = await user.getToken();

  if (!userId || !token) throw new Error("User not authenticated");
  if (!budgetId) throw new Error("Budget ID is required");

  const budget = await prisma.budget.findUnique({
    where: { id: budgetId, userId },
  });
  if (!budget) throw new Error("Budget not found");

  const insights = await apiRequest<BudgetInsights>({
    endpoint: `/insights/budget/${budgetId}`,
    method: "GET",
    init: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  if (!insights.success) throw new Error(insights.error?.message);

  return insights.data;
};