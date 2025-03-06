"use client";

import { useCategory } from "@/hooks/useCategory";
import { useCurrency } from "@/hooks/useCurrency";
import { ExpenseFormSchema, type ExpenseFormSchemaType } from "@/schema";
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

const ExpenseFormV2 = () => {
  const {
    control,
    formState: { errors },
  } = useForm<ExpenseFormSchemaType>({
    resolver: zodResolver(ExpenseFormSchema),
  });

  const {
    query: {
      data: currencies,
      isPending: currenciesLoading,
      isError: currenciesError,
    },
  } = useCurrency();

  const {
    expenseCategoriesQuery: {
      data: categories,
      isPending: categoriesLoading,
      isError: categoriesError,
    },
  } = useCategory();

  const onSubmit = (data: ExpenseFormSchemaType) => {
    console.log(data);
  };

  if (currenciesLoading || categoriesLoading) {
    return <ExpenseFormSkeleton />;
  }

  return (
    <>
      <form method="POST" action="/api/expense" className="flex flex-col gap-4" >
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
                  onChange={(value) => field.onChange(value)}
                  isInvalid={!!errors.currency}
                  value={field.value}
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
                  onChange={(value) => field.onChange(value)}
                  isInvalid={!!errors.category}
                  value={field.value}
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
            className="flex-grow md:flex-grow-0"
            color="primary"
            type="submit"
          >
            Submit
          </Button>
        </div>
      </form>
    </>
  );
};

export default ExpenseFormV2;
