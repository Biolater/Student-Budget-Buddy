// src/app/components/RecurringTransactions/RecurringTransactionItems.tsx
import React from "react";
import { fetchRecurringTransactions } from "@/app/data/recurringTransactions";
import { TransactionCard } from "./RecurringTransactionCard";

export default async function RecurringTransactionItems() {
  let transactions;
  try {
    transactions = await fetchRecurringTransactions();
  } catch (err) {
    console.error("Failed to load recurring transactions", err);
    return (
      <div className="p-6 text-center text-red-600">
        Couldn’t load recurring transactions.
      </div>
    );
  }

  if (!transactions.data?.length) {
    return (
      <div className="p-6 text-center text-gray-500">
        No recurring transactions yet.
      </div>
    );
  }

  return (
    <div className="p-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {transactions.data.map((tx) => (
        <TransactionCard key={tx.id} transaction={tx} />
      ))}
    </div>
  );
}
