import { z } from "zod";
import { DateValue } from "@heroui/react";

// Custom validation function for DateValue
const isValidDateValue = (value: unknown): value is DateValue => {
    if (!value) return false;
    return typeof value === 'object' && value !== null;
};

export const ExpenseFormSchema = z.object({
    date: z
        .custom<DateValue>(isValidDateValue, "Invalid date")
        .refine(value => value !== undefined && value !== null, {
            message: "Date is required",
        }),
        amount: z.coerce
        .number()
        .min(0.01, "Amount must be greater than 0")
        .positive("Amount must be positive"),
    currency: z.string().nonempty("Currency is required"),
    category: z.string().nonempty("Category is required"),
    description: z.string().optional(),
})

export type ExpenseFormSchemaType = z.infer<typeof ExpenseFormSchema>