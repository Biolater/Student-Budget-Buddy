"use server";

import {
  fetchFinancialOverview,
  fetchSpendingTrends,
  fetchSpendingByCategory,
} from "../data/dashboard";
import {
  FetchFinancialOverviewDataParams,
  FetchSpendingTrendsDataParams,
  FetchSpendingByCategoryDataParams,
} from "../types/dashboard.types";

export async function fetchFinancialOverviewData(
  params: FetchFinancialOverviewDataParams
) {
  return fetchFinancialOverview(params);
}

export async function fetchSpendingTrendsData(
  params: FetchSpendingTrendsDataParams
) {
  return fetchSpendingTrends(params);
}

export async function fetchSpendingByCategoryData(
  params: FetchSpendingByCategoryDataParams
) {
  return fetchSpendingByCategory(params);
}
