import { fetchExpenseCategoriesForSelect } from "@/app/actions/category.actions";
import { useQuery } from "@tanstack/react-query";

export const useCategory = () => {
  return {
    expenseCategoriesQuery: useQuery({
      queryKey: ["expenseCategories"],
      queryFn: fetchExpenseCategoriesForSelect,
    }),
  };
};
