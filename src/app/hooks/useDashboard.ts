import { useQuery } from "@tanstack/react-query";
import { TimePeriod } from "../types/dashboard.types";
import { fetchFinancialOverviewData } from "../actions/dashboard.actions";

/**
 * Custom hook for dashboard related data and operations
 */
export const useDashboard = () => {
  /**
   * Get financial overview data for a specific time period
   */
  const useFinancialOverviewData = (timePeriod: TimePeriod) => {
    return useQuery({
      queryKey: ["getFinancialOverviewData", timePeriod],
      queryFn: () => fetchFinancialOverviewData({ timePeriod }),
      enabled: !!timePeriod,
    });
  };

  return {
    useFinancialOverviewData,
  };
};
