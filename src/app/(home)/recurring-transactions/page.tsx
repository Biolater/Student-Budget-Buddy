import SectionHeader from "@/app/components/ui/SectionHeader";
import RecurringTransactionsClient from "@/app/components/RecurringTransactions/RecurringTransactionsClient";
import { fetchDefaultUserCurrency } from "@/app/data/currency";

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
    </main>
  );
};

export default RecurringTransactions;
