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
import ViewBudgetDetailsDrawer from "@/app/components/Budget/ViewBudgetDetailsDrawer";
// import { getCurrencies } from "@/app/lib/currencyUtils";
// import { useCurrencies } from "@/hooks/useCurrency";

import React, { useState } from "react";

const Budget = () => {
  const { userId, isLoaded } = useAuth();
  const [selectedBudget, setSelectedBudget] = useState<
    import("@/app/types/budget.types").ExtendedBudget | null
  >(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const budgetHook = useBudget(userId);

  const {
    query: { data: budgets, isPending: budgetsLoading, isError: budgetsError },
    budgetStats: {
      data: budgetStatsData,
      isPending: budgetStatsLoading,
      isError: budgetStatsError,
    },
  } = budgetHook;
  useEffect(() => {
    if (budgetsError || budgetStatsError) {
      toast.error("Failed to fetch budget data. Please try again later.");
    }
  }, [budgetsError, budgetStatsError]);

  if (!isLoaded) {
    return <div>Loading authentication...</div>;
  }
  if (!userId) {
    return <div>Please log in to view your budgets.</div>;
  }
  if (budgetsLoading || budgetStatsLoading) {
    return <div>Loading budget data...</div>;
  }

  return (
    <main className="container mx-auto container-padding">
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
      <BudgetStatsOverview
        defaultCurrency={budgets?.[0]?.currency?.symbol ?? "USD"}
        totalBudget={
          budgetStatsData && !Array.isArray(budgetStatsData)
            ? budgetStatsData.overallBudgetAmount ?? 0
            : 0
        }
        totalRemaining={
          budgetStatsData && !Array.isArray(budgetStatsData)
            ? budgetStatsData.overallRemainingAmount ?? 0
            : 0
        }
        totalSpent={
          budgetStatsData && !Array.isArray(budgetStatsData)
            ? budgetStatsData.overallSpentAmount ?? 0
            : 0
        }
      />
      <h1 className="text-3xl font-bold my-4">Budgets</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgets && budgets.length > 0 ? (
          budgets.map((budget, index) => (
            <motion.div
              key={budget.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.05 + 0.3 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              onClick={() => {
                setSelectedBudget(budget);
                setDrawerOpen(true);
              }}
              style={{ cursor: "pointer" }}
            >
              <BudgetCard budget={budget} />
            </motion.div>
          ))
        ) : (
          <p>No budgets found. Create one to get started!</p>
        )}
      </div>
      <ViewBudgetDetailsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        budget={selectedBudget}
      />
    </main>
  );
};

export default Budget;
