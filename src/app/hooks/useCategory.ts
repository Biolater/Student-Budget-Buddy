import { fetchBudgetCategoriesForSelect, fetchExpenseCategoriesForSelect } from "@/app/actions/category.actions";
import { useQuery } from "@tanstack/react-query";

export const useCategory = () => {
  return {
    expenseCategoriesQuery: useQuery({
      queryKey: ["expenseCategories"],
      queryFn: fetchExpenseCategoriesForSelect,
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 60 * 60 * 1000, // 1 hour
    }),
    budgetCategoriesQuery: useQuery({
      queryKey: ["budgetCategories"],
      queryFn: fetchBudgetCategoriesForSelect,
/*       staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 60 * 60 * 1000, // 1 hour */
    })
  };
};