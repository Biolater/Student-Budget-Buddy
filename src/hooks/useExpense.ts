// hooks/useExpenses.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  type TransformedExpense,
  type CreateExpenseData,
  createExpense,
  fetchExpensesByUser,
  deleteAnExpense,
} from "@/app/actions/expense.actions";
import { queryClient } from "@/app/components/TanstackProvider";
import toast from "react-hot-toast";

// Custom hook for fetching expenses
const useExpenses = (userId: string | undefined | null) => {
  return {
    query: useQuery({
      queryKey: ["expenses", userId],
      queryFn: () => fetchExpensesByUser(),
      enabled: !!userId,
      staleTime: 600000,
    }),
    create: useMutation({
      mutationFn: (data: CreateExpenseData) => createExpense(data),
      mutationKey: ["createExpense", userId],
      onMutate: async (newExpense) => {
        if (!userId)
          throw new Error("You must be signed in to create a budget");
        await queryClient.cancelQueries({ queryKey: ["expenses", userId] });
        const previousExpenses = queryClient.getQueryData<TransformedExpense[]>(
          ["expenses", userId]
        );
        queryClient.setQueryData<TransformedExpense[]>(
          ["expenses", userId],
          (old) => {
            const newExpenseWithDefaults = {
              ...newExpense,
              id: Date.now().toString(),
              userId,
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            return old
              ? [...old, newExpenseWithDefaults]
              : [newExpenseWithDefaults];
          }
        );
        toast.success("Expense created successfully");
        return { previousExpenses };
      },
      onError: (error, _, ctx) => {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
        queryClient.setQueryData(["budgets", userId], ctx?.previousExpenses);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["expenses", userId] });
      },
    }),
    delete: useMutation({
      mutationFn: (expenseId: string) => deleteAnExpense(expenseId),
      mutationKey: ["deleteExpense", userId],
      onMutate: async (expenseId: string) => {
        if (!userId)
          throw new Error("You must be signed in to create a budget");
        queryClient.invalidateQueries({ queryKey: ["expeneses", userId] });
        const previousExpenses = queryClient.getQueryData<TransformedExpense[]>(
          ["expenses", userId]
        );
        queryClient.setQueryData<TransformedExpense[]>(
          ["expenses", userId],
          (old) =>
            old ? old.filter((expense) => expense.id !== expenseId) : []
        );
        toast.success("Expense deleted successfully");

        return { previousExpenses };
      },
      onError: (error, _, ctx) => {
        queryClient.setQueryData(["expenses", userId], ctx?.previousExpenses);
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["expenses", userId] });
      },
    }),
  };
};

export default useExpenses;
