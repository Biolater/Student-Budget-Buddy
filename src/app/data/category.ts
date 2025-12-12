import { prisma } from "@/app/lib/client";

export async function fetchExpenseCategories() {
  return prisma.expenseCategory.findMany({
    cacheStrategy: {
      ttl: 60 * 60 * 1000,
      swr: 60 * 60 * 1000,
    },
    select: {
      id: true,
      name: true,
      icon: true,
    },
  });
}

export async function fetchBudgetCategories() {
  return prisma.budgetCategory.findMany({
    cacheStrategy: {
      ttl: 60 * 60 * 1000,
      swr: 60 * 60 * 1000,
    },
    select: {
      id: true,
      name: true,
      icon: true,
      type: true,
    },
  });
}
