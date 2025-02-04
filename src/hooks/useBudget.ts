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
  // Use a fallback value for query keys to avoid undefined/null in keys.
  const keyUserId = userId ?? "no-user";

  const query = useQuery({
    queryKey: ["budgets", keyUserId],
    queryFn: async () => {
      if (!userId) return []; // Safe default value (empty array)
      const budgets = await getBudgets();
      return budgets ?? [];
    },
    enabled: !!userId,
    staleTime: 600000,
  });

  const deleteMutation = useMutation({
    mutationFn: (budgetId: string) => deleteBudget(budgetId),
    mutationKey: ["deleteBudget", keyUserId],
    onMutate: async (budgetId: string) => {
      if (!userId) throw new Error("You must be signed in to delete a budget");
      await queryClient.cancelQueries({ queryKey: ["budgets", keyUserId] });
      const previousBudgets = queryClient.getQueryData<ClientBudget[]>([
        "budgets",
        keyUserId,
      ]);

      queryClient.setQueryData<ClientBudget[]>(["budgets", keyUserId], (old) =>
        old ? old.filter((budget) => budget.id !== budgetId) : []
      );

      toast.success("Budget deleted successfully");

      return { previousBudgets };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(
        ["budgets", keyUserId],
        context?.previousBudgets
      );
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets", keyUserId] });
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: NewBudgetSchema) => createBudget(data),
    mutationKey: ["createBudget", keyUserId],
    onMutate: async (newBudget) => {
      if (!userId) throw new Error("You must be signed in to create a budget");
      await queryClient.cancelQueries({ queryKey: ["budgets", keyUserId] });

      const previousBudgets = queryClient.getQueryData<ClientBudget[]>([
        "budgets",
        keyUserId,
      ]);

      queryClient.setQueryData<ClientBudget[]>(
        ["budgets", keyUserId],
        (old) => {
          const newBudgetWithDefaults = {
            ...newBudget,
            id: "temp-id",
            userId,
            createdAt: new Date(),
            updatedAt: new Date(),
            expenses: [],
            amount: Number(newBudget.amount),
          };

          return old
            ? [...old, newBudgetWithDefaults]
            : [newBudgetWithDefaults];
        }
      );
      toast.success("Budget created successfully");

      return { previousBudgets };
    },
    onError: (error, _, ctx) => {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
      queryClient.setQueryData(["budgets", keyUserId], ctx?.previousBudgets);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets", keyUserId] });
    },
  });

  const totalBudgetAmountQuery = useQuery({
    queryKey: ["totalBudgetAmount", keyUserId],
    queryFn: async () => {
      if (!userId) return 0; // Safe default numeric value
      const total = await getTotalBudgetAmount();
      return total ?? 0;
    },
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
