// src/app/schema/recurring-transactions.schema.ts

import { z } from "zod";
import { isValid, isAfter } from "date-fns";
import { computeMinEndDate } from "@/app/utils/recurrence";
import { CalendarDate } from "@internationalized/date";

export const FinancialEventFrequency = z.enum([
  "DAILY", "WEEKLY", "MONTHLY",
  "QUARTERLY", "SEMESTERLY", "YEARLY", "CUSTOM"
]);

export const FinancialEventTypeEnum = z
  .enum(["INCOME", "EXPENSE"])
  .default("EXPENSE");

export const CreateRecurringTransactionSchema = z
  .object({
    name:       z.string().min(1, "Name is required"),
    amount:     z.coerce.number().positive("Amount must be positive"),
    currencyId: z.string().min(1, "Currency is required"),

    frequency:  FinancialEventFrequency,
    type:       FinancialEventTypeEnum,

    nextDueDate: z.preprocess(
      (val) => (val instanceof Date ? val : new Date(val as string)),
      z.date({
        required_error: "Next due date is required",
        invalid_type_error: "Invalid next due date",
      })
    ),

    endDate: z.preprocess(
      (val) => (val ? new Date(val as string) : undefined),
      z.date({ invalid_type_error: "Invalid end date" }).optional()
    ),

    budgetCategoryId: z.string().optional(),
    description:      z.string().optional(),
    isActive:         z.boolean().default(true),

    // CUSTOM only
    interval:     z.number().min(1, "Interval must be at least 1").optional(),
    intervalUnit: z.enum(["DAY", "WEEK", "MONTH", "YEAR"]).optional(),
  })

  .refine(
    (d) => d.frequency !== "CUSTOM" || (d.interval != null && d.intervalUnit != null),
    { message: "When frequency is custom, interval and unit are required", path: ["interval"] }
  )

  .refine((data) => {
    if (!data.endDate || !data.nextDueDate || !isValid(data.endDate)) return true;
    const min = computeMinEndDate(
      data.frequency,
      // Convert JS Date → CalendarDate for computeMinEndDate if needed,
      // but here nextDueDate is already a JS Date from preprocess
      new CalendarDate(
        data.nextDueDate.getFullYear(),
        data.nextDueDate.getMonth() + 1,
        data.nextDueDate.getDate()
      ),
      data.interval,
      data.intervalUnit
    );
    return min ? !isAfter(min, data.endDate) : true;
  }, {
    message: "End date must allow at least one recurrence after the next due date.",
    path: ["endDate"],
  });

export type CreateRecurringTransactionSchemaType = z.infer<
  typeof CreateRecurringTransactionSchema
>;
