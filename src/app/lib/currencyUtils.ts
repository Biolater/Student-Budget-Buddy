"use server";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "./client";
import fetchExchangeRates from "./getLatestExchangeRates";

const convertAmount = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  exchangeRates: Record<string, number>
): number =>
  (amount * (exchangeRates?.[toCurrency] || 1)) /
  (exchangeRates?.[fromCurrency] || 1);

const formatCurrency = (
  amount: number,
  currencyCode: string,
  currencies: { code: string; symbol: string }[]
): string => {
  const currency = currencies.find((c) => c.code === currencyCode);
  return `${currency?.symbol}${amount.toFixed(2)}`;
};

const convertCurrency = async (amount: number, targetCurrency: string, baseCurrency: string) => {
  try {
    const { conversion_rates } = await fetchExchangeRates(targetCurrency);
    return parseFloat((amount * conversion_rates[baseCurrency]).toFixed(2));
  } catch (error) {
    throw error;
  }
};

const getDefaultCurrency = async () => {
  const user = await currentUser();
  if (!user) throw new Error("You must be signed in to get budgets");
  try {
    const userId = user.id;
    const defaultCurrency = await prisma.user.findUnique({
      where: { id: userId },
      select: { baseCurrency: true },
    });
    return defaultCurrency;
  } catch (error) {
    throw error;
  }
};

export { convertAmount, formatCurrency, getDefaultCurrency, convertCurrency };
