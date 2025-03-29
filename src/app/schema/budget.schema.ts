import { z } from "zod"

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
    startDate: z.date({ required_error: "Start date is required" }),
    endDate: z.date({ required_error: "End date is required" }),
    description: z.string().optional(),
  })
  .refine(
    (data) => {
      // Custom type → must manually enter dates (already required)
      // Other types → frontend should pre-fill both dates before submission
      return !!data.startDate && !!data.endDate
    },
    {
      message: "Start and End date are required",
      path: ["startDate"],
    }
  )


export type CreateBudgetFormSchemaType = z.infer<typeof CreateBudgetFormSchema>