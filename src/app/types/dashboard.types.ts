export type TimePeriod = "currentMonth" | "previousMonth" | "allTime";

export interface FetchFinancialOverviewDataParams {
  timePeriod: TimePeriod;
}

export interface SummaryData {
  totalBudget: number;
  totalExpenses: number;
  remainingFunds: number;
  savings: number;
}
