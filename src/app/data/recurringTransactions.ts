// src/app/lib/recurring.ts
import { prisma } from "@/app/lib/client"
import { requireUser } from "@/app/utils/auth.utils"
import { unstable_cache } from "next/cache"
import type { FinancialEventClient } from "@/app/types/recurring-transactions.types"
import { ResponseHandler } from "../lib/ResponseHandler"
import ApiResponse from "../types/api-response.types"

export const fetchRecurringTransactions = unstable_cache(
  async (): Promise<ApiResponse<FinancialEventClient[]>> => {
    return ResponseHandler.execute(async () => {
      const { userId } = await requireUser()
      if (!userId) {
        throw new Error("Not authenticated")
      }
      const rows = await prisma.financialEvent.findMany({
        where: { userId },
        include: { currency: true, budgetCategory: true },
        orderBy: { createdAt: "desc" },
      })
      return rows.map((tx) => ({
        ...tx,
        amount: tx.amount.toNumber(),
      }))
    })
  },
  undefined,
  {
    revalidate: 60,
    tags: ["recurring-transactions"],
  }
)
