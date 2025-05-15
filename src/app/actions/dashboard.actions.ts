"use server";

import { requireUser } from "../utils/auth.utils";
import { apiRequest } from "../lib/apiClient";
import {
  FetchFinancialOverviewDataParams,
  SummaryData,
} from "../types/dashboard.types";

export async function fetchFinancialOverviewData(
  params: FetchFinancialOverviewDataParams
) {
  try {
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

    console.log("this is the summary", summary);

    return summary.data;
  } catch (error) {
    throw error;
  }
}
