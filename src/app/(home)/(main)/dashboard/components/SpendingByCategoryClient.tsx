"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { PieChart } from "lucide-react";
import { Card, CardBody, CardHeader, Skeleton } from "@heroui/react";
import CategoryPeriodSelector from "@/app/components/Dashboard/CategoryPeriodSelector";
import { SpendingByCategoryChart } from "@/app/components/Dashboard/SpendingByCategoryChart";
import { formatCurrency } from "@/app/utils/currency.utils";
import { CategorySpending, TimePeriod } from "@/app/types/dashboard.types";

interface SpendingByCategoryClientProps {
  currencySymbol: string;
  currencyCode: string;
  initialData: CategorySpending[];
  initialPeriod: TimePeriod;
}

export default function SpendingByCategoryClient({
  currencySymbol,
  currencyCode,
  initialData,
  initialPeriod,
}: SpendingByCategoryClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(initialPeriod);

  // Calculate total spending
  const totalSpending = initialData.reduce(
    (sum, item) => sum + item.totalSpending,
    0
  );

  // Find the largest category
  const largestCategory =
    initialData.length > 0
      ? initialData.reduce((prev, current) =>
          prev.totalSpending > current.totalSpending ? prev : current
        )
      : null;

  const handlePeriodChange = (period: TimePeriod) => {
    setTimePeriod(period);

    // Update URL with new period
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("categoryPeriod", period);
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
            <PieChart className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold tracking-tight">
              Spending by Category
            </h2>
          </motion.div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <Skeleton className="rounded-md" isLoaded={!isPending}>
              <span>Total: {formatCurrency(totalSpending, currencyCode)}</span>
            </Skeleton>
            <Skeleton className="rounded-md" isLoaded={!isPending}>
              <span className="ml-2">
                • Highest: {largestCategory?.category} (
                {formatCurrency(largestCategory?.totalSpending, currencyCode)})
              </span>
            </Skeleton>
          </div>
        </div>
        <CategoryPeriodSelector
          value={[timePeriod]}
          onPeriodChange={(period) => handlePeriodChange(period as TimePeriod)}
        />
      </CardHeader>
      <CardBody className="relative z-10 pt-0 p-4">
        <div className="h-[350px] w-full">
          <SpendingByCategoryChart
            data={initialData}
            currency={currencyCode}
            isLoading={isPending}
          />
        </div>
      </CardBody>
    </Card>
  );
}
