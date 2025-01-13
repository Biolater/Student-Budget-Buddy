"use client";

import { Category } from "@/actions/expense.actions";
import {
  Button,
  DatePicker,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { RefObject, useCallback, useEffect, useState } from "react";
import {
  createExpenseAction,
  updateExpenseAction,
} from "@/actions/expense.actions";
import toast from "react-hot-toast";
import type { Expense } from "./page";
import {
  getLocalTimeZone,
  now,
  parseAbsoluteToLocal,
  type ZonedDateTime,
} from "@internationalized/date";
import useExpenses from "@/hooks/useExpense";

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
  isEditing?: boolean;
  editingExpense?: Expense | null;
  updateTriggerState?: RefObject<boolean>;
  onUpdateExpense?: (expense: Expense) => void;
  onUpdateFinished?: () => void;
}> = ({
  userId,
  isEditing,
  editingExpense,
  updateTriggerState,
  onUpdateExpense,
  onUpdateFinished,
}) => {
  const {
    create: { mutateAsync: createExpense, isPending: isCreatingExpense },
  } = useExpenses(userId);
  const [date, setDate] = useState<ZonedDateTime | null>(
    isEditing && editingExpense
      ? parseAbsoluteToLocal(editingExpense.date.toISOString())
      : null
  );

  const [amount, setAmount] = useState(
    isEditing ? editingExpense?.amount : null
  );
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

  const clearForm = () => {
    setDate(null);
    setAmount(null);
    setCurrency("");
    setCategory("");
    setDescription("");
  };

  const validateForm = useCallback(() => {
    const newErrors = {
      date: date ? "" : "Date is required.",
      amount: amount ? "" : "Amount is required.",
      currency: currency ? "" : "Currency is required.",
      category: category ? "" : "Category is required.",
      description: description?.trim() ? "" : "Description is required.",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  }, [date, amount, currency, category, description]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !userId) return;

    if (date && amount && currency && category && description && userId) {
      const { year, month, day, hour, minute, second } = date;
      const localDate = new Date(year, month - 1, day, hour, minute, second);

      try {
        await createExpense({
          description,
          amount,
          category,
          currency,
          date: localDate,
        });
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
      } finally {
        clearForm();
      }
    }
  };

  useEffect(() => {
    if (isEditing && editingExpense && updateTriggerState?.current) {
      const updateExpense = async () => {
        if (date && amount && currency && category && description && userId) {
          const { year, month, day, hour, minute, second, offset } = date;
          const localDate = new Date(
            year,
            month - 1,
            day,
            hour,
            minute,
            second
          );

          try {
            const data = {
              date: localDate,
              amount,
              currency,
              category,
              description,
            };
            const updatedExpense = await updateExpenseAction(
              editingExpense.id,
              data
            );
            if (updatedExpense) {
              onUpdateExpense?.(updatedExpense);
              toast.success("Expense updated successfully");
            }
          } catch (error) {
            toast.error(
              error instanceof Error ? error.message : "Something went wrong"
            );
          } finally {
            clearForm();
            onUpdateFinished?.();
          }
        }
      };
      updateExpense();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateTriggerState?.current]);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div
        className={`${
          !isEditing ? "grid grid-cols-1 sm:grid-cols-2" : ""
        } gap-4`}
      >
        <div className="space-y-2">
          <label
            htmlFor="date"
            className="block text-sm font-medium text-muted-foreground"
          >
            Date
          </label>
          <DatePicker
            showMonthAndYearPickers
            aria-label="Select date"
            onChange={(value) => setDate(value)}
            value={date}
            errorMessage={errors.date}
            isInvalid={!!errors.date}
            size="md"
            className="w-full"
            granularity="minute" // or "second" if you want to include seconds
          />
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
            size="md"
            type="number"
            placeholder="Enter amount"
            value={amount ? amount.toString() : ""}
            onChange={(e) => {
              setAmount(parseFloat(e.target.value));
              setErrors({ ...errors, amount: "" });
            }}
            isInvalid={errors.amount !== ""} // Validation logic to mark the input invalid
            className={
              errors.amount !== "" ? "[&_*_input]:placeholder:text-danger" : ""
            }
            errorMessage={errors.amount}
          />
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
            onChange={(e) => {
              setCurrency(e.target.value);
              setErrors({ ...errors, currency: "" });
            }}
            selectedKeys={[currency ?? ""]}
            errorMessage={errors.currency}
            isInvalid={errors.currency !== ""}
            size="md"
            placeholder="Select currency"
          >
            {currencies.map((currency) => (
              <SelectItem key={currency.code} value={currency.code}>
                {`${currency.symbol} ${currency.code}`}
              </SelectItem>
            ))}
          </Select>
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
              setErrors({ ...errors, category: "" });
            }}
            errorMessage={errors.category}
            isInvalid={errors.category !== ""}
            size="md"
            placeholder="Select category"
          >
            {categories.map((category, idx) => (
              <SelectItem key={category.code} value={category.code}>
                {`${category.symbol} ${category.code}`}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-muted-foreground"
          >
            Description
          </label>
          <Textarea
            className={
              errors.description ? "[&_*_textarea]:placeholder:text-danger" : ""
            }
            aria-labelledby="description"
            errorMessage={errors.description}
            isInvalid={errors.description !== ""}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setErrors({ ...errors, description: "" });
            }}
            placeholder="Enter description"
          />
        </div>
      </div>
      {!isEditing && (
        <Button
          isDisabled={isCreatingExpense}
          isLoading={isCreatingExpense}
          type="submit"
          color="primary"
          className="mt-4 w-full sm:w-auto md:self-start"
        >
          {!isCreatingExpense && "Add expense"}
        </Button>
      )}
    </form>
  );
};

export default ExpenseForm;
