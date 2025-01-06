"use server";
import { prisma } from "@/lib/client";
import { type Expense } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

// Types
export type Category =
  | "Food"
  | "Entertainment"
  | "Transport"
  | "Health"
  | "Education"
  | "Clothing"
  | "Pets"
  | "Travel"
  | "Other"
  | "";

type TransformedExpense = Omit<Expense, "amount"> & { amount: number };

const cache = new Map<
  string,
  { data: TransformedExpense[]; expiresAt: number }
>();

// Helper function to invalidate cache for a user
const invalidateCache = (userId: string) => {
  cache.delete(userId); // Remove cached data for the user
};

// Create Expense
const createExpense = async (
  date: Date,
  amount: number,
  currency: string,
  category: Category,
  description: string
) => {
  try {
    const user = await currentUser(); // Fetch the current authenticated user from Clerk
    if (!user) {
      throw new Error("User not authenticated");
    }

    const expense = await prisma.expense.create({
      data: {
        date,
        amount,
        currency,
        category,
        description,
        userId: user.id, // Use the Clerk user ID
      },
    });

    invalidateCache(user.id);
    return { ...expense, amount: expense.amount.toNumber() };
  } catch (error) {
    throw error;
  }
};

// Delete Expense
const deleteAnExpense = async (expenseId: string) => {
  try {
    const user = await currentUser(); // Fetch the current authenticated user
    if (!user) {
      throw new Error("User not authenticated");
    }

    const deletedExpense = await prisma.expense.delete({
      where: { id: expenseId },
    });

    // Ensure that the user is deleting their own expense
    if (deletedExpense.userId !== user.id) {
      throw new Error("You are not authorized to delete this expense");
    }

    invalidateCache(user.id);
    return { ...deletedExpense, amount: deletedExpense.amount.toNumber() };
  } catch (error) {
    throw error;
  }
};

// Fetch Expenses by User
const fetchExpensesByUser = async () => {
  try {
    const user = await currentUser(); // Fetch the current authenticated user
    if (!user) {
      throw new Error("User not authenticated");
    }

    const now = Date.now();

    // Check if data is in cache and still valid
    if (cache.has(user.id)) {
      const cached = cache.get(user.id)!;
      if (now < cached.expiresAt) {
        return cached.data;
      }
    }

    // Fetch from database
    const expenses: Expense[] = await prisma.expense.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
    });

    // Process amounts and store in cache
    const processedExpenses: TransformedExpense[] = expenses.map((expense) => ({
      ...expense,
      amount: expense.amount.toNumber(),
    }));

    cache.set(user.id, { data: processedExpenses, expiresAt: now + 600000 }); // Cache for 10 minutes
    return processedExpenses;
  } catch (error) {
    throw error;
  }
};

// Update Expense
const updateExpenseAction = async (
  expenseId: string,
  data: {
    date: Date;
    amount: number;
    currency: string;
    category: string;
    description: string;
  }
) => {
  try {
    const user = await currentUser(); // Fetch the current authenticated user
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Ensure that the user is updating their own expense
    const expenseToUpdate = await prisma.expense.findUnique({
      where: { id: expenseId },
    });

    if (!expenseToUpdate || expenseToUpdate.userId !== user.id) {
      throw new Error("You are not authorized to update this expense");
    }

    const updatedExpense = await prisma.expense.update({
      where: { id: expenseId },
      data,
    });

    invalidateCache(user.id);

    return { ...updatedExpense, amount: updatedExpense.amount.toNumber() };
  } catch (error) {
    throw error;
  }
};

// Create Expense Action (with validation)
const createExpenseAction = async (
  date: Date,
  amount: number,
  currency: string,
  category: Category,
  description: string,
  errors: {
    date: string;
    amount: string;
    currency: string;
    category: string;
    description: string;
  }
) => {
  const noErrors = Object.values(errors).every((error) => error === "");

  // Validate that all required fields are present and of the correct type
  if (
    typeof date !== "object" ||
    typeof amount !== "number" ||
    typeof currency !== "string" ||
    typeof category !== "string" ||
    typeof description !== "string" ||
    !noErrors
  ) {
    throw new Error("Invalid input data");
  }

  // Call the createExpense function with validated and converted data
  try {
    const expense = await createExpense(
      date,
      amount,
      currency,
      category as Category,
      description
    );
    return expense;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }
};

export {
  createExpense,
  deleteAnExpense,
  fetchExpensesByUser,
  updateExpenseAction,
  createExpenseAction,
};
