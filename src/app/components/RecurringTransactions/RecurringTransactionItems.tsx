// src/app/components/RecurringTransactions/RecurringTransactionItems.tsx
import React from "react";
import { fetchRecurringTransactions } from "@/app/data/recurringTransactions";
import { TransactionCard } from "./RecurringTransactionCard";

export default async function RecurringTransactionItems() {
  const transactions = await fetchRecurringTransactions();

  if (!transactions.data?.length) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        No recurring transactions yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {transactions.data.map((tx) => (
        <TransactionCard key={tx.id} transaction={tx} />
      ))}
    </div>
  );
}
