"use client";

import FinancialOverview from "@/app/components/Dashboard/FinancialOverview";
import { SpendingByCategory } from "@/app/components/Dashboard/SpendingByCategory";
import { SpendingTrends } from "@/app/components/Dashboard/SpendingTrends";
import SectionHeader from "@/app/components/ui/SectionHeader";
import { useCurrency } from "@/app/hooks/useCurrency";
import { motion } from "framer-motion";

interface DashboardClientProps {
  defaultUserCurrency: {
    code: string;
    symbol: string;
  } | null;
}

const DashboardComponent = ({ defaultUserCurrency }: DashboardClientProps) => {
  const {
    fetchDefaultUserCurrency: {
      data: userCurrency,
      isLoading: defaultUserCurrencyLoading,
    },
  } = useCurrency(defaultUserCurrency ?? undefined);

  const currency = userCurrency || defaultUserCurrency;

  return (
    <main className="container container-padding flex flex-col gap-4">
      <SectionHeader
        title="Dashboard"
        description="Overview of your financial health"
      />
      <FinancialOverview
        defaultCurrencySymbol={currency?.symbol || "$"}
        currencyLoading={defaultUserCurrencyLoading}
      />
      <SpendingTrends
        defaultCurrencySymbol={currency?.symbol || "$"}
        currencyLoading={defaultUserCurrencyLoading}
      />
      <SpendingByCategory
        defaultCurrencySymbol={currency?.symbol || "$"}
        currencyLoading={defaultUserCurrencyLoading}
        defaultCurrencyCode={currency?.code || "USD"}
      />
    </main>
  );
};

export default DashboardComponent;
