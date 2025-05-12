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
import BudgetCardSkeleton from "@/app/components/Budget/BudgetCardSkeleton";

import React, { useState } from "react";
import ConfirmBudgetDeletionModal from "@/app/components/Budget/ConfirmBudgetDeletionModal";
import type { BudgetWithStats, ExtendedBudget } from "@/app/types/budget.types";
import { GlobalLoading } from "@/app/components/GlobalLoading";
import { useCurrency } from "@/app/hooks/useCurrency";
import { useQueries } from "@tanstack/react-query";
import { fetchBudgetStats } from "@/app/utils/budget.utils";

const Budget = () => {
  const { userId, isLoaded } = useAuth();
  const [selectedBudget, setSelectedBudget] = useState<ExtendedBudget | null>(
    null
  );
  const [budgetsWithStats, setBudgetsWithStats] = useState<
    BudgetWithStats[] | null
  >(null);
  const [budgetsWithStatsLoading, setBudgetsWithStatsLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteBudgetId, setDeleteBudgetId] = useState<string | null>(null);
  const budgetHook = useBudget(userId);
  const currencyHook = useCurrency(userId);

  const handleDrawerDelete = (budgetId: string) => {
    setDeleteBudgetId(budgetId);
  };

  const {
    query: { data: budgets, isPending: budgetsLoading, isError: budgetsError },
    budgetStats: {
      data: budgetStatsData,
      isPending: budgetStatsLoading,
      isError: budgetStatsError,
    },
    deleteBudget: {
      mutateAsync: deleteBudget,
      isPending: deleteBudgetLoading,
      isError: deleteBudgetError,
    },
  } = budgetHook;

  const {
    fetchDefaultUserCurrency: {
      data: defaultCurrency,
      isLoading: defaultCurrencyLoading,
      isError: defaultCurrencyError,
    },
  } = currencyHook;

  useEffect(() => {
    if (budgetsError || budgetStatsError || defaultCurrencyError) {
      toast.error("Failed to fetch budget data. Please try again later.");
    }
    if (deleteBudgetError) {
      toast.error("Failed to delete budget. Please try again later.");
    }
  }, [budgetsError, budgetStatsError, deleteBudgetError, defaultCurrencyError]);

  useEffect(() => {
    const fetchAllBudgetStats = async () => {
      if (budgets) {
        setBudgetsWithStatsLoading(true);
        const budgetsWithStatsData = await Promise.all(
          budgets.map(async (budget) => {
            const stats = await fetchBudgetStats(budget);
            return { ...budget, stats };
          })
        );
        setBudgetsWithStats(budgetsWithStatsData);
        setBudgetsWithStatsLoading(false);
      } else {
        setBudgetsWithStats(null);
        setBudgetsWithStatsLoading(false);
      }
    };

    fetchAllBudgetStats();
  }, [budgets]);

  useEffect(() => {
    console.log("budgetsWithStats", budgetsWithStats);
    console.log("selectedBudget", selectedBudget);
  }, [budgetsWithStats, selectedBudget]);

  const handleDeleteBudget = async () => {
    if (!deleteBudgetId) return;
    await deleteBudget(deleteBudgetId);
    setDeleteBudgetId(null);
    setSelectedBudget(null);
    setDrawerOpen(false);
  };

  if (!isLoaded || !userId) {
    return <GlobalLoading isLoading={true} message="Loading budget data..." />;
  }

  return (
    <main className="container container-padding">
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
        isLoading={
          budgetStatsLoading ||
          defaultCurrencyLoading ||
          budgetsWithStatsLoading
        }
        defaultCurrencySymbol={defaultCurrency?.symbol ?? "$"}
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
        {budgetsLoading || budgetsWithStatsLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <BudgetCardSkeleton key={index} />
          ))
        ) : budgets && budgets.length > 0 ? (
          budgetsWithStats?.map((budget, index) => (
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
              <BudgetCard budget={budget} stats={budget.stats} />
            </motion.div>
          ))
        ) : (
          <p className="text-muted-foreground">
            No budgets found. Create one to get started!
          </p>
        )}
      </div>
      <ViewBudgetDetailsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        budget={selectedBudget}
        onDeleteBudget={handleDrawerDelete}
      />
      <ConfirmBudgetDeletionModal
        isOpen={!!deleteBudgetId}
        onClose={() => setDeleteBudgetId(null)}
        onDelete={handleDeleteBudget}
        isDeleting={deleteBudgetLoading}
      />
    </main>
  );
};

export default Budget;
