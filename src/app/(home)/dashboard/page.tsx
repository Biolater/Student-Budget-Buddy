"use client";

import FinancialOverview from "@/app/components/Dashboard/FinancialOverview";
import { SpendingByCategory } from "@/app/components/Dashboard/SpendingByCategory";
import { SpendingTrends } from "@/app/components/Dashboard/SpendingTrends";
import SectionHeader from "@/app/components/ui/SectionHeader";
import { useCurrency } from "@/app/hooks/useCurrency";
import { motion } from "framer-motion";

const DashboardComponent = () => {
  const {
    fetchDefaultUserCurrency: {
      data: defaultUserCurrency,
      isLoading: defaultUserCurrencyLoading,
    },
  } = useCurrency();

  return (
    <main className="container container-padding flex flex-col gap-4">
      <SectionHeader
        title="Dashboard"
        description="Overview of your financial health"
      />
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
