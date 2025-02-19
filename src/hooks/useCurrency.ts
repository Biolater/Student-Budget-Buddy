import { useQuery } from "@tanstack/react-query";
import { getCurrencies } from "@/app/lib/currencyUtils";

export const useCurrencies = (userId: string) => {
  return {
    query: useQuery({
      queryKey: ["currencies"],
      queryFn: getCurrencies,
      select: (data) => data.map((currency) => ({
        code: currency.code,
        symbol: currency.symbol,
        id: currency.id,
      })),
      enabled: !!userId,
      staleTime: 1000 * 60 * 60 * 24,
    }),
  };
};
