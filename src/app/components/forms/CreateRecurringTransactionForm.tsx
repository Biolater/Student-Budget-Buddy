import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateRecurringTransactionSchemaType,
  CreateRecurringTransactionSchema,
  FinancialEventFrequency,
} from "@/app/schema/recurring-transactions.schema";
import { useCategory } from "@/app/hooks/useCategory";
import { useCurrency } from "@/app/hooks/useCurrency";
import {
  Input,
  Select,
  SelectItem,
  DatePicker,
  Textarea,
  Button,
  Switch,
  DateValue,
} from "@heroui/react";
import { useMemo } from "react";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import useRecurringTransaction from "@/app/hooks/useRecurringTransaction";
import { useAuth } from "@/app/contexts/AuthContext";
import CreateBudgetFormSkeleton from "../Budget/CreateBudgetFormSkeleton";
import { computeMinEndDate, toCalendarDate } from "@/app/utils/recurrence";

interface CreateRecurringTransactionFormProps {
  onSuccess?: () => void;
  defaultCurrency: string;
}

const CreateRecurringTransactionForm = ({
  onSuccess,
  defaultCurrency,
}: CreateRecurringTransactionFormProps) => {
  const { userId } = useAuth();
  const {
    budgetCategoriesQuery: { data: categories, isPending: categoriesLoading },
  } = useCategory();

  const {
    query: { data: currencies, isPending: currenciesLoading },
  } = useCurrency();

  const {
    create: {
      mutateAsync: createRecurringTransaction,
      isPending: createRecurringTransactionLoading,
    },
  } = useRecurringTransaction(userId);

  const form = useForm<CreateRecurringTransactionSchemaType>({
    resolver: zodResolver(CreateRecurringTransactionSchema),
    defaultValues: {
      frequency: "MONTHLY",
      currencyId: defaultCurrency,
      isActive: true,
      type: "EXPENSE",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const activeTransactionType = form.watch("type");
  const frequencyValue = form.watch("frequency");
  const interval = form.watch("interval");
  const intervalUnit = form.watch("intervalUnit");
  const nextDueDate = form.watch("nextDueDate");

  const minEndDate = computeMinEndDate(
    frequencyValue,
    nextDueDate,
    interval,
    intervalUnit
  );

  const minEndDateCalendarDate = minEndDate
    ? toCalendarDate(minEndDate)
    : undefined;

  const budgetCategories = useMemo(
    () => categories?.filter((c) => c.type === activeTransactionType) ?? [],
    [categories, activeTransactionType]
  );

  const onSubmit = async (data: CreateRecurringTransactionSchemaType) => {
    console.log(data);
    await createRecurringTransaction(data);
    onSuccess?.();
  };

  if (categoriesLoading || currenciesLoading) {
    return <CreateBudgetFormSkeleton />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6">
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <Input
              variant="faded"
              label="Transaction Name"
              labelPlacement="outside"
              placeholder="e.g. Rent, Salary, etc."
              errorMessage={errors.name?.message}
              isInvalid={!!errors.name}
              isRequired
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <Select
              variant="faded"
              label="Transaction Type"
              labelPlacement="outside"
              placeholder="Select type"
              errorMessage={errors.type?.message}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0]?.toString();
                field.onChange(selectedKey);
              }}
              isInvalid={!!errors.type}
              selectedKeys={field.value ? [field.value] : []}
              isRequired
            >
              <SelectItem key="INCOME">Income</SelectItem>
              <SelectItem key="EXPENSE">Expense</SelectItem>
            </Select>
          )}
        />
        <Controller
          control={control}
          name="budgetCategoryId"
          render={({ field }) => (
            <Select
              variant="faded"
              label="Category"
              labelPlacement="outside"
              placeholder="Select category"
              errorMessage={errors.budgetCategoryId?.message}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0]?.toString();
                field.onChange(selectedKey);
              }}
              isInvalid={!!errors.budgetCategoryId}
              selectedKeys={field.value ? [field.value] : []}
            >
              {budgetCategories!.map((category) => (
                <SelectItem
                  key={category.id}
                  textValue={`${category.icon} ${category.name}`}
                >
                  {category.icon} {category.name}
                </SelectItem>
              ))}
            </Select>
          )}
        />
        <Controller
          control={control}
          name="currencyId"
          render={({ field }) => (
            <Select
              variant="faded"
              label="Currency"
              labelPlacement="outside"
              placeholder="Select currency"
              errorMessage={errors.currencyId?.message}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0]?.toString();
                field.onChange(selectedKey);
              }}
              isInvalid={!!errors.currencyId}
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
              variant="faded"
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
          name="frequency"
          render={({ field }) => (
            <Select
              variant="faded"
              label="Frequency"
              labelPlacement="outside"
              placeholder="Select frequency"
              errorMessage={errors.frequency?.message}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0]?.toString();
                field.onChange(selectedKey);
              }}
              isInvalid={!!errors.frequency}
              selectedKeys={field.value ? [field.value] : []}
              isRequired
            >
              {FinancialEventFrequency.options.map((option) => (
                <SelectItem key={option}>{option}</SelectItem>
              ))}
            </Select>
          )}
        />
        {/* Custom interval UI */}
        {frequencyValue === FinancialEventFrequency.Enum.CUSTOM && (
          <div className="grid grid-cols-2 gap-4">
            {/* Interval count */}
            <Controller
              name="interval"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  label="Repeat every"
                  type="number"
                  variant="faded"
                  size="sm"
                  isRequired
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  value={field.value?.toString() ?? ""}
                  onChange={(e) => {
                    const v = e.target.valueAsNumber;
                    field.onChange(isNaN(v) ? undefined : v);
                  }}
                  min={1}
                />
              )}
            />

            {/* Interval unit */}
            <Controller
              name="intervalUnit"
              control={control}
              render={({ field, fieldState }) => (
                <Select
                  label="Unit"
                  variant="faded"
                  size="sm"
                  isRequired
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  selectedKeys={field.value ? [field.value] : []}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0];
                    if (selected) {
                      field.onChange(
                        selected as "DAY" | "WEEK" | "MONTH" | "YEAR"
                      );
                    }
                  }}
                >
                  {["DAY", "WEEK", "MONTH", "YEAR"].map((unit) => (
                    <SelectItem key={unit}>{unit.toLowerCase()}</SelectItem>
                  ))}
                </Select>
              )}
            />
          </div>
        )}
        <Controller
          control={control}
          name="nextDueDate"
          render={({ field, fieldState }) => (
            <DatePicker
              variant="faded"
              label="Next Due Date"
              labelPlacement="outside"
              description="The date this transaction will occur next."
              showMonthAndYearPickers
              value={
                field.value ? toCalendarDate(field.value as Date) : undefined
              }
              onChange={(value: CalendarDate | null) => {
                if (value === null) {
                  field.onChange(undefined);
                } else {
                  field.onChange(
                    new Date(value.year, value.month - 1, value.day)
                  );
                }
              }}
              minValue={today(getLocalTimeZone())}
              errorMessage={fieldState.error?.message}
              isInvalid={!!fieldState.error}
              isRequired
            />
          )}
        />
        <Controller
          control={control}
          name="endDate"
          render={({ field, fieldState }) => (
            <DatePicker
              variant="faded"
              label="End On"
              labelPlacement="outside"
              description="Leave empty to repeat forever, or set a date to stop."
              showMonthAndYearPickers
              value={
                field.value ? toCalendarDate(field.value as Date) : undefined
              }
              onChange={(value: CalendarDate | null) => {
                if (value === null) {
                  field.onChange(undefined);
                } else {
                  field.onChange(
                    new Date(value.year, value.month - 1, value.day)
                  );
                }
              }}
              minValue={minEndDateCalendarDate}
              errorMessage={fieldState.error?.message}
              isInvalid={!!fieldState.error}
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <Textarea
              variant="faded"
              label="Description"
              labelPlacement="outside"
              placeholder="Enter description"
              errorMessage={errors.description?.message}
              isInvalid={!!errors.description}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name="isActive"
          render={({ field }) => (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Active Status</p>
                <p className="text-sm text-muted-foreground">
                  Is this recurring transaction active?
                </p>
              </div>
              <Switch
                isSelected={field.value}
                onValueChange={field.onChange}
                color="primary"
              />
            </div>
          )}
        />
      </div>
      <Button
        className="mt-8 w-full md:w-auto md:self-end"
        type="submit"
        color="primary"
      >
        Create Recurring Transaction
      </Button>
    </form>
  );
};

export default CreateRecurringTransactionForm;
