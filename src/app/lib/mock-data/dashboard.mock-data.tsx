import { DollarSign } from "lucide-react";

export const financialOverviewData = [
  {
    title: "Total Budget",
    amount: 1000,
    currencySymbol: "$",
    icon: <DollarSign className="size-6 text-current" />,
  },
  {
    title: "Total Income",
    amount: 1000,
    currencySymbol: "$",
    icon: <DollarSign className="size-6 text-current" />,
  },
  {
    title: "Total Expenses",
    amount: 1000,
    currencySymbol: "$",
    icon: <DollarSign className="size-6 text-current" />,
  },
];

// Types based on API structure
export type SpendingTrendTimePeriod = "last6Months" | "currentYear";
export type CategoryTimePeriod = "currentMonth" | "previousMonth" | "allTime";
export type TimePeriod = "currentMonth" | "previousMonth" | "allTime";

export interface SpendingTrend {
  month: string;
  totalSpending: number;
}

export interface CategorySpending {
  category: string;
  totalSpending: number;
}

export interface SpendingTrendsResponse {
  trends: SpendingTrend[];
  currency: string;
}

export interface SpendingByCategoryResponse {
  spendingByCategory: CategorySpending[];
  currency: string;
}

export interface SummaryData {
  totalBudget: number;
  totalExpenses: number;
  remainingFunds: number;
}

export interface SpendingTrendData {
  month: string;
  totalSpending: number;
}

// Static data for spending trends
export const spendingTrendsData: Record<
  SpendingTrendTimePeriod,
  SpendingTrendsResponse
> = {
  last6Months: {
    trends: [
      { month: "2024-12", totalSpending: 450.75 },
      { month: "2025-01", totalSpending: 510.2 },
      { month: "2025-02", totalSpending: 485.5 },
      { month: "2025-03", totalSpending: 550.9 },
      { month: "2025-04", totalSpending: 495.15 },
      { month: "2025-05", totalSpending: 520.3 },
    ],
    currency: "AZN",
  },
  currentYear: {
    trends: [
      { month: "2024-06", totalSpending: 430.25 },
      { month: "2024-07", totalSpending: 445.8 },
      { month: "2024-08", totalSpending: 460.15 },
      { month: "2024-09", totalSpending: 475.6 },
      { month: "2024-10", totalSpending: 490.25 },
      { month: "2024-11", totalSpending: 470.9 },
      { month: "2024-12", totalSpending: 450.75 },
      { month: "2025-01", totalSpending: 510.2 },
      { month: "2025-02", totalSpending: 485.5 },
      { month: "2025-03", totalSpending: 550.9 },
      { month: "2025-04", totalSpending: 495.15 },
      { month: "2025-05", totalSpending: 520.3 },
    ],
    currency: "AZN",
  },
};

// Static data for spending by category
export const spendingByCategoryData: Record<
  CategoryTimePeriod,
  SpendingByCategoryResponse
> = {
  currentMonth: {
    spendingByCategory: [
      { category: "Food", totalSpending: 195.8 },
      { category: "Entertainment", totalSpending: 180.7 },
      { category: "Utilities", totalSpending: 85.65 },
      { category: "Transportation", totalSpending: 120.4 },
      { category: "Other", totalSpending: 33.0 },
    ],
    currency: "AZN",
  },
  previousMonth: {
    spendingByCategory: [
      { category: "Food", totalSpending: 210.5 },
      { category: "Entertainment", totalSpending: 150.2 },
      { category: "Utilities", totalSpending: 90.75 },
      { category: "Transportation", totalSpending: 135.3 },
      { category: "Other", totalSpending: 45.6 },
    ],
    currency: "AZN",
  },
  allTime: {
    spendingByCategory: [
      { category: "Food", totalSpending: 1250.8 },
      { category: "Entertainment", totalSpending: 980.7 },
      { category: "Utilities", totalSpending: 520.65 },
      { category: "Transportation", totalSpending: 780.4 },
      { category: "Other", totalSpending: 320.0 },
    ],
    currency: "AZN",
  },
};

// Static data for dashboard summary
const summaryData: Record<TimePeriod, SummaryData> = {
  currentMonth: {
    totalBudget: 2000,
    totalExpenses: 535.55,
    remainingFunds: 1464.45,
  },
  previousMonth: {
    totalBudget: 2000,
    totalExpenses: 632.35,
    remainingFunds: 1367.65,
  },
  allTime: {
    totalBudget: 24000,
    totalExpenses: 7564.2,
    remainingFunds: 16435.8,
  },
};

// Function to fetch summary data based on time period
export const fetchSummaryData = (timePeriod: TimePeriod): SummaryData => {
  return summaryData[timePeriod];
};

// Function to fetch spending trends data based on time period
export const fetchSpendingTrendsData = (
  timePeriod: SpendingTrendTimePeriod
): SpendingTrendData[] => {
  return spendingTrendsData[timePeriod].trends;
};
