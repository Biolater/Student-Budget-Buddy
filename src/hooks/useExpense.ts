import { useMutation, useQuery } from "@tanstack/react-query";
import {
  type TransformedExpense,
  type CreateExpenseData,
  createExpense,
  fetchExpensesByUser,
  deleteAnExpense,
  getTotalSpent,
  getMonthlySpending,
  updateExpenseAction,
} from "@/app/actions/expense.actions";
import { queryClient } from "@/app/components/TanstackProvider";
import toast from "react-hot-toast";

const useExpenses = (userId: string | undefined | null) => {
  // Use a fallback value for keys to avoid undefined/null.
  const keyUserId = userId ?? "no-user";

  return {
    query: useQuery({
      queryKey: ["expenses", keyUserId],
      queryFn: async () => {
        if (!userId) return []; // Default to an empty array.
        const expenses = await fetchExpensesByUser();
        return expenses ?? [];
      },
      enabled: !!userId,
      staleTime: 600000,
    }),
    create: useMutation({
      mutationFn: (data: CreateExpenseData) => createExpense(data),
      mutationKey: ["createExpense", keyUserId],
      onMutate: async () => {
        if (!userId) {
          throw new Error("You must be signed in to create an expense");
        }
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
      },
      onSuccess: () => {
        toast.success("Expense created successfully");
        queryClient.invalidateQueries({ queryKey: ["expenses", keyUserId] });
      },
    }),
    delete: useMutation({
      mutationFn: (expenseId: string) => deleteAnExpense(expenseId),
      mutationKey: ["deleteExpense", keyUserId],
      onMutate: async () => {
        if (!userId) {
          throw new Error("You must be signed in to delete an expense");
        }
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
      },
      onSuccess: () => {
        toast.success("Expense deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["expenses", keyUserId] });
      },
    }),
    update: useMutation({
      mutationFn: ({
        expenseId,
        data,
      }: {
        expenseId: string;
        data: CreateExpenseData;
      }) => updateExpenseAction(expenseId, data),
      mutationKey: ["updateExpense", keyUserId],
      onSuccess: () => {
        toast.success("Expense updated successfully");
        queryClient.invalidateQueries({ queryKey: ["expenses", keyUserId] });
      },
    }),
    totalSpentAmount: useQuery({
      queryKey: ["totalSpent", keyUserId],
      queryFn: async () => {
        if (!userId) return 0;
        const total = await getTotalSpent();
        return total ?? 0;
      },
      enabled: !!userId,
      staleTime: 600000,
    }),
    monthlySpendingQuery: useQuery({
      queryKey: ["monthlySpending", keyUserId],
      queryFn: async () => {
        if (!userId) return [];
        const data = await getMonthlySpending({ byCategory: false });
        return data ?? [];
      },
      enabled: !!userId,
      staleTime: 600000,
    }),
    spendingByCategory: useQuery({
      queryKey: ["spendingByCategory", keyUserId],
      queryFn: async () => {
        if (!userId) return [];
        const data = await getMonthlySpending({ byCategory: true });
        return data ?? [];
      },
      enabled: !!userId,
      staleTime: 600000,
    }),
  };
};

export default useExpenses;
