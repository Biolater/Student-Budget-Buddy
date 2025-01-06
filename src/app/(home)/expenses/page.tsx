"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";
import ExpenseForm from "./ExpenseForm";
import { fetchExpensesByUser } from "@/actions/expense.actions";
import ExpenseFilterOptions from "./ExpenseFilterOptions";
import ExpenseItems from "./ExpenseItems";
import type { RangeValue } from "@nextui-org/react";
import type { ZonedDateTime } from "@internationalized/date";

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
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [dateRangePickerValue, setDateRangePickerValue] =
    useState<RangeValue<ZonedDateTime> | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<string>("All Categories");
  const { userId } = useAuth();

  // Compute filtered expenses using useMemo
  const filteredExpenses = useMemo(() => {
    return filterExpenses(expenses, selectedCategory, dateRangePickerValue);
  }, [expenses, selectedCategory, dateRangePickerValue]);

  // Update expenses and automatically reapply filters
  const updateExpenses = (newExpenses: Expense[]) => {
    setExpenses(newExpenses);
  };

  // Fetch expenses on component mount
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        if (userId) {
          const data = await fetchExpensesByUser();
          setExpenses(data);
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
      }
    };
    fetchExpenses();
  }, [userId]);

  return (
    <div className="container max-w-4xl mx-auto p-4 md:py-8">
      <Card aria-labelledby="expense-tracker">
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
            onExpenseCreated={(expense) =>
              updateExpenses([...expenses, expense])
            }
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
            expensesLoading={!expenses.length}
            onExpenseCreation={(expense) =>
              updateExpenses([...expenses, expense])
            }
            onExpenseDeletionFinished={(expense) =>
              updateExpenses(expenses.filter((e) => e.id !== expense.id))
            }
            onExpenseUpdate={(expense) =>
              updateExpenses(
                expenses.map((e) => (e.id === expense.id ? expense : e))
              )
            }
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default ExpenseTracker;
