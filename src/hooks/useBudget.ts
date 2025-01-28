import { useQuery, useMutation } from "@tanstack/react-query";
import {
  createBudget,
  deleteBudget,
  getBudgets,
  getTotalBudgetAmount,
} from "@/app/actions/budget.actions";
import { queryClient } from "@/app/components/TanstackProvider";
import type {
  ClientBudget,
  NewBudgetSchema,
} from "@/app/components/Budget/AddNewBudget";
import toast from "react-hot-toast";

const useBudget = (userId: string | undefined | null) => {
  const query = useQuery({
    queryKey: ["budgets", userId],
    queryFn: () => (userId ? getBudgets() : null),
    enabled: !!userId,
    staleTime: 600000,
  });

  const deleteMutation = useMutation({
    mutationFn: (budgetId: string) => deleteBudget(budgetId),
    mutationKey: ["deleteBudget", userId],
    onMutate: async (budgetId: string) => {
      if (!userId) throw new Error("You must be signed in to delete a budget");
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
  });

  const createMutation = useMutation({
    mutationFn: (data: NewBudgetSchema) => createBudget(data),
    mutationKey: ["createBudget", userId],
    onMutate: async (newBudget) => {
      if (!userId) throw new Error("You must be signed in to create a budget");
      await queryClient.cancelQueries({ queryKey: ["budgets", userId] });

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
  });

  const totalBudgetAmountQuery = useQuery({
    queryKey: ["totalBudgetAmount", userId],
    queryFn: () => (userId ? getTotalBudgetAmount() : null),
    enabled: !!userId,
    staleTime: 600000,
  });

  return {
    query,
    delete: deleteMutation,
    create: createMutation,
    totalBudgetAmount: totalBudgetAmountQuery,
  };
};

export default useBudget;
