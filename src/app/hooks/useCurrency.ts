import {
  fetchCurrenciesForSelect,
  fetchDefaultUserCurrency,
} from "@/app/actions/currency.actions";
import { useQuery } from "@tanstack/react-query";

export const useCurrency = () => {
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
      queryFn: () => {
        return fetchDefaultUserCurrency();
      },
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchInterval: false,
      retry: 1,
      staleTime: 10 * 60 * 1000,
      gcTime: 60 * 60 * 1000,
    }),
  };
};
