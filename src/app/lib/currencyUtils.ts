import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "./client";

export const convertAmount = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  exchangeRates: Record<string, number>
): number =>
  (amount * (exchangeRates?.[toCurrency] || 1)) /
  (exchangeRates?.[fromCurrency] || 1);

export const formatCurrency = (
  amount: number,
  currencyCode: string,
  currencies: { code: string; symbol: string }[]
): string => {
  const currency = currencies.find((c) => c.code === currencyCode);
  return `${currency?.symbol}${amount.toFixed(2)}`;
};

export const getDefaultCurrency = async () => {
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
