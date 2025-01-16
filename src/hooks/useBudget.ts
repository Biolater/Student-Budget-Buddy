import { useQuery, useMutation } from "@tanstack/react-query";

import {
  createBudget,
  deleteBudget,
  getBudgets,
} from "@/app/actions/budget.actions";
import { queryClient } from "@/app/components/TanstackProvider";
import type {
  ClientBudget,
  NewBudgetSchema,
} from "@/app/(home)/budget/AddNewBudget";
import toast from "react-hot-toast";

const useBudget = (userId: string | undefined | null) => {
  return {
    query: useQuery({
      queryKey: ["budgets", userId],
      queryFn: () => getBudgets(),
      enabled: !!userId,
      staleTime: 600000,
      refetchOnWindowFocus: false,
      retry: 2,
    }),
    delete: useMutation({
      mutationFn: (budgetId: string) => deleteBudget(budgetId),
      mutationKey: ["deleteBudget", userId],
      onMutate: async (budgetId: string) => {
        await queryClient.cancelQueries({ queryKey: ["budgets", userId] });
        const previousBudgets = queryClient.getQueryData<ClientBudget[]>([
          "budgets",
          userId,
        ]);

        queryClient.setQueryData<ClientBudget[]>(["budgets", userId], (old) =>
          old ? old.filter((budget) => budget.id !== budgetId) : []
        );

        toast.success("Budget deleted successfully");

        return { previousBudgets };
      },
      onError: (error, _, context) => {
        queryClient.setQueryData(["budgets", userId], context?.previousBudgets);
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["budgets", userId] });
      },
    }),
    create: useMutation({
      mutationFn: (data: NewBudgetSchema) => createBudget(data),
      mutationKey: ["createBudget", userId],
      onMutate: async (newBudget) => {
        await queryClient.cancelQueries({ queryKey: ["budgets", userId] });
        if (!userId)
          throw new Error("You must be signed in to create a budget");

        const previousBudgets = queryClient.getQueryData<ClientBudget[]>([
          "budgets",
          userId,
        ]);

        queryClient.setQueryData<ClientBudget[]>(["budgets", userId], (old) => {
          const newBudgetWithDefaults = {
            ...newBudget,
            id: "temp-id",
            userId,
            createdAt: new Date(),
            updatedAt: new Date(),
            expenses: [],
            amount: Number(newBudget.amount),
          };
        
          return old ? [...old, newBudgetWithDefaults] : [newBudgetWithDefaults];
        });
        toast.success("Budget created successfully");

        return { previousBudgets };
      },
      onError: (error, _, ctx) => {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
        queryClient.setQueryData(["budgets", userId], ctx?.previousBudgets);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["budgets", userId] });
      },
    }),
  };
};

export default useBudget;
