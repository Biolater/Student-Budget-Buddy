"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createBudget } from "@/actions/budget.actions";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { Expense, type Budget } from "@prisma/client";
import { useState } from "react";

const schema = z.object({
  category: z.string().nonempty("Category is required"),
  currency: z.string().nonempty("Currency is required"),
  amount: z
    .union([z.string(), z.undefined()])
    .refine(
      (value) =>
        value === undefined ||
        (value !== undefined &&
          !isNaN(parseFloat(value)) &&
          parseFloat(value) > 0 && !/^0\d+$/.test(value)),
      "Amount must be a number greater than 0 and without leading zeros."
    ),
  period: z.string().nonempty("Period is required"),
});

export type NewBudgetSchema = z.infer<typeof schema>;

export type ClientBudget = Omit<Budget, "amount"> & {
  amount: number;
  expenses: (Omit<Expense, "amount"> & { amount: number })[];
};

type Props = {
  onBudgetCreated: () => void;
};

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

const PERIODS = [
  {
    key: "monthly",
    label: "Monthly",
  },
  {
    key: "Semesterly",
    label: "Semesterly",
  },
  {
    key: "yearly",
    label: "Yearly",
  },
];

const CURRENCIES = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "TRY", symbol: "₺" },
  { code: "AZN", symbol: "₼" },
];

const AddNewBudget: React.FC<Props> = ({ onBudgetCreated }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<NewBudgetSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      category: "",
      currency: "",
      amount: undefined,
      period: "",
    },
  });

  const [category, period, currency, amount] = watch([
    "category",
    "period",
    "currency",
    "amount",
  ]);

  const [creatingBudget, setCreatingBudget] = useState(false);

  const { isSignedIn } = useAuth();

  const handleFormReset = () => {
    setValue("category", "");
    setValue("currency", "");
    setValue("amount", undefined);
    setValue("period", "");
  };

  const onSubmit = async (data: NewBudgetSchema) => {
    if (isSignedIn) {
      try {
        setCreatingBudget(true);
        const budget = await createBudget(data);
        if (budget) {
          setCreatingBudget(false);
          onBudgetCreated();
          toast.success("Budget created successfully");
          handleFormReset();
        }
      } catch (error) {
        setCreatingBudget(false);
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
      }
    } else {
      toast.error("You must be signed in to create a budget");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col space-y-1.5 p-6 items-start">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          Add New Budget
        </h3>
        <p className="text-sm text-muted-foreground">
          Create a new budget for a specific category
        </p>
      </CardHeader>
      <form className="h-full flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <CardBody className="p-6 pt-0 flex-col gap-4">
          <div className="space-y-2">
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="category"
            >
              Category
            </label>
            <Select
              selectedKeys={new Set([category])}
              {...register("category")}
              aria-labelledby="category"
              errorMessage={errors?.category?.message}
              isInvalid={!!errors?.category?.message}
              name="category"
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
          <div className="space-y-2">
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="currency"
            >
              Currency
            </label>
            <Select
              selectedKeys={new Set([currency])}
              {...register("currency")}
              aria-labelledby="currency"
              errorMessage={errors?.currency?.message}
              isInvalid={!!errors?.currency?.message}
              name="currency"
              size="md"
              placeholder="Select currency"
            >
              {CURRENCIES.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  {`${currency.symbol} ${currency.code}`}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="amount"
            >
              Amount
            </label>
            <Input
              value={`${amount}`}
              {...register("amount")}
              className={
                errors?.amount?.message !== undefined
                  ? "[&_*_input]:placeholder:text-danger"
                  : ""
              }
              startContent={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`lucide lucide-dollar-sign h-4 w-4 ${
                    !!errors?.amount?.message
                      ? "text-danger"
                      : "text-muted-foreground"
                  }`}
                >
                  <line x1="12" x2="12" y1="2" y2="22"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              }
              aria-labelledby="amount"
              size="md"
              type="number"
              placeholder="Enter amount"
              errorMessage={errors?.amount?.message}
              isInvalid={!!errors?.amount?.message}
            />
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="period"
            >
              Period
            </label>
            <Select
              selectedKeys={new Set([period])}
              {...register("period")}
              aria-labelledby="period"
              errorMessage={errors?.period?.message}
              isInvalid={!!errors?.period?.message}
              placeholder="Select period"
            >
              {PERIODS.map((period) => (
                <SelectItem key={period.key}>{period.label}</SelectItem>
              ))}
            </Select>
          </div>
        </CardBody>
        <CardFooter className="p-6 pt-0">
          <Button
            isDisabled={creatingBudget}
            isLoading={creatingBudget}
            type="submit"
            className="lg:w-full"
            startContent={!creatingBudget && <Plus />}
          >
            Add Budget
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AddNewBudget;
