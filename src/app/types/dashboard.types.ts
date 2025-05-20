export type TimePeriod = "currentMonth" | "previousMonth" | "allTime";
export type SpendingTrendTimePeriod = "last6Months" | "currentYear" | "allTime";

export interface FetchFinancialOverviewDataParams {
  timePeriod: TimePeriod;
}

export interface FetchSpendingTrendsDataParams {
  timePeriod: SpendingTrendTimePeriod;
}

export interface SummaryData {
  totalBudget: number;
  totalExpenses: number;
  remainingFunds: number;
  savings: number;
}

export interface SpendingTrendData {
  month: string;
  totalSpending: number;
}
