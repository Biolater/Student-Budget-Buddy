"use client";
import BudgetData from "../../components/Dashboard/BudgetData";
import SpendingData from "../../components/Dashboard/SpendingData";
import FinancialInsights from "../../components/Dashboard/FinancialInsights";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import useBudget from "@/hooks/useBudget";
import { useEffect } from "react";
import DashboardSkeleton from "@/app/components/Dashboard/DashboardSkeleton";
import {
  getMonthlySpending,
  type SpendingDataByCategory,
  type SpendingDataByMonth,
} from "@/app/actions/expense.actions";
import useExpenses from "@/hooks/useExpense";
import { useQuery } from "@tanstack/react-query";
import { getDefaultCurrency } from "@/app/lib/currencyUtils";

const DashboardComponent = () => {
  const { user } = useUser();

  const {
    totalBudgetAmount: {
      data: totalBudget,
      isLoading: totalBudgetLoading,
      isError: totalBudgetError,
    },
  } = useBudget(user?.id);

  const { data: defaultCurrency, isLoading: defaultCurrencyLoading, isError: defaultCurrencyError } = useQuery({
    queryKey: ["default-currency"],
    queryFn: async () => {
      const defaultCurrency = await getDefaultCurrency();
      return defaultCurrency;
    },
  });


  const {
    totalSpentAmount: {
      data: totalSpent,
      isLoading: totalSpentLoading,
      isError: totalSpentError,
    },
    monthlySpendingQuery: {
      data: monthlySpending,
      isLoading: monthlySpendingLoading,
      isError: monthlySpendingError,
    },
    spendingByCategory: {
      data: spendingByCategory,
      isLoading: spendingLoading,
      isError: spendingError,
    },
  } = useExpenses(user?.id);

  useEffect(() => {
    if (totalBudgetError) {
      toast.error("Error fetching total budget");
    }

    if (totalSpentError) {
      toast.error("Error fetching total spent");
    }

    if (monthlySpendingError) {
      toast.error("Error fetching monthly spending");
    }

    if (spendingError) {
      toast.error("Error fetching spending by category");
    }

    if (defaultCurrencyError) {
      toast.error("Error fetching default currency");
    }
  }, [totalBudgetError, totalSpentError, monthlySpendingError, spendingError, defaultCurrencyError]);


  if (!user) {
    return null;
  }

  return totalBudgetLoading ||
    totalSpentLoading ||
    monthlySpendingLoading ||
    defaultCurrencyLoading ||
    spendingLoading ? (
    <DashboardSkeleton />
  ) : (
    <main className="container mx-auto px-4 py-8 sm:px-6 md:px-10 lg:px-14 xl:px-18 2xl:px-22">
      <h1 className="text-3xl font-bold mb-8">Financial Dashboard</h1>
      <div className="flex flex-col">
        <BudgetData
          defaultCurrency={defaultCurrency}
          savedAmount={600}
          savingsGoal={1000}
          totalBudget={totalBudget}
          spent={totalSpent}
        />
        <SpendingData
          spendingDataByCategory={
            (spendingByCategory as SpendingDataByCategory) || []
          }
          monthlySpendingData={(monthlySpending as SpendingDataByMonth) || []}
        />
        <FinancialInsights />
      </div>
    </main>
  );
};

export default DashboardComponent;
