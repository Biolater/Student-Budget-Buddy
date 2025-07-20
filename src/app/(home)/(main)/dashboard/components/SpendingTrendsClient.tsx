"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { LineChart, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardBody, CardHeader, Skeleton } from "@heroui/react";
import { formatCurrency } from "@/app/utils/currency.utils";
import { SpendingTrendsChart } from "@/app/components/Dashboard/SpendingTrendsChart";
import TrendPeriodSelector from "@/app/components/Dashboard/TrendPeriodSelector";
import { SpendingTrendData, SpendingTrendTimePeriod } from "@/app/types/dashboard.types";

interface SpendingTrendsClientProps {
  currencySymbol: string;
  initialData: SpendingTrendData[];
  initialPeriod: SpendingTrendTimePeriod;
}

export default function SpendingTrendsClient({
  currencySymbol,
  initialData,
  initialPeriod,
}: SpendingTrendsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [timePeriod, setTimePeriod] = useState<SpendingTrendTimePeriod>(initialPeriod);

  // Calculate average spending
  const averageSpending =
    initialData.length > 0
      ? initialData.reduce((sum, item) => sum + item.totalSpending, 0) / initialData.length
      : 0;

  // Determine if spending is trending up or down
  const trendDirection =
    initialData.length >= 2
      ? initialData[initialData.length - 1].totalSpending >
        initialData[initialData.length - 2].totalSpending
        ? "up"
        : "down"
      : "neutral";

  const handlePeriodChange = (period: SpendingTrendTimePeriod) => {
    setTimePeriod(period);
    
    // Update URL with new period
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('trendsPeriod', period);
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-0 px-4 pt-4">
        <div>
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LineChart className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold tracking-tight">Spending Trends</h2>
          </motion.div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <Skeleton className="rounded-md" isLoaded={!isPending}>
              <span>
                Average: {formatCurrency(averageSpending, currencySymbol)}
              </span>
            </Skeleton>
            <Skeleton className="rounded-md" isLoaded={!isPending}>
              <span className="flex items-center gap-1 ml-2">
                {trendDirection === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : trendDirection === "down" ? (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                ) : null}
                Trending {trendDirection}
              </span>
            </Skeleton>
          </div>
        </div>
        <TrendPeriodSelector
          value={[timePeriod]}
          onPeriodChange={(period) => handlePeriodChange(period as SpendingTrendTimePeriod)}
        />
      </CardHeader>
      <CardBody className="relative z-10 pt-0 p-4">
        <div className="h-[350px] w-full">
          <SpendingTrendsChart
            data={initialData}
            currency={currencySymbol || "USD"}
            isLoading={isPending}
          />
        </div>
      </CardBody>
    </Card>
  );
} 