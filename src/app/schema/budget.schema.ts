import { z } from "zod"
import { DateValue } from "@heroui/react"

// Custom validation function for DateValue
const isValidDateValue = (value: unknown): value is DateValue => {
  if (!value) return false;
  return typeof value === "object" && value !== null;
};

export const BudgetPeriodTypeEnum = z.enum([
  "MONTHLY",
  "QUARTERLY",
  "SEMESTERLY",
  "YEARLY",
  "CUSTOM",
])

export const CreateBudgetFormSchema = z
  .object({
    budgetCategory: z.string().nonempty("Budget category is required"),
    currency: z.string().nonempty("Currency is required"),
    amount: z.coerce.number().nonnegative("Amount must be greater than 0"),
    periodType: BudgetPeriodTypeEnum,
    startDate: z.custom<DateValue>(isValidDateValue, "Invalid start date"),
    endDate: z.custom<DateValue>(isValidDateValue, "Invalid end date"),
    description: z.string().optional(),
  })
  .refine(
    (data) => {
      // Only require dates for CUSTOM period type
      if (data.periodType === "CUSTOM") {
        return !!data.startDate && !!data.endDate;
      }
      return true; // No validation needed for other period types
    },
    {
      message: "Start and End date are required for custom period",
      path: ["startDate"],
    }
  )

export type CreateBudgetFormSchemaType = z.infer<typeof CreateBudgetFormSchema>