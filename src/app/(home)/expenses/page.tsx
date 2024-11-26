"use client";
import { useEffect, useState } from "react";
import { CalendarIcon, Loader2, Pencil, Trash2 } from "lucide-react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import ClientDatePicker from "./ClientDatePicker";
import { Input, Textarea } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { Button } from "@nextui-org/button";
import { DateValue } from "@nextui-org/react";
import { useAuth } from "@clerk/nextjs";
import createExpenseAction, { type Category } from "@/actions/createExpense";
import toast from "react-hot-toast";

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

const ExpenseTracker = () => {
  const [date, setDate] = useState<DateValue | null>(null);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("");
  const [category, setCategory] = useState<Category>("");
  const [filterCategory, setFilterCategory] = useState<Category>("");
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
        await createExpenseAction(
          newDate,
          parseFloat(amount),
          currency,
          correctCategory,
          description,
          userId,
          errors
        );
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

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <Card>
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
        <CardFooter className="gap-3 grid grid-cols-1 sm:grid-cols-3 p-6 pt-0">
          <Select defaultSelectedKeys={["category"]} aria-labelledby="filter">
            <SelectItem key="category">Filter by category</SelectItem>
            <SelectItem key="date">Filter by date</SelectItem>
          </Select>
          <Select
            onChange={(e) => setFilterCategory(e.target.value as Category)}
            defaultSelectedKeys={[filterCategory]}
            aria-labelledby="filter"
          >
            {categories.map((category) => (
              <SelectItem key={`${category.code}`} value={category.code}>
                {`${category.symbol} ${category.code}`}
              </SelectItem>
            ))}
          </Select>
          <Button>Filter by Date Range</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ExpenseTracker;
