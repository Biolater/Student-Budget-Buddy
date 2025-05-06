import { ExpenseCategory } from "@prisma/client";

type ExpenseCategoryRef = Omit<ExpenseCategory, "createdAt" | "updatedAt" | "description">;

export type { ExpenseCategoryRef };