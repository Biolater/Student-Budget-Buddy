"use server";

import { requireUser } from "../utils/auth.utils";
import { prisma } from "../lib/client";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * Update the user's base currency
 */
export const updateUserBaseCurrency = async (currencyId: string) => {
  const currentUser = await requireUser();
  const userId = currentUser.userId!;

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        baseCurrencyId: currencyId,
      },
    });

    // Revalidate the cache for the user's currency
    revalidateTag("defaultUserCurrency");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Failed to update base currency:", error);
    throw new Error("Failed to update base currency");
  }
};
