import React from "react";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/react";
import { CreditCardIcon, ChevronRightIcon } from "./icons";
import { cn } from "@/app/lib/utils";
import { BudgetCategory, Currency, Prisma } from "@prisma/client";
import { useBudgetStats } from "@/app/hooks/useBudgetStats";
type ExpenseWithCurrency = Prisma.ExpenseGetPayload<{
  include: { currency: true };
}>;

import type { ExtendedBudget } from "@/app/types/budget.types";

interface BudgetCardProps {
  budget: ExtendedBudget;
  stats: any;
}

const BudgetCard = ({ budget, stats }: BudgetCardProps) => {

  if (!stats) {
    return (
      <Card>
        <CardHeader>Error loading budget stats</CardHeader>
      </Card>
    );
  }

  const { expensesTotal, budgetStatus } = stats;

  return (
    <Card className="group cursor-pointer transition-all">
      <CardHeader
        className={cn(
          "w-full p-0 m-0 h-1 rounded-t-lg",
          budgetStatus === "success" && "bg-success",
          budgetStatus === "warning" && "bg-warning",
          budgetStatus === "danger" && "bg-danger"
        )}
      />
      <CardBody className="items-start flex-row gap-4">
        <div
          className={cn(
            "size-10 rounded-full flex items-center justify-center",
            budgetStatus === "success" && "bg-success/20",
            budgetStatus === "warning" && "bg-warning/20",
            budgetStatus === "danger" && "bg-danger/20"
          )}
        >
          {budget.category.icon}
        </div>
        <div className="flex flex-col flex-1 gap-2">
          <div className="flex justify-between items-start flex-1">
            <h3 className="font-semibold truncate">{budget.category.name}</h3>
            <span className="font-bold">
              {budget.currency.symbol}
              {budget.amount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              {budget.currency.symbol}
              {expensesTotal.toFixed(2)}
            </span>
            <span className="font-medium">
              {((expensesTotal / budget.amount) * 100).toFixed(2)}%
            </span>
          </div>
          <Progress
            value={
              budget.amount === 0 ? 0 : (expensesTotal / budget.amount) * 100
            }
            color={budgetStatus ?? undefined}
          />
          <div className="flex justify-between text-xs text-muted-foreground pt-1">
            <span>{budget.startDate.toDateString()}</span>
            <span>{budget.endDate.toDateString()}</span>
          </div>
        </div>
      </CardBody>
      <CardFooter className="w-full flex items-center justify-between border-t">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <CreditCardIcon />
          <span>
            {budget.expenses.length} expense
            {budget.expenses.length === 1 ? "" : "s"}
          </span>
        </div>
        <div className="text-xs font-medium text-primary/60 group-hover:text-primary cursor-pointer transition-colors flex items-center">
          View Details
          <ChevronRightIcon />
        </div>
      </CardFooter>
    </Card>
  );
};

export default BudgetCard;
