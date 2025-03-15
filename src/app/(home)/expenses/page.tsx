"use client";

import ExpenseFilterOptions from "@/app/components/Expense/ExpenseFilterOptions";
import ExpenseForm from "@/app/components/Expense/ExpenseForm";
import ExpenseFormV2 from "@/app/components/Expense/ExpenseFormV2";
import ExpenseItems from "@/app/components/Expense/ExpenseItems";
import { useAuth } from "@/app/contexts/AuthContext";
import { useCurrency } from "@/app/hooks/useCurrency";
import useExpense from "@/app/hooks/useExpense";
/* import { ChangeEvent, useEffect, useMemo, useState } from "react";
 */ import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { ChangeEvent, useEffect } from "react";
/* import { useAuth } from "@clerk/nextjs";
import ExpenseForm from "../../components/Expense/ExpenseForm";
import ExpenseFilterOptions from "../../components/Expense/ExpenseFilterOptions";
import ExpenseItems from "../../components/Expense/ExpenseItems";
import type { RangeValue } from "@heroui/react";
import type { ZonedDateTime } from "@internationalized/date";
import useExpenses from "@/hooks/useExpense";
import toast from "react-hot-toast";

 */
// Utility function for filtering expenses
/* const filterExpenses = (
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
 */
const ExpenseTracker = () => {
  const { isLoaded, userId } = useAuth();
  /*   const [dateRangePickerValue, setDateRangePickerValue] =
    useState<RangeValue<ZonedDateTime> | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<string>("All Categories");
  const { userId } = useAuth();
  const {
    query: { data: expenses, isPending: isFetching, error: fetchError },
  } = useExpenses(userId); */

  /*   useEffect(() => {
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
 */

  const {
    fetchExpenses: { data: expenses, isPending: isFetching, error: fetchError },
  } = useExpense(userId);

  const {
    query: {
      data: currencies,
      isPending: currenciesLoading,
      isError: currenciesError,
    },
  } = useCurrency();

  if (!isLoaded || !userId || isFetching) return null;

  return (
    <div className="container max-w-4xl mx-auto p-4 md:py-8">
      <Card className="expense-tracker bg-card">
        <CardHeader className="flex-col items-start p-6">
          <h3 className="font-semibold tracking-tight text-2xl sm:text-3xl">
            Expense Tracker
          </h3>
          <p className="text-muted-foreground text-sm sm:text-base">
            Keep track of your expenses easily.
          </p>
        </CardHeader>
        <CardBody className="p-6 pt-0">
          <ExpenseFormV2 currencies={currencies!} currenciesLoading={currenciesLoading} />
        </CardBody>
        <CardFooter className="p-6 pt-0 flex flex-col gap-4">
          {/* <ExpenseFilterOptions
            onFilterChange={
              (e: ChangeEvent<HTMLSelectElement>) => {}
              // setSelectedCategory(e.target.value)
            }
            // onDateRangePickerReset={() => setDateRangePickerValue(null)}
            // onDateRangePickerChange={(value) => setDateRangePickerValue(value)}
          /> */}
          <ExpenseItems
            userId={userId}
            expenses={expenses}
            expensesLoading={isFetching}
            currencies={currencies || []}
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default ExpenseTracker;
