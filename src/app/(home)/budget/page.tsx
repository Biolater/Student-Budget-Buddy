"use client";

import BudgetOverview from "../../components/Budget/BudgetOverview";
import CurrentBudgets from "../../components/Budget/CurrentBudgets";
import { type Budget } from "@prisma/client";
import { useAuth } from "@clerk/nextjs";
import useBudget from "@/hooks/useBudget";
import { useEffect } from "react";
import toast from "react-hot-toast";
import BudgetForm from "../../components/Budget/AddNewBudget";
import { getCurrencies } from "@/app/lib/currencyUtils";
import { useCurrencies } from "@/hooks/useCurrency";

const Budget = () => {
  const { userId } = useAuth();

  const {
    query: { data: budgets, isPending: budgetsLoading, isError: budgetsError },
  } = useBudget(userId);
  
  const { query: { data: currencies, isPending: currenciesLoading, isError: currenciesError } } = useCurrencies(userId ?? "");

  useEffect(() => {
    if (budgetsError) {
      toast.error("Failed to fetch budgets");
    }
    if (currenciesError) {
      toast.error("Failed to fetch currencies");
    }
  }, [budgetsError, currenciesError]);

  return (
    <main className="container mx-auto px-4 py-8 sm:px-6 md:px-10 lg:px-14 xl:px-18 2xl:px-22">
      <h1 className="text-3xl font-bold mb-8">Budget Management</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <CurrentBudgets
          budgets={budgets || []}
          budgetsLoading={budgetsLoading}
          userId={userId}
        />
        <BudgetForm currencies={currencies || []} onSubmit={() => {}} />
        <BudgetOverview />
      </div>
    </main>
  );
};

export default Budget;
