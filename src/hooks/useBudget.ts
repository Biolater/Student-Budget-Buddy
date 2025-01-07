import { useQuery } from "@tanstack/react-query";

import { getBudgets } from "@/actions/budget.actions";

const useBudget = (userId: string | undefined | null) => {
    return useQuery({
        queryKey: ["budgets", userId],
        queryFn: () => getBudgets(),
        enabled: !!userId,
        staleTime: 600000,
        refetchOnWindowFocus: false,
        retry: 2
    })
}

export default useBudget