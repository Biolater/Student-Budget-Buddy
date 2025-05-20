"use client";

import FinancialOverview from "@/app/components/Dashboard/FinancialOverview";
import { SpendingByCategory } from "@/app/components/Dashboard/SpendingByCategory";
import { SpendingTrends } from "@/app/components/Dashboard/SpendingTrends";
import { useCurrency } from "@/app/hooks/useCurrency";

const DashboardComponent = () => {
  const {
    fetchDefaultUserCurrency: {
      data: defaultUserCurrency,
      isLoading: defaultUserCurrencyLoading,
    },
  } = useCurrency();

  return (
    <main className="container container-padding flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <FinancialOverview
        defaultCurrencySymbol={defaultUserCurrency?.symbol || "$"}
        currencyLoading={defaultUserCurrencyLoading}
      />
      <SpendingTrends
        defaultCurrencySymbol={defaultUserCurrency?.symbol || "$"}
        currencyLoading={defaultUserCurrencyLoading}
      />
      <SpendingByCategory
        defaultCurrencySymbol={defaultUserCurrency?.symbol || "$"}
        currencyLoading={defaultUserCurrencyLoading}
        defaultCurrencyCode={defaultUserCurrency?.code || "USD"}
      />
    </main>
  );
};

export default DashboardComponent;
