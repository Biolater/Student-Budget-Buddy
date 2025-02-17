"use client";

import { Card, CardHeader, CardBody, Progress } from "@heroui/react";
import { ArrowRight, BarChart3, DollarSign, TrendingUp, Wallet } from 'lucide-react';
import Link from "next/link";
import { motion } from "framer-motion";

type Currency = {
  code: string;
  symbol: string;
};

type BudgetDataProps = {
  budgets: {
    id: string;
    amount: number;
    currency: string;
    category: string;
    startDate: Date;
    endDate: Date;
  }[];
  expenses: {
    amount: number;
    currency: string;
    date: Date;
    budgetId: string;
  }[];
  defaultCurrency: Currency;
  savingsGoal?: number | null;
  savedAmount?: number | null;
};

const BudgetData: React.FC<BudgetDataProps> = ({
  budgets,
  expenses,
  defaultCurrency,
  savingsGoal,
  savedAmount,
}) => {
  const currencySymbol = defaultCurrency?.symbol || "$";

  // Calculate total budget in default currency
  const totalBudget = budgets.reduce((total, budget) => {
    // Convert budget amount to default currency
    const convertedAmount = convertCurrency(budget.amount, budget.currency, defaultCurrency.code);
    return total + convertedAmount;
  }, 0);

  // Calculate total spent in default currency
  const totalSpent = expenses.reduce((total, expense) => {
    // Convert expense amount to default currency
    const convertedAmount = convertCurrency(expense.amount, expense.currency, defaultCurrency.code);
    return total + convertedAmount;
  }, 0);

  // Calculate remaining budget
  const remainingBudget = totalBudget - totalSpent;

  // Determine the overall budget period
  const earliestStartDate = new Date(Math.min(...budgets.map(b => b.startDate.getTime())));
  const latestEndDate = new Date(Math.max(...budgets.map(b => b.endDate.getTime())));
  const budgetPeriod = `${formatDate(earliestStartDate)} - ${formatDate(latestEndDate)}`;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Total Budget Card */}
      <motion.div variants={cardVariants} className="h-full">
        <Card className="bg-card border-border h-full">
          <CardHeader className="justify-between p-4 items-center">
            <h3 className="tracking-tight text-sm font-medium text-foreground">
              Total Budget
            </h3>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardBody className="p-4 pt-0 flex flex-col justify-between gap-2">
            <div className="flex flex-col gap-1">
              <div className="text-2xl font-bold text-foreground">
                {currencySymbol}{totalBudget.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {budgetPeriod}
              </p>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Spent Card */}
      <motion.div variants={cardVariants} className="h-full">
        <Card className="bg-card border-border h-full">
          <CardHeader className="justify-between p-4 items-center">
            <h3 className="tracking-tight text-sm font-medium text-foreground">
              Spent
            </h3>
            <Wallet className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardBody className="p-4 pt-0 flex flex-col justify-between gap-2">
            <div className="flex flex-col gap-1">
              <div className="text-2xl font-bold text-foreground">
                {currencySymbol}{totalSpent.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {((totalSpent / totalBudget) * 100).toFixed(1)}% of total budget
              </p>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Remaining Card */}
      <motion.div variants={cardVariants} className="h-full">
        <Card className="bg-card border-border h-full">
          <CardHeader className="justify-between p-4 items-center">
            <h3 className="tracking-tight text-sm font-medium text-foreground">
              Remaining
            </h3>
            <BarChart3 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardBody className="p-4 pt-0 flex flex-col justify-between gap-2">
            <div className="flex flex-col gap-1">
              <div className="text-2xl font-bold text-foreground">
                {currencySymbol}{remainingBudget.toLocaleString()}
              </div>
              <Progress
                aria-label="Budget progress"
                classNames={{
                  base: "max-w-full",
                  track: "drop-shadow-md border border-default",
                  indicator: `${
                    (totalSpent / totalBudget) * 100 > 100
                      ? "bg-destructive"
                      : (totalSpent / totalBudget) * 100 > 75
                      ? "bg-warning"
                      : (totalSpent / totalBudget) * 100 > 50
                      ? "bg-primary"
                      : "bg-success"
                  }`,
                  label: "tracking-wider font-medium text-default-600",
                  value: "text-foreground/60",
                }}
                value={Math.min((totalSpent / totalBudget) * 100, 100)}
              />
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Savings Goal Card */}
      <motion.div variants={cardVariants} className="h-full">
        <Card className="bg-card border-border h-full">
          <CardHeader className="justify-between p-4 items-center">
            <h3 className="tracking-tight text-sm font-medium text-foreground">
              Savings Goal
            </h3>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardBody className="p-4 pt-0 flex flex-col justify-between gap-2">
            {savingsGoal ? (
              <>
                <div className="flex flex-col gap-1">
                  <div className="text-2xl font-bold text-foreground">
                    {currencySymbol}{savingsGoal.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {currencySymbol}{savedAmount?.toLocaleString()} saved so far
                  </p>
                  <Progress
                    aria-label="Savings progress"
                    classNames={{
                      base: "max-w-full",
                      track: "drop-shadow-md border border-default",
                      indicator: `${
                        ((savedAmount || 0) / savingsGoal) * 100 >= 100
                          ? "bg-success"
                          : ((savedAmount || 0) / savingsGoal) * 100 >= 75
                          ? "bg-primary"
                          : ((savedAmount || 0) / savingsGoal) * 100 >= 50
                          ? "bg-warning"
                          : "bg-destructive"
                      }`,
                      label: "tracking-wider font-medium text-default-600",
                      value: "text-foreground/60",
                    }}
                    value={Math.min(savedAmount ? ((savedAmount / savingsGoal) * 100) : 0, 100)}
                  />
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">
                  No savings goal set
                </p>
                <Link
                  href="/goals"
                  className="inline-flex self-start items-center gap-2 text-sm text-primary hover:underline"
                >
                  Set a goal
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            )}
          </CardBody>
        </Card>
      </motion.div>
    </motion.div>
  );
};

// Helper function to convert currency (you'll need to implement this)
function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
  // Implement currency conversion logic here
  // For now, we'll just return the amount
  return amount;
}

// Helper function to format date
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default BudgetData;