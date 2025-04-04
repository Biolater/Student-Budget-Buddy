import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateBudgetFormSchemaType,
  CreateBudgetFormSchema,
  BudgetPeriodTypeEnum,
} from "@/app/schema/budget.schema";
import { useCategory } from "@/app/hooks/useCategory";
import { useCurrency } from "@/app/hooks/useCurrency";
import { useAuth } from "@clerk/nextjs";
import {
  Input,
  Select,
  SelectItem,
  DatePicker,
  Textarea,
  Button,
} from "@heroui/react";
import { useEffect } from "react";
import { parseDate, parseDateTime } from "@internationalized/date";
import useBudget from "@/app/hooks/useBudget";

interface CreateBudgetFormProps {
  onSuccess?: () => void;
}

const CreateBudgetForm = ({ onSuccess }: CreateBudgetFormProps) => {
  const { userId } = useAuth();

  if (!userId) {
    return <div>Loading...</div>;
  }

  const {
    budgetCategoriesQuery: {
      data: categories,
      isPending: categoriesLoading,
      error: categoriesError,
    },
  } = useCategory();

  const {
    query: {
      data: currencies,
      isPending: currenciesLoading,
      error: currenciesError,
    },
  } = useCurrency(userId);

  const {
    create: { mutateAsync: createBudget, isPending: createBudgetLoading },
  } = useBudget(userId);

  const form = useForm<CreateBudgetFormSchemaType>({
    resolver: zodResolver(CreateBudgetFormSchema),
    defaultValues: {
      periodType: "MONTHLY",
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const periodTypeValue = watch("periodType");

  useEffect(() => {
    // When period type changes, set the appropriate start/end dates
    if (periodTypeValue && periodTypeValue !== "CUSTOM") {
      const today = new Date();
      let startDate, endDate;

      switch (periodTypeValue) {
        case "MONTHLY": {
          // Current day of month
          const day = today.getDate();

          // Start from today
          startDate = new Date(today.getFullYear(), today.getMonth(), day);

          // End on the same day next month (or last day if that day doesn't exist)
          const nextMonth = today.getMonth() + 1;
          const nextMonthLastDay = new Date(
            today.getFullYear(),
            nextMonth + 1,
            0
          ).getDate();
          const endDay = Math.min(day, nextMonthLastDay);
          endDate = new Date(today.getFullYear(), nextMonth, endDay);
          break;
        }
        case "QUARTERLY": {
          const day = today.getDate();
          const quarter = Math.floor(today.getMonth() / 3);

          // Start from today
          startDate = new Date(today.getFullYear(), today.getMonth(), day);

          // End three months later on the same day (or last day if that day doesn't exist)
          const endMonth = quarter * 3 + 3;
          const endMonthLastDay = new Date(
            today.getFullYear(),
            endMonth + 1,
            0
          ).getDate();
          const endDay = Math.min(day, endMonthLastDay);
          endDate = new Date(today.getFullYear(), endMonth, endDay);
          break;
        }
        case "SEMESTERLY": {
          const day = today.getDate();
          const semester = Math.floor(today.getMonth() / 6);

          // Start from today
          startDate = new Date(today.getFullYear(), today.getMonth(), day);

          // End six months later on the same day (or last day if that day doesn't exist)
          const endMonth = semester * 6 + 6;
          const endMonthLastDay = new Date(
            today.getFullYear(),
            endMonth + 1,
            0
          ).getDate();
          const endDay = Math.min(day, endMonthLastDay);
          endDate = new Date(today.getFullYear(), endMonth, endDay);
          break;
        }
        case "YEARLY": {
          const day = today.getDate();
          const month = today.getMonth();

          // Start from today
          startDate = new Date(today.getFullYear(), month, day);

          // End one year later on the same day (or last day if that day doesn't exist)
          const nextYear = today.getFullYear() + 1;
          const endMonthLastDay = new Date(nextYear, month + 1, 0).getDate();
          const endDay = Math.min(day, endMonthLastDay);
          endDate = new Date(nextYear, month, endDay);
          break;
        }
      }

      // Convert JavaScript Date objects to proper DateValue objects
      const startCalendarDate = parseDateTime(
        `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(startDate.getDate()).padStart(2, "0")}`
      );

      const endCalendarDate = parseDateTime(
        `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(endDate.getDate()).padStart(2, "0")}`
      );

      // Now set these properly formatted dates
      setValue("startDate", startCalendarDate);
      setValue("endDate", endCalendarDate);
    }
  }, [periodTypeValue, setValue]);

  const onSubmit = async (data: CreateBudgetFormSchemaType) => {
    await createBudget(data);
    onSuccess?.();
  };

  if (categoriesLoading || currenciesLoading) {
    return <div>Loading...</div>;
  }

  if (categoriesError || currenciesError) {
    return <div>Error...</div>;
  }

  return (
    <form className="flex flex-col flex-1" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        <Controller
          control={control}
          name="budgetCategory"
          render={({ field }) => (
            <Select
              label="Budget Category"
              labelPlacement="outside"
              placeholder="Select budget category"
              errorMessage={errors.budgetCategory?.message}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0];
                field.onChange(selectedKey);
              }}
              isInvalid={!!errors.budgetCategory}
              selectedKeys={field.value ? [field.value] : []}
              isRequired
            >
              {categories!.map((option) => (
                <SelectItem
                  textValue={`${option.icon} ${option.name}`}
                  key={option.id}
                >
                  {option.icon} {option.name}
                </SelectItem>
              ))}
            </Select>
          )}
        />
        <Controller
          control={control}
          name="currency"
          render={({ field }) => (
            <Select
              label="Currency"
              labelPlacement="outside"
              placeholder="Select currency"
              errorMessage={errors.currency?.message}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0];
                field.onChange(selectedKey);
              }}
              isInvalid={!!errors.currency}
              selectedKeys={field.value ? [field.value] : []}
              isRequired
            >
              {currencies!.map((option) => (
                <SelectItem
                  textValue={`${option.symbol} ${option.code}`}
                  key={option.id}
                >
                  {option.symbol} {option.code}
                </SelectItem>
              ))}
            </Select>
          )}
        />
        <Controller
          control={control}
          name="amount"
          render={({ field }) => (
            <Input
              type="number"
              label="Amount"
              labelPlacement="outside"
              placeholder="Enter amount"
              errorMessage={errors.amount?.message}
              isInvalid={!!errors.amount}
              isRequired
              onChange={(e) => {
                const parsedValue = Number.parseFloat(e.target.value);
                field.onChange(isNaN(parsedValue) ? undefined : parsedValue);
              }}
            />
          )}
        />
        <Controller
          control={control}
          name="periodType"
          render={({ field }) => (
            <Select
              label="Period Type"
              labelPlacement="outside"
              placeholder="Select period type"
              errorMessage={errors.periodType?.message}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0];
                field.onChange(selectedKey);
              }}
              isInvalid={!!errors.periodType}
              selectedKeys={field.value ? [field.value] : []}
              isRequired
            >
              {BudgetPeriodTypeEnum.options.map((option) => (
                <SelectItem key={option}>{option}</SelectItem>
              ))}
            </Select>
          )}
        />
        {periodTypeValue === "CUSTOM" && (
          <>
            <Controller
              control={control}
              name="startDate"
              render={({ field }) => (
                <DatePicker
                  label="Start Date"
                  granularity="minute"
                  labelPlacement="outside"
                  showMonthAndYearPickers
                  value={field.value}
                  onChange={field.onChange}
                  errorMessage={errors.startDate?.message}
                  isInvalid={!!errors.startDate}
                  isRequired
                />
              )}
            />
            <Controller
              control={control}
              name="endDate"
              render={({ field }) => (
                <DatePicker
                  label="End Date"
                  labelPlacement="outside"
                  granularity="minute"
                  showMonthAndYearPickers
                  value={field.value}
                  onChange={field.onChange}
                  errorMessage={errors.endDate?.message}
                  isInvalid={!!errors.endDate}
                  isRequired
                />
              )}
            />
          </>
        )}
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <Textarea
              label="Description"
              labelPlacement="outside"
              placeholder="Enter description"
              errorMessage={errors.description?.message}
              isInvalid={!!errors.description}
              {...field}
            />
          )}
        />
      </div>
      <Button
        className="mt-8 w-full md:w-auto md:self-end"
        type="submit"
        isLoading={isSubmitting || createBudgetLoading}
        disabled={isSubmitting || createBudgetLoading}
        color="primary"
      >
        Create Budget
      </Button>
    </form>
  );
};

export default CreateBudgetForm;
