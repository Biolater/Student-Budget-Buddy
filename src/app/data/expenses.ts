import { prisma } from "@/app/lib/client";
import { requireUser } from "../utils/auth.utils";
import { ResponseHandler } from "../lib/ResponseHandler";
import { ExtendedExpense } from "../types/expense.types";
import ApiResponse from "../types/api-response.types";

export const fetchExpensesByUserId = async (
  userId: string
): Promise<ApiResponse<ExtendedExpense[]>> => {
  return ResponseHandler.execute<ExtendedExpense[]>(async () => {
    const user = await requireUser();
    if (!user || !user.userId) throw new Error("User not authenticated");
    if (user.userId !== userId) {
      throw new Error("Unauthorized access");
    }

    const expenses = await prisma.expense.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      include: {
        category: true,
        currency: true,
      },
    });

    return expenses.map((expense) => ({
      ...expense,
      amount: expense.amount.toNumber(),
    }));
  });
};
