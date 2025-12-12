import {
  fetchCurrenciesForSelect,
  fetchDefaultUserCurrency,
} from "@/app/actions/currency.actions";
import { updateUserBaseCurrency } from "@/app/actions/user-settings.actions";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useCurrency = () => {
  const queryClient = useQueryClient();
  return {
    query: useQuery({
      queryKey: ["currencies"],
      queryFn: fetchCurrenciesForSelect,
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 60 * 60 * 1000, // 1 hour
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchInterval: false,
      retry: 1,
    }),
    fetchDefaultUserCurrency: useQuery({
      queryKey: ["defaultUserCurrency"],
      queryFn: () => fetchDefaultUserCurrency(),
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchInterval: false,
      retry: 1,
      staleTime: 10 * 60 * 1000,
      gcTime: 60 * 60 * 1000,
    }),
    updateBaseCurrency: useMutation({
      mutationFn: (currencyId: string) => updateUserBaseCurrency(currencyId),
      onSuccess: () => {
        // Invalidate and refetch queries that might be affected
        return Promise.all([
          queryClient.invalidateQueries({ queryKey: ["currencies"] }),
          queryClient.invalidateQueries({ queryKey: ["defaultUserCurrency"] })
        ]);
      },
    }),
  };
};
