import { useQuery } from "@tanstack/react-query";
import { convertToBudgetCurrency } from "@/app/utils/budget.utils";
import { getBudgetStatus } from "@/app/utils/budget.utils";
import { ExtendedBudget } from "@/app/types/budget.types";

/**
 * Hook to calculate total expenses (in budget currency) and status for a budget.
 * Handles async currency conversion and exposes loading/error state.
 */
export function useBudgetStats(budget: ExtendedBudget | null | undefined) {
  return useQuery({
    queryKey: ["budget-stats", budget?.id, budget?.updatedAt],
    enabled: !!budget,
    queryFn: async () => {
      if (!budget) return null;
      let total = 0;
      // Convert each expense to budget currency if needed
      for (const expense of budget.expenses) {
        if (expense.currency.code !== budget.currency.code) {
          const convertedAmount = await convertToBudgetCurrency(
            expense.amount,
            expense.currency.code,
            budget.currency.code
          );
          total += convertedAmount;
        } else {
          total += expense.amount;
        }
      }
      const status = getBudgetStatus(budget.amount, total);
      return {
        expensesTotal: total,
        budgetStatus: status,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}
