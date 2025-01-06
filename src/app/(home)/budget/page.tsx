"use client";

import { useEffect, useState } from "react";
import AddNewBudget from "./AddNewBudget";
import BudgetOverview from "./BudgetOverview";
import CurrentBudgets from "./CurrentBudgets";
import { type Budget } from "@prisma/client";
import { getBudgets } from "@/actions/budget.actions";
import toast from "react-hot-toast";
import { type ClientBudget } from "./AddNewBudget";

const Budget = () => {
  const [budgets, setBudgets] = useState<ClientBudget[] | null>(null);
  const [budgetsLoading, setBudgetsLoading] = useState(true);
  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const budgets = await getBudgets();
        setBudgets(budgets);
        setBudgetsLoading(false);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
      }
    };
    if (!budgets) fetchBudgets();
  }, [budgets]);

  const handleBudgetCreated = (budget: ClientBudget) => {
    setBudgets((prevBudgets) => [...(prevBudgets || []), budget]);
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
