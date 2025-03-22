import type { RangeValue } from "@heroui/react";
import type { ZonedDateTime } from "@internationalized/date";
import type { ExtendedExpense } from "../types/expense.types";

export const filterExpenses = (
    expenses: ExtendedExpense[],
    category: string | null,
    dateRange: RangeValue<ZonedDateTime> | null = null
): ExtendedExpense[] => {
    const isAllCategories = !category;
    const startDate = dateRange?.start?.toDate();
    const endDate = dateRange?.end?.toDate();

    return expenses.filter(({ category: expenseCategory, date }) => {
        const matchesCategory = isAllCategories || expenseCategory.name === category;

        const matchesDateRange =
            !startDate || !endDate || (date >= startDate && date <= endDate);

        return matchesCategory && matchesDateRange;
    });
};


