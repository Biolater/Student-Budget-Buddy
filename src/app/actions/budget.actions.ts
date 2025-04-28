"use server";

import { prisma } from "@/app/lib/client";
import { getLocalTimeZone } from "@internationalized/date";
import {
  CreateBudgetFormSchemaType,
  CreateBudgetFormSchema,
} from "@/app/schema/budget.schema";
import { requireUser } from "@/app/utils/auth.utils";

type ServerBudgetData = Omit<
  CreateBudgetFormSchemaType,
  "startDate" | "endDate"
> & {
  startDate: Date;
  endDate: Date;
};

class BudgetValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BudgetValidationError";
  }
}

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
        userId: user.id,
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
        userId: user.id,
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

const getBudgets = async () => {
  const user = await requireUser();
  const userId = user.id;

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
  const userId = user.id;

  try {
    const budgets = await prisma.budget.findMany({
      where: { userId },
      include: {
        category: true,
        currency: true,
        expenses: true,
        user: true,
      },
    });
    return budgets;
  } catch (error) {
    throw new Error("Failed to fetch budget stats. Please try again.");
  }
};

export { createBudget, type CreateBudgetResponse, getBudgets, getBudgetStats };

// const createBudget = async (data: NewBudgetSchema) => {
//   const { category, currency, amount, period } = data;
//   const user = await currentUser();
//   if (!user) return null;
//   const userId = user.id;
//   try {
//     if (!category || !currency || !amount || !period) {
//       throw new Error("Missing required fields");
//     }
//     const budget = await prisma.budget.create({
//       data: {
//         category,
//         currencyId: `${currency.toLowerCase()}-id`,
//         amount,
//         period,
//         userId,
//       },
//     });

//     return {
//       ...budget,
//       amount: budget.amount.toNumber(),
//       expenses: [],
//     };
//   } catch (error) {
//     throw error; // re-throw the error
//   }
// };

// const deleteBudget = async (budgetId: string) => {
//   const user = await currentUser();
//   if (!user) throw new Error("You must be signed in to delete a budget");

//   const userId = user.id;
//   try {
//     await prisma.budget.delete({ where: { id: budgetId, userId } });
//   } catch (error) {
//     throw error;
//   }
// };

// const getBudgets = async () => {
//   const user = await currentUser();
//   if (!user) throw new Error("You must be signed in to get budgets");
//   const userId = user.id;

//   try {
//     const budgets = await prisma.budget.findMany({ where: { userId }, include: {
//       currency: true
//     } },);
//     const formattedBudgets = await Promise.all(
//       budgets.map(async (budget) => {
//         const expenses = await prisma.expense.findMany({
//           where: { category: budget.category, userId },
//         });
//         const formattedExpenses = expenses.map((expense) => ({
//           ...expense,
//           amount: expense.amount.toNumber(),
//         }));
//         const formattedBudget = {
//           ...budget,
//           amount: budget.amount.toNumber(),
//           expenses: formattedExpenses,
//         };
//       return formattedBudget;
//       })
//     );
//     return formattedBudgets;
//   } catch (error) {
//     throw new Error("Failed to fetch budgets. Please try again later.");
//   }
// };

// const getTotalBudgetAmount = async () => {
//   const user = await currentUser();
//   if (!user) throw new Error("You must be signed in to get budgets");
//   const userId = user.id;
//   try {
//     const budgets = await prisma.budget.findMany({
//       where: { userId },
//       select: { amount: true },
//     });
//     const totalBudgetAmount = budgets.reduce(
//       (acc, budget) => acc + budget.amount.toNumber(),
//       0
//     );
//     return totalBudgetAmount;
//   } catch (error) {
//     throw error;
//   }
// };

// export { createBudget, getBudgets, deleteBudget, getTotalBudgetAmount };
