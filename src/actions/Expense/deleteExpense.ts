"use server";
import { prisma } from "@/lib/client";


const deleteAnExpense = async (expenseId: string) => {
  try {
    const deletedExpense = await prisma.expense.delete({
      where: { id: expenseId },
    });
    return { ...deletedExpense, amount: deletedExpense.amount.toNumber() };
  } catch (error) {
    throw error;
  }
};

export default deleteAnExpense;
