"use client";

import FinancialOverview from "@/app/components/Dashboard/FinancialOverview";
import { SpendingByCategory } from "@/app/components/Dashboard/SpendingByCategory";
import { SpendingTrends } from "@/app/components/Dashboard/SpendingTrends";
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your financial health
          </p>
        </div>
      </motion.div>
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
