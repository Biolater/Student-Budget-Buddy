"use client";

import SectionHeader from "@/app/components/ui/SectionHeader";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useCurrency } from "@/app/hooks/useCurrency";
import CreateRecurringTransactionsDrawer from "@/app/components/RecurringTransactions/CreateRecurringTransactionsDrawer";

const RecurringTransactions = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { userId } = useAuth();
  const { fetchDefaultUserCurrency } = useCurrency();
  const defaultCurrency = fetchDefaultUserCurrency.data?.id || "";

  return (
    <main className="container container-padding flex flex-col gap-4">
      <div className="flex justify-between flex-wrap gap-4">
        <SectionHeader
          title="Recurring Transactions"
          description="Manage your recurring transactions easily."
        />
        <CreateRecurringTransactionsDrawer
          isOpen={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
          defaultCurrency={defaultCurrency}
        />
      </div>
    </main>
  );
};

export default RecurringTransactions;
