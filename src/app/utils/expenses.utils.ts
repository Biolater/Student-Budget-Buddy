import type { RangeValue } from "@heroui/react";
import type { ZonedDateTime } from "@internationalized/date";
import type { ExtendedExpense } from "../types/expense.types";

export const filterExpenses = (
    expenses: ExtendedExpense[],
    category: string | null,
    dateRange: RangeValue<ZonedDateTime> | null = null
): ExtendedExpense[] => {
    const isAllCategories = !category;
    
    // Convert ZonedDateTime to Date and normalize to start/end of day for comparison
    const startDate = dateRange?.start?.toDate();
    const endDate = dateRange?.end?.toDate();
    
    // If no date range is provided, include all dates
    if (!startDate || !endDate) {
        return expenses.filter(({ category: expenseCategory }) => 
            isAllCategories || expenseCategory.name === category
        );
    }

    // Normalize dates to start and end of day for accurate comparison
    const normalizedStartDate = new Date(startDate);
    normalizedStartDate.setHours(0, 0, 0, 0);
    
    const normalizedEndDate = new Date(endDate);
    normalizedEndDate.setHours(23, 59, 59, 999);

    return expenses.filter(({ category: expenseCategory, date }) => {
        const matchesCategory = isAllCategories || expenseCategory.name === category;
        
        // Convert expense date to Date object if it's not already
        const expenseDate = date instanceof Date ? date : new Date(date);
        
        // Check if expense date falls within the range
        const matchesDateRange = expenseDate >= normalizedStartDate && 
                               expenseDate <= normalizedEndDate;

        return matchesCategory && matchesDateRange;
    });
};


