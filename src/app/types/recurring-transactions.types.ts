import { Prisma } from "@prisma/client";

// 1) This is the “raw” type coming back from Prisma:
export type FinancialEventWithRelations = Prisma.FinancialEventGetPayload<{
  include: {
    currency: true
    budgetCategory: true
  }
}>;

// 2) Override just the `amount: Decimal` → `amount: number` for your client code:
export type FinancialEventClient = Omit<FinancialEventWithRelations, "amount"> & {
  amount: number
}
