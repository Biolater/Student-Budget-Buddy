"use server";

import { requireUser } from "../utils/auth.utils";
import { apiRequest } from "../lib/apiClient";
import {
  FetchFinancialOverviewDataParams,
  FetchSpendingTrendsDataParams,
  SummaryData,
  SpendingTrendData,
} from "../types/dashboard.types";
import { ResponseHandler } from "../lib/ResponseHandler";

export async function fetchFinancialOverviewData(
  params: FetchFinancialOverviewDataParams
) {
  return ResponseHandler.execute(async () => {
    const user = await requireUser();
    const token = await user.getToken();
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

    return summary.data;
  });
}

export async function fetchSpendingTrendsData(
  params: FetchSpendingTrendsDataParams
) {
  return ResponseHandler.execute(async () => {
    const user = await requireUser();
    const token = await user.getToken();
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
    return trends.data;
  });
}
