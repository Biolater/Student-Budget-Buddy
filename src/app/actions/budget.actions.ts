"use server";

import { prisma } from "@/app/lib/client";
import { getLocalTimeZone } from "@internationalized/date";
import {
  CreateBudgetFormSchemaType,
  CreateBudgetFormSchema,
} from "@/app/schema/budget.schema";
import { requireUser } from "@/app/utils/auth.utils";
import { getConversionRate } from "./currency.actions";
import { apiRequest } from "../lib/apiClient";
import { BudgetInsights } from "../types/budget.types";
import { auth } from "@clerk/nextjs/server";

type ServerBudgetData = Omit<
  CreateBudgetFormSchemaType,
  "startDate" | "endDate"
> & {
  startDate: Date;
  endDate: Date;
};

interface CreateBudgetResponse {
  id: string;
  amount: number;
  periodType: string;
  startDate: Date;
  endDate: Date;
  category: {
    name: string;
    icon: string;
  };
  currency: {
    code: string;
    symbol: string;
  };
  expenseCount: number;
}

const createBudget = async (
  data: ServerBudgetData
): Promise<CreateBudgetResponse> => {
  const user = await requireUser();
  const {
    budgetCategory,
    startDate,
    endDate,
    amount,
    currency,
    description,
    periodType,
  } = data;

  if (startDate >= endDate) {
    throw new Error("Start date must be before end date");
  }

  // Create the budget and update existing expenses in a single transaction
  return prisma.$transaction(async (tx) => {
    // 1. Create the budget
    const categoryExists = await tx.budgetCategory.findUnique({
      cacheStrategy: {
        ttl: 86400, // 24 hours = 60 * 60 * 24 seconds
        swr: 3600, // 1 hour = 60 * 60 seconds
      },
      where: { id: budgetCategory },
    });
    if (!categoryExists) throw new Error("Invalid budget category");

    const currencyExists = await tx.currency.findUnique({
      where: { id: currency },
    });
    if (!currencyExists) throw new Error("Invalid currency");

    const budget = await tx.budget.create({
      data: {
        userId: user.userId!,
        budgetCategoryId: budgetCategory,
        startDate,
        endDate,
        amount,
        currencyId: currency,
        description,
        periodType,
      },
      include: {
        category: true,
        currency: true,
      },
    });

    // 2. Find existing expenses that should be linked to this budget
    const matchingExpenses = await tx.expense.findMany({
      where: {
        userId: user.userId!,
        expenseCategoryId: budgetCategory,
        date: {
          gte: startDate,
          lte: endDate,
        },
        budgetId: null, // Only get expenses that don't have a budget yet
      },
    });

    // 3. Update those expenses to link them to this new budget
    if (matchingExpenses.length > 0) {
      await tx.expense.updateMany({
        where: {
          id: { in: matchingExpenses.map((expense) => expense.id) },
        },
        data: {
          budgetId: budget.id,
        },
      });
    }

    // Return the created budget with expense count
    return {
      ...budget,
      amount: budget.amount.toNumber(),
      expenseCount: matchingExpenses.length,
    };
  });
};

const deleteBudget = async (budgetId: string) => {
  const user = await requireUser();
  const userId = user.userId!;

  try {
    const budget = await prisma.budget.findUnique({
      where: { id: budgetId, userId },
    });
    if (!budget) throw new Error("Budget not found");
    prisma.$transaction([
      prisma.budget.delete({ where: { id: budgetId, userId } }),
      prisma.expense.updateMany({
        where: { budgetId },
        data: { budgetId: null },
      }),
    ]);
  } catch (error) {
    throw error;
  }
};

const getBudgets = async () => {
  const user = await requireUser();
  const userId = user.userId!;

  try {
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
  } catch (error) {
    throw new Error("Failed to fetch budgets. Please try again.");
  }
};

const getBudgetStats = async () => {
  const user = await requireUser();
  const userId = user.userId!;

  try {
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

    // Convert all amounts to numbers for easier calculation
    const budgetsWithNumbers = budgets.map((budget) => ({
      ...budget,
      amount: budget.amount.toNumber(),
      expenses: budget.expenses.map((expense) => ({
        ...expense,
        amount: expense.amount.toNumber(),
      })),
    }));

    // Prepare promises for all conversions
    let overallBudgetAmount = 0;
    let overallSpentAmount = 0;
    let overallRemainingAmount = 0;

    for (const budget of budgetsWithNumbers) {
      // Convert budget amount to default currency if needed
      let budgetAmountInDefault = budget.amount;
      if (budget.currency.code !== userDefaultCurrency) {
        const conversionRate = await getConversionRate(
          budget.currency.code,
          userDefaultCurrency
        );
        budgetAmountInDefault = budget.amount * conversionRate;
      }
      overallBudgetAmount += budgetAmountInDefault;

      // Sum expenses in default currency
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
  } catch (error) {
    throw new Error("Failed to fetch budget stats. Please try again.");
  }
};

const getBudgetInsights = async (budgetId: string) => {
  console.log('[Budget Insights] Function called with budgetId:', budgetId);
  try {
    const user = await requireUser();
    const userId = user.userId;
    console.log('[Budget Insights] User ID:', userId);

    const token = await user.getToken();
    console.log('[Budget Insights] Token obtained:', !!token);

    if (!userId || !token) {
      console.log('[Budget Insights] Authentication error - missing userId or token');
      throw new Error("User not authenticated");
    }

    if (!budgetId) {
      console.log('[Budget Insights] Missing budgetId');
      throw new Error("Budget ID is required");
    }

    try {
      console.log('[Budget Insights] Checking if budget exists in database');
      const budget = await prisma.budget.findUnique({
        where: { id: budgetId, userId },
      });
      
      if (!budget) {
        console.log('[Budget Insights] Budget not found in database');
        throw new Error("Budget not found");
      }
      console.log('[Budget Insights] Budget found in database');

      console.log('[Budget Insights] Making API request to insights endpoint');
      const insights = await apiRequest<BudgetInsights>({
        endpoint: `/insights/budget/${budgetId}`,
        method: "GET",
        init: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });

      console.log('[Budget Insights] API response received:', { success: insights.success });
      
      if (!insights.success) {
        console.log('[Budget Insights] API request failed:', insights.error);
        throw new Error(insights.error?.message);
      }

      console.log('[Budget Insights] Returning insights data');
      return insights.data;
    } catch (error) {
      console.log('[Budget Insights] Error in budget lookup or API request:', error instanceof Error ? error.message : error);
      throw error;
    }
  } catch (error) {
    console.log('[Budget Insights] Top-level error:', error instanceof Error ? error.message : error);
    throw error;
  }
};

export {
  createBudget,
  type CreateBudgetResponse,
  getBudgets,
  getBudgetStats,
  deleteBudget,
  getBudgetInsights,
};
