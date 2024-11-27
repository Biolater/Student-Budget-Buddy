import { prisma } from "@/lib/client";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  if (!userId) {
    throw new Error("Missing userId or category");
  }
  try {
    const expenses = await prisma.expense.findMany({
      where: { userId },
    });
    return new Response(JSON.stringify(expenses));
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Something went wrong");
  }
}
