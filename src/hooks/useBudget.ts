import { useQuery, useMutation } from "@tanstack/react-query";

import {
  createBudget,
  deleteBudget,
  getBudgets,
} from "@/actions/budget.actions";
import { queryClient } from "@/app/components/TanstackProvider";
import type {
  ClientBudget,
  NewBudgetSchema,
} from "@/app/(home)/budget/AddNewBudget";

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

        return { previousBudgets };
      },
      onError: (error, _, context) => {
        queryClient.setQueryData(["budgets", userId], context?.previousBudgets);
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

        const previousBudgets = queryClient.getQueryData<ClientBudget[]>([
          "budgets",
          userId,
        ]);

        queryClient.setQueryData<ClientBudget[]>(["budgets", userId], (old) =>
          old
            ? [
                ...old,
                {
                  ...newBudget,
                  id: "temp-id",
                  userId: userId!,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  expenses: [],
                  amount: Number(newBudget.amount),
                },
              ]
            : [
                {
                  ...newBudget,
                  id: "temp-id",
                  userId: userId!,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  expenses: [],
                  amount: Number(newBudget.amount),
                },
              ]
        );

        return { previousBudgets };
      },
      onError: (error, newBudget, ctx) => {
        queryClient.setQueryData(["budgets", userId], ctx?.previousBudgets);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["budgets", userId] });
      },
    }),
  };
};

export default useBudget;
