import { z } from "zod";
import { DateValue } from "@heroui/react";

// Custom validation function for DateValue
const isValidDateValue = (value: unknown): value is DateValue => {
  if (!value) return false;
  return typeof value === "object" && value !== null;
};

// Enum for frequency of recurring transactions
export const FinancialEventFrequency = z.enum([
  "DAILY",
  "WEEKLY",
  "MONTHLY",
  "QUARTERLY",
  "SEMESTERLY",
  "YEARLY",
  "CUSTOM",
])

const FinancialEvenTypeEnum = z.enum([
  "INCOME",
  "EXPENSE",
]).default("EXPENSE");

export const CreateRecurringTransactionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  currencyId: z.string().min(1, "Currency is required"),
  frequency: FinancialEventFrequency,
  type: FinancialEvenTypeEnum,
  nextDueDate: z.custom<DateValue>(
    isValidDateValue,
    "Next due date is required"
  ),
  budgetCategoryId: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type CreateRecurringTransactionSchemaType = z.infer<
  typeof CreateRecurringTransactionSchema
>;
