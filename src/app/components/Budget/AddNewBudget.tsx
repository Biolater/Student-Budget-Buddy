"use client";

import { useEffect, useState } from "react";
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
  Selection,
} from "@heroui/react";
import { Plus } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { DateValue } from "@heroui/react";
import useBudget from "@/hooks/useBudget";
import { categories } from "@/constants/data/categories";

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
  amount: z.coerce
    .number()
    .min(0.01, "Amount must be greater than 0")
    .positive("Amount must be positive"),
  period: z.string().nonempty("Period is required"),
  periodType: z.enum(["predefined", "custom"]),
  startDate: z.custom<DateValue>().optional(),
  endDate: z.custom<DateValue>().optional(),
});

type FormData = z.infer<typeof schema>;

interface BudgetFormProps {
  currencies: {
    id: string;
    symbol: string;
    code: string;
  }[];
}

const BudgetForm: React.FC<BudgetFormProps> = ({ currencies }) => {
  const [periodType, setPeriodType] = useState<"predefined" | "custom">(
    "predefined"
  );
  const { userId } = useAuth();

  const {
    create: { mutateAsync: createBudget, isPending: creatingBudget },
  } = useBudget(userId);

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
      period: "",
      periodType: "predefined",
    },
  });

  const handleFormSubmit = async (data: FormData) => {
    if (!userId) {
      toast.error("You must be signed in to create a budget");
      return;
    }

    try {
      await createBudget(data);
      toast.success("Budget created successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create budget"
      );
    }
  };

  const watchPeriod = watch("period");
  const watchCategory = watch("category");
  const watchCurrency = watch("currencyId");

  return (
    <Card className="bg-card">
      <CardHeader className="flex flex-col gap-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight self-start">
          Create New Budget
        </h3>
        <p className="text-sm text-muted-foreground">
          Set up a new budget with your preferred category and period
        </p>
      </CardHeader>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <CardBody className="p-6 pt-0 flex flex-col gap-4">
          {/* Category Selection */}
          <div className="flex flex-col gap-2">
            <Select
              label="Category"
              labelPlacement="outside"
              placeholder="Select Category"
              {...register("category")}
              errorMessage={errors.category?.message}
              isInvalid={!!errors.category}
            >
              {categories.map((category) => (
                <SelectItem key={category.key}>{category.label}</SelectItem>
              ))}
            </Select>
          </div>

          {/* Currency Selection */}
          <div className="flex flex-col gap-2">
            <Select
              label="Currency"
              labelPlacement="outside"
              placeholder="Select Currency"
              {...register("currencyId")}
              errorMessage={errors.currencyId?.message}
              isInvalid={!!errors.currencyId}
            >
              {currencies.map((currency) => (
                <SelectItem key={currency.id}>
                  {`${currency.symbol} ${currency.code}`}
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* Amount Input */}
          <div className="flex flex-col gap-2">
            <Input
              label="Amount"
              labelPlacement="outside"
              type="number"
              step="0.01"
              {...register("amount")}
              errorMessage={errors.amount?.message}
              isInvalid={!!errors.amount}
            />
          </div>

          {/* Period Selection */}
          <div className="flex flex-col gap-2">
            <Tabs
              className="w-full"
              classNames={{
                tabList: "w-full",
              }}
              selectedKey={periodType}
              onSelectionChange={(key) =>
                setPeriodType(key as "predefined" | "custom")
              }
            >
              <Tab key="predefined" title="Predefined Periods">
                <div className="flex flex-col gap-2">
                  <Select
                    label="Period"
                    labelPlacement="outside"
                    placeholder="Select Period"
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
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-4">
                    <Controller
                      name="startDate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          label="Start Date"
                          labelPlacement="outside"
                          value={field.value}
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
                          labelPlacement="outside"
                          value={field.value}
                          onChange={field.onChange}
                          errorMessage={errors.endDate?.message}
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
            isLoading={creatingBudget}
            isDisabled={creatingBudget}
            startContent={<Plus className="size-4" />}
          >
            {creatingBudget ? "Creating..." : "Create Budget"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default BudgetForm;
