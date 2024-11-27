"use client";
import { ChangeEvent, useEffect, useState } from "react";
import { CalendarIcon, Loader2, Pencil, Trash2 } from "lucide-react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { DateRangePicker } from "@nextui-org/react";
import ClientDatePicker from "./ClientDatePicker";
import { Input, Textarea } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { Button } from "@nextui-org/button";
import { DateValue } from "@nextui-org/react";
import { useAuth } from "@clerk/nextjs";
import createExpenseAction, { type Category } from "@/actions/createExpense";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { pre } from "framer-motion/client";

type Expense = {
  id: string;
  userId: string;
  amount: string;
  category: string;
  description: string;
  currency: string;
  date: string;
  createdAt: string;
  updatedAt: string;
};
const currencies = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "TRY", symbol: "₺" },
  { code: "AZN", symbol: "₼" },
];

const categories = [
  { code: "Food", symbol: "🍔" },
  { code: "Entertainment", symbol: "🎉" },
  { code: "Transport", symbol: "🚗" },
  { code: "Health", symbol: "💊" },
  { code: "Education", symbol: "📚" },
  { code: "Clothing", symbol: "👕" },
  { code: "Pets", symbol: "🐶" },
  { code: "Travel", symbol: "🌳" },
  { code: "Other", symbol: "🤷‍♀️" },
];

const categories2 = [{ code: "All Categories", symbol: "" }, ...categories];

const TABLE_HEADERS = ["Date", "Amount", "Category", "Description", "Actions"];

const ExpenseTracker = () => {
  const [date, setDate] = useState<DateValue | null>(null);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("");
  const [category, setCategory] = useState<Category>("");
  // const [filterCategory, setFilterCategory] = useState<Category>("Food");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();

  const clearForm = () => {
    setDate(null);
    setAmount("");
    setCurrency("");
    setCategory("");
    setDescription("");
  };

  // Error states
  const [errors, setErrors] = useState({
    date: "",
    amount: "",
    currency: "",
    category: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate form
    let isValid = true;
    const newErrors = {
      date: date ? "" : "Date is required.",
      amount: amount ? "" : "Amount is required.",
      currency: currency ? "" : "Currency is required.",
      category: category ? "" : "Category is required.",
      description: description ? "" : "Description is required.",
    };

    // Check if all required fields are filled
    for (let key in newErrors) {
      if (newErrors[key as keyof typeof newErrors]) {
        isValid = false;
      }
    }

    setErrors(newErrors);

    // If the form is valid, proceed with form submission logic (e.g., save data)
    if (
      isValid &&
      date &&
      amount &&
      currency &&
      category &&
      description &&
      userId
    ) {
      const { year, month, day } = date;
      const newDate = new Date(year, month - 1, day);
      const correctCategory = category.split("-")[0] as Category;
      try {
        setLoading(true);
        const expense = await createExpenseAction(
          newDate,
          parseFloat(amount),
          currency,
          correctCategory,
          description,
          userId,
          errors
        );
        if (expense)
          setExpenses([
            {
              ...expense,
              amount: expense.amount.toString(),
              date: expense.date.toString(),
              createdAt: expense.createdAt.toString(),
              updatedAt: expense.updatedAt.toString(),
            },
            ...expenses,
          ]);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
      clearForm();
    }
  };

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

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        if (userId) {
          const response = await fetch(`/api/expenses?userId=${userId}`);
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          const data: Expense[] = await response.json();
          setExpenses(data);
          setFilteredExpenses(data)
        }
        // setExpenses(data);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
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
        <CardBody className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-muted-foreground"
                >
                  Date
                </label>
                <ClientDatePicker value={date} onChange={setDate} />
                {errors.date && (
                  <p className="text-red-500 text-sm">{errors.date}</p>
                )}
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-muted-foreground"
                >
                  Amount
                </label>
                <Input
                  aria-labelledby="amount"
                  isRequired
                  size="md"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                {errors.amount && (
                  <p className="text-red-500 text-sm">{errors.amount}</p>
                )}
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="currency"
                  className="block text-sm font-medium text-muted-foreground"
                >
                  Currency
                </label>
                <Select
                  aria-labelledby="currency"
                  onChange={(e) => setCurrency(e.target.value)}
                  selectedKeys={[currency]}
                  errorMessage={errors.currency}
                  isRequired
                  size="md"
                  placeholder="Select currency"
                >
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {`${currency.symbol} ${currency.code}`}
                    </SelectItem>
                  ))}
                </Select>
                {errors.currency && (
                  <p className="text-red-500 text-sm">{errors.currency}</p>
                )}
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-muted-foreground"
                >
                  Category
                </label>
                <Select
                  aria-labelledby="category"
                  selectedKeys={[category]}
                  onChange={(e) => {
                    const selectedCategory = e.target.value;
                    setCategory(selectedCategory as Category);
                  }}
                  isRequired
                  size="md"
                  placeholder="Select category"
                >
                  {categories.map((category, idx) => (
                    <SelectItem
                      key={`${category.code}-${idx}`}
                      value={category.code}
                    >
                      {`${category.symbol} ${category.code}`}
                    </SelectItem>
                  ))}
                </Select>
                {errors.category && (
                  <p className="text-red-500 text-sm">{errors.category}</p>
                )}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-muted-foreground"
                >
                  Description
                </label>
                <Textarea
                  aria-labelledby="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description}</p>
                )}
              </div>
            </div>
            <Button
              isDisabled={loading}
              type="submit"
              className="mt-4 w-full sm:w-auto md:self-start"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-1 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Expense"
              )}
            </Button>
          </form>
        </CardBody>
        <CardFooter className="p-6 pt-0 flex flex-col gap-4">
          <div className="gap-3 w-full grid grid-cols-1 sm:grid-cols-2">
            <Select
              onChange={handleFilterChange}
              defaultSelectedKeys={["All Categories"]}
              aria-labelledby="filter"
            >
              {categories2.map((category) => (
                <SelectItem key={`${category.code}`} value={category.code}>
                  {`${category.symbol} ${category.code}`}
                </SelectItem>
              ))}
            </Select>
            <div className="relative">
              <Button className="relative w-full">Filter by Date Range</Button>
              <DateRangePicker className="expenses-date-range opacity-0 inset-0" />
            </div>
          </div>
          <Table
            removeWrapper
            classNames={{ base: "w-full overflow-auto" }}
            aria-label="Expense table"
          >
            <TableHeader>
              {TABLE_HEADERS.map((column, idx) => (
                <TableColumn key={`${column}-${idx}`}>{column}</TableColumn>
              ))}
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{format(expense.date, "PP")}</TableCell>
                  <TableCell>
                    {
                      currencies.find((c) => c.code === expense.currency)
                        ?.symbol
                    }
                    {parseFloat(expense.amount).toFixed(2)} {expense.currency}
                  </TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Button
                      className="min-w-8 min-h-8 p-3"
                      // variant=""
                      size="md"
                      // onClick={() => handleEdit(expense)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      className="min-w-8 min-h-8 p-3"
                      // variant="outline"
                      size="md"
                      // onClick={() => handleDelete(expense.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ExpenseTracker;
