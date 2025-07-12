"use server";

import { prisma } from "@/app/lib/client";
import {
  ServerExpenseData,
  ServerExpenseSchema,
} from "@/app/schema/expense.schema";
import { requireUser } from "../utils/auth.utils";
import { ResponseHandler } from "../lib/ResponseHandler";
import ApiResponse from "../types/api-response.types";
import { Expense, ExpenseCategory, Currency } from "@prisma/client";
import { ExtendedExpense } from "../types/expense.types";
import { revalidateTag } from "next/cache";

// Define a type for expense data returned from the create operation
type CreatedExpense = Omit<Expense, "amount"> & { amount: number };

// Export the type for reuse in other files
export type { CreatedExpense };


const createExpense = async (
  data: ServerExpenseData
): Promise<ApiResponse<CreatedExpense>> => {
  return ResponseHandler.execute<CreatedExpense>(async () => {
    const user = await requireUser();
    if (!user || !user.userId) throw new Error("User not authenticated");
    const validatedData = ServerExpenseSchema.parse(data);
    const { date, amount, currency, category, description } = validatedData;

    if (amount <= 0) throw Error("Amount must be positive");
    if (date > new Date())
      throw Error("Cannot create expenses for future dates");

    const budgetCategory = await prisma.budgetCategory.findUnique({
      where: { id: category },
    });
    if (!budgetCategory) throw Error("Invalid budget category");

    const budgetCurrency = await prisma.currency.findUnique({
      where: { id: currency },
    });
    if (!budgetCurrency) throw Error("Invalid currency");

    // Use transaction for consistency
    return await prisma.$transaction(async (tx) => {
      // Find matching budget
      const matchingBudget = await tx.budget.findFirst({
        where: {
          budgetCategoryId: category,
          userId: user.userId,
          startDate: { lte: date },
          endDate: { gte: date },
        },
      });

      // Check for duplicate
      const potentialDuplicate = await tx.expense.findFirst({
        where: {
          userId: user.userId,
          date: { equals: date },
          amount: { equals: amount },
          expenseCategoryId: category,
          createdAt: { gte: new Date(Date.now() - 5 * 60 * 1000) },
        },
      });

      if (potentialDuplicate) throw Error("Similar expense recently created");

      // Create expense
      const expense = await tx.expense.create({
        data: {
          date,
          amount,
          expenseCategoryId: category,
          description,
          currencyId: currency,
          userId: user.userId,
          ...(matchingBudget ? { budgetId: matchingBudget.id } : {}),
        },
      });

      revalidateTag("expenses")
      revalidateTag("dashboard")
      return { ...expense, amount: expense.amount.toNumber() };
    });
  });
};

const deleteExpense = async (expenseId: string): Promise<ApiResponse<null>> => {
  return ResponseHandler.execute<null>(async () => {
    const user = await requireUser();
    if (!user) throw new Error("User not authenticated");

    // Safety check - only delete expense that belongs to the user
    const expense = await prisma.expense.findUnique({
      where: { id: expenseId },
    });

    if (!expense) throw new Error("Expense not found");
    if (expense.userId !== user.userId)
      throw new Error("Not authorized to delete this expense");

    await prisma.expense.delete({
      where: { id: expenseId },
    });

    revalidateTag("expenses")
    revalidateTag("dashboard")

    return null;
  });
};

const updateExpense = async (
  expenseId: string,
  data: ServerExpenseData
): Promise<ApiResponse<CreatedExpense>> => {
  return ResponseHandler.execute<CreatedExpense>(async () => {
    const user = await requireUser();
    const validatedData = ServerExpenseSchema.parse(data);
    const { date, amount, currency, category, description } = validatedData;

    // Verify that the expense exists and belongs to the user.
    const expense = await prisma.expense.findUnique({
      where: { id: expenseId },
    });
    if (!expense) {
      throw Error("Expense not found");
    }
    if (expense.userId !== user.userId) {
      throw Error("You are not authorized to update this expense");
    }

    const updatedExpense = await prisma.expense.update({
      where: { id: expenseId },
      data: {
        date,
        amount,
        expenseCategoryId: category,
        description,
        currencyId: currency,
      },
    });

    revalidateTag("expenses")
    revalidateTag("dashboard")

    return { ...updatedExpense, amount: updatedExpense.amount.toNumber() };
  });
};

export { createExpense, deleteExpense, updateExpense };
