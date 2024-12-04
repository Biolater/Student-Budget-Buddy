"use client";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Skeleton,
  useDisclosure,
} from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { useAuth } from "@clerk/nextjs";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import toast from "react-hot-toast";
import { format } from "date-fns";
import ExpenseForm from "./ExpenseForm";
import deleteAnExpense from "@/actions/Expense/deleteExpense";
import fetchExpensesByUser from "@/actions/Expense/fetchExpenses";
import ExpenseFilterOptions from "./ExpenseFilterOptions";
import ExpenseItems from "./ExpenseItems";

export type Expense = {
  id: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  currency: string;
  date: string;
  createdAt: Date;
  updatedAt: Date;
};
const currencies = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "TRY", symbol: "₺" },
  { code: "AZN", symbol: "₼" },
];

const TABLE_HEADERS = ["Date", "Amount", "Category", "Description", "Actions"];

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [expensesLoading, setExpensesLoading] = useState(true);
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
    setExpenses((prevExpenses) => [expense, ...prevExpenses].sort((a, b) => b.date.localeCompare(a.date)));
    setFilteredExpenses((prevExpenses) => [expense, ...prevExpenses].sort((a, b) => b.date.localeCompare(a.date)));
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
          <ExpenseFilterOptions onFilterChange={handleFilterChange} />
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
