"use server";
import { prisma } from "@/lib/client";
import { currentUser } from "@clerk/nextjs/server";

const getBudgets = async () => {
  const user = await currentUser();
  if (!user) throw new Error("You must be signed in to get budgets");

  const userId = user.id;
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
    return formattedBudgets;
  } catch (error) {
    console.error("Error fetching budgets:", error);
    throw new Error("Failed to fetch budgets. Please try again later.");
  }
};

export default getBudgets;
