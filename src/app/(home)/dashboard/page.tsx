"use client";
import BudgetData from "../../components/Dashboard/BudgetData";
import SpendingData from "../../components/Dashboard/SpendingData";
import FinancialInsights from "../../components/Dashboard/FinancialInsights";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import useBudget from "@/hooks/useBudget";
import { useEffect } from "react";
import DashboardSkeleton from "@/app/components/Dashboard/DashboardSkeleton";
import { getMonthlySpending } from "@/app/actions/expense.actions";

const DashboardComponent = () => {
  const { user } = useUser();

  const {
    totalBudgetAmount: {
      data: totalBudget,
      isLoading: totalBudgetLoading,
      isError: totalBudgetError,
    },
    totalSpentAmount: {
      data: totalSpent,
      isLoading: totalSpentLoading,
      isError: totalSpentError,
    },
  } = useBudget(user?.id);

  useEffect(() => {
    if (totalBudgetError) {
      toast.error("Error fetching total budget");
    }

    if (totalSpentError) {
      toast.error("Error fetching total spent");
    }
  }, [totalBudgetError, totalSpentError]);

  useEffect(() => {
    (async () => {
      const monthlySpending = await getMonthlySpending()
      console.log(monthlySpending)
    })()
  }, [])

  if (!user) {
    return null;
  }

  return totalBudgetLoading || totalSpentLoading ? (
    <DashboardSkeleton />
  ) : (
    <main className="container mx-auto px-4 py-8 sm:px-6 md:px-10 lg:px-14 xl:px-18 2xl:px-22">
      <h1 className="text-3xl font-bold mb-8">Financial Dashboard</h1>
      <div className="flex flex-col">
        <BudgetData
          savedAmount={600}
          savingsGoal={1000}
          totalBudget={totalBudget}
          spent={totalSpent}
          totalBudgetLoading={totalBudgetLoading}
        />
        <SpendingData spendings={150}  />
        <FinancialInsights />
      </div>
    </main>
  );
};

export default DashboardComponent;
