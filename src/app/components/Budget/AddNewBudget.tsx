"use client";

import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Select,
  SelectItem,
  Tabs,
  Tab,
  DatePicker,
} from "@heroui/react";
import { Plus } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";

// Categories from your existing code
const categories = [
  { key: "food", label: "🍔 Food" },
  { key: "entertainment", label: "🎉 Entertainment" },
  { key: "transport", label: "🚗 Transport" },
  { key: "health", label: "💊 Health" },
  { key: "education", label: "📚 Education" },
  { key: "clothing", label: "👕 Clothing" },
  { key: "pets", label: "🐶 Pets" },
  { key: "travel", label: "🌳 Travel" },
  { key: "other", label: "🤷‍♀️ Other" },
];

// Predefined periods with their date calculations
const PREDEFINED_PERIODS = {
  monthly: {
    key: "monthly",
    label: "Monthly",
    getDates: () => {
      const start = new Date();
      const end = new Date();
      end.setMonth(end.getMonth() + 1);
      return { start, end };
    },
  },
  quarterly: {
    key: "quarterly",
    label: "Quarterly",
    getDates: () => {
      const start = new Date();
      const end = new Date();
      end.setMonth(end.getMonth() + 3);
      return { start, end };
    },
  },
  semesterly: {
    key: "semesterly",
    label: "Semesterly",
    getDates: () => {
      const start = new Date();
      const end = new Date();
      end.setMonth(end.getMonth() + 6);
      return { start, end };
    },
  },
  yearly: {
    key: "yearly",
    label: "Yearly",
    getDates: () => {
      const start = new Date();
      const end = new Date();
      end.setFullYear(end.getFullYear() + 1);
      return { start, end };
    },
  },
};

const schema = z.object({
  category: z.string().nonempty("Category is required"),
  currencyId: z.string().nonempty("Currency is required"),
  amount: z.number().positive("Amount must be greater than 0"),
  period: z.string().nonempty("Period is required"),
  periodType: z.enum(["predefined", "custom"]),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

type FormData = z.infer<typeof schema>;

interface BudgetFormProps {
  currencies: {
    id: string;
    symbol: string;
    code: string;
  }[];
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting?: boolean;
}

const BudgetForm: React.FC<BudgetFormProps> = ({
  currencies,
  onSubmit,
  isSubmitting = false,
}) => {
  const [periodType, setPeriodType] = useState<"predefined" | "custom">(
    "predefined"
  );
  const { userId } = useAuth();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      category: "",
      currencyId: "",
      amount: 0,
      period: "monthly",
      periodType: "predefined",
    },
  });

  const handleFormSubmit = async (data: FormData) => {
    if (!userId) {
      toast.error("You must be signed in to create a budget");
      return;
    }

    try {
      await onSubmit(data);
      toast.success("Budget created successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create budget"
      );
    }
  };

  const watchPeriod = watch("period");
  const watchCategory = watch("category");

  return (
    <Card className="bg-card">
      <CardHeader className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          Create New Budget
        </h3>
        <p className="text-sm text-muted-foreground">
          Set up a new budget with your preferred category and period
        </p>
      </CardHeader>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <CardBody className="p-6 pt-0 space-y-4">
          {/* Category Selection */}
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <Select>
              {categories.map((category) => (
                <SelectItem key={category.key}>{category.label}</SelectItem>
              ))}
            </Select>
          </div>

          {/* Currency Selection */}
          <div className="space-y-2">
            <label htmlFor="currencyId" className="text-sm font-medium">
              Currency
            </label>
            <Select
              {...register("currencyId")}
              errorMessage={errors.currencyId?.message}
              isInvalid={!!errors.currencyId}
              value={watch("currencyId")}
            >
              {currencies.map((currency) => (
                <SelectItem key={currency.id}>
                  {currency.symbol} {currency.code}
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  errorMessage={errors.amount?.message}
                  isInvalid={!!errors.amount}
                />
              )}
            />
          </div>

          {/* Period Selection */}
          <div className="space-y-4">
            <Tabs
              selectedKey={periodType}
              onSelectionChange={(key) =>
                setPeriodType(key as "predefined" | "custom")
              }
            >
              <Tab key="predefined" title="Predefined Periods">
                <div className="pt-4 space-y-4">
                  <Select
                    {...register("period")}
                    errorMessage={errors.period?.message}
                    isInvalid={!!errors.period}
                  >
                    {Object.values(PREDEFINED_PERIODS).map((period) => (
                      <SelectItem key={period.key}>{period.label}</SelectItem>
                    ))}
                  </Select>
                </div>
              </Tab>
              <Tab key="custom" title="Custom Period">
                <div className="pt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Controller
                      name="startDate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          label="Start Date"
                          selected={field.value}
                          onChange={field.onChange}
                          errorMessage={errors.startDate?.message}
                        />
                      )}
                    />
                    <Controller
                      name="endDate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          label="End Date"
                          selected={field.value}
                          onChange={field.onChange}
                          errorMessage={errors.endDate?.message}
                          minDate={watch("startDate")}
                        />
                      )}
                    />
                  </div>
                </div>
              </Tab>
            </Tabs>
          </div>
        </CardBody>

        <CardFooter className="p-6 pt-0">
          <Button
            type="submit"
            color="primary"
            className="w-full"
            isLoading={isSubmitting}
            startContent={!isSubmitting && <Plus className="size-4" />}
          >
            Create Budget
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default BudgetForm;
