import { PrismaClient } from "@prisma/client";
import { withPulse } from "@prisma/extension-pulse/node";

const currencies = [
  { code: "USD", name: "United States Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺" },
  { code: "AZN", name: "Azerbaijani Manat", symbol: "₼" },
];

const prisma = new PrismaClient().$extends(
  withPulse({
    apiKey: process.env.PULSE_API_KEY as string,
  })
);

export  async function main() {
  console.log("Seeding currencies...");
  for (const currency of currencies) {
    await prisma.currency.upsert({
      where: { code: currency.code },
      update: {}, // No updates for existing entries in this case
      create: {
        id: `${currency.code.toLowerCase()}-id`,
        ...currency,
      },
    });
  }
  console.log("Currencies seeded successfully!");
}

export { prisma };
