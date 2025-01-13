"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { useAuth } from "@clerk/nextjs";
import ExpenseForm from "./ExpenseForm";
import ExpenseFilterOptions from "./ExpenseFilterOptions";
import ExpenseItems from "./ExpenseItems";
import type { RangeValue } from "@nextui-org/react";
import type { ZonedDateTime } from "@internationalized/date";
import useExpenses from "@/hooks/useExpense";
import toast from "react-hot-toast";
import { Category } from "@/actions/expense.actions";

export type Expense = {
  id: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  currency: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
};

// Utility function for filtering expenses
const filterExpenses = (
  expenses: Expense[],
  category: string = "All Categories",
  dateRange: RangeValue<ZonedDateTime> | null = null
): Expense[] => {
  return expenses.filter((expense) => {
    const matchesCategory =
      category === "All Categories" || expense.category === category;
    const matchesDateRange =
      !dateRange ||
      (expense.date >= dateRange.start.toDate() &&
        expense.date <= dateRange.end.toDate());

    return matchesCategory && matchesDateRange;
  });
};

const ExpenseTracker = () => {
  const [dateRangePickerValue, setDateRangePickerValue] =
    useState<RangeValue<ZonedDateTime> | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<string>("All Categories");
  const { userId } = useAuth();
  const {
    query: { data: expenses, isPending: isFetching, error: fetchError },
  } = useExpenses(userId);

  useEffect(() => {
    if (fetchError) {
      toast.error(fetchError.message);
    }
  }, [fetchError]);

  // Compute filtered expenses using useMemo
  const filteredExpenses = useMemo(() => {
    return filterExpenses(
      expenses || [],
      selectedCategory,
      dateRangePickerValue
    );
  }, [expenses, selectedCategory, dateRangePickerValue]);

  return (
    <div className="container max-w-4xl mx-auto p-4 md:py-8">
      <Card aria-labelledby="expense-tracker bg-card">
        <CardHeader className="flex-col items-start p-6">
          <h3 className="font-semibold tracking-tight text-2xl sm:text-3xl">
            Expense Tracker
          </h3>
          <p className="text-muted-foreground text-sm sm:text-base">
            Keep track of your expenses easily.
          </p>
        </CardHeader>
        <CardBody className="p-6 pt-0">
          <ExpenseForm
            userId={userId}
          />
        </CardBody>
        <CardFooter className="p-6 pt-0 flex flex-col gap-4">
          <ExpenseFilterOptions
            onFilterChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setSelectedCategory(e.target.value)
            }
            onDateRangePickerChange={(value) => setDateRangePickerValue(value)}
          />
          <ExpenseItems
            userId={userId}
            expenses={filteredExpenses}
            expensesLoading={isFetching}
            onExpenseCreation={() => {}}
            onExpenseDeletionFinished={() => {}}
            onExpenseUpdate={() => {}}
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default ExpenseTracker;
