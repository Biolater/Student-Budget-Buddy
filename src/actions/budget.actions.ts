"use server";
import { prisma } from "@/lib/client";
import { type NewBudgetSchema } from "@/app/(home)/budget/AddNewBudget";
import { currentUser } from "@clerk/nextjs/server";
import { type Budget } from "@prisma/client";
import { type TransformedExpense } from "./expense.actions";

type TransformedBudget = Omit<Budget, "amount" | "expenses"> & {
  amount: number;
  expenses: TransformedExpense[];
};

const cache: Map<string, { data: TransformedBudget[]; expiresAt: number }> =
  new Map();

const invalidateCache = (userId: string) => {
  cache.delete(userId);
};

const createBudget = async (data: NewBudgetSchema) => {
  const { category, currency, amount, period } = data;
  const user = await currentUser();
  if (!user) return null;
  const userId = user.id;
  try {
    const budget = await prisma.budget.create({
      data: {
        category,
        currency,
        amount,
        period,
        userId,
      },
    });

    invalidateCache(userId);
    return {
      ...budget,
      amount: budget.amount.toNumber(),
      expenses: [],
    };
  } catch (error) {
    throw error; // re-throw the error
  }
};

const getBudgets = async () => {
  const user = await currentUser();
  if (!user) throw new Error("You must be signed in to get budgets");

  const userId = user.id;

  // Check if data is in cache and still valid
  const now = Date.now();
  if (cache.has(userId)) {
    const cached = cache.get(userId)!;
    if (now < cached.expiresAt) {
      return cached.data;
    } else {
      cache.delete(userId);
    }
  }

  try {
    const budgets = await prisma.budget.findMany({ where: { userId } });
    const formattedBudgets = await Promise.all(
      budgets.map(async (budget) => {
        const expenses = await prisma.expense.findMany({
          where: { category: budget.category },
        });
        const formattedExpenses = expenses.map((expense) => ({
          ...expense,
          amount: expense.amount.toNumber(),
        }));
        const formattedBudget = {
          ...budget,
          amount: budget.amount.toNumber(),
          expenses: formattedExpenses,
        };
        return formattedBudget;
      })
    );
    cache.set(userId, { data: formattedBudgets, expiresAt: now + 600000 });
    return formattedBudgets;
  } catch (error) {
    console.error("Error fetching budgets:", error);
    throw new Error("Failed to fetch budgets. Please try again later.");
  }
};

export { createBudget, getBudgets };
