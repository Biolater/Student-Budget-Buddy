"use server";

import { prisma } from "@/app/lib/client";
import { getLocalTimeZone } from "@internationalized/date";
import {
  CreateBudgetFormSchemaType,
  CreateBudgetFormSchema,
} from "@/app/schema/budget.schema";
import { requireUser } from "@/app/utils/auth.utils";
import { getConversionRate } from "./currency.actions";
import {
  fetchBudgets,
  fetchBudgetStats,
  fetchBudgetInsights,
} from "../data/budget";

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
  return fetchBudgets();
};

const getBudgetStats = async () => {
  return fetchBudgetStats();
};

const getBudgetInsights = async (budgetId: string) => {
  return fetchBudgetInsights(budgetId);
};

export {
  createBudget,
  type CreateBudgetResponse,
  getBudgets,
  getBudgetStats,
  deleteBudget,
  getBudgetInsights,
};
