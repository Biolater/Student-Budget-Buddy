"use server";

import { prisma } from "@/app/lib/client";
import { ConversionRateResponse } from "../types/currency.types";

export async function fetchCurrenciesForSelect() {
  try {
    return await prisma.currency.findMany({
      select: {
        id: true,
        code: true,
        name: true,
        symbol: true,
      },
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

export async function getConversionRate(
  baseCurrency: string,
  targetCurrency: string
) {
  try {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATES_API_KEY}/latest/${baseCurrency}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch exchange rates from API: ${response.statusText}`
      );
    }

    const data: ConversionRateResponse = await response.json();

    return data.conversion_rates[targetCurrency];
  } catch (error) {
    console.error("Failed to fetch conversion rate:", error);
    throw new Error("Could not fetch conversion rate");
  }
}
