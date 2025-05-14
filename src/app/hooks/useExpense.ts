import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/app/components/TanstackProvider";
import {
  createExpense,
  deleteExpense,
  fetchExpensesByUserId,
  updateExpense,
} from "@/app/actions/expense.actions";
import { ExpenseFormSchemaType } from "@/app/schema/expense.schema";
import { addToast } from "@heroui/react";
import { getLocalTimeZone } from "@internationalized/date";

// Generate a dynamic query key based on userId.
const EXPENSE_QUERY_KEY = (userId: string) => ["expenses", userId];

/**
 * Custom hook for expense operations with proper error handling
 */
// Wrap the server action with client-side error handling
const createExpenseWithErrorHandling = async (data: ExpenseFormSchemaType) => {
  try {
    const result = await createExpense({
      ...data,
      date: data.date.toDate(getLocalTimeZone()),
    });
    return { success: true, data: result };
  } catch (error) {
    // Convert the error to a plain object for serialization
    let errorMessage = "Unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null) {
      const errorObj = error as { message?: string };
      if (errorObj.message) {
        errorMessage = String(errorObj.message);
      }
    }
    
    // Return structured error
    return { 
      success: false, 
      error: errorMessage 
    };
  }
};

const useExpense = (userId: string | undefined | null) => {
  return {
    create: useMutation({
      mutationFn: async (data: ExpenseFormSchemaType) => {
        const result = await createExpenseWithErrorHandling(data);
        
        if (!result.success) {
          // Explicitly throw client-side error with message
          throw new Error(result.error);
        }
        
        return result.data;
      },
      mutationKey: userId ? EXPENSE_QUERY_KEY(userId) : ["expenses", "guest"],
      onSuccess: () => {
        addToast({
          title: "Success",
          description: "Expense created successfully",
          color: "success",
        });
        if (userId) {
          queryClient.invalidateQueries({
            queryKey: EXPENSE_QUERY_KEY(userId),
          });
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
    }),
  };
};

export default useExpense;
