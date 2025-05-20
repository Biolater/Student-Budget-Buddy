"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PieChart } from "lucide-react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import CategoryPeriodSelector from "./CategoryPeriodSelector";
import { SpendingByCategoryChart } from "./SpendingByCategoryChart";

import { formatCurrency } from "@/app/utils/currency.utils";
import { CategorySpending, TimePeriod } from "@/app/types/dashboard.types";
import { useDashboard } from "@/app/hooks/useDashboard";

interface SpendingByCategoryProps {
  defaultCurrencySymbol: string;
  defaultCurrencyCode: string;
  currencyLoading: boolean;
}

export function SpendingByCategory({
  defaultCurrencySymbol,
  defaultCurrencyCode,
  currencyLoading,
}: SpendingByCategoryProps) {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("currentMonth");

  const { useSpendingByCategoryData } = useDashboard();

  const {
    data = [],
    isLoading,
    error,
    refetch: refetchSpendingTrendsData,
  } = useSpendingByCategoryData(timePeriod);

  // Calculate total spending
  const totalSpending = data.reduce((sum, item) => sum + item.amount, 0);

  // Find the largest category
  const largestCategory =
    data.length > 0
      ? data.reduce((prev, current) =>
          prev.amount > current.amount ? prev : current
        )
      : null;

  useEffect(() => {
    refetchSpendingTrendsData();
  }, [timePeriod, refetchSpendingTrendsData]);

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
        <div>
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <PieChart className="h-5 w-5 text-primary" />
            <h2>Spending by Category</h2>
          </motion.div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <span>
              Total: {formatCurrency(totalSpending, defaultCurrencyCode)}
            </span>
            {!isLoading && largestCategory && (
              <span className="ml-2">
                • Highest: {largestCategory.category} (
                {formatCurrency(largestCategory.amount, defaultCurrencyCode)})
              </span>
            )}
          </div>
        </div>
        <CategoryPeriodSelector
          value={[timePeriod]}
          onPeriodChange={(period) => setTimePeriod(period as TimePeriod)}
        />
      </CardHeader>
      <CardBody className="relative z-10 pt-0">
        <div className="h-[350px] w-full">
          <SpendingByCategoryChart
            data={data}
            currency={defaultCurrencyCode}
            isLoading={isLoading}
          />
        </div>
      </CardBody>
    </Card>
  );
}
