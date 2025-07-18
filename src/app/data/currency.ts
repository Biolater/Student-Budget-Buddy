import { unstable_cache } from "next/cache";
import { prisma } from "@/app/lib/client";
import { ConversionRateResponse } from "../types/currency.types";
import { requireUser } from "../utils/auth.utils";
import { ResponseHandler } from "../lib/ResponseHandler";

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

// Internal cached function for user default currency
const _fetchDefaultUserCurrencyCached = unstable_cache(
  async (userId: string) => {
    const response = await ResponseHandler.execute(async () => {
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
    });

    return response.data;
  },
  ["defaultUserCurrency"],
  {
    revalidate: 300, // Cache for 5 minutes
    tags: ["user-data", "currency"],
  }
);

export async function fetchDefaultUserCurrency() {
  const currentUser = await requireUser();
  return await _fetchDefaultUserCurrencyCached(currentUser.userId!);
}

// Cached function for exchange rates
const _getConversionRateCached = unstable_cache(
  async (baseCurrency: string, targetCurrency: string) => {
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
  },
  ["conversionRate"],
  {
    revalidate: 3600, // Cache for 1 hour (exchange rates don't change frequently)
    tags: ["exchange-rates", "currency"],
  }
);

export async function getConversionRate(
  baseCurrency: string,
  targetCurrency: string
) {
  return await _getConversionRateCached(baseCurrency, targetCurrency);
}
