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
    throw new Error(
      error instanceof Error ? error.message : "Something went wrong"
    );
  }
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("postId");
  if (!id) {
    throw new Error("Missing id");
  }
  try {
    const expense = await prisma.expense.delete({
      where: { id },
    });
    return new Response(JSON.stringify(expense));
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Something went wrong"
    );
  }
}
