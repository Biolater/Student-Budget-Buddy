"use server";

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

export async function fetchFinancialOverview(params: FetchFinancialOverviewDataParams) {
  const user = await requireUser();
  const token = await user.getToken();

  if (!token) {
    throw new Error("Unable to get authentication token");
  }

  return ResponseHandler.execute(async () => {
    const { timePeriod } = params;

    const summary = await apiRequest<SummaryData>({
      method: "GET",
      endpoint: `/dashboard/summary?timePeriod=${timePeriod}`,
      init: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        next: {
          revalidate: 300,
          tags: ["dashboard", "financial-overview"],
        },
        cache: "force-cache",
      },
    });

    if (!summary.success || summary.data === null) {
      throw new Error(summary.error?.message || "Data not available");
    }

    return summary.data;
  });
}

export async function fetchSpendingTrends(params: FetchSpendingTrendsDataParams) {
  const user = await requireUser();
  const token = await user.getToken();

  if (!token) {
    throw new Error("Unable to get authentication token");
  }

  return ResponseHandler.execute(async () => {
    const { timePeriod } = params;

    const trends = await apiRequest<SpendingTrendData[]>({
      method: "GET",
      endpoint: `/dashboard/spending-trends?timePeriod=${timePeriod}`,
      init: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        next: {
          revalidate: 300,
          tags: ["dashboard", "spending-trends"],
        },
        cache: "force-cache",
      },
    });

    if (!trends.success || trends.data === null) {
      throw new Error(trends.error?.message || "Data not available");
    }

    return trends.data;
  });
}

export async function fetchSpendingByCategory(params: FetchSpendingByCategoryDataParams) {
  const user = await requireUser();
  const token = await user.getToken();

  if (!token) {
    throw new Error("Unable to get authentication token");
  }

  return ResponseHandler.execute(async () => {
    const { timePeriod } = params;

    const categories = await apiRequest<CategorySpending[]>({
      method: "GET",
      endpoint: `/dashboard/spending-by-category?timePeriod=${timePeriod}`,
      init: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        next: {
          revalidate: 300,
          tags: ["dashboard", "spending-by-category"],
        },
        cache: "force-cache",
      },
    });

    if (!categories.success || categories.data === null) {
      throw new Error(categories.error?.message || "Data not available");
    }

    return categories.data;
  });
}
