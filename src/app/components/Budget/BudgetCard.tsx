import React, { useState, useEffect } from "react";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/react";
import { BudgetCategory, Currency, Prisma } from "@prisma/client";
import {
  convertToBudgetCurrency,
  getBudgetStatus,
} from "@/app/utils/budget.utils";
type ExpenseWithCurrency = Prisma.ExpenseGetPayload<{
  include: { currency: true };
}>;

interface BudgetCardProps {
  budget: {
    id: string;
    userId: string;
    budgetCategoryId: string;
    currencyId: string;
    amount: number;
    periodType: string;
    startDate: Date;
    endDate: Date;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    category: BudgetCategory;
    currency: Currency;
    expenses: (Omit<ExpenseWithCurrency, "amount"> & { amount: number })[];
  };
}

const BudgetCard = ({ budget }: BudgetCardProps) => {
  const [budgetStatus, setBudgetStatus] = useState<
    "success" | "warning" | "danger" | undefined
  >(undefined);
  const [expensesTotal, setExpensesTotal] = useState<number>(0);

  useEffect(() => {
    const calculateExpenses = async () => {
      let total = 0;
      for (const expense of budget.expenses) {
        if (expense.currency.code !== budget.currency.code) {
          const convertedAmount = await convertToBudgetCurrency(
            expense.amount,
            expense.currency.code,
            budget.currency.code
          );
          total += convertedAmount;
        } else {
          total += expense.amount;
        }
      }
      setExpensesTotal(total);
      setBudgetStatus(getBudgetStatus(budget.amount, total));
    };
    calculateExpenses();
  }, [budget]);

  return (
    <Card>
      <CardHeader
        className={`w-full p-0 m-0 h-1 bg-${budgetStatus} rounded-t-lg`}
      />
      <CardBody className="items-start flex-row gap-4">
        <div className="size-10 bg-danger/20 rounded-full flex items-center justify-center">
          {budget.category.icon}
        </div>
        <div className="flex flex-col flex-1 gap-2">
          <div className="flex justify-between items-start flex-1">
            <h3 className="font-semibold truncate">{budget.category.name}</h3>
            <span className="font-bold">
              {budget.currency.symbol}
              {budget.amount}
            </span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              {budget.currency.symbol}
              {expensesTotal}
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
      <CardFooter className="w-full flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-credit-card h-3 w-3"
          >
            <rect width="20" height="14" x="2" y="5" rx="2"></rect>
            <line x1="2" x2="22" y1="10" y2="10"></line>
          </svg>
          <span>
            {budget.expenses.length} expense
            {budget.expenses.length === 1 ? "" : "s"}
          </span>
        </div>
        <div className="text-xs font-medium text-primary/60 hover:text-primary cursor-pointer group transition-colors flex items-center">
          View Details
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide group-hover:translate-x-0.5 transition-transform lucide-chevron-right h-3 w-3 ml-1"
          >
            <path d="m9 18 6-6-6-6"></path>
          </svg>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BudgetCard;
