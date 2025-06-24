"use server";

import { unstable_cache } from "next/cache";
import { prisma } from "@/app/lib/client";
import { requireUser } from "../utils/auth.utils";
import { ResponseHandler } from "../lib/ResponseHandler";
import { ExtendedExpense } from "../types/expense.types";
import { Prisma } from "@prisma/client";

// Type for paginated expenses response
export type PaginatedExpensesResponse = {
  expenses: ExtendedExpense[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasMore: boolean;
};

// Internal cached function for paginated expenses
const _fetchExpensesPaginatedCached = unstable_cache(
  async (userId: string, page: number, limit: number, searchQuery?: string) => {
    return ResponseHandler.execute<PaginatedExpensesResponse>(async () => {
      const offset = (page - 1) * limit;
      
      // Build where clause for search
      const whereClause: Prisma.ExpenseWhereInput = { userId };
      if (searchQuery && searchQuery.trim()) {
        whereClause.OR = [
          {
            description: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            category: {
              name: {
                contains: searchQuery,
                mode: 'insensitive',
              },
            },
          },
        ];
      }

      // Get total count for pagination
      const totalCount = await prisma.expense.count({
        where: whereClause,
      });

      // Get paginated expenses
      const expenses = await prisma.expense.findMany({
        where: whereClause,
        orderBy: { date: "desc" },
        include: {
          category: true,
          currency: true,
        },
        skip: offset,
        take: limit,
      });

      const totalPages = Math.ceil(totalCount / limit);

      return {
        expenses: expenses.map((expense) => ({
          ...expense,
          amount: expense.amount.toNumber(),
        })),
        totalCount,
        totalPages,
        currentPage: page,
        hasMore: page < totalPages,
      };
    });
  },
  ["expenses-paginated"],
  {
    revalidate: 60, // Cache for 1 minute (expenses change frequently)
    tags: ["expenses", "user-data"],
  }
);

// Public function for paginated expenses
export const fetchExpensesPaginated = async (
  page: number = 1,
  limit: number = 10,
  searchQuery?: string
) => {
  const user = await requireUser();
  if (!user || !user.userId) throw new Error("User not authenticated");
  
  return await _fetchExpensesPaginatedCached(user.userId, page, limit, searchQuery);
};

// Keep the old function for backward compatibility but make it fetch only first page
export const fetchExpenses = async () => {
  const user = await requireUser();
  if (!user || !user.userId) throw new Error("User not authenticated");
  
  // Fetch only first 50 expenses to avoid cache limit
  const result = await _fetchExpensesPaginatedCached(user.userId, 1, 50);
  return { data: result.data?.expenses || [], success: result.success, error: result.error };
};
