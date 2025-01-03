"use server";
import { prisma } from "@/lib/client";
import { type NewBudgetSchema } from "@/app/(home)/budget/AddNewBudget";
import { currentUser } from "@clerk/nextjs/server";

export const createBudget = async (data: NewBudgetSchema) => {
    console.log("AAA")
    const { category, currency, amount, period } = data;
    const user = await currentUser()
    if(!user) return null
    const userId = user.id;
    try {
        const budget = await prisma.budget.create({
            data: {
                category,
                currency,
                amount,
                period,
                userId
            }
        })
        return budget
    } catch (error) {
      throw error; // re-throw the error
    }
}