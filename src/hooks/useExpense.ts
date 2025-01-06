// hooks/useExpenses.ts
import { useQuery } from "@tanstack/react-query";
import { fetchExpensesByUser } from "@/actions/expense.actions";

// Custom hook for fetching expenses
const useExpenses = (userId: string) => {
  return useQuery({
    queryKey: ["expenses", userId],
    queryFn: () => fetchExpensesByUser(),
    enabled: !!userId,
    staleTime: 600000,
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

export default useExpenses;
