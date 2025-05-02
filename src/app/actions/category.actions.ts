'use server';

import { prisma } from "@/app/lib/client";

export async function fetchExpenseCategoriesForSelect() {
    try {
        return await prisma.expenseCategory.findMany({
            cacheStrategy: {
                ttl: 60 * 60 * 1000, // 1 
                swr: 60 * 60 * 1000, // 1 
            },
            select: {
                id: true,
                name: true,
                icon: true,
            }
        });
    } catch (error) {
        console.error("Failed to fetch currencies:", error);
        throw new Error("Could not fetch currencies");
    }
}

export async function fetchBudgetCategoriesForSelect() {
    try {
        return await prisma.budgetCategory.findMany({
            cacheStrategy: {
                ttl: 60 * 60 * 1000, // 1 
                swr: 60 * 60 * 1000, // 1 
            },
            select: {
                id: true,
                name: true,
                icon: true,
            }
        });
    } catch (error) {
        console.error("Failed to fetch currencies:", error);
        throw new Error("Could not fetch currencies");
    }
}
