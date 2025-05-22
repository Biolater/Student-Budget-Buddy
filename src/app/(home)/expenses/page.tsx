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
import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ZonedDateTime } from "@internationalized/date";
import { useCategory } from "@/app/hooks/useCategory";
import { addToast } from "@heroui/react";
import SectionHeader from "@/app/components/ui/SectionHeader";

const ExpenseTracker = () => {
  const { userId } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [dateRangePickerValue, setDateRangePickerValue] =
    useState<RangeValue<ZonedDateTime> | null>(null);

  const {
    fetchExpenses: {
      data: expenses,
      isPending: isFetching,
      error: expensesError,
    },
  } = useExpense(userId ?? "");

  const {
    query: {
      data: currencies,
      isPending: currenciesLoading,
      error: currenciesError,
    },
    fetchDefaultUserCurrency: {
      data: defaultUserCurrency,
      isPending: defaultUserCurrencyLoading,
      error: defaultUserCurrencyError,
    },
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

  useEffect(() => {
    if (currenciesError) {
      addToast({
        title: "Error",
        description: "Failed to fetch currencies.",
        color: "danger",
      });
    } else if (categoriesError) {
      addToast({
        title: "Error",
        description: "Failed to fetch categories.",
        color: "danger",
      });
    } else if (expensesError) {
      {
      }
      addToast({
        title: "Error",
        description: "Failed to fetch expenses.",
        color: "danger",
      });
    } else if (defaultUserCurrencyError) {
      addToast({
        title: "Error",
        description: "Failed to fetch default user currency.",
        color: "danger",
      });
    }
  }, [
    currenciesError,
    categoriesError,
    expensesError,
    defaultUserCurrencyError,
  ]);

  return (
    <main className="container max-w-4xl mx-auto p-4 md:py-8 flex flex-col gap-4">
      <SectionHeader
        title="Expense Tracker"
        description="Keep track of your expenses easily."
      />
      <Card className="expense-tracker bg-card">
        <CardBody className="p-6">
          <ExpenseFormV2
            currencies={currencies ?? []}
            categories={categories ?? []}
            loading={
              categoriesLoading ||
              currenciesLoading ||
              defaultUserCurrencyLoading
            }
            defaultUserCurrency={defaultUserCurrency}
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
            expenses={filteredExpenses ?? []}
            expensesLoading={isFetching}
            currencies={currencies ?? []}
            categories={categories ?? []}
            currenciesLoading={currenciesLoading}
            categoriesLoading={categoriesLoading}
          />
        </CardFooter>
      </Card>
    </main>
  );
};

export default ExpenseTracker;
