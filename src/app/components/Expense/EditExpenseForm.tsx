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
import { useAuth } from "@/app/contexts/AuthContext";
import { FC, useEffect } from "react";
import { ClientCurrencyItem } from "../../types/currency.types";
import { ExpenseCategoryRef } from "@/app/types/category.types";

interface EditExpenseFormProps {
  currencies: ClientCurrencyItem[];
  categories: ExpenseCategoryRef[];
  currenciesLoading: boolean;
  categoriesLoading: boolean;
  initialData: ExpenseFormSchemaType;
}

const EditExpenseForm: FC<EditExpenseFormProps> = ({
  currencies,
  categories,
  currenciesLoading,
  categoriesLoading,
  initialData,
}) => {
  const { userId } = useAuth();
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<ExpenseFormSchemaType>({
    resolver: zodResolver(ExpenseFormSchema),
    defaultValues: initialData,
  });

  //   const {
  //     update: {
  //       mutateAsync: updateExpense,
  //       isPending: updateExpenseLoading,
  //       isError: updateExpenseError,
  //     },
  //   } = useExpense(userId);

  const onSubmit = async (data: ExpenseFormSchemaType) => {
    try {
      //   await updateExpense(data);
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  if (currenciesLoading || categoriesLoading) {
    return <ExpenseFormSkeleton />;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
      aria-label="Edit Expense Form"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date Picker */}
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
                aria-required="true"
              />
            )}
          />
        </div>

        {/* Currency Select */}
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
                isInvalid={!!errors.currency}
                selectedKeys={field.value ? [field.value] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0];
                  field.onChange(selectedKey);
                }}
                isRequired
                aria-required="true"
              >
                {currencies.map((option) => (
                  <SelectItem
                    key={option.code}
                    textValue={`${option.symbol} ${option.code}`}
                  >
                    {option.symbol} {option.code}
                  </SelectItem>
                ))}
              </Select>
            )}
          />
        </div>

        {/* Category Select */}
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
                selectedKeys={field.value ? [field.value] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0];
                  field.onChange(selectedKey);
                }}
                isInvalid={!!errors.category}
                isRequired
                aria-required="true"
              >
                {categories.map((category) => (
                  <SelectItem
                    textValue={`${category.icon} ${category.name}`}
                    key={category.name}
                  >
                    {category.icon} {category.name}
                  </SelectItem>
                ))}
              </Select>
            )}
          />
        </div>

        {/* Amount Input */}
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
                  field.onChange(isNaN(parsedValue) ? undefined : parsedValue);
                }}
                isInvalid={!!errors.amount}
                value={
                  field.value !== undefined && field.value !== null
                    ? field.value.toString()
                    : ""
                }
                isRequired
                aria-required="true"
              />
            )}
          />
        </div>

        {/* Description Textarea */}
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

      {/* Submit Button */}
      <div className="flex md:justify-end">
        <Button
          className="flex-grow md:flex-grow-0"
          color="primary"
          type="submit"
          //   isLoading={updateExpenseLoading}
          //   disabled={updateExpenseLoading}
          aria-label="Update Expense"
        >
          {/* {!updateExpenseLoading ? "Update Expense" : "Updating Expense..."} */}
        </Button>
      </div>
    </form>
  );
};

export default EditExpenseForm;
