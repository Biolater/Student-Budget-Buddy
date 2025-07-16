"use server";

import { prisma } from "@/app/lib/client";
import { getLocalTimeZone } from "@internationalized/date";
import {
  CreateRecurringTransactionSchemaType,
} from "@/app/schema/recurring-transactions.schema";
import { requireUser } from "@/app/utils/auth.utils";
import { fetchRecurringTransactions } from "../data/recurringTransactions";

type ServerRecurringTransactionData = Omit<
  CreateRecurringTransactionSchemaType,
  "nextDueDate" | "endDate"
> & {
  nextDueDate: Date;
  endDate?: Date;
};

interface CreateRecurringTransactionResponse {
  id: string;
  name: string;
  amount: number;
  frequency: string;
  nextDueDate: Date;
  endDate: Date;
  budgetCategory?: {
    name: string;
    icon: string;
  };
  currency: {
    code: string;
    symbol: string;
  };
  isActive: boolean;
  description?: string;
}

const createRecurringTransaction = async (
  data: ServerRecurringTransactionData
) => {
  const user = await requireUser();
  const { currencyId, budgetCategoryId } = data;

  // Create the recurring transaction in a transaction
  return prisma.$transaction(async (tx) => {
    // Validate currency exists
    const currencyExists = await tx.currency.findUnique({
      where: { id: currencyId },
    });
    if (!currencyExists) throw new Error("Invalid currency");

    // Validate budget category if provided
    if (budgetCategoryId) {
      const categoryExists = await tx.budgetCategory.findUnique({
        where: { id: budgetCategoryId },
      });
      if (!categoryExists) throw new Error("Invalid budget category");
    }

    // Create the recurring transaction
    const recurringTransaction = await tx.financialEvent.create({
      data: {
        userId: user.userId!,
        ...data,
      },
      include: {
        budgetCategory: true,
        currency: true,
      },
    });

    // Return the created recurring transaction
    return {
      ...recurringTransaction,
      amount: recurringTransaction.amount.toNumber(),
    };
  });
};

const updateRecurringTransaction = async (
  id: string,
  data: Partial<ServerRecurringTransactionData>
) => {
  const user = await requireUser();
  const userId = user.userId!;

  try {
    // Verify that the recurring transaction exists and belongs to the user
    const recurringTransaction = await prisma.financialEvent.findUnique({
      where: { id, userId },
    });
    
    if (!recurringTransaction) {
      throw new Error("Recurring transaction not found");
    }

    // If currency is being updated, verify it exists
    if (data.currencyId) {
      const currencyExists = await prisma.currency.findUnique({
        where: { id: data.currencyId },
      });
      if (!currencyExists) throw new Error("Invalid currency");
    }

    // If budget category is being updated, verify it exists
    if (data.budgetCategoryId) {
      const categoryExists = await prisma.budgetCategory.findUnique({
        where: { id: data.budgetCategoryId },
      });
      if (!categoryExists) throw new Error("Invalid budget category");
    }

    // Update the recurring transaction
    const updatedTransaction = await prisma.financialEvent.update({
      where: { id, userId },
      data,
      include: {
        budgetCategory: true,
        currency: true,
      },
    });

    return {
      ...updatedTransaction,
      amount: updatedTransaction.amount.toNumber(),
    };
  } catch (error) {
    throw error;
  }
};

const deleteRecurringTransaction = async (id: string) => {
  const user = await requireUser();
  const userId = user.userId!;

  try {
    // Verify that the recurring transaction exists and belongs to the user
    const recurringTransaction = await prisma.financialEvent.findUnique({
      where: { id, userId },
    });
    
    if (!recurringTransaction) {
      throw new Error("Recurring transaction not found");
    }

    // Delete the recurring transaction
    await prisma.financialEvent.delete({
      where: { id, userId },
    });

    return { success: true };
  } catch (error) {
    throw error;
  }
};

const getRecurringTransactions = async () => {
  return fetchRecurringTransactions();
};

export {
  createRecurringTransaction,
  type CreateRecurringTransactionResponse,
  updateRecurringTransaction,
  deleteRecurringTransaction,
  getRecurringTransactions,
};
