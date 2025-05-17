import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/app/components/TanstackProvider";
import {
  createExpense,
  deleteExpense,
  fetchExpensesByUserId,
  updateExpense,
  CreatedExpense,
} from "@/app/actions/expense.actions";
import { ExpenseFormSchemaType } from "@/app/schema/expense.schema";
import { addToast } from "@heroui/react";
import { getLocalTimeZone } from "@internationalized/date";
import ApiResponse from "@/app/types/api-response.types";
import { ExtendedExpense } from "../types/expense.types";
import { Expense } from "@prisma/client";

// Generate a dynamic query key based on userId.
const EXPENSE_QUERY_KEY = (userId: string) => ["expenses", userId];

const useExpense = (userId: string | undefined | null) => {
  return {
    create: useMutation<CreatedExpense, Error, ExpenseFormSchemaType>({
      mutationFn: async (data: ExpenseFormSchemaType) => {
        const response = await createExpense({
          ...data,
          date: data.date.toDate(getLocalTimeZone()),
        });

        if (!response.success) {
          throw new Error(
            response.error?.message || "Failed to create expense"
          );
        }

        return response.data!;
      },
      mutationKey: userId ? EXPENSE_QUERY_KEY(userId) : ["expenses", "guest"],
      onSuccess: () => {
        if (userId) {
          addToast({
            title: "Success",
            description: "Expense created successfully",
            color: "success",
          });
          queryClient.invalidateQueries({
            queryKey: EXPENSE_QUERY_KEY(userId),
          });
        }
      },
      onError: (error: Error) => {
        addToast({
          title: "Error",
          description: error.message || "Failed to create expense",
          color: "danger",
        });
      },
    }),
    fetchExpenses: useQuery<ExtendedExpense[]>({
      queryKey: userId ? EXPENSE_QUERY_KEY(userId) : ["expenses", "guest"],
      queryFn: async () => {
        if (!userId) return [] as ExtendedExpense[];
        const response = await fetchExpensesByUserId(userId);
        if (!response.success) {
          throw new Error(
            response.error?.message || "Failed to fetch expenses"
          );
        }
        return response.data!;
      },
      enabled: !!userId,
      staleTime: 600000, // 10 minutes.
    }),
    delete: useMutation<null, Error, string>({
      mutationFn: async (expenseId: string) => {
        const response = await deleteExpense(expenseId);
        if (!response.success) {
          throw new Error(
            response.error?.message || "Failed to delete expense"
          );
        }
        return null;
      },
      mutationKey: userId ? EXPENSE_QUERY_KEY(userId) : ["expenses", "guest"],
      onSuccess: () => {
        addToast({
          title: "Success",
          description: "Expense deleted successfully",
          color: "success",
        });
        if (userId) {
          queryClient.invalidateQueries({
            queryKey: EXPENSE_QUERY_KEY(userId),
          });
        }
      },
      onError: (error: Error) => {
        addToast({
          title: "Error",
          description: error.message || "Failed to delete expense",
          color: "danger",
        });
      },
    }),
    update: useMutation<
      CreatedExpense,
      Error,
      {
        expenseId: string;
        data: ExpenseFormSchemaType;
      }
    >({
      mutationFn: async ({ expenseId, data }) => {
        const response = await updateExpense(expenseId, {
          ...data,
          date: data.date.toDate(getLocalTimeZone()),
        });

        if (!response.success) {
          throw new Error(
            response.error?.message || "Failed to update expense"
          );
        }

        return response.data!;
      },
      mutationKey: userId ? EXPENSE_QUERY_KEY(userId) : ["expenses", "guest"],
      onSuccess: () => {
        addToast({
          title: "Success",
          description: "Expense updated successfully",
          color: "success",
        });
        if (userId) {
          queryClient.invalidateQueries({
            queryKey: EXPENSE_QUERY_KEY(userId),
          });
        }
      },
      onError: (error: Error) => {
        addToast({
          title: "Error",
          description: error.message || "Failed to update expense",
          color: "danger",
        });
      },
    }),
  };
};

export default useExpense;
