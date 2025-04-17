"use client";

import BudgetOverview from "../../components/Budget/BudgetOverview";
import CurrentBudgets from "../../components/Budget/CurrentBudgets";
import { type Budget } from "@prisma/client";
import { useAuth } from "@clerk/nextjs";
import useBudget from "@/app/hooks/useBudget";
import { useEffect } from "react";
import toast from "react-hot-toast";
import BudgetForm from "../../components/Budget/AddNewBudget";
import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import CreateBudgetDrawer from "@/app/components/Budget/CreateBudgetDrawer";
import BudgetStatsOverview from "@/app/components/Budget/BudgetStatsOverview";
import BudgetCard from "@/app/components/Budget/BudgetCard";
// import { getCurrencies } from "@/app/lib/currencyUtils";
// import { useCurrencies } from "@/hooks/useCurrency";

const Budget = () => {
  const { userId } = useAuth();

  const {
    query: { data: budgets, isPending: budgetsLoading, isError: budgetsError },
  } = useBudget(userId ?? "");

  useEffect(() => {
    if (budgetsError) {
      toast.error("Failed to fetch budgets");
    }
  }, [budgetsError]);

  if (budgetsLoading) {
    return <div>Loading...</div>;
  }

  // const { query: { data: currencies, isPending: currenciesLoading, isError: currenciesError } } = useCurrencies(userId ?? "");

  // useEffect(() => {
  //   if (budgetsError) {
  //     toast.error("Failed to fetch budgets");
  //   }
  //   if (currenciesError) {
  //     toast.error("Failed to fetch currencies");
  //   }
  // }, [budgetsError, currenciesError]);

  return (
    <main className="container mx-auto container-padding">
      {/* Budget Header  */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between flex-wrap gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold">Budget Management</h1>
          <p className="text-muted-foreground">
            Create and manage your spending limits
          </p>
        </div>
        <CreateBudgetDrawer />
      </motion.div>
      {/* Budget Stats Overview */}
      <BudgetStatsOverview
        defaultCurrency="USD"
        totalBudget={100}
        totalRemaining={100}
        totalSpent={200}
      />

      {/* MAIN CONTENT */}
      <h1 className="text-3xl font-bold mb-4">Budgets</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgets?.map((budget) => (
          <BudgetCard key={budget.id} budget={budget} />
        ))}
      </div>
    </main>
  );
};

export default Budget;
