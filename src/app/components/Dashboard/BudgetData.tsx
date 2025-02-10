"use client";

import { Card, CardHeader, CardBody, Progress } from "@heroui/react";
import {
  ArrowRight,
  BarChart3,
  DollarSign,
  TrendingUp,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Currency } from "@prisma/client";

type BudgetDataProps = {
  totalBudget?: number | null;
  spent?: number | null;
  savingsGoal?: number | null;
  savedAmount?: number | null;
  defaultCurrency: Currency | undefined;
};

const BudgetData: React.FC<BudgetDataProps> = ({
  totalBudget,
  spent,
  savingsGoal,
  savedAmount,
  defaultCurrency,
}) => {
  const currencySymbol = defaultCurrency?.symbol || "$";

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
            {totalBudget ? (
              <>
                <div className="flex flex-col gap-1">
                  <div className="text-2xl font-bold text-foreground">
                    {currencySymbol}
                    {totalBudget.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    For this semester
                  </p>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">No budget set</p>
                <Link
                  href="/budget"
                  className="inline-flex self-start items-center gap-2 text-sm text-primary hover:underline"
                >
                  Add Budget
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            )}
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
            {spent ? (
              <div className="flex flex-col gap-1">
                <div className="text-2xl font-bold text-foreground">
                  {currencySymbol}
                  {spent.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {totalBudget
                    ? `${((spent / totalBudget) * 100).toFixed(
                        1
                      )}% of total budget`
                    : ""}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">
                  No expenses recorded
                </p>
                <Link
                  href="/expenses"
                  className="inline-flex self-start items-center gap-2 text-sm text-primary hover:underline"
                >
                  Add expenses
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            )}
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
            {totalBudget && spent ? (
              <>
                <div className="flex flex-col gap-1">
                  <div className="text-2xl font-bold text-foreground">
                    {currencySymbol}
                    {(totalBudget - spent).toLocaleString()}
                  </div>
                  <Progress
                    aria-label="Budget progress"
                    classNames={{
                      base: "max-w-full",
                      track: "drop-shadow-md border border-default",
                      indicator: `${
                        (spent / totalBudget) * 100 > 100
                          ? "bg-destructive"
                          : (spent / totalBudget) * 100 > 75
                          ? "bg-warning"
                          : (spent / totalBudget) * 100 > 50
                          ? "bg-primary"
                          : "bg-success"
                      }`,
                      label: "tracking-wider font-medium text-default-600",
                      value: "text-foreground/60",
                    }}
                    value={Math.min((spent / totalBudget) * 100, 100)}
                  />
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">
                  Set a budget to track remaining funds
                </p>
                <Link
                  href="/budget"
                  className="inline-flex self-start items-center gap-2 text-sm text-primary hover:underline"
                >
                  Set budget
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            )}
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
                    {currencySymbol}
                    {savingsGoal.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {currencySymbol}
                    {savedAmount?.toLocaleString()} saved so far
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
                    value={Math.min(
                      savedAmount ? (savedAmount / savingsGoal) * 100 : 0,
                      100
                    )}
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

export default BudgetData;
