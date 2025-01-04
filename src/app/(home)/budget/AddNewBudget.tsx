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
import { createBudget } from "@/actions/Expense/createBudget";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { type Budget } from "@prisma/client";

const schema = z.object({
  category: z.string().nonempty("Category is required"),
  currency: z.string().nonempty("Currency is required"),
  amount: z
    .string()
    .nonempty("Amount is required")
    .refine((value) => !isNaN(parseFloat(value)), {
      message: "Amount must be a number",
    })
    .refine((value) => parseFloat(value) > 0, {
      message: "Amount must be greater than 0",
    })
    .transform((value) => parseFloat(value)),
  period: z.string().nonempty("Period is required"),
});

export type NewBudgetSchema = z.infer<typeof schema>;

export type ClientBudget = Omit<Budget, "amount"> & { amount: number };

type Props = {
  onBudgetCreated: (budget: ClientBudget) => void;
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
  } = useForm<NewBudgetSchema>({
    resolver: zodResolver(schema),
  });

  const { isSignedIn } = useAuth();

  const onSubmit = async (data: NewBudgetSchema) => {
    if (isSignedIn) {
      try {
        const budget = await createBudget(data);
        if (budget) {
          onBudgetCreated(budget);
          toast.success("Budget created successfully");
        }
      } catch (error) {
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
              {...register("category")}
              aria-labelledby="category"
              errorMessage={errors?.category?.message}
              isInvalid={errors?.category?.message !== undefined}
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
              {...register("currency")}
              aria-labelledby="currency"
              errorMessage={errors?.currency?.message}
              isInvalid={errors?.currency?.message !== undefined}
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
              className={
                errors?.amount?.message !== undefined
                  ? "[&_*_input]:placeholder:text-danger"
                  : ""
              }
              {...register("amount")}
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
                    errors?.amount?.message !== undefined
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
              isInvalid={errors?.amount?.message !== undefined}
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
              {...register("period")}
              aria-labelledby="period"
              errorMessage={errors?.period?.message}
              isInvalid={errors?.period?.message !== undefined}
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
            type="submit"
            className="lg:w-full"
            startContent={<Plus className="h-4 w-4" />}
          >
            Add Budget
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AddNewBudget;
