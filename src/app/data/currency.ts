import { prisma } from "@/app/lib/client";
import { ConversionRateResponse } from "../types/currency.types";
import { requireUser } from "../utils/auth.utils";

export async function fetchCurrencies() {
  return prisma.currency.findMany({
    cacheStrategy: {
      ttl: 60 * 60 * 1000,
      swr: 60 * 60 * 1000,
    },
    select: {
      id: true,
      code: true,
      name: true,
      symbol: true,
    },
  });
}

export async function fetchDefaultUserCurrency() {
  const currentUser = await requireUser();
  const user = await prisma.user.findUnique({
    where: { id: currentUser.userId! },
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
}

export async function getConversionRate(
  baseCurrency: string,
  targetCurrency: string
) {
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
}
