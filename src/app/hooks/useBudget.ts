import { useQuery, useMutation } from "@tanstack/react-query";
import {
  createBudget,
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
          toast.error(budgetError.message);
        } else {
          toast.error("Failed to create budget. Please try again.");
        }
      },
      onSuccess: () => {
        toast.success("Budget created successfully");
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
    queryKey: BUDGET_MUTATION_KEY(userId ?? ""),
    queryFn: async () => {
      if (!userId) return [];
      const budgetStats = await getBudgetStats();
      return budgetStats ?? [];
    },
    enabled: !!userId,
    staleTime: 600000,
   })
  };
};

export default useBudget;

// const useBudget = (userId: string | undefined | null) => {
//     const keyUserId = userId ?? "no-user";

//     const query = useQuery({
//         queryKey: ["budgets", keyUserId],
//         queryFn: async () => {
//             if (!userId) return [];
//             const budgets = await getBudgets();
//             return budgets ?? [];
//         },
//         enabled: !!userId,
//         staleTime: 600000,
//     });

//     const deleteMutation = useMutation({
//         mutationFn: (budgetId: string) => deleteBudget(budgetId),
//         mutationKey: ["deleteBudget", keyUserId],
//         onMutate: async () => {
//             if (!userId) throw new Error("You must be signed in to delete a budget");
//         },
//         onError: (error) => {
//             toast.error(
//                 error instanceof Error ? error.message : "Something went wrong"
//             );
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries({queryKey: ["budgets", keyUserId]});
//             toast.success("Budget deleted successfully");
//         },
//     });

//     const createMutation = useMutation({
//         mutationFn: (data: NewBudgetSchema) => createBudget(data),
//         mutationKey: ["createBudget", keyUserId],
//         onMutate: async () => {
//             if (!userId) throw new Error("You must be signed in to create a budget");
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries({queryKey: ["budgets", keyUserId]});
//             toast.success("Budget created successfully");
//         },
//     });

//     const totalBudgetAmountQuery = useQuery({
//         queryKey: ["totalBudgetAmount", keyUserId],
//         queryFn: async () => {
//             if (!userId) return 0;
//             const total = await getTotalBudgetAmount();
//             return total ?? 0;
//         },
//         enabled: !!userId,
//         staleTime: 600000,
//     });

//     return {
//         query,
//         delete: deleteMutation,
//         create: createMutation,
//         totalBudgetAmount: totalBudgetAmountQuery,
//     };
// };

// export default useBudget;
