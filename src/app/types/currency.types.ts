import type { Currency } from "@prisma/client"

type ClientCurrencyItem  = Omit<Currency, "createdAt" | "updatedAt">

type ConversionRateResponse = {
  result: string;
  base_code: string;
  conversion_rates: Record<string, number>;
}

export type { ClientCurrencyItem, ConversionRateResponse };