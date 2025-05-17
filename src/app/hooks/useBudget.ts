import { useQuery, useMutation } from "@tanstack/react-query";
import {
  createBudget,
  deleteBudget,
  getBudgetInsights as getBudgetInsightsAction,
  getBudgets,
  getBudgetStats,
  /*     deleteBudget,
        getBudgets,
        getTotalBudgetAmount, */
} from "@/app/actions/budget.actions";
import { queryClient } from "@/app/components/TanstackProvider";
import toast from "react-hot-toast";
import { CreateBudgetFormSchemaType } from "../schema/budget.schema";
import { assertUser } from "../utils/auth.utils";
import { type BudgetErrorType } from "@/app/types/errors";
import { getLocalTimeZone } from "@internationalized/date";
import { BudgetInsights } from "../types/budget.types";
import { addToast } from "@heroui/react";

// Create a separate custom hook for budget insights
export const useBudgetInsights = (
  budgetId: string,
  userId: string | undefined | null
) => {
  return useQuery<BudgetInsights | undefined, Error>({
    queryKey: ["budgetInsights", budgetId],
    retry: false,
    queryFn: async () => {
      const budgetInsights = await getBudgetInsightsAction(budgetId);
      return budgetInsights ?? undefined;
    },
    enabled: !!budgetId && !!userId,
    staleTime: 600000,
  });
};

const BUDGET_MUTATION_KEY = (userId: string) => ["budgets", userId];

const useBudget = (userId: string | undefined | null) => {
  return {
    create: useMutation({
      mutationFn: (data: CreateBudgetFormSchemaType) =>
        createBudget({
          ...data,
          startDate: data.startDate?.toDate(getLocalTimeZone()),
          endDate: data.endDate?.toDate(getLocalTimeZone()),
        }),
      mutationKey: userId ? BUDGET_MUTATION_KEY(userId) : ["budgets", "guest"],
      onMutate: async () => {
        assertUser(userId);
      },
      onError: (error) => {
        const budgetError = error as BudgetErrorType;
        if (budgetError.name === "BudgetValidationError") {
          addToast({
            title: "Budget Validation Error",
            description: budgetError.message,
            color: "danger",
          });
        } else {
          addToast({
            title: "Error",
            description: "Failed to create budget. Please try again.",
            color: "danger",
          });
        }
      },
      onSuccess: () => {
        addToast({
          title: "Success",
          description: "Budget created successfully",
          color: "success",
        });
        if (userId) {
          queryClient.invalidateQueries({
            queryKey: BUDGET_MUTATION_KEY(userId),
          });
        }
      },
    }),
    query: useQuery({
      queryKey: BUDGET_MUTATION_KEY(userId ?? ""),
      queryFn: async () => {
        if (!userId) return [];
        const budgets = await getBudgets();
        return budgets ?? [];
      },
      enabled: !!userId,
      staleTime: 600000,
    }),
    budgetStats: useQuery({
      queryKey: ["budgetStats", userId],
      queryFn: async () => {
        if (!userId) return [];
        const budgetStats = await getBudgetStats();
        return budgetStats ?? [];
      },
      enabled: !!userId,
      staleTime: 600000,
    }),
    deleteBudget: useMutation({
      mutationFn: (budgetId: string) => deleteBudget(budgetId),
      mutationKey: ["deleteBudget", userId],
      onMutate: async () => {
        assertUser(userId);
      },
      onError: (error) => {
        addToast({
          title: "Error",
          description: "Failed to delete budget. Please try again.",
          color: "danger",
        });
      },
      onSuccess: () => {
        addToast({
          title: "Success",
          description: "Budget deleted successfully",
          color: "success",
        });
        if (userId) {
          queryClient.invalidateQueries({
            queryKey: BUDGET_MUTATION_KEY(userId),
          });
        }
      },
    }),
  };
};

export default useBudget;
