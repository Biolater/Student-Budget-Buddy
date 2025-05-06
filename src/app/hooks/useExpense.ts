import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/app/components/TanstackProvider";
import toast from "react-hot-toast";
import { createExpense, deleteExpense, fetchExpensesByUserId, updateExpense } from "@/app/actions/expense.actions";
import { ExpenseFormSchemaType } from "@/app/schema/expense.schema";
import { addToast } from "@heroui/react";
import { getLocalTimeZone } from "@internationalized/date";
import { assertUser } from "../utils/auth.utils";

// Generate a dynamic query key based on userId.
const EXPENSE_QUERY_KEY = (userId: string) => ["expenses", userId];

const useExpense = (userId: string | undefined | null) => {
  // Helper function to ensure the user is authenticated.

  return {
    create: useMutation({
      mutationFn: (data: ExpenseFormSchemaType) =>
        createExpense({
          ...data,
          date: data.date.toDate(getLocalTimeZone()),
        }),
      // Use a dynamic query key for better cache management.
      mutationKey: userId ? EXPENSE_QUERY_KEY(userId) : ["expenses", "guest"],
      onMutate: async () => {
        assertUser(userId);
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : "Something went wrong");
      },
      onSuccess: () => {
        toast.success("Expense created successfully");
        if (userId) {
          queryClient.invalidateQueries({ queryKey: EXPENSE_QUERY_KEY(userId) });
        }
      },
    }),
    fetchExpenses: useQuery({
      queryKey: userId ? EXPENSE_QUERY_KEY(userId) : ["expenses", "guest"],
      queryFn: async () => {
        if (!userId) return []; // Default to an empty array.
        const expenses = await fetchExpensesByUserId(userId);
        return expenses ?? [];
      },
      enabled: !!userId,
      staleTime: 600000, // 10 minutes.
    }),
    delete: useMutation({
      mutationFn: (expenseId: string) => deleteExpense(expenseId),
      mutationKey: userId ? EXPENSE_QUERY_KEY(userId) : ["expenses", "guest"],
      onMutate: async () => {
        assertUser(userId);
        // You might add an optimistic update here.
      },
      onError: (error) => {
        addToast({
          title: "Error",
          description: error instanceof Error ? error.message : "Something went wrong",
          color: "danger",
        });
      },
      onSuccess: () => {
        addToast({
          title: "Success",
          description: "Expense deleted successfully",
          color: "success",
        });
        if (userId) {
          queryClient.invalidateQueries({ queryKey: EXPENSE_QUERY_KEY(userId) });
        }
      },
    }),
    update: useMutation({
      mutationFn: ({
        expenseId,
        data,
      }: {
        expenseId: string;
        data: ExpenseFormSchemaType;
      }) =>
        updateExpense(expenseId, {
          ...data,
          date: data.date.toDate(getLocalTimeZone()),
        }),
      mutationKey: userId ? EXPENSE_QUERY_KEY(userId) : ["expenses", "guest"],
      onMutate: async () => {
        assertUser(userId);
      },
      onSuccess: () => {
        toast.success("Expense updated successfully");
        if (userId) {
          queryClient.invalidateQueries({ queryKey: EXPENSE_QUERY_KEY(userId) });
        }
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : "Something went wrong");
      },
    }),
  };
};

export default useExpense;
