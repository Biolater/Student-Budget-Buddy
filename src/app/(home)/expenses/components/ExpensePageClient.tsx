"use client";

import { useCallback, useMemo, useState, useTransition, type ChangeEvent } from "react";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Input } from "@heroui/input";
import { Pagination } from "@heroui/pagination";
import { Spinner } from "@heroui/spinner";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import type { RangeValue } from "@heroui/react";
import type { ZonedDateTime } from "@internationalized/date";
import ExpenseFormV2 from "@/app/components/Expense/ExpenseFormV2";
import ExpenseFilterOptions from "@/app/components/Expense/ExpenseFilterOptions";
import ExpenseItems from "@/app/components/Expense/ExpenseItems";
import SectionHeader from "@/app/components/ui/SectionHeader";
import { filterExpenses } from "@/app/utils/expenses.utils";
import type { ClientCurrencyItem } from "@/app/types/currency.types";
import type { ExpenseCategoryRef } from "@/app/types/category.types";
import type { ExtendedExpense } from "@/app/types/expense.types";

export interface ExpensePageClientProps {
  categories: ExpenseCategoryRef[];
  currencies: ClientCurrencyItem[];
  defaultCurrency: ClientCurrencyItem | null;
  expenses: ExtendedExpense[];
  totalPages: number;
  currentPage: number;
  searchQuery: string;
}

export default function ExpensePageClient({
  categories,
  currencies,
  defaultCurrency,
  expenses,
  totalPages,
  currentPage,
  searchQuery,
}: ExpensePageClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [dateRangePickerValue, setDateRangePickerValue] =
    useState<RangeValue<ZonedDateTime> | null>(null);

  // Handle search with debouncing and loading state
  const handleSearch = useDebouncedCallback((term: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set('page', '1'); // Reset to first page on new search
      if (term) {
        params.set('query', term);
      } else {
        params.delete('query');
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }, 500);

  // Handle pagination with loading state
  const handlePageChange = useCallback((page: number) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set('page', page.toString());
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }, [pathname, router, searchParams]);

  // Filter expenses based on selected filters (client-side filtering for category/date)
  const filteredExpenses = useMemo(() => {
    return filterExpenses(
      expenses,
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
    <main className="container max-w-4xl mx-auto p-4 md:py-8 flex flex-col gap-4">
      <SectionHeader
        title="Expense Tracker"
        description="Keep track of your expenses easily."
      />
      <Card className="expense-tracker">
        <CardBody className="p-6">
          <ExpenseFormV2
            currencies={currencies}
            categories={categories}
            loading={false}
            defaultUserCurrency={defaultCurrency}
          />
        </CardBody>
        <CardFooter className="p-6 pt-0 flex flex-col gap-4">
          {/* Search Input with Loading State */}
          <div className="w-full relative">
            <Input
              type="text"
              placeholder="Search expenses..."
              defaultValue={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              isDisabled={isPending}
              startContent={
                isPending ? (
                  <Spinner size="sm" />
                ) : (
                  <MagnifyingGlassIcon className="h-4 w-4 text-default-400" />
                )
              }
              classNames={{
                base: "max-w-full",
                mainWrapper: "h-full",
                input: "text-small",
                inputWrapper: `h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20 ${
                  isPending ? "opacity-70" : ""
                }`,
              }}
            />
          </div>

          <ExpenseFilterOptions
            categories={categories}
            onFilterChange={handleCategoryChange}
            onDateRangePickerReset={handleDateReset}
            onDateRangePickerChange={handleDateRangeChange}
          />
          
          <ExpenseItems
            userId={null}
            expenses={filteredExpenses}
            expensesLoading={isPending} // Show loading during server operations
            currencies={currencies}
            categories={categories}
            currenciesLoading={false}
            categoriesLoading={false}
          />

          {/* Pagination with Loading State */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 relative">
              <Pagination
                total={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                showControls
                showShadow
                color="primary"
                size="lg"
                isDisabled={isPending} // Disable pagination during loading
                classNames={{
                  wrapper: isPending ? "opacity-70" : "",
                }}
              />
              {isPending && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-background/80 backdrop-blur-sm rounded-lg px-3 py-1 flex items-center gap-2">
                    <Spinner size="sm" />
                    <span className="text-xs text-default-600">Loading...</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardFooter>
      </Card>
    </main>
  );
} 