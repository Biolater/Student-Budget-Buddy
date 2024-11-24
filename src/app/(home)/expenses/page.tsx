"use client";
import { useEffect, useState } from "react";
import { CalendarIcon, Pencil, Trash2 } from "lucide-react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import ClientDatePicker from "./ClientDatePicker";
import { Input, Textarea } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { Button } from "@nextui-org/button";
import { DateValue } from "@nextui-org/react";
import { prisma } from "@/lib/client";
import { useAuth } from "@clerk/nextjs";

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

type Category =
  | "Food"
  | "Entertainment"
  | "Transport"
  | "Health"
  | "Education"
  | "Clothing"
  | "Pets"
  | "Travel"
  | "Other"
  | "";

const ExpenseTracker = () => {
  const [date, setDate] = useState<DateValue | null>(null);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("");
  const [category, setCategory] = useState<Category>("");
  const [description, setDescription] = useState("");
  const { userId } = useAuth();

  const clearForm = () => {
    setDate(null);
    setAmount("");
    setCurrency("");
    setCategory("");
    setDescription("");
  };

  const createExpense = async (
    date: Date,
    amount: number,
    currency: string,
    category: Category,
    description: string,
    userId: string
  ) => {
    try {
      const expense = await prisma.expense.create({
        data: {
          date,
          amount,
          currency,
          category,
          description,
          userId,
        },
      });

      console.log("Expense created:", expense);
    } catch (error) {}
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
    console.log("Form submitted!");
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
    if (isValid) {
      if (
        date &&
        amount &&
        currency &&
        category &&
        description.trim() &&
        userId
      ) {
        const { year, month, day } = date;
        const newDate = new Date(year, month - 1, day);
        await createExpense(
          newDate,
          Number(amount),
          currency,
          category,
          description,
          userId
        );
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
          <form className="flex flex-col" onSubmit={handleSubmit}>
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
                  selectedKeys={["Food"]}
                  onChange={(e)}
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
            <Button type="submit" className="mt-4 w-full sm:w-auto md:self-end">
              Submit
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default ExpenseTracker;
