"use client";

import AddNewBudget from "./AddNewBudget";
import BudgetOverview from "./BudgetOverview";
import CurrentBudgets from "./CurrentBudgets";
import { type Budget } from "@prisma/client";
import { useAuth } from "@clerk/nextjs";
import useBudget from "@/hooks/useBudget";
import { useEffect } from "react";
import toast from "react-hot-toast";

const Budget = () => {
  const { userId } = useAuth();

  const {
    query: { data: budgets, isPending: budgetsLoading, isError: budgetsError },
  } = useBudget(userId);

  useEffect(() => {
    if (budgetsError) {
      toast.error("Failed to fetch budgets");
    }
  }, [budgetsError]);

  return (
    <main className="container mx-auto px-4 py-8 sm:px-6 md:px-10 lg:px-14 xl:px-18 2xl:px-22">
      <h1 className="text-3xl font-bold mb-8">Budget Management</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <CurrentBudgets
          budgets={budgets || []}
          budgetsLoading={budgetsLoading}
        />
        <AddNewBudget />
        <BudgetOverview />
      </div>
    </main>
  );
};

export default Budget;
