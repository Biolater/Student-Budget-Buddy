"use server";

import { unstable_cache } from "next/cache";
import { requireUser } from "../utils/auth.utils";
import { apiRequest } from "../lib/apiClient";
import {
  FetchFinancialOverviewDataParams,
  FetchSpendingTrendsDataParams,
  SummaryData,
  SpendingTrendData,
  FetchSpendingByCategoryDataParams,
  CategorySpending,
} from "../types/dashboard.types";
import { ResponseHandler } from "../lib/ResponseHandler";

// Internal cached function that doesn't use dynamic data
const _fetchFinancialOverviewCached = unstable_cache(
  async (params: FetchFinancialOverviewDataParams, token: string) => {
    console.log(`🔥 API CALL: Financial Overview for ${params.timePeriod} - ${new Date().toISOString()}`);
    
    return ResponseHandler.execute(async () => {
      const { timePeriod } = params;

      const summary = await apiRequest<SummaryData>({
        method: "GET",
        endpoint: `/dashboard/summary?timePeriod=${timePeriod}`,
        init: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });

      if (!summary.success || summary.data === null) {
        throw new Error(summary.error?.message || "Data not available");
      }

      console.log(`✅ API SUCCESS: Financial Overview for ${params.timePeriod}`);
      return summary.data;
    });
  },
  ["financial-overview"],
  {
    revalidate: 300, // Cache for 5 minutes
    tags: ["dashboard", "financial-overview"],
  }
);

// Public function that handles auth and calls cached version
export async function fetchFinancialOverview(params: FetchFinancialOverviewDataParams) {
  const startTime = performance.now();
  console.log(`📊 REQUESTED: Financial Overview for ${params.timePeriod}`);
  
  const user = await requireUser();
  const token = await user.getToken();
  
  if (!token) {
    throw new Error("Unable to get authentication token");
  }
  
  const result = await _fetchFinancialOverviewCached(params, token);
  const endTime = performance.now();
  const duration = Math.round(endTime - startTime);
  
  console.log(`⚡ RETURNED: Financial Overview for ${params.timePeriod} in ${duration}ms ${duration < 50 ? '(CACHED 🚀)' : '(API CALL 🌐)'}`);
  
  return result;
}

// Internal cached function for spending trends
const _fetchSpendingTrendsCached = unstable_cache(
  async (params: FetchSpendingTrendsDataParams, token: string) => {
    console.log(`🔥 API CALL: Spending Trends for ${params.timePeriod} - ${new Date().toISOString()}`);
    
    return ResponseHandler.execute(async () => {
      const { timePeriod } = params;

      const trends = await apiRequest<SpendingTrendData[]>({
        method: "GET",
        endpoint: `/dashboard/spending-trends?timePeriod=${timePeriod}`,
        init: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });

      if (!trends.success || trends.data === null) {
        throw new Error(trends.error?.message || "Data not available");
      }
      
      console.log(`✅ API SUCCESS: Spending Trends for ${params.timePeriod}`);
      return trends.data;
    });
  },
  ["spending-trends"],
  {
    revalidate: 300, // Cache for 5 minutes
    tags: ["dashboard", "spending-trends"],
  }
);

// Public function that handles auth and calls cached version
export async function fetchSpendingTrends(params: FetchSpendingTrendsDataParams) {
  console.log(`📊 REQUESTED: Spending Trends for ${params.timePeriod}`);
  
  const user = await requireUser();
  const token = await user.getToken();
  
  if (!token) {
    throw new Error("Unable to get authentication token");
  }
  
  const result = await _fetchSpendingTrendsCached(params, token);
  console.log(`⚡ RETURNED: Spending Trends for ${params.timePeriod} (from cache or API)`);
  
  return result;
}

// Internal cached function for spending by category
const _fetchSpendingByCategoryCached = unstable_cache(
  async (params: FetchSpendingByCategoryDataParams, token: string) => {
    console.log(`🔥 API CALL: Spending by Category for ${params.timePeriod} - ${new Date().toISOString()}`);
    
    return ResponseHandler.execute(async () => {
      const { timePeriod } = params;

      const trends = await apiRequest<CategorySpending[]>({
        method: "GET",
        endpoint: `/dashboard/spending-by-category?timePeriod=${timePeriod}`,
        init: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });

      if (!trends.success || trends.data === null) {
        throw new Error(trends.error?.message || "Data not available");
      }
      
      console.log(`✅ API SUCCESS: Spending by Category for ${params.timePeriod}`);
      return trends.data;
    });
  },
  ["spending-by-category"],
  {
    revalidate: 300, // Cache for 5 minutes
    tags: ["dashboard", "spending-by-category"],
  }
);

// Public function that handles auth and calls cached version
export async function fetchSpendingByCategory(params: FetchSpendingByCategoryDataParams) {
  console.log(`📊 REQUESTED: Spending by Category for ${params.timePeriod}`);
  
  const user = await requireUser();
  const token = await user.getToken();
  
  if (!token) {
    throw new Error("Unable to get authentication token");
  }
  
  const result = await _fetchSpendingByCategoryCached(params, token);
  console.log(`⚡ RETURNED: Spending by Category for ${params.timePeriod} (from cache or API)`);
  
  return result;
}
