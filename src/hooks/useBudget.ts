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
  const keyUserId = userId ?? "no-user";

  const query = useQuery({
    queryKey: ["budgets", keyUserId],
    queryFn: async () => {
      if (!userId) return [];
      const budgets = await getBudgets();
      return budgets ?? [];
    },
    enabled: !!userId,
    staleTime: 600000,
  });

  const deleteMutation = useMutation({
    mutationFn: (budgetId: string) => deleteBudget(budgetId),
    mutationKey: ["deleteBudget", keyUserId],
    onMutate: async () => {
      if (!userId) throw new Error("You must be signed in to delete a budget");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets", keyUserId] });
      toast.success("Budget deleted successfully");
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: NewBudgetSchema) => createBudget(data),
    mutationKey: ["createBudget", keyUserId],
    onMutate: async () => {
      if (!userId) throw new Error("You must be signed in to create a budget");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets", keyUserId] });
      toast.success("Budget created successfully");
    },
  });

  const totalBudgetAmountQuery = useQuery({
    queryKey: ["totalBudgetAmount", keyUserId],
    queryFn: async () => {
      if (!userId) return 0;
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
