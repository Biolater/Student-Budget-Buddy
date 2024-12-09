"use client";
import { ChangeEvent, useEffect, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";
import ExpenseForm from "./ExpenseForm";
import fetchExpensesByUser from "@/actions/Expense/fetchExpenses";
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

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [expensesLoading, setExpensesLoading] = useState(true);
  const [dateRangePickerValue, setDateRangePickerValue] =
    useState<RangeValue<ZonedDateTime> | null>(null);
  const { userId } = useAuth();

  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const filterCategory = e.target.value;
    if (filterCategory === "All Categories") {
      setFilteredExpenses(expenses);
    } else {
      setFilteredExpenses(
        expenses.filter((expense) => expense.category === filterCategory)
      );
    }
  };

  const handleExpenseCreation = (expense: Expense) => {
    // setExpenses((prevExpenses) =>
    //   [expense, ...prevExpenses].sort((a, b) => b.date.localeCompare(a.date))
    // );
    // setFilteredExpenses((prevExpenses) =>
    //   [expense, ...prevExpenses].sort((a, b) => b.date.localeCompare(a.date))
    // );
    setExpenses((prevExpenses) => [...prevExpenses, expense]);
    setFilteredExpenses((prevExpenses) => [...prevExpenses, expense]);
  };

  const handleExpenseDeletion = (expense: Expense) => {
    const id = expense.id;
    setExpenses((prevExpenses) =>
      prevExpenses.filter((expense) => expense.id !== id)
    );
    setFilteredExpenses((prevExpenses) =>
      prevExpenses.filter((expense) => expense.id !== id)
    );
  };

  const handleExpenseUpdate = (expense: Expense) => {
    setExpenses((prevExpenses) =>
      prevExpenses.map((prevExpense) =>
        prevExpense.id === expense.id ? expense : prevExpense
      )
    );
    setFilteredExpenses((prevExpenses) =>
      prevExpenses.map((prevExpense) =>
        prevExpense.id === expense.id ? expense : prevExpense
      )
    );
  };

  const handleDateRangePicker = (value: RangeValue<ZonedDateTime> | null) => {
    if (value) {
      setDateRangePickerValue(value);
      const { start, end } = value;
      const {
        day: startDay,
        month: startMonth,
        year: startYear,
        hour: startHour,
        minute: startMinute,
        second: startSecond,
        offset: startOffset,
      } = start;
      const {
        day: endDay,
        month: endMonth,
        year: endYear,
        hour: endHour,
        minute: endMinute,
        second: endSecond,
        offset: endOffset,
      } = end;
      setDateRangePickerValue(value);
      setFilteredExpenses(
        expenses.filter(
          (expense) =>
            expense.date >= start.toDate() && expense.date <= end.toDate()
        )
      );
    }
  };

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setExpensesLoading(true);
        if (userId) {
          const data: Expense[] = await fetchExpensesByUser(userId);
          setExpenses(data);
          setFilteredExpenses(data);
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
      } finally {
        setExpensesLoading(false);
      }
    };
    fetchExpenses();
  }, [userId]);

  return (
    <div className="container max-w-4xl mx-auto p-4">
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
            onExpenseCreated={handleExpenseCreation}
          />
        </CardBody>
        <CardFooter className="p-6 pt-0 flex flex-col gap-4">
          <ExpenseFilterOptions
            onFilterChange={handleFilterChange}
            onDateRangePickerChange={handleDateRangePicker}
          />
          <ExpenseItems
            userId={userId}
            expenses={filteredExpenses}
            expensesLoading={expensesLoading}
            onExpenseCreation={handleExpenseCreation}
            onExpenseDeletionFinished={handleExpenseDeletion}
            onExpenseUpdate={handleExpenseUpdate}
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default ExpenseTracker;
