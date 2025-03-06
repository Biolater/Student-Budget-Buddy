import { fetchCurrenciesForSelect } from "@/app/actions/currency.actions";
import { useQuery } from "@tanstack/react-query";

export const useCurrency = () => {
  return {
    query: useQuery({
      queryKey: ["currencies"],
      queryFn: fetchCurrenciesForSelect
    })
  };
};
