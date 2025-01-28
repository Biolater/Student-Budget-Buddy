"use server";
import { prisma } from "@/app/lib/client";
import { type NewBudgetSchema } from "@/app/components/Budget/AddNewBudget";
import { currentUser } from "@clerk/nextjs/server";

const createBudget = async (data: NewBudgetSchema) => {
  const { category, currency, amount, period } = data;
  const user = await currentUser();
  if (!user) return null;
  const userId = user.id;
  try {
    if (!category || !currency || !amount || !period) {
      throw new Error("Missing required fields");
    }
    const budget = await prisma.budget.create({
      data: {
        category,
        currency,
        amount,
        period,
        userId,
      },
    });

    return {
      ...budget,
      amount: budget.amount.toNumber(),
      expenses: [],
    };
  } catch (error) {
    throw error; // re-throw the error
  }
};

const deleteBudget = async (budgetId: string) => {
  const user = await currentUser();
  if (!user) throw new Error("You must be signed in to delete a budget");

  const userId = user.id;
  try {
    await prisma.budget.delete({ where: { id: budgetId, userId } });
  } catch (error) {
    throw error;
  }
};

const getBudgets = async () => {
  const user = await currentUser();
  if (!user) throw new Error("You must be signed in to get budgets");
  const userId = user.id; 

  try {
    const budgets = await prisma.budget.findMany({ where: { userId } });
    const formattedBudgets = await Promise.all(
      budgets.map(async (budget) => {
        const expenses = await prisma.expense.findMany({
          where: { category: budget.category, userId },
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

const getTotalBudgetAmount = async () => {
  const user = await currentUser();
  if(!user) throw new Error("You must be signed in to get budgets");
  const userId = user.id
  try{
    const budgets = await prisma.budget.findMany({ where: { userId }, select: { amount: true } });
    const totalBudgetAmount = budgets.reduce((acc, budget) => acc + budget.amount.toNumber(), 0);
    return totalBudgetAmount
  }catch(error){  
    throw error
  }
}


export { createBudget, getBudgets, deleteBudget, getTotalBudgetAmount };

