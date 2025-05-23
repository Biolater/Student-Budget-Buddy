import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateRecurringTransactionSchemaType,
  CreateRecurringTransactionSchema,
  FinancialEventFrequency,
} from "@/app/schema/recurring-transactions.schema";
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
  Switch,
} from "@heroui/react";
import { useEffect } from "react";
import {
  getLocalTimeZone,
  parseDate,
  parseDateTime,
  today,
} from "@internationalized/date";
/* import useRecurringTransaction from "@/app/hooks/useRecurringTransaction";
 */
interface CreateRecurringTransactionFormProps {
  onSuccess?: () => void;
  defaultCurrency: string;
}

const CreateRecurringTransactionForm = ({
  onSuccess,
  defaultCurrency,
}: CreateRecurringTransactionFormProps) => {
  const { userId } = useAuth();

  // Move all hooks before any conditional statements
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
  } = useCurrency();

  /*   const {
    create: { mutateAsync: createRecurringTransaction, isPending: createRecurringTransactionLoading },
  } = useRecurringTransaction(userId); */

  const form = useForm<CreateRecurringTransactionSchemaType>({
    resolver: zodResolver(CreateRecurringTransactionSchema),
    defaultValues: {
      frequency: "MONTHLY",
      currencyId: defaultCurrency,
      isActive: true,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (data: CreateRecurringTransactionSchemaType) => {
    /*     await createRecurringTransaction(data);
     */ onSuccess?.();
  };

  if (categoriesLoading || currenciesLoading) {
    return <div>Loading...</div>;
  }

  if (categoriesError || currenciesError) {
    return <div>Error loading data</div>;
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
              {categories!.map((category) => (
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
        <Controller
          control={control}
          name="nextDueDate"
          render={({ field }) => (
            <DatePicker
              variant="faded"
              label="Next Due Date"
              labelPlacement="outside"
              description="The date this transaction will occur next."
              showMonthAndYearPickers
              value={field.value}
              onChange={field.onChange}
              errorMessage={errors.nextDueDate?.message}
              minValue={today(getLocalTimeZone())}
              isInvalid={!!errors.nextDueDate}
              isRequired
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
        /*         isLoading={isSubmitting || createRecurringTransactionLoading}
        disabled={isSubmitting || createRecurringTransactionLoading} */
        color="primary"
      >
        Create Recurring Transaction
      </Button>
    </form>
  );
};

export default CreateRecurringTransactionForm;
