"use client";

import type { Category } from "@/actions/createExpense";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
  type DateValue,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import ClientDatePicker from "./ClientDatePicker";
import createExpenseAction from "@/actions/createExpense";
import toast from "react-hot-toast";
import type { Expense } from "./page";
import { parseDate } from "@internationalized/date";

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

const ExpenseForm: React.FC<{
  userId: string | undefined | null;
  onExpenseCreated: (expense: Expense) => void;
  isEditing?: boolean;
  editingExpense?: Expense | null;
}> = ({ userId, onExpenseCreated, isEditing, editingExpense }) => {
  const [date, setDate] = useState<DateValue | null>(
    isEditing ? parseDate(editingExpense?.date.slice(0, 10) as string) : null
  );
  const [amount, setAmount] = useState(isEditing ? editingExpense?.amount : "");
  const [currency, setCurrency] = useState(
    isEditing ? editingExpense?.currency : ""
  );
  const [category, setCategory] = useState<Category | null | undefined>(
    isEditing ? (editingExpense?.category as Category) : ""
  );
  const [description, setDescription] = useState(
    isEditing ? editingExpense?.description : ""
  );
  const [errors, setErrors] = useState({
    date: "",
    amount: "",
    currency: "",
    category: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const clearForm = () => {
    setDate(null);
    setAmount("");
    setCurrency("");
    setCategory("");
    setDescription("");
  };

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
    for (const key in newErrors) {
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
        if (expense) {
          const correctedExpense = {
            ...expense,
            amount: expense.amount.toString(),
            date: expense.date.toString(),
            createdAt: expense.createdAt.toString(),
            updatedAt: expense.updatedAt.toString(),
          };
          onExpenseCreated(correctedExpense);
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
        clearForm();
      }
    }
  };


  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="date"
            className="block text-sm font-medium text-muted-foreground"
          >
            Date
          </label>
          <ClientDatePicker value={date} onChange={(value) => setDate(value)} />
          {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
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
            selectedKeys={[currency ?? ""]}
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
            selectedKeys={[category ?? ""]}
            onChange={(e) => {
              const selectedCategory = e.target.value;
              setCategory(selectedCategory as Category);
            }}
            isRequired
            size="md"
            placeholder="Select category"
          >
            {categories.map((category, idx) => (
              <SelectItem key={category.code} value={category.code}>
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
      {!isEditing && (
        <Button
          isDisabled={loading}
          isLoading={loading}
          type="submit"
          className="mt-4 w-full sm:w-auto md:self-start"
        >
          {!loading && "Add expense"}
        </Button>
      )}
    </form>
  );
};

export default ExpenseForm;
