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
