import { WalletIcon, DollarSign, ChevronUp } from "lucide-react";

export const financialOverviewPeriods = [
  { label: "Current Month", value: "currentMonth" },
  { label: "Previous Month", value: "previousMonth" },
  { label: "All Time", value: "allTime" },
];

export const financialOverviewItems = [
  { title: "Total Budget", value: "totalBudget", icon: <WalletIcon /> },
  { title: "Total Expenses", value: "totalExpenses", icon: <DollarSign /> },
  { title: "Remaining Funds", value: "remainingFunds", icon: <ChevronUp /> },
];