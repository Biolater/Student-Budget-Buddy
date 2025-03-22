"use client";

import ExpenseFilterOptions from "@/app/components/Expense/ExpenseFilterOptions";
import ExpenseFormV2 from "@/app/components/Expense/ExpenseFormV2";
import ExpenseItems from "@/app/components/Expense/ExpenseItems";
import { useAuth } from "@/app/contexts/AuthContext";
import { useCurrency } from "@/app/hooks/useCurrency";
import useExpense from "@/app/hooks/useExpense";
import { filterExpenses } from "@/app/utils/expenses.utils";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import type { RangeValue } from "@heroui/react";
import { type ChangeEvent, useCallback, useMemo, useState } from "react";
import type { ZonedDateTime } from "@internationalized/date";
import { useCategory } from "@/app/hooks/useCategory";
import { Skeleton } from "@heroui/react";
import { Alert } from "@heroui/react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@heroui/react";

const ExpenseTracker = () => {
  const { isLoaded, userId } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [dateRangePickerValue, setDateRangePickerValue] =
    useState<RangeValue<ZonedDateTime> | null>(null);

  const {
    fetchExpenses: { data: expenses, isPending: isFetching, error: fetchError },
  } = useExpense(userId);

  const {
    query: { data: currencies, isPending: currenciesLoading },
  } = useCurrency();

  const {
    expenseCategoriesQuery: {
      data: categories,
      isPending: categoriesLoading,
      isError: categoriesError,
    },
  } = useCategory();

  const filteredExpenses = useMemo(() => {
    return filterExpenses(
      expenses ?? [],
      selectedCategory,
      dateRangePickerValue
    );
  }, [expenses, selectedCategory, dateRangePickerValue]);

  const handleCategoryChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setSelectedCategory(e.target.value);
    },
    []
  );

  const handleDateRangeChange = useCallback(
    (value: RangeValue<ZonedDateTime> | null) => {
      setDateRangePickerValue(value);
    },
    []
  );

  const handleDateReset = useCallback(() => setDateRangePickerValue(null), []);

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
          <ExpenseFormV2
            currencies={currencies!}
            categories={categories!}
            categoriesLoading={categoriesLoading}
            currenciesLoading={currenciesLoading}
          />
        </CardBody>
        <CardFooter className="p-6 pt-0 flex flex-col gap-4">
          <ExpenseFilterOptions
            categories={categories ?? []}
            onFilterChange={handleCategoryChange}
            onDateRangePickerReset={handleDateReset}
            onDateRangePickerChange={handleDateRangeChange}
          />
          <ExpenseItems
            userId={userId}
            expenses={filteredExpenses || []}
            expensesLoading={isFetching}
            currencies={currencies || []}
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default ExpenseTracker;
