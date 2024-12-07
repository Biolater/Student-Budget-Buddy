"use server";
import { prisma } from "@/lib/client";

type updatedExpense = {
  date: Date;
  amount: number;
  currency: string;
  category: string;
  description: string;
};

const updateExpenseAction = async (expenseId: string, data: updatedExpense) => {
  try {
    const updatedExpense = await prisma.expense.update({
      where: { id: expenseId },
      data,
    });
    return { ...updatedExpense, amount: updatedExpense.amount.toNumber() };
  } catch (error) {
    throw error;
  }
};

export default updateExpenseAction;
