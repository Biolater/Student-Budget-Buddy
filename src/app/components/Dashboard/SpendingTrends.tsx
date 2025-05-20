"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LineChart, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { formatCurrency } from "@/app/utils/currency.utils";
import { SpendingTrendsChart } from "./SpendingTrendsChart";
import { useDashboard } from "@/app/hooks/useDashboard";
import { useCurrency } from "@/app/hooks/useCurrency";
import { SpendingTrendTimePeriod } from "@/app/types/dashboard.types";
import TrendPeriodSelector from "./TrendPeriodSelector";

interface SpendingTrendsProps {
  defaultCurrencySymbol: string
  currencyLoading: boolean
}

export function SpendingTrends({ defaultCurrencySymbol, currencyLoading }: SpendingTrendsProps) {
  const [timePeriod, setTimePeriod] =
    useState<SpendingTrendTimePeriod>("allTime");

  const { useSpendingTrendsData } = useDashboard();

  const {
    data: trends = [],
    isLoading,
    error,
    refetch: refetchSpendingTrendsData,
  } = useSpendingTrendsData(timePeriod);

  // Calculate average spending
  const averageSpending =
    trends.length > 0
      ? trends.reduce((sum, item) => sum + item.totalSpending, 0) /
        trends.length
      : 0;

  // Determine if spending is trending up or down
  const trendDirection =
    trends.length >= 2
      ? trends[trends.length - 1].totalSpending >
        trends[trends.length - 2].totalSpending
        ? "up"
        : "down"
      : "neutral";

  useEffect(() => {
    refetchSpendingTrendsData();
  }, [timePeriod, refetchSpendingTrendsData]);

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-0 px-4 pt-4">
        <div>
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LineChart className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">
              Spending Trends
            </h2>
          </motion.div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            {trendDirection === "up" ? (
              <>
                <TrendingUp className="h-4 w-4 text-red-500 dark:text-red-400" />
                <span className="text-red-500 dark:text-red-400">
                  Trending upward
                </span>
              </>
            ) : trendDirection === "down" ? (
              <>
                <TrendingDown className="h-4 w-4 text-green-500 dark:text-green-400" />
                <span className="text-green-500 dark:text-green-400">
                  Trending downward
                </span>
              </>
            ) : (
              <span>No significant trend</span>
            )}
            {!isLoading && trends.length > 0 && (
              <span className="ml-2">
                • Average:{" "}
                {formatCurrency(
                  averageSpending,
                  defaultCurrencySymbol || "USD"
                )}
              </span>
            )}
          </div>
        </div>
        <TrendPeriodSelector
          value={[timePeriod]}
          onPeriodChange={(period) => {
            setTimePeriod(period as SpendingTrendTimePeriod);
          }}
        />
      </CardHeader>
      <CardBody className="relative z-10 pt-0 p-4">
        <div className="h-[350px] w-full">
          <SpendingTrendsChart
            data={trends}
            currency={defaultCurrencySymbol || "USD"}
            isLoading={isLoading}
          />
        </div>
      </CardBody>
    </Card>
  );
}
