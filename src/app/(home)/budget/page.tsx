"use client";

import AddNewBudget from "./AddNewBudget";
import BudgetOverview from "./BudgetOverview";
import CurrentBudgets from "./CurrentBudgets";
import { type Budget } from "@prisma/client";
import { useAuth } from "@clerk/nextjs";
import useBudget from "@/hooks/useBudget";

const Budget = () => {
  const { userId } = useAuth();

  const {
    data: budgets,
    isPending: budgetsLoading,
    refetch,
  } = useBudget(userId);

  const handleBudgetCreated = () => {
    refetch();
  };
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Budget Management</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <CurrentBudgets
          budgets={budgets || []}
          budgetsLoading={budgetsLoading}
        />
        <AddNewBudget onBudgetCreated={handleBudgetCreated} />
        <BudgetOverview />
      </div>
    </main>
  );
};

export default Budget;
