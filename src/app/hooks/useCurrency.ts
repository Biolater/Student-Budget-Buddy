import { fetchCurrenciesForSelect, fetchDefaultUserCurrency } from "@/app/actions/currency.actions";
import { useQuery } from "@tanstack/react-query";

export const useCurrency = (userId: string) => {
  return {
    query: useQuery({
      queryKey: ["currencies"],
      queryFn: fetchCurrenciesForSelect,
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 60 * 60 * 1000, // 1 hour
    }),
    fetchDefaultUserCurrency: useQuery({
      queryKey: ["defaultUserCurrency", userId],
      queryFn: ({ queryKey }) => {
        const [, userId] = queryKey
        return fetchDefaultUserCurrency(userId)
      },
      enabled: !!userId, // avoid running the query if userId is not ready
      staleTime: 10 * 60 * 1000,
      gcTime: 60 * 60 * 1000,
    })
  };
};
