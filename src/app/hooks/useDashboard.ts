import { useQuery } from "@tanstack/react-query";
import {
  TimePeriod,
  SummaryData,
  SpendingTrendTimePeriod,
} from "../types/dashboard.types";
// Import data layer directly for all GET requests (best practice)
import { 
  fetchFinancialOverview,
  fetchSpendingTrends,
  fetchSpendingByCategory
} from "../data/dashboard";
import ApiResponse from "../types/api-response.types";
import { ApiErrorDetails } from "../types/error.types";

/**
 * Custom hook for dashboard related data and operations
 */
export const useDashboard = () => {
  /**
   * Get financial overview data for a specific time period
   * Calls data layer directly (best practice for GET requests)
   */
  const useFinancialOverviewData = (timePeriod: TimePeriod) => {
    return useQuery({
      queryKey: ["getFinancialOverviewData", timePeriod],
      queryFn: async () => {
        // Call data layer directly instead of going through actions
        const response = await fetchFinancialOverview({ timePeriod });

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

  /**
   * Get spending trends data for a specific time period
   * Calls data layer directly (best practice for GET requests)
   */
  const useSpendingTrendsData = (timePeriod: SpendingTrendTimePeriod) => {
    return useQuery({
      queryKey: ["getSpendingTrendsData", timePeriod],
      queryFn: async () => {
        // Call data layer directly instead of going through actions
        const response = await fetchSpendingTrends({ timePeriod });

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

  /**
   * Get spending by category data for a specific time period
   * Calls data layer directly (best practice for GET requests)
   */
  const useSpendingByCategoryData = (timePeriod: TimePeriod) => {
    return useQuery({
      queryKey: ["getSpendingByCategoryData", timePeriod],
      queryFn: async () => {
        // Call data layer directly instead of going through actions
        const response = await fetchSpendingByCategory({ timePeriod });

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
    useSpendingTrendsData,
    useSpendingByCategoryData,
  };
};
