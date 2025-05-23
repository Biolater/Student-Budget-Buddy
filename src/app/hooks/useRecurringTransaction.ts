import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/app/components/TanstackProvider";
import { addToast } from "@heroui/react";
import { assertUser } from "../utils/auth.utils";
import { getLocalTimeZone } from "@internationalized/date";
import { CreateRecurringTransactionSchemaType } from "../schema/recurring-transactions.schema";

// These functions would need to be implemented in the actions folder
// Similar to how budget actions are implemented
import {
  createRecurringTransaction,
  deleteRecurringTransaction,
  getRecurringTransactions,
  updateRecurringTransaction,
} from "@/app/actions/recurring-transactions.actions";

const RECURRING_TRANSACTION_MUTATION_KEY = (userId: string) => [
  "recurringTransactions",
  userId,
];

const useRecurringTransaction = (userId: string | undefined | null) => {
  return {
    create: useMutation({
      mutationFn: (data: CreateRecurringTransactionSchemaType) =>
        createRecurringTransaction({
          ...data,
          nextDueDate: data.nextDueDate?.toDate(getLocalTimeZone()),
        }),
      mutationKey: userId
        ? RECURRING_TRANSACTION_MUTATION_KEY(userId)
        : ["recurringTransactions", "guest"],
      onMutate: async () => {
        assertUser(userId);
      },
      onError: (error) => {
        addToast({
          title: "Error",
          description: "Failed to create recurring transaction. Please try again.",
          color: "danger",
        });
        console.error("Recurring transaction creation error:", error);
      },
      onSuccess: () => {
        addToast({
          title: "Success",
          description: "Recurring transaction created successfully",
          color: "success",
        });
        if (userId) {
          queryClient.invalidateQueries({
            queryKey: RECURRING_TRANSACTION_MUTATION_KEY(userId),
          });
        }
      },
    }),
    query: useQuery({
      queryKey: RECURRING_TRANSACTION_MUTATION_KEY(userId ?? ""),
      queryFn: async () => {
        if (!userId) return [];
        const recurringTransactions = await getRecurringTransactions();
        return recurringTransactions ?? [];
      },
      enabled: !!userId,
      staleTime: 600000,
    }),
    update: useMutation({
      mutationFn: ({
        id,
        data,
      }: {
        id: string;
        data: Partial<CreateRecurringTransactionSchemaType>;
      }) =>
        updateRecurringTransaction(id, {
          ...data,
          nextDueDate: data.nextDueDate?.toDate(getLocalTimeZone()),
        }),
      mutationKey: ["updateRecurringTransaction", userId],
      onMutate: async () => {
        assertUser(userId);
      },
      onError: (error) => {
        addToast({
          title: "Error",
          description: "Failed to update recurring transaction. Please try again.",
          color: "danger",
        });
        console.error("Recurring transaction update error:", error);
      },
      onSuccess: () => {
        addToast({
          title: "Success",
          description: "Recurring transaction updated successfully",
          color: "success",
        });
        if (userId) {
          queryClient.invalidateQueries({
            queryKey: RECURRING_TRANSACTION_MUTATION_KEY(userId),
          });
        }
      },
    }),
    delete: useMutation({
      mutationFn: (recurringTransactionId: string) =>
        deleteRecurringTransaction(recurringTransactionId),
      mutationKey: ["deleteRecurringTransaction", userId],
      onMutate: async () => {
        assertUser(userId);
      },
      onError: (error) => {
        addToast({
          title: "Error",
          description: "Failed to delete recurring transaction. Please try again.",
          color: "danger",
        });
        console.error("Recurring transaction deletion error:", error);
      },
      onSuccess: () => {
        addToast({
          title: "Success",
          description: "Recurring transaction deleted successfully",
          color: "success",
        });
        if (userId) {
          queryClient.invalidateQueries({
            queryKey: RECURRING_TRANSACTION_MUTATION_KEY(userId),
          });
        }
      },
    }),
  };
};

export default useRecurringTransaction;
