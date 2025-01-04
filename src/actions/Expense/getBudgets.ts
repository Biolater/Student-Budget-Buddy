"use server";
import { prisma } from "@/lib/client";
import { currentUser } from "@clerk/nextjs/server";

const budgetCache: { [key: string]: { data: any; expiry: number } } = {};

// Periodic cleanup of stale cache entries
setInterval(() => {
  const now = Date.now();
  for (const key in budgetCache) {
    if (budgetCache[key].expiry < now) {
      delete budgetCache[key];
    }
  }
}, 60000); // Cleanup every 1 minute

const getBudgets = async () => {
  const user = await currentUser();
  if (!user) throw new Error("You must be signed in to get budgets");

  const userId = user.id;
  const cacheKey = `user:${userId}:budgets`;

  const cacheExpiry = 5 * 60 * 1000; // Cache for 5 minutes
  const now = Date.now();

  if (budgetCache[cacheKey] && budgetCache[cacheKey].expiry > now) {
    return budgetCache[cacheKey].data;
  }

  try {
    const budgets = await prisma.budget.findMany({ where: { userId } });
    const formattedBudgets = budgets.map((budget) => ({
      ...budget,
      amount: budget.amount.toNumber(),
    }));
    budgetCache[cacheKey] = {
      data: formattedBudgets,
      expiry: now + cacheExpiry,
    };
    return formattedBudgets;
  } catch (error) {
    console.error("Error fetching budgets:", error);
    throw new Error("Failed to fetch budgets. Please try again later.");
  }
};

export default getBudgets;
