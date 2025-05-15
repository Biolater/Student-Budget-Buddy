"use server";

import { requireUser } from "../utils/auth.utils";
import { apiRequest } from "../lib/apiClient";
import {
  FetchFinancialOverviewDataParams,
  SummaryData,
} from "../types/dashboard.types";
import { ResponseHandler } from "../lib/ResponseHandler";

/**
 * Alternative implementation using ResponseHandler.execute method
 * This approach reduces boilerplate with a cleaner OOP pattern
 */
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
