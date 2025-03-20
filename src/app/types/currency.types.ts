import type { Currency } from "@prisma/client"

type ClientCurrencyItem  = Omit<Currency, "createdAt" | "updatedAt">

export type { ClientCurrencyItem };