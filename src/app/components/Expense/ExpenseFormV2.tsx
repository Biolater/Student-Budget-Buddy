"use client";

import {
  ExpenseFormSchema,
  type ExpenseFormSchemaType,
} from "@/app/schema/expense.schema";
import {
  Button,
  DatePicker,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import ExpenseFormSkeleton from "./ExpenseFormSkeleton";
import useExpense from "@/app/hooks/useExpense";
import { useAuth } from "@/app/contexts/AuthContext";
import { FC } from "react";
import { ClientCurrencyItem } from "../../types/currency.types";
import { ExpenseCategoryRef } from "@/app/types/category.types";

interface ExpenseFormProps {
  currencies: ClientCurrencyItem[];
  categories: ExpenseCategoryRef[];
  categoriesLoading: boolean;
  currenciesLoading: boolean;
}

const ExpenseFormV2: FC<ExpenseFormProps> = ({
  currencies,
  categories,
  currenciesLoading,
  categoriesLoading,
}) => {
  const { userId } = useAuth();
  const {
    watch,
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<ExpenseFormSchemaType>({
    resolver: zodResolver(ExpenseFormSchema),
  });

  const {
    create: { mutateAsync: createExpense, isPending: createExpenseLoading },
  } = useExpense(userId);

  const onSubmit = async (data: ExpenseFormSchemaType) => {
    try {
      await createExpense(data);
      reset({
        date: undefined,
        currency: undefined,
        category: undefined,
        amount: undefined,
        description: "",
      });
    } catch (error) {
      console.error("Error creating expense:", error);
    }
  };

  if (currenciesLoading || categoriesLoading) {
    return <ExpenseFormSkeleton />;
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <DatePicker
                  label="Date"
                  labelPlacement="outside"
                  granularity="minute"
                  size="md"
                  showMonthAndYearPickers
                  errorMessage={errors.date?.message}
                  onChange={field.onChange}
                  isInvalid={!!errors.date}
                  value={field.value}
                  isRequired
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
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
          </div>

          <div className="flex flex-col gap-2">
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select
                  label="Category"
                  labelPlacement="outside"
                  placeholder="Select category"
                  errorMessage={errors.category?.message}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0];
                    field.onChange(selectedKey);
                  }}
                  selectedKeys={field.value ? [field.value] : []}
                  isInvalid={!!errors.category}
                  isRequired
                >
                  {categories!.map((category) => (
                    <SelectItem
                      textValue={`${category.icon} ${category.name}`}
                      key={category.id}
                    >
                      {category.icon} {category.name}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Controller
              control={control}
              name="amount"
              render={({ field }) => (
                <Input
                  type="number"
                  label="Amount"
                  placeholder="Enter amount"
                  labelPlacement="outside"
                  errorMessage={errors.amount?.message}
                  onChange={(e) => {
                    const parsedValue = Number.parseFloat(e.target.value);
                    field.onChange(
                      isNaN(parsedValue) ? undefined : parsedValue
                    );
                  }}
                  isInvalid={!!errors.amount}
                  value={
                    field.value !== undefined && field.value !== null
                      ? field.value.toString()
                      : ""
                  }
                  isRequired
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <Textarea
                  type="text"
                  label="Description"
                  placeholder="Enter description"
                  labelPlacement="outside"
                  errorMessage={errors.description?.message}
                  onChange={field.onChange}
                  isInvalid={!!errors.description}
                  value={field.value}
                />
              )}
            />
          </div>
        </div>

        <div className="flex md:justify-end">
          <Button
            className="grow md:grow-0"
            color="primary"
            type="submit"
            isLoading={createExpenseLoading}
            disabled={createExpenseLoading}
          >
            {!createExpenseLoading ? "Create Expense" : "Creating Expense..."}
          </Button>
        </div>
      </form>
    </>
  );
};

export default ExpenseFormV2;
