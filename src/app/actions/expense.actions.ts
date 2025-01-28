"use server";
import { prisma } from "@/app/lib/client";
import { type Expense } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";
import { convertCurrency, getDefaultCurrency } from "../lib/currencyUtils";

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

export type TransformedExpense = Omit<Expense, "amount"> & { amount: number };

export type CreateExpenseData = {
  date: Date;
  amount: number;
  currency: string;
  category: Category;
  description: string;
};

// Create Expense
const createExpense = async (data: CreateExpenseData) => {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const expense = await prisma.expense.create({
      data: {
        ...data,
        userId: user.id,
      },
    });

    return { ...expense, amount: expense.amount.toNumber() };
  } catch (error) {
    throw error;
  }
};

// Delete Expense
const deleteAnExpense = async (expenseId: string) => {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const deletedExpense = await prisma.expense.delete({
      where: { id: expenseId },
    });

    if (deletedExpense.userId !== user.id) {
      throw new Error("You are not authorized to delete this expense");
    }

    return { ...deletedExpense, amount: deletedExpense.amount.toNumber() };
  } catch (error) {
    throw error;
  }
};

// Fetch Expenses by User
const fetchExpensesByUser = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const expenses: Expense[] = await prisma.expense.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
    });

    const processedExpenses: TransformedExpense[] = expenses.map((expense) => ({
      ...expense,
      amount: expense.amount.toNumber(),
    }));

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
    const user = await currentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

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

  try {
    const expense = await createExpense({
      date,
      amount,
      currency,
      category,
      description,
    });
    return expense;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }
};

type MonthlySpending = Record<string, number>;

const getTotalSpent = async () => {
  const user = await currentUser();
  if(!user) throw new Error("You must be signed in to get budgets");
  const userId = user.id
  try{
    const expenses = await prisma.expense.findMany({ where: { userId }, select: { amount: true } });
    const totalSpent = expenses.reduce((acc, expense) => acc + expense.amount.toNumber(), 0);
    return totalSpent
  }catch(error){  
    throw error
  }
}

// Get montly spending
const getMonthlySpending = async () => {
  const user = await currentUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const spendings = await prisma.expense.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
    select: {
      amount: true,
      date: true,
      category: true,
      currency: true,
      id: true,
    },
  });

  const formattedSpendings = spendings.map((spending) => ({
    ...spending,
    amount: spending.amount.toNumber(),
  }));

  const result = await getDefaultCurrency();
  const baseCurrency = result?.baseCurrency;

  if (!baseCurrency) throw new Error("You must have a base currency");

  const monthlySpendings: { month: string; amount: number }[] = [];

  for (const spending of formattedSpendings) {
    const month = spending.date.toLocaleDateString("en-US", { month: "short" });
    const amount = spending.amount;
    const currency = spending.currency;

    const amountToAdd =
      currency === baseCurrency.code
        ? amount
        : await convertCurrency(amount, currency, baseCurrency.code);

    const existingMonth = monthlySpendings.find((m) => m.month === month);

    if (existingMonth) {
      existingMonth.amount += amountToAdd
    }else{
      monthlySpendings.push({ month, amount: amountToAdd })
    }
  }

  return monthlySpendings;
};

export {
  createExpense,
  deleteAnExpense,
  fetchExpensesByUser,
  updateExpenseAction,
  createExpenseAction,
  getMonthlySpending,
  getTotalSpent
};
