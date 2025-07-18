import { z } from "zod";
import { isAfter } from "date-fns";
import { CalendarDate } from "@internationalized/date";
import { computeMinEndDate } from "@/app/utils/recurrence";

// ✅ Frequency & Type enums
export const FinancialEventFrequency = z.enum([
  "DAILY",
  "WEEKLY",
  "MONTHLY",
  "QUARTERLY",
  "SEMESTERLY",
  "YEARLY",
  "CUSTOM"
]);

export const FinancialEventTypeEnum = z.enum(["INCOME", "EXPENSE"]).default("EXPENSE");

// ✅ CalendarDate Zod type
const calendarDateSchema = z.custom<CalendarDate>(
  (val) => val instanceof CalendarDate,
  { message: "Invalid date format" }
);

// ✅ Schema definition
export const CreateRecurringTransactionSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    amount: z.number().positive("Amount must be positive"),
    currencyId: z.string().min(1, "Currency is required"),

    frequency: FinancialEventFrequency,
    type: FinancialEventTypeEnum,

    nextDueDate: calendarDateSchema,
    endDate: calendarDateSchema.optional(),

    budgetCategoryId: z.string().optional(),
    description: z.string().optional(),
    isActive: z.boolean().default(true),

    interval: z.number().min(1, "Interval must be at least 1").optional(),
    intervalUnit: z.enum(["DAY", "WEEK", "MONTH", "YEAR"]).optional(),
  })

  // ✅ Require interval + unit if frequency is CUSTOM
  .refine(
    (d) => d.frequency !== "CUSTOM" || (d.interval != null && d.intervalUnit != null),
    {
      message: "When frequency is custom, interval and unit are required",
      path: ["interval"]
    }
  )

  // ✅ Validate that endDate is after at least one recurrence
  .refine((data) => {
    const isCalendarDate = (d: unknown): d is CalendarDate =>
      d instanceof CalendarDate;

    if (!isCalendarDate(data.nextDueDate)) return false;
    if (data.endDate && !isCalendarDate(data.endDate)) return false;
    if (!data.endDate) return true;

    const min = computeMinEndDate(
      data.frequency,
      data.nextDueDate,
      data.interval,
      data.intervalUnit
    );

    if (!min) return true;

    // Convert both dates to the same format for comparison
    const minDate = min;
    const endDate = data.endDate;

    // Compare using date-fns isAfter with consistent date types
    return !isAfter(
      new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate()),
      new Date(endDate.year, endDate.month - 1, endDate.day)
    );
  }, {
    message: "End date must allow at least one recurrence after the next due date.",
    path: ["endDate"]
  });

// ✅ Export the type
export type CreateRecurringTransactionSchemaType = z.infer<
  typeof CreateRecurringTransactionSchema
>;
