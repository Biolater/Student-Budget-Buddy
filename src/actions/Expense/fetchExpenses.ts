"use server";
import { prisma } from "@/lib/client";
import { type Expense } from "@prisma/client";

const fetchExpensesByUser = async (userId: string) => {
  try {
    const expenses: Expense[] = await prisma.expense.findMany({
      where: {
        userId,
      },
      orderBy: {
        date: "desc",
      },
    });
    return expenses.map((expense) => ({
      ...expense,
      amount: expense.amount.toNumber(),
    }));
  } catch (error) {
    throw Error;
  }
};

export default fetchExpensesByUser;
