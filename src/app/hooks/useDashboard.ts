import { useQuery } from "@tanstack/react-query";
import { TimePeriod, SummaryData } from "../types/dashboard.types";
import { fetchFinancialOverviewData } from "../actions/dashboard.actions";
import ApiResponse from "../types/api-response.types";
import { ApiErrorDetails } from "../types/error.types";

/**
 * Custom hook for dashboard related data and operations
 */
export const useDashboard = () => {
  /**
   * Get financial overview data for a specific time period
   */
  /**
   * Get financial overview data for a specific time period
   * Handles the ApiResponse object and provides proper error handling
   */
  const useFinancialOverviewData = (timePeriod: TimePeriod) => {
    return useQuery({
      queryKey: ["getFinancialOverviewData", timePeriod],
      queryFn: async () => {
        // Fetch data using server action that returns ApiResponse
        const response = await fetchFinancialOverviewData({ timePeriod });
        
        // Check if the response was successful
        if (response.success && response.data) {
          return response.data; // Return just the data for the component
        }
        
        // If there was an error, throw it so React Query can handle it
        const errorMessage = response.error?.message || "Unknown error";
        const errorCode = response.error?.code || 500;
        
        // Create an Error object with additional context
        const error = new Error(errorMessage) as Error & ApiErrorDetails;
        // Add properties in a type-safe way
        error.code = errorCode;
        error.isApiError = true;
        
        throw error;
      },
      enabled: !!timePeriod,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  return {
    useFinancialOverviewData,
  };
};
