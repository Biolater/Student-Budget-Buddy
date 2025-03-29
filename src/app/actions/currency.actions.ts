'use server';

import { prisma } from "@/app/lib/client";

export async function fetchCurrenciesForSelect() {
    try {
        return await prisma.currency.findMany({
            select: {
                id: true,
                code: true,
                name: true,
                symbol: true
            }
        });
    } catch (error) {
        console.error("Failed to fetch currencies:", error);
        throw new Error("Could not fetch currencies");
    }
}

export async function fetchDefaultUserCurrency(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                baseCurrency: {
                    select: {
                        id: true,
                        code: true,
                        name: true,
                        symbol: true,
                    },
                },
            },
        });

        return user?.baseCurrency || null;
    } catch (error) {
        console.error("Failed to fetch default user currency:", error);
        throw new Error("Could not fetch default user currency");
    }
}