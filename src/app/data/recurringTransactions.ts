import { prisma } from "@/app/lib/client";
import { requireUser } from "../utils/auth.utils";

export const fetchRecurringTransactions = async () => {
  const user = await requireUser();
  const userId = user.userId!;

  const recurringTransactions = await prisma.financialEvent.findMany({
    where: { userId },
    include: {
      budgetCategory: true,
      currency: true,
    },
    orderBy: {
      nextDueDate: 'asc',
    },
  });

  return recurringTransactions.map((transaction) => ({
    ...transaction,
    amount: transaction.amount.toNumber(),
  }));
};
