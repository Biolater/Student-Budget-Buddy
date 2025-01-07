// hooks/useExpenses.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Category,
  createExpense,
  deleteAnExpense,
  fetchExpensesByUser,
} from "@/actions/expense.actions";
import { queryClient } from "@/app/components/TanstackProvider";

// Custom hook for fetching expenses
const useExpenses = (userId: string | undefined | null) => {
  return {
    query: useQuery({
      queryKey: ["expenses", userId],
      queryFn: () => fetchExpensesByUser(),
      enabled: !!userId,
      staleTime: 600000,
      refetchOnWindowFocus: false,
      retry: 2,
    }),
    create: useMutation({
      mutationKey: ["createExpense", userId],
      mutationFn: (expense: {
        date: Date;
        amount: number;
        currency: string;
        category: Category;
        description: string;
      }) =>
        createExpense(
          expense.date,
          expense.amount,
          expense.currency,
          expense.category,
          expense.description
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["expenses"] });
      },
    }),
    delete: useMutation({
      mutationKey: ["deleteExpense", userId],
      mutationFn: (expenseId: string) => deleteAnExpense(expenseId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["expenses"] });
      },
    }),
  };
};

export default useExpenses;
