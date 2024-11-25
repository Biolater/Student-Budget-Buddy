"use server";
import { prisma } from "@/lib/client";

export type Category =
  | "Food"
  | "Entertainment"
  | "Transport"
  | "Health"
  | "Education"
  | "Clothing"
  | "Pets"
  | "Travel"
  | "Other"
  | "";

const createExpense = async (
  date: Date,
  amount: number,
  currency: string,
  category: Category,
  description: string,
  userId: string
) => {
  try {
    const expense = await prisma.expense.create({
      data: {
        date,
        amount,
        currency,
        category,
        description,
        userId,
      },
    });
    console.log("Expense created:", expense);
  } catch (error) {
    console.log(error);
  }
};

export default async function createExpenseAction(
  date: Date,
  amount: number,
  currency: string,
  category: Category,
  description: string,
  userId: string,
  errors: {
    date: string;
    amount: string;
    currency: string;
    category: string;
    description: string;
  }
) {
  const noErrors = Object.values(errors).every((error) => error === "");

  // Validate that all required fields are present and of the correct type
  if (
    typeof date !== "object" ||
    typeof amount !== "number" ||
    typeof currency !== "string" ||
    typeof category !== "string" ||
    typeof description !== "string" ||
    typeof userId !== "string" ||
    !noErrors
  ) {
    throw new Error("Invalid input data");
    return;
  }

  // Call the createExpense function with validated and converted data
  try {
    const expense = await createExpense(
      date,
      amount,
      currency,
      category as Category,
      description,
      userId
    );
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }
}
