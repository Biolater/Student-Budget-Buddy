import SectionHeader from "@/app/components/ui/SectionHeader";
import RecurringTransactionsClient from "@/app/components/RecurringTransactions/RecurringTransactionsClient";
import { fetchDefaultUserCurrency } from "@/app/data/currency";
import RecurringTransactionItems from "@/app/components/RecurringTransactions/RecurringTransactionItems";
import { Suspense } from "react";
import RecurringTransactionItemsSkeleton from "@/app/components/RecurringTransactions/RecurringTransactionItemsSkeleton";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import RecurringTransactionsError from "../../../components/RecurringTransactions/RecurringTransactionsError";

const RecurringTransactions = async () => {
  const defaultCurrency = await fetchDefaultUserCurrency();
  return (
    <main className="container container-padding flex flex-col gap-4">
      <div className="flex justify-between flex-wrap gap-4">
        <SectionHeader
          title="Recurring Transactions"
          description="Manage your recurring transactions easily."
        />
        <RecurringTransactionsClient
          defaultCurrency={defaultCurrency?.id || "usd-id"}
        />
      </div>
      <ErrorBoundary errorComponent={RecurringTransactionsError}>
        <Suspense fallback={<RecurringTransactionItemsSkeleton />}>
          <RecurringTransactionItems />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
};

export default RecurringTransactions;
